"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

export async function refinePrompt(
    prompt: string,
    detailLevel: string,
    options: {
        model?: string;
        temperature?: number;
        topP?: number;
        topK?: number;
    } = {}
) {
    const {
        model = "gemini-2.5-flash",
        temperature = 0.7,
        topP = 0.95,
        topK = 40
    } = options;
    if (!prompt || prompt.trim().length < 3) return null;

    // Fallback for local dev / demo
    if (!process.env.GEMINI_API_KEY) {
        await new Promise(r => setTimeout(r, 1200));
        return `[MOCK RESPONSE — GEMINI_API_KEY MISSING]

ROLE: Prompt Engineering System
OBJECTIVE: Refine the following input into a high-quality prompt

RAW INPUT:
${prompt}

DETAIL LEVEL:
${detailLevel}

NOTE:
This is a simulated response. In production, Gemini will generate a fully refined prompt.`;
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
                        return "Error: Limit Reached. The Free tier is limited to 30 prompts per month. Please upgrade to Pro for unlimited access.";
                    }
                }
            } catch (quotaErr) {
                console.error("Quota check failed", quotaErr);
                // Fail open? or fail closed? failing open for now to avoid blocking users on error
            }
        }

        // Pool of keys for redundancy/failover
        // Loaded securely from environment variables
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
You are PromptForge AI — a senior-level prompt engineering system used by professionals, founders, and product teams.

CORE MISSION:
Convert raw user intent into a production-ready, high-impact prompt that delivers the best possible result on the first run.

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
   - When the domain is recognizable (e.g., websites, games, apps, branding, AI),
     apply industry-standard best practices by default.
   - Do NOT downgrade output quality by asking basic clarification questions.

3. Vision Elevation
   - Upgrade vague ideas into strong, outcome-driven objectives.
   - Replace generic wording with specific, high-signal language.
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
- Short: Minimal but decisive. No filler.
- Medium: Clear structure, strong defaults.
- Detailed: Deep reasoning, professional-grade completeness.
- Granular: Expert-level depth, implementation hints, edge-case awareness.

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
Only if the input is extremely vague (e.g., "help", "build AI"),
generate a professional SYSTEM INTAKE TEMPLATE that actively guides the user forward.
`;

        let lastError: any = null;

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
                        `RAW USER INPUT:\n${prompt}`
                    ]);

                    const text = result.response.text();
                    if (!text) throw new Error("Empty response");

                    // --- Success! ---

                    // Save to Supabase (Blocking/Awaited to ensure persistence)
                    if (userId) {
                        try {
                            const token = await getToken({ template: "supabase" });
                            const supabase = createClerkSupabaseClient(token);

                            const { error } = await supabase.from("prompts").insert({
                                user_id: userId,
                                original_prompt: prompt,
                                refined_prompt: text.trim(),
                                intent: "General",
                                detail_level: detailLevel,
                                model_used: modelName
                            });

                            if (error) {
                                console.error("Supabase insert error:", error);
                            }
                        } catch (saveErr) {
                            console.error("Failed to save prompt history:", saveErr);
                        }
                    }

                    return text.trim();

                } catch (err: any) {
                    console.warn(`[Key Ending ...${apiKey.slice(-4)}] Model ${modelName} failed:`, err.message);
                    lastError = err;

                    const msg = (err.message || "").toLowerCase();

                    // If it's a Key error (Quota, Auth), mark key as failed and break model loop
                    // to immediately try the NEXT KEY.
                    if (msg.includes("429") || msg.includes("quota") || msg.includes("api key") || msg.includes("forbidden")) {
                        console.warn(`Key quota exceeded or invalid. Switching API key...`);
                        keyFailed = true;
                        break;
                    }

                    // If it's a Model error (404 Not Found, 503 Overloaded), continue loop to try next model with SAME KEY.
                }
            }
        }

        throw lastError || new Error("All API keys and models failed. Please try again later.");

    } catch (error: any) {
        console.error("Gemini System Failure:", error);

        if (error.message?.includes("Limit Reached")) {
            return error.message;
        }
        if (error.message?.includes("API key"))
            return "Error: Invalid or missing GEMINI_API_KEY in environment.";
        if (error.message?.includes("not found"))
            return "Error: Requested Gemini model not found.";
        if (error.message?.includes("fetch"))
            return "Error: Network connection failed.";

        return "Error: " + (error.message || "Unknown generation failure.");
    }
}
