"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

export interface GenerateResponse {
    success: boolean;
    content?: string;
    promptId?: string;
    versionId?: string;
    error?: string;
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getStartOfISTDay() {
    const now = new Date();
    const istTime = new Date(now.getTime() + IST_OFFSET_MS);
    istTime.setUTCHours(0, 0, 0, 0);
    return new Date(istTime.getTime() - IST_OFFSET_MS);
}

export async function refinePrompt(
    prompt: string,
    detailLevel: string,
    options: {
        model?: string;
        temperature?: number;
        topP?: number;
        topK?: number;
    } = {}
): Promise<GenerateResponse> {
    const {
        model,
        temperature = 0.7,
        topP = 0.95,
        topK = 40
    } = options;

    if (!prompt || prompt.trim().length < 3) {
        return { success: false, error: "Prompt is too short to optimize." };
    }

    // Safety Mock for No-Key Envs
    if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY_2) {
        await new Promise(r => setTimeout(r, 1200));
        return {
            success: true,
            content: `[DEMO MODE]\n\nYour prompt processed successfully.\n(Gemini keys are missing in env)`,
            promptId: "demo-id",
            versionId: "demo-v1"
        };
    }

    try {
        const { userId, getToken } = await auth();

        // --- HARD SECURITY GATE ---
        if (!userId) {
            return {
                success: false,
                error: "Authentication Required: Please sign in to use the engine and protect against unauthorized usage."
            };
        }

        let userTier = "free";
        let isPro = false;

        if (userId) {
            try {
                const token = await getToken({ template: "supabase" });
                const supabase = createClerkSupabaseClient(token);

                // 1. Fetch User Tier
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('subscription_tier')
                    .eq('user_id', userId)
                    .single();

                userTier = profile?.subscription_tier || 'free';
                isPro = userTier === 'pro';

                // 2. Define Limits
                const RATE_LIMIT_MIN = isPro ? 15 : 3;
                const DAILY_LIMIT = isPro ? 500 : 15;

                // 3. Time Windows
                const startOfISTDay = getStartOfISTDay().toISOString();
                const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();

                // 4. Check Rate Limit (Last 1 Minute)
                const { count: recentCount } = await supabase
                    .from('prompts')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId)
                    .gte('created_at', oneMinuteAgo);

                if (recentCount !== null && recentCount >= RATE_LIMIT_MIN) {
                    return {
                        success: false,
                        error: isPro
                            ? "Whoa, speed of light! Please wait a moment."
                            : "Our AI is thinking hard. Please wait 20s or upgrade for faster speeds."
                    };
                }

                // 5. Check Daily Limit (Since 00:00 IST)
                const { count: dailyCount } = await supabase
                    .from('prompts')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId)
                    .gte('created_at', startOfISTDay);

                if (dailyCount !== null && dailyCount >= DAILY_LIMIT) {
                    if (!isPro) {
                        return { success: false, error: "Daily Limit Reached (15/15). Upgrade to Pro for unlimited generations." };
                    } else {
                        // Soft cap for Pro
                        if (dailyCount >= 1000) return { success: false, error: "Usage limit exceeded for today." };
                    }
                }

                // 6. Feature Gating
                if (!isPro && detailLevel === "Granular") {
                    return { success: false, error: "Granular Mode is a Pro feature." };
                }

            } catch (authErr) {
                console.error("Auth/Quota Check Failed:", authErr);
                // Fail open or closed? Let's fail safe but allow if DB is just temporary down
            }
        }

        // --- KEY ROUTING STRATEGY ---
        // 4-Key System:
        // Key 1 (Mechanic) -> Fixer (Low usage)
        // Key 2 (Gamer) -> Playground/General (High usage)
        // Key 3 (Analyst) -> Analysis (Handled in analyze.ts)
        // Key 4 (Viper) -> Pro Exclusive

        let API_KEYS: string[] = [];

        if (isPro) {
            // Pro gets Viper first, then pooling
            API_KEYS = [
                process.env.GEMINI_API_KEY_4,
                process.env.GEMINI_API_KEY,
                process.env.GEMINI_API_KEY_2,
                process.env.GEMINI_API_KEY_5
            ].filter(Boolean) as string[];
        } else {
            // Free gets Gamer first, then Mechanic
            API_KEYS = [
                process.env.GEMINI_API_KEY_2, // Gamer
                process.env.GEMINI_API_KEY    // Mechanic (Fallback)
            ].filter(Boolean) as string[];
        }

        if (API_KEYS.length === 0) {
            // Fallback for dev if specific keys aren't set
            API_KEYS = [process.env.GEMINI_API_KEY!].filter(Boolean);
        }

        // --- GENERATION ROUTING ---
        let lastError: any = null;
        let generatedText = "";
        let usedModel = "";

        // Gemini Logic
        const MODELS_TO_TRY = model ? [model] : ["gemini-3-flash", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

        // --- GENERATION LOOP ---
        // System Prompt Construction
        let modifier = "";
        switch (detailLevel) {
            case "Short": modifier = "Low — minimal structure, concise constraints."; break;
            case "Medium": modifier = "Medium — clear sections, essential constraints."; break;
            case "Detailed": modifier = "High — fully structured, examples included."; break;
            case "Granular": modifier = "High — exhaustive, step-by-step instructions, edge cases."; break;
            default: modifier = "Medium — balanced structure.";
        }

        const systemInstruction = `
You are PromptForge Studio — a senior-level prompt engineering system.
CORE MISSION: Convert raw user intent into a production-ready, high-impact prompt.
OUTPUT RULE: Return ONLY the refined prompt. No markdown, no conversational filler.

INTENT & EXECUTION PROTOCOL:
1. Intent Classification: Identify Creative, Technical, or Strategic intent.
2. Expert Assumption: Apply industry best practices by default.
3. Vision Elevation: Upgrade vague ideas into specific objectives.
4. Constraint Engineering: define measurable rules.
5. Structural Precision: Use standard prompt sections (ROLE, OBJECTIVE, CONSTRAINTS).

DETAIL LEVEL: ${modifier}
QUALITY BAR: Professional, Authoritative, Precise.
`;

        outerLoop:
        for (const apiKey of API_KEYS) {
            const genAI = new GoogleGenerativeAI(apiKey);

            for (const modelName of MODELS_TO_TRY) {
                try {
                    const geminiModel = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: { temperature, topP, topK }
                    });

                    const result = await geminiModel.generateContent([
                        systemInstruction,
                        `RAW USER INPUT: \n${prompt} `
                    ]);

                    const text = result.response.text();
                    if (text) {
                        generatedText = text;
                        usedModel = modelName;
                        break outerLoop; // Success!
                    }

                } catch (err: any) {
                    lastError = err;
                    const msg = (err.message || "").toLowerCase();
                    // If Key error, break to next key
                    if (msg.includes("429") || msg.includes("quota") || msg.includes("key")) {
                        console.warn(`Key exhausted, switching...`);
                        break; // Try next key
                    }
                }
            }
        }

        if (!generatedText) {
            // Soft Error Handling
            const errString = lastError?.message || "";
            const isQuotaError = errString.includes("429") || errString.includes("quota");

            if (isQuotaError) {
                return {
                    success: false,
                    error: "High traffic server load. Please try again in 10 seconds."
                };
            }

            throw new Error(errString || "Generation failed");
        }

        // --- DB PERSISTENCE (Async / Blocking) ---
        let updatedPromptId: string | undefined;
        let updatedVersionId: string | undefined;

        if (userId) {
            try {
                const token = await getToken({ template: "supabase" });
                const supabase = createClerkSupabaseClient(token);

                // Insert Prompt Container
                const { data: promptData } = await supabase
                    .from("prompts")
                    .insert({
                        user_id: userId,
                        original_prompt: prompt,
                        refined_prompt: generatedText.trim(),
                        intent: "General",
                        detail_level: detailLevel,
                        model_used: usedModel,
                    })
                    .select('id')
                    .single();

                if (promptData) {
                    updatedPromptId = promptData.id;
                    // Insert Version
                    const { data: versionData } = await supabase
                        .from("prompt_versions")
                        .insert({
                            prompt_id: promptData.id,
                            version_number: 1,
                            content: generatedText.trim(),
                            model_config: { model: usedModel, temperature, detailLevel },
                            changelog: "Initial generation",
                            created_by: userId
                        })
                        .select('id')
                        .single();

                    if (versionData) {
                        updatedVersionId = versionData.id;
                        // Update Current Ref
                        await supabase
                            .from("prompts")
                            .update({ current_version_id: versionData.id })
                            .eq('id', promptData.id);
                    }
                }
            } catch (dbErr) {
                console.error("DB Save Error:", dbErr);
                // Don't fail the request if DB fails, just return content
            }
        }

        return {
            success: true,
            content: generatedText.trim(),
            promptId: updatedPromptId,
            versionId: updatedVersionId
        };

    } catch (error: any) {
        console.error("Critical Generation Error:", error);
        return { success: false, error: `Generation failed: ${error.message || "Unknown error"}` };
    }
}
