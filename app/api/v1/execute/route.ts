import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { routeAndExecutePrompt } from '@/lib/router';
import { withCache } from '@/lib/cache';
import { runGuardrails, validateSchema } from '@/lib/guardrails';
import { validateApiKey } from '@/lib/api-keys';
import { checkRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';
import { z } from 'zod';

// Input Validation Schema using Zod
const executeSchema = z.object({
    version_id: z.string().uuid(),
    ab_version_id: z.string().uuid().optional(), // For A/B traffic split
    variables: z.record(z.string(), z.string()).default({}), // Allows optional variables
    required_schema: z.any().optional(), // For schema validation
});

export async function POST(req: Request) {
    const startTime = Date.now();

    // Authenticate Request
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
        return NextResponse.json({ error: "Missing x-api-key header", code: "MISSING_API_KEY" }, { status: 401 });
    }

    const keyContext = await validateApiKey(apiKeyHeader);
    if (!keyContext || keyContext.revoked) {
        return NextResponse.json({ error: "Invalid or revoked API key", code: "INVALID_API_KEY" }, { status: 403 });
    }

    // Rate Limiting: 120 execution requests per minute per API key
    const isAllowed = await checkRateLimit(`exec_key_${keyContext.id}`, 120, 60);
    if (!isAllowed) {
        return NextResponse.json({ error: "Rate limit exceeded (120 req/min). Please slow down." }, { status: 429 });
    }

    try {
        // 1. Parse & Validate Request
        const body = await req.json();
        const parsed = executeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request payload", details: parsed.error.issues }, { status: 400 });
        }

        const { version_id, ab_version_id, variables, required_schema } = parsed.data;

        // A/B Testing split logic (50/50 randomly)
        const active_version_id = (ab_version_id && Math.random() > 0.5) ? ab_version_id : version_id;

        // Run Guardrails on Input Variables
        const combinedInput = Object.values(variables).join(" ");
        const guardrailResult = runGuardrails(combinedInput);
        if (!guardrailResult.passed) {
            return NextResponse.json({ error: "Guardrail blocked input", reason: guardrailResult.reason }, { status: 400 });
        }

        // 2. Fetch Prompt Definition (Bypassing RLS with Admin key for programmatic access)
        const supabase = getSupabaseAdmin();

        console.log(`[Execute] Incoming Request - VersionID: ${active_version_id}, WorkspaceID: ${keyContext.user_id}`);

        // Try V2 table first (production-saved prompts)
        // We join with v2_prompts to verify ownership by user_id
        let { data: version, error: dbError } = await supabase
            .from('v2_prompt_versions')
            .select(`
                system_prompt, 
                template, 
                published,
                v2_prompts!inner(user_id)
            `)
            .eq('id', active_version_id)
            .eq('v2_prompts.user_id', keyContext.user_id)
            .eq('published', true)
            .single();

        let systemPrompt = version?.system_prompt;
        let template = version?.template;

        // Fallback to Playground tables (V1 history)
        if (!version || dbError) {
            console.log(`[Execute] Checking Playground Fallback for ID: ${active_version_id} | User: ${keyContext.user_id}`);

            // 1. Try prompt_versions table (Specific historical version)
            const { data: v1Version, error: v1Error } = await supabase
                .from('prompt_versions')
                .select('content, created_by')
                .eq('id', active_version_id)
                .single();

            if (v1Version && v1Version.created_by === keyContext.user_id) {
                console.log(`[Execute] Found in prompt_versions`);
                systemPrompt = "You are a highly capable AI assistant.";
                template = v1Version.content;
                dbError = null;
            } else {
                // 2. Try prompts table (Parent container/Playground root)
                const { data: v1Prompt, error: pError } = await supabase
                    .from('prompts')
                    .select('refined_prompt, original_prompt, user_id')
                    .eq('id', active_version_id)
                    .single();

                if (v1Prompt && v1Prompt.user_id === keyContext.user_id) {
                    console.log(`[Execute] Found in prompts (V1 Root)`);
                    systemPrompt = "You are a highly capable AI assistant.";
                    template = v1Prompt.refined_prompt || v1Prompt.original_prompt;
                    dbError = null;
                } else {
                    console.log(`[Execute] Fallback failed. V1Error: ${v1Error?.message}, PError: ${pError?.message}`);
                    if (v1Version) console.log(`[Execute] Ownership mismatch (Version): expected ${keyContext.user_id}, got ${v1Version.created_by}`);
                    if (v1Prompt) console.log(`[Execute] Ownership mismatch (Prompt): expected ${keyContext.user_id}, got ${v1Prompt.user_id}`);
                }
            }
        }

        if (dbError || (!systemPrompt && !template)) {
            // DEEP DIAGNOSTIC: Check if it exists AT ALL regardless of ownership
            const { data: v2Exists } = await supabase.from('v2_prompt_versions').select('id, v2_prompts!inner(user_id)').eq('id', active_version_id).maybeSingle();
            const { data: v1VersionExists } = await supabase.from('prompt_versions').select('id, created_by').eq('id', active_version_id).maybeSingle();
            const { data: v1PromptExists } = await supabase.from('prompts').select('id, user_id').eq('id', active_version_id).maybeSingle();

            console.log(`[Execute] Diagnostic - ID: ${active_version_id}, Workspace: ${keyContext.user_id}`);
            console.log(`[Execute] Diagnostic - v2Exists: ${!!v2Exists}, v1VersionExists: ${!!v1VersionExists}, v1PromptExists: ${!!v1PromptExists}`);

            return NextResponse.json({
                success: false,
                error: "Prompt version not found",
                debug: {
                    receivedVersionId: active_version_id,
                    workspaceId: keyContext.user_id,
                    existsInV2: !!v2Exists,
                    existsInV1Version: !!v1VersionExists,
                    existsInV1Prompt: !!v1PromptExists,
                    v2Owner: (v2Exists as any)?.v2_prompts?.user_id || null,
                    v1VersionOwner: v1VersionExists?.created_by || null,
                    v1PromptOwner: v1PromptExists?.user_id || null,
                }
            }, { status: 404 });
        }

        // 3. Generate Exact-Match Cache Key
        // We hash the version_id + sorted variables to ensure stable keys
        const sortedVars = Object.keys(variables).sort().reduce((acc, key) => {
            acc[key] = variables[key];
            return acc;
        }, {} as Record<string, string>);

        const hashInput = JSON.stringify({ v: active_version_id, vars: sortedVars });
        const hash = crypto.createHash('md5').update(hashInput).digest('hex');
        const cacheKey = `pf:exec:${hash}`;

        // 4. Execute (With Route & Cache wrapping)
        const { data: result, cached } = await withCache(cacheKey, async () => {
            return await routeAndExecutePrompt(
                systemPrompt,
                template,
                variables
            );
        });

        // Run output schema validation on generated output
        if (required_schema && !validateSchema(result.output, required_schema)) {
            // Minimal handling: skip cache and return error
            return NextResponse.json({ error: "Output failed schema validation", output: result.output }, { status: 422 });
        }

        const latencyMs = Date.now() - startTime;
        const finalCost = cached ? 0 : (result.costMicroUsd || 0);

        // 5. Asynchronous Telemetry Logging (Fire and forget to not block the response)
        supabase.from('v2_execution_logs').insert({
            version_id: active_version_id,
            api_key_id: keyContext.id, // Link execution to the API Key
            latency_ms: latencyMs,
            model_used: result.modelUsed,
            cached_hit: cached,
            tokens_input: result.tokensInput || 0,
            tokens_output: result.tokensOutput || 0,
            cost_micro_usd: finalCost,
            ab_test_variant: ab_version_id ? active_version_id : null
        }).then(({ error }) => {
            if (error) console.error("[Telemetry] Failed to log execution:", error);
        });

        // 6. Return Response
        return NextResponse.json({
            success: true,
            data: result.output,
            meta: {
                model: result.modelUsed,
                cached: cached,
                latency_ms: latencyMs,
                tokens_input: result.tokensInput || 0,
                tokens_output: result.tokensOutput || 0,
                cost_micro_usd: finalCost,
                served_version: active_version_id
            }
        });

    } catch (err: any) {
        console.error("[API Error] /v1/execute:", err);
        return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
    }
}
