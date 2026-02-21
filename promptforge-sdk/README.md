# promptforge-server-sdk

[![npm version](https://img.shields.io/npm/v/promptforge-server-sdk.svg)](https://www.npmjs.com/package/promptforge-server-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js / Edge SDK for **PromptForge Studio**. 
PromptForge is a "Prompt-as-a-Service" platform that lets you manage, optimize, and execute prompts via a managed API.

## 📖 Full Documentation

Visit our [Documentation Hub](https://promptforge.com/docs) for the complete experience:

- [Core Concepts](https://promptforge.com/docs/introduction) — Learn about Variable Injection, Semantic Caching, and Model Routing.
- [Node.js SDK Guide](https://promptforge.com/docs/sdk) — Detailed reference for this library.
- [REST API Reference](https://promptforge.com/docs/api) — For non-JS environments.

---

## 🚀 Quick Start

### 1. Installation

```sh
npm install promptforge-server-sdk
```

### 2. Get your API Key
Go to the **Settings** sidebar in [PromptForge Studio](https://promptforge.com/studio) and generate a new API Key.

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

## 🛡️ Support
- [Issue Tracker](https://github.com/ani12004/Prompt-Forge-Studio/issues)
- [Discord Community](https://promptforge.com/community)
