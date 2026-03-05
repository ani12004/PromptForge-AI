
import { BaseAIProvider } from "./base";
import { AIProviderName, CompletionOptions, ProviderResult } from "../types";

export class GroqProvider extends BaseAIProvider {
    name: AIProviderName = "groq";

    async generateResponse(options: CompletionOptions): Promise<ProviderResult> {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new Error("Missing GROQ_API_KEY");

        const result = await this.fetchOpenAICompatible(
            "https://api.groq.com/openai/v1/chat/completions",
            apiKey,
            options
        );

        // Approximate cost for llama-3.3-70b-versatile ($0.59 / 1M tokens)
        const tokensInput = result.usage?.promptTokens || 0;
        const tokensOutput = result.usage?.completionTokens || 0;
        const costMicroUsd = Math.round((tokensInput * 0.59) + (tokensOutput * 0.59));

        return { ...result, costMicroUsd };
    }
}
