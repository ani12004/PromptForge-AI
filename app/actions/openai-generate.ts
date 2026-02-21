"use server";

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIResponse {
    success: boolean;
    content?: string;
    error?: string;
}

export async function refinePromptOpenAI(
    prompt: string,
    detailLevel: string,
    options: {
        model?: string;
        temperature?: number;
    } = {}
): Promise<OpenAIResponse> {
    const {
        model = "gpt-4o-mini",
        temperature = 0.7,
    } = options;

    if (!process.env.OPENAI_API_KEY) {
        return { success: false, error: "OpenAI API Key is missing in environment." };
    }

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

    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: `RAW USER INPUT: \n${prompt}` }
            ],
            temperature: temperature,
        });

        const content = response.choices[0]?.message?.content;

        if (content) {
            return {
                success: true,
                content: content.trim(),
            };
        } else {
            return { success: false, error: "OpenAI returned an empty response." };
        }
    } catch (error: any) {
        console.error("OpenAI Generation Error:", error);
        return { success: false, error: error.message || "OpenAI generation failed" };
    }
}
