# promptforge-server-sdk

[![npm version](https://img.shields.io/npm/v/promptforge-server-sdk.svg)](https://www.npmjs.com/package/promptforge-server-sdk)
[![Socket Badge](https://badge.socket.dev/npm/package/promptforge-server-sdk/1.0.6)](https://badge.socket.dev/npm/package/promptforge-server-sdk/1.0.6)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js / Edge SDK for **PromptForge Studio**. 
PromptForge is a "Prompt-as-a-Service" platform that lets you manage, optimize, and execute prompts via a managed API.

## 📖 Full Documentation

Visit our [Documentation Hub](https://prompt-forge-studio.vercel.app/docs) for the complete experience:

- [Core Concepts](https://prompt-forge-studio.vercel.app/docs/introduction) — Learn about Variable Injection, Semantic Caching, and Model Routing.
- [Node.js SDK Guide](https://prompt-forge-studio.vercel.app/docs/sdk) — Detailed reference for this library.
- [REST API Reference](https://prompt-forge-studio.vercel.app/docs/api) — For non-JS environments.

---

## 🚀 Quick Start

### 1. Installation

```sh
npm install promptforge-server-sdk
```

### 2. Get your API Key
Go to the **Settings** sidebar in [PromptForge Studio](https://prompt-forge-studio.vercel.app/studio) and generate a new API Key.

### 3. Usage

Initialize the `PromptForgeClient` with your API key and execute a prompt by it's **Version ID** (found in your Prompt History).

```ts
import { PromptForgeClient } from 'promptforge-server-sdk';

const client = new PromptForgeClient({
  apiKey: process.env.PROMPTFORGE_API_KEY,
});

async function main() {
  const response = await client.execute({
    versionId: 'your-version-uuid-here',
    variables: { 
      topic: 'Space Exploration',
      tone: 'optimistic'
    }
  });

  if (response.success) {
    console.log("LLM Result:", response.data);
    console.log("Latency:", response.meta.latencyMs);
  }
}

main();
```

---

## ⚖️ SDK vs API: When to Use?

| Feature | Node.js SDK | REST API |
| :--- | :--- | :--- |
| **Language** | JavaScript/TypeScript | Any (Python, Go, etc.) |
| **TypeScript** | Native Support | Manual Types |
| **Caching** | Built-in | Manual |
| **Ease of Use** | High (Method calls) | Moderate (HTTP requests) |
| **Best For** | Next.js, Node, Vercel | Python, PHP, Microservices |

---

## 🛠️ Best Practices (Do's & Don'ts)

### ✅ The Do's
- **Use Environment Variables**: Always store your API keys in `.env` files (e.g. `PROMPTFORGE_API_KEY`).
- **Check Success Flag**: Always verify `result.success` before attempting to access `result.data`.
- **Use TypeScript**: Take advantage of our internal types for better IDE autocompletion.
- **Implement Singletons**: In serverless environments, initialize the `PromptForgeClient` once and reuse it to optimize memory.

### ❌ The Don'ts
- **Never Call from Client-Side**: Do not call the SDK or API from the browser. Your API keys will be exposed to users in the Network tab.
- **Don't Hardcode Prompts**: Keep your prompt logic in **PromptForge Studio** and reference them by **Version ID**. This allows you to update prompts without redeploying code.
- **Don't Ignore Metadata**: Fields like `meta.latency_ms` and `meta.tokens_input` are vital for monitoring performance and costs.

---

## 🛡️ Support
- [Issue Tracker](https://github.com/ani12004/Prompt-Forge-Studio/issues)
- [Discord Community](https://prompt-forge-studio.vercel.app/community)
