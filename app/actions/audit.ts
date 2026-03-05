"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabaseClient";

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
        const { userId, getToken } = await auth();

        // --- SECURITY: Mandatory Auth ---
        if (!userId) {
            return { success: false, error: "Authentication Required: Please sign in to audit prompts." };
        }

        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        // --- RATE LIMITING ---
        const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
        const { count: recentAudits } = await supabase
            .from('prompts') // Re-using prompts table check for now as a proxy for activity
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', oneMinuteAgo);

        if (recentAudits !== null && recentAudits >= 5) {
            return { success: false, error: "Audit limit reached. Please wait a minute." };
        }

        const apiKey = API_KEYS[0];
        if (!apiKey) return { success: false, error: "System Configuration Error: API Key missing" };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        return { success: false, error: "Failed to audit prompt. Please try again later." };
    }
}
