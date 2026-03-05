
import { IAIProvider, AIProviderName, CompletionOptions, ProviderResult } from "./types";
import { GeminiProvider } from "./providers/gemini";
import { NvidiaProvider } from "./providers/nvidia";
import { GroqProvider } from "./providers/groq";

export class AIRouter {
    private providers: Map<AIProviderName, IAIProvider> = new Map();

    constructor() {
        this.providers.set("gemini", new GeminiProvider());
        this.providers.set("nvidia", new NvidiaProvider());
        this.providers.set("groq", new GroqProvider());
    }

    async generateResponse(providerName: AIProviderName, options: CompletionOptions): Promise<ProviderResult> {
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`Provider ${providerName} not found`);
        }
        return provider.generateResponse(options);
    }
}

export const aiRouter = new AIRouter();
