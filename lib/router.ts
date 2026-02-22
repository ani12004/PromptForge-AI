import { GoogleGenerativeAI } from "@google/generative-ai";

let aiInstance: GoogleGenerativeAI | null = null;

const getAIClient = () => {
    if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
    if (!aiInstance) {
        aiInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return aiInstance;
};

export interface RouterResult {
    output: string;
    modelUsed: string;
    tokensInput: number;
    tokensOutput: number;
    costMicroUsd: number;
}

export async function routeAndExecutePrompt(
    systemPrompt: string,
    template: string,
    variables: Record<string, string>,
    forcedModel?: string
): Promise<RouterResult> {
    const ai = getAIClient();

    // 1. Variable Injection
    // Replaces all occurrences of {{variable_name}} with the actual value
    let finalPrompt = template;
    for (const [key, value] of Object.entries(variables)) {
        // Use a global regex to replace all instances of the variable
        const regex = new RegExp(`{{${key}}}`, 'g');
        finalPrompt = finalPrompt.replace(regex, value);
    }

    // 2. Cascading Model Router Logic
    // Token approximation: 1 token ~= 4 chars.
    // If the prompt is massive (>4000 chars roughly 1k tokens) or explicitly asks for deep reasoning, route to Pro.
    const isMassive = finalPrompt.length > 4000;
    const requiresDeepLogic = systemPrompt.toLowerCase().includes("step-by-step") || template.toLowerCase().includes("<think>");

    // Default to the fast, cheap model. Upgrade based on heuristics or forced override.
    const modelName = forcedModel || ((isMassive || requiresDeepLogic)
        ? "gemini-2.0-pro-exp-02-05"
        : "gemini-2.5-flash");

    // 3. LLM Execution
    if (modelName.startsWith('nvidia/')) {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: finalPrompt }
                ],
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 1024,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `NVIDIA API error: ${response.status}`);
        }

        const data = await response.json();
        let text = data.choices[0]?.message?.content || "";

        // Handle Reward models (which might return scores in metadata/content)
        if (!text && modelName.includes('reward')) {
            text = JSON.stringify(data.choices[0], null, 2);
        }

        const tokensInput = data.usage?.prompt_tokens || 0;
        const tokensOutput = data.usage?.completion_tokens || 0;

        // Approximate NVIDIA costs (varies by model, using a baseline for now)
        const costMicroUsd = Math.round((tokensInput * 0.1) + (tokensOutput * 0.3));

        return {
            output: text,
            modelUsed: modelName,
            tokensInput,
            tokensOutput,
            costMicroUsd
        };

    } else {
        // Gemini Execution
        const geminiModel = ai.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt
        });

        const response = await geminiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
            generationConfig: {
                temperature: 0.7,
            }
        });

        const text = response.response.text();
        if (!text) {
            throw new Error("LLM returned an empty response.");
        }

        const usage = response.response.usageMetadata || (response as any).usageMetadata;
        const tokensInput = usage?.promptTokenCount || 0;
        const tokensOutput = usage?.candidatesTokenCount || 0;

        const isPro = modelName.includes('pro');
        const costIn = isPro ? 1.25 : 0.075;
        const costOut = isPro ? 5.00 : 0.30;

        const costMicroUsd = Math.round((tokensInput * costIn) + (tokensOutput * costOut));

        return {
            output: text,
            modelUsed: modelName,
            tokensInput,
            tokensOutput,
            costMicroUsd
        };
    }
}
