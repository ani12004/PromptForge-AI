# PromptForge SDK & API Usage Guide

PromptForge Studio V2 is a "Prompt-as-a-Service" platform. This guide explains how to integrate your saved prompts into your own applications using either our Node.js SDK or our standard REST API.

---

## 1. Prerequisites

Before you can execute prompts programmatically, you must:

1.  **Generate an API Key**: Go to the **Settings** sidebar in PromptForge Studio and generate a new API Key.
2.  **Save a Prompt**: Create and save a prompt in the **Studio**. Note the **Version ID** generated after saving.

---

## 2. Using the Node.js / TypeScript SDK

The easiest way to integrate PromptForge into your Node.js or Edge environment (Vercel, Cloudflare, etc.) is using the `promptforge-server-sdk`.

### Installation

```bash
npm install promptforge-server-sdk
```

### Basic Usage

Initialize the client with your API key and execute a prompt by its `version_id`.

```typescript
import { PromptForgeClient } from 'promptforge-server-sdk';

const pf = new PromptForgeClient({
  apiKey: 'pf_live_...', // Your API Key from Settings
});

async function main() {
  const response = await pf.execute({
    versionId: 'your-saved-version-id', // Found in Studio history
    variables: {
      user_query: "How do I bake a cake?",
      tone: "friendly"
    }
  });

  if (response.success) {
    console.log("LLM Response:", response.data);
    console.log("Model Used:", response.meta.model);
    console.log("Latency (ms):", response.meta.latencyMs);
  } else {
    console.error("Error:", response.message);
  }
}

main();
```

---

## 3. Using the REST API

If you are using a language other than JavaScript, you can call our REST API directly.

### Authentication
All requests must include your API Key in the headers.

**Header Name**: `X-API-Key`  
**Header Value**: `pf_live_your_key_here`

### Execute Prompt

**Endpoint**: `POST /api/v1/execute`

**Request Body**:
```json
{
  "version_id": "YOUR_VERSION_ID",
  "variables": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**Example Curl Request**:

```bash
curl -X POST https://your-promptforge-domain.com/api/v1/execute \
  -H "X-API-Key: pf_live_..." \
  -H "Content-Type: application/json" \
  -d '{
    "version_id": "123e4567-e89b-12d3-a456-426614174000",
    "variables": { "name": "DeepMind" }
  }'
```

**Response Format**:
```json
{
  "success": true,
  "data": {
    "output": "The response from the LLM...",
    "modelUsed": "gemini-2.0-flash",
    "cached": false
  }
}
```

---

## 4. Features

### Dynamic Variable Injection
Any text wrapped in double curly braces `{{variable_name}}` in your Studio prompt will automatically be replaced by the values you pass in the `variables` object.

### Cascading Model Routing
PromptForge automatically routes your requests to the best-performing model based on the complexity and length of your prompt.

### Semantic Caching (Enterprise Only)
If enabled, PromptForge will check if a semantically similar request has been made recently. If a 98% match is found, the cached result is returned instantly, saving you LLM costs and reducing latency to <50ms.

---

---

## 6. SDK vs API: Deep-Dive Comparison

| Feature | Node.js SDK | REST API |
| :--- | :--- | :--- |
| **Primary Language** | JavaScript/TypeScript | Any (Python, Go, etc.) |
| **Type Safety** | Native (Full IntelliSense) | Manual (Custom Schemas) |
| **Caching** | Built-in Token Caching | Manual Header Handling |
| **Next.js Integration**| High (Optimized for Server Actions) | Moderate (Standard fetch) |
| **Dependencies** | Minimum (`axios`, `events`) | Zero (Standard HTTP) |
| **Best For** | Early-stage JS/TS Apps | Polyglot Microservices |

---

## 7. Mastering Best Practices

### ✅ The Do's (Professional Integration)
- **Environment Isolation**: Separate keys for `pf_test_` and `pf_live_` using environment variables.
- **The Singleton Rule**: Initialize the `PromptForgeClient` in a shared file (e.g., `lib/pf.ts`) to avoid re-initializing multiple times in serverless functions.
- **Fail Gracefully**: Always wrap `pf.execute` in try/catch. Our engine returns rich error codes (401, 404, 500) that you should handle.
- **Leverage Types**: Use the internal `ExecuteResult` and `PromptVariables` types to ensure your variables match the Studio's expectations.

### ❌ The Don'ts (Common Pitfalls)
- **Frontend Leakage**: Never import `promptforge-server-sdk` in a client-side component. This will expose your secret keys.
- **Hardcoded Prompts**: If you catch yourself writing template strings in code, stop. Move that logic to **PromptForge Studio** and use a `version_id` instead.
- **Ignoring Meta**: The `meta` object contains `latency_ms` and `tokens_total`. Use these for your own performance dashboards.
- **Unlimited Timeouts**: LLMs can be slow. Set a `timeoutMs` (default 30s) to prevent your own backend from hanging.

---

## 8. Troubleshooting & Support

- **401 Unauthorized**: Ensure your `X-API-Key` is correct and active.
- **404 Version Not Found**: Ensure the `version_id` exists in your workspace.
- **500 Internal Error**: This usually indicates an issue with the underlying LLM provider or a rate limit being hit. Check your PromptForge dashboard for detailed logs.
