"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
    process.env.GEMINI_API_KEY as string,
    process.env.GEMINI_API_KEY_SECONDARY as string
].filter(Boolean);

export interface AuditResult {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
}

export async function auditPrompt(prompt: string): Promise<{ success: boolean, data?: AuditResult, error?: string }> {
    if (!prompt || prompt.length < 10) {
        return { success: false, error: "Prompt is too short to audit." };
    }

    try {
        const apiKey = API_KEYS[0]; // Simple selection for now
        if (!apiKey) return { success: false, error: "API Key missing" };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
        You are a harsh but fair Prompt Engineering Critic. 
        Analyze the following prompt and provide a structured critique.
        
        Output format must be valid JSON:
        {
            "score": number (0-100),
            "strengths": [ "point 1", "point 2" ],
            "weaknesses": [ "point 1", "point 2" ],
            "suggestions": [ "actionable advice 1", "actionable advice 2" ]
        }

        Scoring Criteria:
        - Clarity: Is the intent obvious?
        - Specificity: Are constraints defined?
        - Content: Is there enough context?
        
        Do not wrap in markdown code blocks. Just return the JSON string.
        `;

        const result = await model.generateContent([
            systemPrompt,
            `PROMPT TO AUDIT: "${prompt}"`
        ]);

        const text = result.response.text();
        // clean up potential markdown formatting if model adds it
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const auditData = JSON.parse(cleanText) as AuditResult;

        return { success: true, data: auditData };

    } catch (error: any) {
        console.error("Audit Error:", error);
        return { success: false, error: "Failed to audit prompt." };
    }
}
