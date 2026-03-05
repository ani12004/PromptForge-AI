import { redis } from './cache';

/**
 * Basic Fixed-Window Rate Limiter
 * @param identifier The unique ID to limit (e.g., API Key ID, IP address)
 * @param limit Maximum allowed requests in the window
 * @param windowSeconds The time window in seconds
 * @returns boolean where true = allowed, false = rate limited
 * 
 * SECURITY: This limiter FAILS CLOSED — if Redis is unavailable, requests are DENIED.
 * This prevents abuse during infrastructure failures at the cost of availability.
 */
export async function checkRateLimit(identifier: string, limit: number, windowSeconds: number): Promise<boolean> {
    if (!redis) {
        console.error("[RateLimit] SECURITY: Redis not configured — FAILING CLOSED. All rate-limited requests will be denied.");
        return false; // Fail closed: deny if Redis is not configured
    }

    const key = `ratelimit:${identifier}`;

    try {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }
        return current <= limit;
    } catch (err) {
        console.error("[RateLimit] SECURITY: Redis error — FAILING CLOSED.", err);
        return false; // Fail closed: deny on Redis errors to prevent abuse
    }
}
