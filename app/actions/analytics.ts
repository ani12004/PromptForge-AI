"use server"

import { createClerkSupabaseClient } from "@/lib/supabaseClient"
import { auth } from "@clerk/nextjs/server"

export interface DashboardMetrics {
    totalPrompts: number;
    totalTokens: number;
    totalCost: number; // in micro-USD
    avgLatency: number;
    usageOverTime: { date: string, count: number }[];
}

export async function submitFeedback(promptVersionId: string, score: number, comment?: string) {
    const { userId, getToken } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        const { data, error } = await supabase
            .from('prompt_analytics')
            .update({
                feedback_score: score,
                feedback_comment: comment
            })
            .eq('prompt_version_id', promptVersionId)
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error("Error submitting feedback:", error);
            return { success: false, error: error.message };
        }

        return { success: true };

    } catch (error) {
        console.error("Exception in submitFeedback:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function getDashboardMetrics(): Promise<{ success: boolean, data?: DashboardMetrics, error?: string }> {
    const { userId, getToken } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        // 1. Fetch all analytics for this user
        // Note: For a real production app with millions of rows, use Supabase RPC or materialized views.
        // For now, fetching raw rows is fine (~1000s of rows).
        const { data, error } = await supabase
            .from('prompt_analytics')
            .select('created_at, tokens_input, tokens_output, latency_ms, cost_micro_usd')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Error fetching analytics:", error);
            return { success: false, error: error.message };
        }

        if (!data || data.length === 0) {
            return {
                success: true,
                data: {
                    totalPrompts: 0,
                    totalTokens: 0,
                    totalCost: 0,
                    avgLatency: 0,
                    usageOverTime: []
                }
            };
        }

        // 2. Aggregate Data in JS (Client-side logic on server)
        let totalTokens = 0;
        let totalCost = 0;
        let totalLatency = 0;

        // Group by date (YYYY-MM-DD)
        const dailyCounts: Record<string, number> = {};

        data.forEach(row => {
            totalTokens += (row.tokens_input || 0) + (row.tokens_output || 0);
            totalCost += (row.cost_micro_usd || 0);
            totalLatency += (row.latency_ms || 0);

            const date = new Date(row.created_at).toISOString().split('T')[0];
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });

        const avgLatency = Math.round(totalLatency / data.length);

        // Convert map to array and sort
        const usageOverTime = Object.entries(dailyCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return {
            success: true,
            data: {
                totalPrompts: data.length,
                totalTokens,
                totalCost,
                avgLatency,
                usageOverTime
            }
        };

    } catch (error) {
        console.error("Exception in getDashboardMetrics:", error);
        return { success: false, error: "Internal server error" };
    }
}

export interface TopPrompt {
    id: string; // version id
    promptId: string;
    content: string;
    score: number;
    tokens: number;
    cost: number;
    timestamp: string;
}

export async function getTopPrompts(): Promise<{ success: boolean, data?: TopPrompt[], error?: string }> {
    const { userId, getToken } = await auth();

    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        const token = await getToken({ template: "supabase" });
        const supabase = createClerkSupabaseClient(token);

        // Fetch analytics with high scores
        const { data: analyticsData, error: analyticsError } = await supabase
            .from('prompt_analytics')
            .select('prompt_version_id, feedback_score, tokens_output, cost_micro_usd, created_at')
            .eq('user_id', userId)
            //.eq('feedback_score', 1) // Optional: filter by positive score? Let's just return all for now to debug
            .order('feedback_score', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .limit(5);

        if (analyticsError) return { success: false, error: analyticsError.message };

        if (!analyticsData || analyticsData.length === 0) return { success: true, data: [] };

        // Fetch version content for these
        const versionIds = analyticsData.map(a => a.prompt_version_id);
        const { data: versionsData, error: versionsError } = await supabase
            .from('prompt_versions')
            .select('id, content, prompt_id')
            .in('id', versionIds);

        if (versionsError) return { success: false, error: versionsError.message };

        // Map back together
        const topPrompts: TopPrompt[] = analyticsData.map(a => {
            const version = versionsData?.find(v => v.id === a.prompt_version_id);
            return {
                id: a.prompt_version_id,
                promptId: version?.prompt_id || "",
                content: version?.content || "Unknown Prompt",
                score: a.feedback_score || 0,
                tokens: a.tokens_output || 0,
                cost: a.cost_micro_usd || 0,
                timestamp: a.created_at
            };
        });

        return { success: true, data: topPrompts };

    } catch (error) {
        console.error("Exception in getTopPrompts:", error);
        return { success: false, error: "Internal server error" };
    }
}
