"use server"

import { getSupabaseAdmin } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"

export async function savePrompt(params: {
    promptId?: string;
    name: string;
    description?: string;
    systemPrompt: string;
    template: string;
    versionTag: string;
}) {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const supabase = getSupabaseAdmin();
        let targetPromptId = params.promptId;

        // 1. Create or ensure parent Prompt exists
        if (!targetPromptId) {
            const { data: newPrompt, error: pError } = await supabase
                .from('v2_prompts')
                .insert({
                    user_id: userId,
                    name: params.name,
                    description: params.description || ''
                })
                .select('id')
                .single();

            if (pError || !newPrompt) {
                console.error("Prompt creation error:", pError);
                return { success: false, error: "Failed to create parent prompt." };
            }
            targetPromptId = newPrompt.id;
        }

        // 2. Create the Version
        const { data: newVersion, error: vError } = await supabase
            .from('v2_prompt_versions')
            .insert({
                prompt_id: targetPromptId,
                version_tag: params.versionTag,
                system_prompt: params.systemPrompt,
                template: params.template
            })
            .select('id, version_tag')
            .single();

        if (vError) {
            console.error("Version creation error:", vError);
            if (vError.code === '23505') { // Unique constraint violation
                return { success: false, error: `Version tag '${params.versionTag}' already exists for this prompt.` };
            }
            return { success: false, error: "Failed to save prompt version." };
        }

        return {
            success: true,
            promptId: targetPromptId,
            versionId: newVersion.id,
            versionTag: newVersion.version_tag
        };
    } catch (e: any) {
        console.error("Save prompt exception:", e);
        return { success: false, error: e.message || "Internal server error" };
    }
}

export async function getPrompt(id: string, type: 'v1' | 'v2' = 'v1') {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const supabase = getSupabaseAdmin();

        if (type === 'v2') {
            const { data, error } = await supabase
                .from('v2_prompt_versions')
                .select('template, v2_prompts(name, description)')
                .eq('id', id)
                .single();

            if (error || !data) {
                return { success: false, error: "Saved prompt version not found." };
            }

            return {
                success: true,
                content: data.template,
                metadata: {
                    name: (data.v2_prompts as any)?.name,
                    description: (data.v2_prompts as any)?.description
                }
            };
        } else {
            // Try specific version first
            const { data: v1Version, error: v1Error } = await supabase
                .from('prompt_versions')
                .select('content')
                .eq('id', id)
                .single();

            if (v1Version) {
                return {
                    success: true,
                    content: v1Version.content,
                };
            }

            // Fallback to parent prompt table
            const { data, error } = await supabase
                .from('prompts')
                .select('original_prompt, refined_prompt')
                .eq('id', id)
                .single();

            if (error || !data) {
                return { success: false, error: "Playground prompt not found." };
            }

            return {
                success: true,
                content: data.original_prompt, // Users usually want to edit the input again
                refinedContent: data.refined_prompt
            };
        }
    } catch (e: any) {
        console.error("Get prompt exception:", e);
        return { success: false, error: "Internal server error" };
    }
}
