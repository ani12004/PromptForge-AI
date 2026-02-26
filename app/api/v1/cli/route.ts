import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { routeAndExecutePrompt } from '@/lib/router';
import { validateApiKey } from '@/lib/api-keys';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const cliExecuteSchema = z.object({
    prompt: z.string().min(1, "Prompt cannot be empty"),
    model: z.string().optional()
});

export async function POST(req: Request) {
    const startTime = Date.now();

    // Authenticate Request
    const apiKeyHeader = req.headers.get('x-api-key');
    if (!apiKeyHeader) {
        return NextResponse.json({ error: "Missing x-api-key header", code: "MISSING_API_KEY" }, { status: 401 });
    }

    const keyContext = await validateApiKey(apiKeyHeader);
    if (!keyContext || keyContext.revoked) {
        return NextResponse.json({ error: "Invalid or revoked API key", code: "INVALID_API_KEY" }, { status: 403 });
    }

    // Rate Limiting: 60 execution requests per minute per API key for CLI usage
    const isAllowed = await checkRateLimit(`cli_exec_key_${keyContext.id}`, 60, 60);
    if (!isAllowed) {
        return NextResponse.json({ error: "Rate limit exceeded. Please slow down." }, { status: 429 });
    }

    try {
        const body = await req.json();
        const parsed = cliExecuteSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request payload", details: parsed.error.issues }, { status: 400 });
        }

        const { prompt, model } = parsed.data;

        // Execute prompt generically
        const systemPrompt = "You are a helpful AI assistant in Prompt Forge Studio.";
        const result = await routeAndExecutePrompt(
            systemPrompt,
            prompt,
            {}, // No variables
            model // Force model if provided, otherwise routeAndExecutePrompt's cascading logic applies
        );

        const latencyMs = Date.now() - startTime;

        // Log telemetry generically for CLI usage if possible.
        // If version_id is strictly required, this might fail, but it's fine since it's fire-and-forget.
        const supabase = getSupabaseAdmin();
        supabase.from('v2_execution_logs').insert({
            api_key_id: keyContext.id,
            latency_ms: latencyMs,
            model_used: result.modelUsed,
            cached_hit: false, // CLI raw prompts don't use semantic cache currently
            tokens_input: result.tokensInput || 0,
            tokens_output: result.tokensOutput || 0,
            cost_micro_usd: result.costMicroUsd || 0,
        }).then(({ error }) => {
            if (error) console.error("[Telemetry] Failed to log CLI execution:", error);
        });

        return NextResponse.json({
            success: true,
            data: result.output,
            meta: {
                model: result.modelUsed,
                latency_ms: latencyMs,
                tokens_input: result.tokensInput || 0,
                tokens_output: result.tokensOutput || 0,
                cost_micro_usd: result.costMicroUsd || 0,
            }
        });

    } catch (err: any) {
        console.error("[API Error] /v1/cli:", err);
        return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
    }
}
