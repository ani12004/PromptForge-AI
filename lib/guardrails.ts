export interface GuardrailResult {
    passed: boolean;
    reason?: string;
}

// ─── Prompt Injection Detection ────────────────────────────────
const PROMPT_INJECTION_PATTERNS = [
    /\b(ignore|disregard|override|forget|bypass)\b.{0,30}\b(previous|above|prior|instructions|rules|guidelines|system\s*prompt)/i,
    /\b(you\s+are\s+now|act\s+as\s+if|pretend\s+you|new\s+instructions|from\s+now\s+on)/i,
    /\b(system\s*prompt|hidden\s*prompt|internal\s*instructions)\s*[:=]/i,
    /\[\s*system\s*\]/i,
    /<\s*\/?system\s*>/i,
];

// ─── PII Detection Patterns ────────────────────────────────────
const PII_PATTERNS: { regex: RegExp; reason: string }[] = [
    {
        regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
        reason: "PII detected (Email address)."
    },
    {
        regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
        reason: "PII detected (Phone number)."
    },
    {
        regex: /\b\d{3}-\d{2}-\d{4}\b/,
        reason: "PII detected (Social Security Number format)."
    },
    {
        regex: /\b(?:\d[ -]*?){13,19}\b/,
        reason: "PII detected (Credit card number format)."
    }
];

// ─── Profanity Filter ──────────────────────────────────────────
const PROFANITY_REGEX = /\b(fuck|shit|bitch|asshole)\b/i;

// ─── Max Input Length ──────────────────────────────────────────
const MAX_INPUT_LENGTH = 10000;

/**
 * Runs multi-layer guardrails on user input:
 * 1. Input length check
 * 2. Profanity filter
 * 3. PII detection (email, phone, SSN, credit card)
 * 4. Prompt injection detection
 */
export function runGuardrails(input: string): GuardrailResult {
    // Layer 1: Input length
    if (input.length > MAX_INPUT_LENGTH) {
        return { passed: false, reason: `Input too long (max ${MAX_INPUT_LENGTH} characters).` };
    }

    // Layer 2: Profanity
    if (PROFANITY_REGEX.test(input)) {
        return { passed: false, reason: "Profanity detected." };
    }

    // Layer 3: PII detection
    for (const pattern of PII_PATTERNS) {
        if (pattern.regex.test(input)) {
            return { passed: false, reason: pattern.reason };
        }
    }

    // Layer 4: Prompt injection detection
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
        if (pattern.test(input)) {
            return { passed: false, reason: "Potentially unsafe input detected (prompt injection pattern)." };
        }
    }

    return { passed: true };
}

/**
 * Wraps user-supplied variable values in delimiters to reduce prompt injection risk.
 * The delimiters signal to the LLM that the content is user-supplied data, not instructions.
 */
export function sanitizeForPrompt(value: string): string {
    return `<user_input>${value}</user_input>`;
}

export function validateSchema(output: string, requiredSchema: any): boolean {
    if (!requiredSchema || Object.keys(requiredSchema).length === 0) return true;
    try {
        const parsed = JSON.parse(output);
        for (const key of Object.keys(requiredSchema)) {
            if (!(key in parsed)) return false;
        }
        return true;
    } catch {
        return false;
    }
}
