import { PromptForgeOptions, ExecuteParams, ExecuteResponse } from './types';
import { PromptForgeError } from './errors';
import { fetchWithTimeout } from './utils';

export class PromptForgeClient {
    private apiKey: string;
    private baseUrl: string;
    private timeoutMs: number;
    private maxRetries: number;

    constructor(options: PromptForgeOptions) {
        if (!options.apiKey) throw new Error("API Key is required");
        this.apiKey = options.apiKey;
        this.baseUrl = (options.baseUrl || 'https://prompt-forge-studio.vercel.app').replace(/\/$/, "");
        this.timeoutMs = options.timeoutMs || 30000;
        this.maxRetries = options.maxRetries ?? 2;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            ...options.headers,
        };

        let lastError: any;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await fetchWithTimeout(url, {
                    ...options,
                    headers,
                    timeoutMs: this.timeoutMs,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new PromptForgeError(
                        response.status,
                        errorData?.error || response.statusText,
                        errorData?.code,
                        errorData?.details || errorData?.reason
                    );
                }

                return await response.json() as T;
            } catch (err: any) {
                lastError = err;
                if (err instanceof PromptForgeError && err.statusCode < 500 && err.statusCode !== 429) {
                    throw err; // Don't retry client errors except rate limit
                }
                if (attempt < this.maxRetries) {
                    await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 1000));
                }
            }
        }
        throw lastError;
    }

    async execute(params: ExecuteParams): Promise<ExecuteResponse> {
        const response = await this.request<any>('/api/v1/execute', {
            method: 'POST',
            body: JSON.stringify({
                version_id: params.versionId,
                ab_version_id: params.abVersionId,
                variables: params.variables,
                required_schema: params.requiredSchema,
            })
        });

        // Map snake_case backend response to CamelCase SDK response
        return {
            success: response.success,
            data: response.data,
            meta: {
                model: response.meta.model,
                cached: response.meta.cached,
                latencyMs: response.meta.latency_ms,
                tokensInput: response.meta.tokens_input,
                tokensOutput: response.meta.tokens_output,
                costMicroUsd: response.meta.cost_micro_usd,
                servedVersion: response.meta.served_version,
            }
        };
    }

    async abTest(params: { experimentId: string; variables?: Record<string, string> }): Promise<any> {
        return this.request<any>('/api/v1/ab-test', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    async getLogs(params?: { limit?: number; offset?: number }): Promise<any> {
        const search = new URLSearchParams(params as any).toString();
        const query = search ? `?${search}` : '';
        return this.request<any>(`/api/v1/logs${query}`, { method: 'GET' });
    }

    async getCosts(): Promise<any> {
        return this.request<any>('/api/v1/costs', { method: 'GET' });
    }
}
