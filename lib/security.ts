/**
 * Shared Security Utilities for PromptForge Studio
 * 
 * Centralized functions for input sanitization, output escaping,
 * and safe error handling across all API routes and server actions.
 */

// ─── Input Length Limits ────────────────────────────────────────
export const MAX_CONTENT_LENGTH = 5000;
export const MAX_VARIABLE_KEY_LENGTH = 100;
export const MAX_VARIABLE_VALUE_LENGTH = 5000;
export const MAX_PROMPT_LENGTH = 10000;

// ─── HTML Escaping (XSS / HTML Injection Prevention) ────────────
/**
 * Escapes HTML special characters to prevent XSS and HTML injection.
 * Use this when interpolating user input into HTML templates (e.g., emails).
 */
export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ─── Error Sanitization ────────────────────────────────────────
/**
 * Returns a generic error message for client-facing responses.
 * Internal error details are only logged server-side — never exposed to clients.
 */
export function sanitizeErrorForClient(error: unknown, context: string): string {
    // Log the real error server-side for debugging
    console.error(`[${context}]`, error);

    // Return a safe generic message to the client
    return "An internal error occurred. Please try again later.";
}

// ─── UUID Validation ────────────────────────────────────────────
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates that a string is a valid UUID v4 format.
 */
export function isValidUUID(value: string): boolean {
    return UUID_REGEX.test(value);
}
