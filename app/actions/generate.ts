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
        model = "gemini-2.5-flash",
        temperature = 0.7,
        topP = 0.95,
        topK = 40
    } = options;

    if (!prompt || prompt.trim().length < 3) {
        return { success: false, error: "Prompt too short" };
    }

    // Fallback for local dev / demo
    if (!process.env.GEMINI_API_KEY) {
        await new Promise(r => setTimeout(r, 1200));
        return {
            success: true,
            content: `[MOCK RESPONSE — GEMINI_API_KEY MISSING]\n\nROLE: Prompt Engineering System\nOBJECTIVE: ...\n\n(Simulated for ${detailLevel} mode)`,
            promptId: "mock-id",
            versionId: "mock-v1"
        };
    }

    try {
        // 0. Subscription & Quota Check
        const { userId, getToken } = await auth();

        if (userId) {
            try {
                const token = await getToken({ template: "supabase" });
                const supabase = createClerkSupabaseClient(token);

                // Check Subscription Tier
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('subscription_tier')
                    .eq('user_id', userId)
                    .single();

                const tier = profile?.subscription_tier || 'free';

                if (tier === 'free') {
                    // Count prompts for current month
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    startOfMonth.setHours(0, 0, 0, 0);

                    const { count } = await supabase
                        .from('prompts')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', userId)
                        .gte('created_at', startOfMonth.toISOString());

                    if (count !== null && count >= 30) {
                        return { success: false, error: "Limit Reached. The Free tier is limited to 30 prompts per month." };
                    }

                    // Granular is Pro only
                    if (detailLevel === "Granular") {
                        return { success: false, error: "Limit Reached. Granular Mode is available only on the Pro plan." };
                    }
                }
            } catch (quotaErr) {
                console.error("Quota check failed", quotaErr);
            }
        }

        // Pool of keys for redundancy/failover
        const API_KEYS = [
            process.env.GEMINI_API_KEY,      // Primary
            process.env.GEMINI_API_KEY_2,    // Backup 1
            process.env.GEMINI_API_KEY_3,    // Backup 2
            process.env.GEMINI_API_KEY_4,    // Backup 3
            process.env.GEMINI_API_KEY_5     // Backup 4 (Optional)
        ].filter(k => k && k.trim().length > 0) as string[];

        if (API_KEYS.length === 0) throw new Error("No valid API keys found");

        // Prioritized list of models to attempt
        const MODELS_TO_TRY = [
            "gemini-2.5-flash",
            "gemini-3-flash",
            "gemini-2.5-flash-lite",
            "gemini-1.5-flash"
        ];

        // Detail-level modifier
        let modifier = "";
        switch (detailLevel) {
            case "Short":
                modifier = "Low — minimal structure, concise constraints, under 50 words.";
                break;
            case "Medium":
                modifier = "Medium — clear sections, essential constraints, one paragraph per section.";
                break;
            case "Detailed":
                modifier = "High — fully structured, comprehensive constraints, examples included.";
                break;
            case "Granular":
                modifier = "High — exhaustive, step-by-step instructions, edge cases, technical depth.";
                break;
            default:
                modifier = "Medium — balanced structure and clarity.";
        }

        const systemInstruction = `

You are PromptForge AI — a senior - level prompt engineering system used by professionals, founders, and product teams.

CORE MISSION:
Convert raw user intent into a production - ready, high - impact prompt that delivers the best possible result on the first run.

You are allowed — and expected — to make expert decisions when industry best practices are clear.
Do NOT ask questions unless critical information is truly missing.

OUTPUT RULE:
The first character of your response must be part of the refined prompt itself.
Do NOT explain your reasoning.
Do NOT include conversational language.

            INTENT & EXECUTION PROTOCOL:

        1. Intent Classification
            - Identify whether the task is Creative, Technical, Strategic, Analytical, or Hybrid.
   - If the user asks to "make", "build", "design", or "create", assume EXECUTION MODE.

2. Expert Assumption Policy
            - When the domain is recognizable(e.g., websites, games, apps, branding, AI),
                apply industry - standard best practices by default.
        - Do NOT downgrade output quality by asking basic clarification questions.

3. Vision Elevation
            - Upgrade vague ideas into strong, outcome - driven objectives.
   - Replace generic wording with specific, high - signal language.
   - Example:
        "make a game site" → "design a cinematic AAA game marketing website"

        4. Constraint Engineering
            - Convert soft constraints into measurable rules.
   - Remove contradictions and redundancy.
   - Add missing constraints that improve output quality.

5. Structural Precision
   Use this structure when applicable:
        ROLE
        OBJECTIVE
   TARGET AUDIENCE
   CORE EXPERIENCE GOAL
   KEY SECTIONS / COMPONENTS
   FUNCTIONAL REQUIREMENTS
        DESIGN & STYLE DIRECTION
        TECHNICAL / PLATFORM NOTES
   OUTPUT REQUIREMENTS

DETAIL LEVEL INTELLIGENCE MODE:
${modifier}

DETAIL LEVEL BEHAVIOR:
        - Short: Minimal but decisive.No filler.
- Medium: Clear structure, strong defaults.
- Detailed: Deep reasoning, professional - grade completeness.
- Granular: Expert - level depth, implementation hints, edge -case awareness.

QUALITY BAR:
Assume the output will be used by:
        - Professional designers
            - Developers
            - AI website builders
                - Product teams

        TONE:
        - Authoritative
            - Precise
            - Confident
            - Zero fluff

HARD RULES:
        - Return ONLY the refined prompt.
- No markdown.
- No emojis.
- No explanations.
- No meta commentary.

VAGUE INPUT EXCEPTION:
Only if the input is extremely vague(e.g., "help", "build AI"),
            generate a professional SYSTEM INTAKE TEMPLATE that actively guides the user forward.
`;

        let lastError: any = null;

        // Timer for Latency Calculation
        const startTime = Date.now();

        // Failover Logic: Try Key 1 -> Key 2 -> ... -> Key N
        for (const apiKey of API_KEYS) {
            const genAI = new GoogleGenerativeAI(apiKey);
            let keyFailed = false; // Flag to skip remaining models for this key if quota/auth fails

            // For each key, we try our list of models (to handle model availability)
            for (const modelName of MODELS_TO_TRY) {
                if (keyFailed) break;

                try {
                    const geminiModel = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            temperature,
                            topK,
                            topP,
                        }
                    });

                    const result = await geminiModel.generateContent([
                        systemInstruction,
                        `RAW USER INPUT: \n${prompt} `
                    ]);

                    const text = result.response.text();
                    if (!text) throw new Error("Empty response");

                    // Analytics capture
                    const usage = result.response.usageMetadata;
                    const latency = Date.now() - startTime;

                    // --- Success! ---
                    let updatedPromptId: string | undefined;
                    let updatedVersionId: string | undefined;

                    // Save to Supabase (Blocking/Awaited to ensure persistence)
                    if (userId) {
                        try {
                            const token = await getToken({ template: "supabase" });
                            const supabase = createClerkSupabaseClient(token);

                            // 1. Create the Prompt Identity (Container)
                            const { data: promptData, error: promptError } = await supabase
                                .from("prompts")
                                .insert({
                                    user_id: userId, // TEXT
                                    original_prompt: prompt,
                                    refined_prompt: text.trim(), // Legacy support
                                    intent: "General",
                                    detail_level: detailLevel,
                                    model_used: modelName,
                                    is_archived: false
                                })
                                .select('id')
                                .single();

                            if (promptError) {
                                console.error("Supabase insert error (prompts):", promptError);
                            } else if (promptData) {
                                updatedPromptId = promptData.id;

                                // 2. Create the First Version (Immutable Snapshot)
                                const { data: versionData, error: versionError } = await supabase
                                    .from("prompt_versions")
                                    .insert({
                                        prompt_id: promptData.id,
                                        version_number: 1,
                                        content: text.trim(),
                                        model_config: {
                                            model: modelName,
                                            temperature,
                                            topP,
                                            topK,
                                            detailLevel
                                        },
                                        changelog: "Initial generation",
                                        created_by: userId // TEXT
                                    })
                                    .select('id')
                                    .single();

                                if (versionError) {
                                    console.error("Supabase insert error (version):", versionError);
                                } else if (versionData) {
                                    updatedVersionId = versionData.id;
                                    // 3. Link back to current version
                                    await supabase
                                        .from("prompts")
                                        .update({ current_version_id: versionData.id })
                                        .eq('id', promptData.id);

                                    // 4. Create Analytics Record
                                    if (usage) {
                                        await supabase.from("prompt_analytics").insert({
                                            prompt_version_id: versionData.id,
                                            user_id: userId,
                                            tokens_input: usage.promptTokenCount,
                                            tokens_output: usage.candidatesTokenCount,
                                            latency_ms: latency,
                                            // Simple cost estimation (example rates for Gemini Flash)
                                            // $0.35/1M input, $0.70/1M output -> micro-USD
                                            cost_micro_usd: Math.round(
                                                ((usage.promptTokenCount || 0) * 0.35) +
                                                ((usage.candidatesTokenCount || 0) * 0.70)
                                            ),
                                            feedback_score: null
                                        });
                                    }
                                }
                            }
                        } catch (saveErr) {
                            console.error("Failed to save prompt history:", saveErr);
                        }
                    }

                    return {
                        success: true,
                        content: text.trim(),
                        promptId: updatedPromptId,
                        versionId: updatedVersionId
                    };

                } catch (err: any) {
                    console.warn(`[Key Ending ...${apiKey.slice(-4)}] Model ${modelName} failed: `, err.message);
                    lastError = err;

                    const msg = (err.message || "").toLowerCase();

                    // If it's a Key error (Quota, Auth), mark key as failed and break model loop
                    // to immediately try the NEXT KEY.
                    if (msg.includes("429") || msg.includes("quota") || msg.includes("api key") || msg.includes("forbidden")) {
                        console.warn(`Key quota exceeded or invalid.Switching API key...`);
                        keyFailed = true;
                        break;
                    }

                    // If it's a Model error (404 Not Found, 503 Overloaded), continue loop to try next model with SAME KEY.
                }
            }
        }

        const finalError = lastError || new Error("All API keys and models failed. Please try again later.");
        return { success: false, error: finalError.message };

    } catch (error: any) {
        console.error("Gemini System Failure:", error);

        let errMsg = "Unknown generation failure.";
        if (error.message?.includes("Limit Reached")) errMsg = error.message;
        else if (error.message?.includes("API key")) errMsg = "Error: Invalid or missing GEMINI_API_KEY in environment.";
        else if (error.message?.includes("not found")) errMsg = "Error: Requested Gemini model not found.";
        else if (error.message?.includes("fetch")) errMsg = "Error: Network connection failed.";
        else errMsg = "Error: " + error.message;

        return { success: false, error: errMsg };
    }
}
