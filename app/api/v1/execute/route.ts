import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { routeAndExecutePrompt } from '@/lib/router';
import { withCache } from '@/lib/cache';
import { runGuardrails, validateSchema } from '@/lib/guardrails';
import { validateApiKey } from '@/lib/api-keys';
import { checkRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';
import { z } from 'zod';

// Input Validation Schema using Zod
const executeSchema = z.object({
    version_id: z.string().uuid(),
    ab_version_id: z.string().uuid().optional(), // For A/B traffic split
    variables: z.record(z.string(), z.string()).default({}), // Allows optional variables
    required_schema: z.any().optional(), // For schema validation
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

    // Rate Limiting: 120 execution requests per minute per API key
    const isAllowed = await checkRateLimit(`exec_key_${keyContext.id}`, 120, 60);
    if (!isAllowed) {
        return NextResponse.json({ error: "Rate limit exceeded (120 req/min). Please slow down." }, { status: 429 });
    }

    try {
        // 1. Parse & Validate Request
        const body = await req.json();
        const parsed = executeSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid request payload", details: parsed.error.issues }, { status: 400 });
        }

        const { version_id, ab_version_id, variables, required_schema } = parsed.data;

        // A/B Testing split logic (50/50 randomly)
        const active_version_id = (ab_version_id && Math.random() > 0.5) ? ab_version_id : version_id;

        // Run Guardrails on Input Variables
        const combinedInput = Object.values(variables).join(" ");
        const guardrailResult = runGuardrails(combinedInput);
        if (!guardrailResult.passed) {
            return NextResponse.json({ error: "Guardrail blocked input", reason: guardrailResult.reason }, { status: 400 });
        }

        // 2. Fetch Prompt Definition (Bypassing RLS with Admin key for programmatic access)
        const supabase = getSupabaseAdmin();

        console.log(`[Execute] Incoming Request - VersionID: ${active_version_id}, WorkspaceID: ${keyContext.user_id}`);

        // Try V2 table first (production-saved prompts)
        // We join with v2_prompts to verify ownership by user_id
        let { data: version, error: dbError } = await supabase
            .from('v2_prompt_versions')
            .select(`
                system_prompt, 
                template, 
                published,
                v2_prompts!inner(user_id)
            `)
            .eq('id', active_version_id)
            .eq('v2_prompts.user_id', keyContext.user_id)
            .eq('published', true)
            .single();

        let systemPrompt = version?.system_prompt;
        let template = version?.template;

        // Fallback to Playground tables (V1 history)
        if (!version || dbError) {
            console.log(`[Execute] Checking Playground Fallback for VersionID: ${active_version_id}`);

            // Try the specific version table first
            const { data: v1Version, error: v1Error } = await supabase
                .from('prompt_versions')
                .select('content, prompts!inner(user_id)')
                .eq('id', active_version_id)
                .eq('prompts.user_id', keyContext.user_id)
                .single();

            if (v1Version) {
                systemPrompt = "You are a highly capable AI assistant.";
                template = v1Version.content;
                dbError = null;
            } else {
                // Try the parent prompts table (for backwards compatibility where prompt ID was used)
                const { data: v1Prompt, error: pError } = await supabase
                    .from('prompts')
                    .select('refined_prompt, user_id')
                    .eq('id', active_version_id)
                    .eq('user_id', keyContext.user_id)
                    .single();

                if (v1Prompt) {
                    systemPrompt = "You are a highly capable AI assistant.";
                    template = v1Prompt.refined_prompt;
                    dbError = null;
                } else {
                    console.log(`[Execute] All Fallbacks Failed - V1Error: ${v1Error?.message}, PError: ${pError?.message}`);
                }
            }
        }

        if (dbError || (!systemPrompt && !template)) {
            // Enhanced Debug Info
            const { data: recentVersions } = await supabase
                .from('v2_prompt_versions')
                .select('id, version_tag, v2_prompts!inner(user_id)')
                .eq('v2_prompts.user_id', keyContext.user_id)
                .limit(5);

            return NextResponse.json({
                success: false,
                error: "Prompt version not found",
                debug: {
                    receivedVersionId: active_version_id,
                    workspaceId: keyContext.user_id,
                    availableVersions: recentVersions?.map(v => ({ id: v.id, tag: v.version_tag })) || [],
                    dbErrorMessage: dbError?.message
                }
            }, { status: 404 });
        }

        // 3. Generate Exact-Match Cache Key
        // We hash the version_id + sorted variables to ensure stable keys
        const sortedVars = Object.keys(variables).sort().reduce((acc, key) => {
            acc[key] = variables[key];
            return acc;
        }, {} as Record<string, string>);

        const hashInput = JSON.stringify({ v: active_version_id, vars: sortedVars });
        const hash = crypto.createHash('md5').update(hashInput).digest('hex');
        const cacheKey = `pf:exec:${hash}`;

        // 4. Execute (With Route & Cache wrapping)
        const { data: result, cached } = await withCache(cacheKey, async () => {
            return await routeAndExecutePrompt(
                systemPrompt,
                template,
                variables
            );
        });

        // Run output schema validation on generated output
        if (required_schema && !validateSchema(result.output, required_schema)) {
            // Minimal handling: skip cache and return error
            return NextResponse.json({ error: "Output failed schema validation", output: result.output }, { status: 422 });
        }

        const latencyMs = Date.now() - startTime;
        const finalCost = cached ? 0 : (result.costMicroUsd || 0);

        // 5. Asynchronous Telemetry Logging (Fire and forget to not block the response)
        supabase.from('v2_execution_logs').insert({
            version_id: active_version_id,
            api_key_id: keyContext.id, // Link execution to the API Key
            latency_ms: latencyMs,
            model_used: result.modelUsed,
            cached_hit: cached,
            tokens_input: result.tokensInput || 0,
            tokens_output: result.tokensOutput || 0,
            cost_micro_usd: finalCost,
            ab_test_variant: ab_version_id ? active_version_id : null
        }).then(({ error }) => {
            if (error) console.error("[Telemetry] Failed to log execution:", error);
        });

        // 6. Return Response
        return NextResponse.json({
            success: true,
            data: result.output,
            meta: {
                model: result.modelUsed,
                cached: cached,
                latency_ms: latencyMs,
                tokens_input: result.tokensInput || 0,
                tokens_output: result.tokensOutput || 0,
                cost_micro_usd: finalCost,
                served_version: active_version_id
            }
        });

    } catch (err: any) {
        console.error("[API Error] /v1/execute:", err);
        return NextResponse.json({ error: "Internal Server Error", message: err.message }, { status: 500 });
    }
}
