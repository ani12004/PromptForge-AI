"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

type DetailLevel = "short" | "medium" | "detailed" | "granular";

interface RefineOptions {
    model?: string;
    temperature?: number;
    topP?: number;
    topK?: number;
}

export async function refinePrompt(
    prompt: string,
    detailLevel: string,
    options: RefineOptions = {}
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

ROLE: PromptForge AI (Simulated)
OBJECTIVE: Demonstrate AAA-quality prompt structure (Mock Mode)

RAW INPUT:
${prompt}

DETAIL LEVEL:
${detailLevel}

NOTE:
This is a simulated response. In production, the system will apply the full "Elite Execution" protocol.`;
    }

    try {
        const { userId, getToken } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        /* USAGE LIMIT CHECK */
        const { data: usage } = await supabase
            .from("usage")
            .select("count")
            .eq("user_id", userId)
            .single();

        if (usage && usage.count >= 50) {
            throw new Error("Free tier limit reached");
        }

        /* DETAIL LEVEL MODIFIER */
        const modifier =
            detailLevel === "short"
                ? "STRICT SHORT MODE: Under 50 words. Only core directives. No elaboration."
                : detailLevel === "medium"
                    ? "MEDIUM MODE: Clear structure with strong defaults. Balanced length."
                    : detailLevel === "detailed"
                        ? "DETAILED MODE: Professional-grade completeness with full section coverage."
                        : `GRANULAR MODE:
Expert-level depth with implementation hints, edge-case awareness, and production considerations.
Increase insight, not length.
Avoid repetition across sections.`;

        /* SYSTEM INSTRUCTION */
        const systemInstruction = `
You are an elite, execution-first prompt engineering system used by senior professionals, founders, and product teams.

CORE MISSION:
Transform raw user intent into a production-ready, expert-grade SYSTEM PROMPT that reliably produces superior results on the first execution across modern LLMs.

You operate at senior practitioner level across creative, technical, strategic, and analytical domains.
You are authorized to make decisive, industry-standard assumptions when the domain is recognizable.
Do NOT ask clarifying questions unless execution would otherwise fail or materially degrade correctness.

ABSOLUTE OUTPUT RULES:
- The first character of your response must be part of the refined prompt itself
- Output MUST be directly usable as a system or master prompt for an LLM
- Do NOT explain reasoning
- Do NOT include conversational language
- Do NOT include meta commentary
- Do NOT include markdown symbols or formatting
- Do NOT reference yourself or prior context
- Output plain, professional text only

INTENT & EXECUTION PROTOCOL:

1. Intent Lock
   - Identify the dominant intent: Creative, Technical, Strategic, Analytical, or Hybrid.
   - If the user uses verbs such as "make", "build", "design", "create", or "generate",
     immediately lock into EXECUTION MODE.
   - Treat the output as actionable instructions for an AI, not documentation for humans.

2. Domain Stabilization
   - Infer domain-specific norms, constraints, and best practices immediately.
   - Reject tone, structure, or concepts that do not match the domain’s real-world standards.
   - Prevent cross-domain contamination (e.g., cinematic language in analytical tasks).

3. Expert Assumption Policy
   - Apply current, widely accepted industry best practices by default for recognizable domains
     (SaaS, websites, games, branding, AI systems, automation, enterprise software).
   - Never degrade output quality by asking obvious or introductory questions.
   - If multiple execution paths exist, select the most professional, scalable, and feasible option.

4. Vision Elevation (Mandatory)
   - Convert vague or underspecified intent into explicit, measurable, outcome-driven objectives.
   - Replace generic phrasing with high-signal, execution-ready decisions.
   - Output must read as authoritative instructions issued by a senior professional.

5. AI Behavior Control (Mandatory)
   - Require internal reasoning and validation before producing final output, without exposing reasoning.
   - Enforce scope, feasibility, and completion criteria.
   - Proactively prevent hallucination, speculation, and unsupported claims.
   - Include fallbacks and progressive enhancement considerations where heavy media, interactivity, or device limitations exist.

6. Originality Enforcement
   - Introduce at least ONE distinctive creative, experiential, or systemic element
     that clearly differentiates the result from standard templates.
   - Ensure originality is actionable, specific, and feasible.
   - Avoid buzzwords, boilerplate patterns, and generic “best practice” padding.

7. Constraint Engineering
   - Translate soft ideas into enforceable, testable constraints.
   - Add missing constraints that materially improve execution quality.
   - Resolve ambiguity decisively; remove redundancy and contradictions.
   - Prioritize critical elements to prevent instruction overload.

8. Structural Precision
   Use the following structure unless task clearly demands otherwise:

   ROLE
   OBJECTIVE
   THINKING & EXECUTION INSTRUCTIONS
   TARGET AUDIENCE
   CORE EXPERIENCE GOAL
   SIGNATURE DIFFERENTIATOR
   KEY SECTIONS / COMPONENTS
   FUNCTIONAL REQUIREMENTS
   DESIGN & STYLE DIRECTION
   TECHNICAL / PLATFORM NOTES
   QUALITY BAR
   OUTPUT REQUIREMENTS

DETAIL LEVEL INTELLIGENCE MODE:
${modifier}

DETAIL LEVEL BEHAVIOR:
- Short: Minimal, decisive, no optional elements, no elaboration.
- Medium: Clear structure, strong defaults, controlled depth.
- Detailed: Full professional coverage with execution clarity.
- Granular: Expert-level depth with prioritization, implementation-aware guidance,
  scalability considerations, edge-case handling, fallback strategies, and progressive enhancement.
  Granular mode must never become verbose, repetitive, or unfocused.

QUALITY BAR (STRICTLY ENFORCED):
Assume the output will be executed by senior designers, engineers,
or product leads without further clarification.
Generic, boilerplate, repetitive, or surface-level decisions are unacceptable.
The result must outperform an average senior professional’s first draft.

FAILURE PREVENTION RULES:
- Do not restate the same requirement in different wording.
- Do not inflate scope beyond what materially improves outcome quality.
- Do not include speculative features unless clearly justified by intent.
- Include fallback strategies for unsupported devices, bandwidth constraints, or feature-heavy interactions.
- Prioritize execution feasibility and critical-path objectives above optional enhancements.
- Maintain clarity, avoid ambiguity, and prevent contradictions.

VAGUE INPUT EXCEPTION:
Only if the input is extremely vague or non-actionable
(e.g., "help", "build AI"),
generate a SYSTEM INTAKE PROMPT that extracts the minimum
required execution details while maintaining authority.
Do not default to intake mode if intent can be reasonably inferred.
`;



        /* GEMINI CONFIG */
        // Pool of keys for redundancy/failover
        // Loaded securely from environment variables
        const API_KEYS = [
            process.env.GEMINI_API_KEY,      // Primary
            process.env.GEMINI_API_KEY_2,    // Backup 1
            process.env.GEMINI_API_KEY_3,    // Backup 2
            process.env.GEMINI_API_KEY_4,    // Backup 3
            process.env.GEMINI_API_KEY_5     // Backup 4 (Optional)
        ].filter(k => k && k.trim().length > 0) as string[];

        if (API_KEYS.length === 0) {
            return `ROLE
You are PromptForge AI operating in simulated mode.

OBJECTIVE
Demonstrate the expected structure and quality of a refined prompt.

RAW USER INPUT
${prompt}

DETAIL LEVEL
${detailLevel}

OUTPUT REQUIREMENTS
This is a simulated response generated without a live model.`;
        }

        const MODELS_TO_TRY = options.model
            ? [options.model, "gemini-2.5-flash", "gemini-1.5-flash"]
            : [
                "gemini-2.5-flash",
                "gemini-3-flash",
                "gemini-2.5-flash-lite",
                "gemini-1.5-flash"
            ];

        let refinedPrompt: string | null = null;
        let lastError: any = null;
        let modelUsed: string = "";

        /* MODEL EXECUTION LOOP */
        for (const apiKey of API_KEYS) {
            const genAI = new GoogleGenerativeAI(apiKey);
            let keyFailed = false;

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

                    refinedPrompt = result.response.text().trim();
                    if (refinedPrompt) {
                        modelUsed = modelName;
                        break;
                    }
                } catch (err: any) {
                    // Logic to handle model/key failure
                    console.warn(`[Key Ending ...${apiKey.slice(-4)}] Model ${modelName} failed:`, err.message);
                    lastError = err;
                    const msg = (err.message || "").toLowerCase();
                    if (msg.includes("429") || msg.includes("quota") || msg.includes("api key") || msg.includes("forbidden")) {
                        keyFailed = true;
                        break;
                    }
                    continue;
                }
            }
            if (refinedPrompt) break;
        }

        if (!refinedPrompt) {
            throw lastError || new Error("All Gemini models failed. Please try again later.");
        }

        /* USAGE TRACKING */
        try {
            await supabase.from("usage").upsert({
                user_id: userId,
                count: (usage?.count ?? 0) + 1
            });

            await supabase.from("prompts").insert({
                user_id: userId,
                original_prompt: prompt,
                refined_prompt: refinedPrompt,
                detail_level: detailLevel, // detailLevel is string, fits DB? yes used to
                intent: "Inferred",
                model_used: modelUsed
            });
        } catch (dbErr) {
            console.error("DB Update failed", dbErr);
        }

        return refinedPrompt;

    } catch (error: any) {
        console.error("Gemini System Failure:", error);

        if (error.message?.includes("Limit Reached")) return error.message;
        if (error.message?.includes("API key")) return "Error: Invalid or missing GEMINI_API_KEY in environment.";
        if (error.message?.includes("not found")) return "Error: Requested Gemini model not found.";
        if (error.message?.includes("fetch")) return "Error: Network connection failed.";

        return "Error: " + (error.message || "Unknown generation failure.");
    }
}
