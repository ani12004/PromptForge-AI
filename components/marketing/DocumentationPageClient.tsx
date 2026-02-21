"use client"

import React, { useState } from "react"
import { Book, Code, Terminal, Zap, Layers, Shield, Cpu, Key, FileJson, Package, ArrowRight, ExternalLink, Globe, Server, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export function DocumentationPageClient() {
    const [activeTab, setActiveTab] = useState<'sdk' | 'api'>('sdk')

    return (
        <div className="pb-32 pt-32 px-6 bg-[#050508]">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[80vw] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

            {/* Header */}
            <div className="max-w-4xl mx-auto relative z-10 text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-6">
                    <Book className="h-4 w-4 text-brand-purple" />
                    <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Developer Center</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">PromptForge Documentation</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Everything you need to integrate the PromptForge Engine into your applications.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="max-w-2xl mx-auto relative z-10 mb-16 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl flex gap-2">
                <button
                    onClick={() => setActiveTab('sdk')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'sdk' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                    <Package className="h-4 w-4" /> Node.js SDK
                </button>
                <button
                    onClick={() => setActiveTab('api')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'api' ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                    <Globe className="h-4 w-4" /> REST API Reference
                </button>
            </div>

            <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 hidden md:block">
                    <div className="glass-panel p-6 rounded-2xl sticky top-32 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">Quick Navigation</h4>
                        <ul className="space-y-1">
                            {activeTab === 'sdk' ? (
                                <>
                                    <li><a href="#sdk-install" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Installation</a></li>
                                    <li><a href="#sdk-usage" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Initialization</a></li>
                                    <li><a href="#sdk-execute" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Executing Prompts</a></li>
                                    <li><a href="#sdk-examples" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Full Examples</a></li>
                                    <li><a href="#sdk-best-practices" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Best Practices</a></li>
                                    <li><a href="#sdk-types" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Type Definitions</a></li>
                                </>
                            ) : (
                                <>
                                    <li><a href="#api-auth" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Authentication</a></li>
                                    <li><a href="#api-endpoint" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Endpoint Details</a></li>
                                    <li><a href="#api-request" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Request Schema</a></li>
                                    <li><a href="#api-response" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Response Format</a></li>
                                    <li><a href="#api-examples" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Full Examples</a></li>
                                    <li><a href="#api-best-practices" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">Best Practices</a></li>
                                </>
                            )}
                            <li className="pt-4 mt-4 border-t border-white/5">
                                <a href="#comparison" className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-purple hover:bg-brand-purple/5 transition-all font-bold">SDK vs API</a>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-4">Official Registry</p>
                            <a
                                href="https://www.npmjs.com/package/promptforge-server-sdk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all font-mono text-sm"
                            >
                                <Package className="h-4 w-4" /> v1.0.1
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    {activeTab === 'sdk' ? (
                        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* SDK Installation */}
                            <section id="sdk-install" className="scroll-mt-32 space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Package className="h-8 w-8 text-blue-500" />
                                    SDK Installation
                                </h2>
                                <p className="text-gray-400 text-lg">
                                    The PromptForge Server SDK is the fastest way to integrate with our engine. It handles token caching, retries, and high-performance routing out of the box.
                                </p>
                                <div className="p-6 bg-[#0F0F12] border border-white/10 rounded-2xl font-mono text-lg text-blue-400 group relative overflow-hidden">
                                    <div className="absolute inset-y-0 left-0 w-1 bg-blue-500" />
                                    npm install promptforge-server-sdk
                                </div>
                            </section>

                            {/* SDK Initialization */}
                            <section id="sdk-usage" className="scroll-mt-32 space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Server className="h-8 w-8 text-emerald-500" />
                                    Initialization
                                </h2>
                                <CodeBlock
                                    code={`import { PromptForgeClient } from 'promptforge-server-sdk';

// Initialize with your secret API key
const pf = new PromptForgeClient({
  apiKey: process.env.PROMPTFORGE_API_KEY,
  timeoutMs: 30000, // Optional 30s timeout
});`}
                                />
                            </section>

                            {/* SDK Execution */}
                            <section id="sdk-execute" className="scroll-mt-32 space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Zap className="h-8 w-8 text-amber-500" />
                                    Executing Prompts
                                </h2>
                                <p className="text-gray-400">
                                    The <code className="text-brand-purple">execute</code> method is your primary interface. It accepts a version ID and dynamic variables.
                                </p>
                                <CodeBlock
                                    code={`async function runPrompt() {
  const result = await pf.execute({
    versionId: 'c123-abc-456', // Unique prompt version ID
    variables: {
      topic: 'Quantum Computing',
      difficulty: 'Expert'
    }
  });

  if (result.success) {
    console.log(result.data); // The generated response
    console.log(\`Latency: \${result.meta.latencyMs}ms\`);
  }
}`}
                                />
                            </section>

                            {/* SDK Full Examples */}
                            <section id="sdk-examples" className="scroll-mt-32 space-y-8">
                                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Terminal className="h-8 w-8 text-brand-purple" />
                                    Full Integration Example
                                </h2>
                                <p className="text-gray-400">
                                    A real-world example of using the SDK within a Next.js Server Action or API Route.
                                </p>
                                <CodeBlock
                                    code={`// app/actions/ai.ts
'use server'

import { PromptForgeClient } from 'promptforge-server-sdk';

const pf = new PromptForgeClient({
  apiKey: process.env.PROMPTFORGE_API_KEY!
});

export async function generateContent(userTopic: string) {
  try {
    const response = await pf.execute({
      versionId: 'c1-content-v2',
      variables: { topic: userTopic }
    });

    if (!response.success) {
      throw new Error('AI generation failed');
    }

    return response.data;
  } catch (error) {
    console.error('PromptForge Error:', error);
    return null;
  }
}`}
                                />
                            </section>

                            {/* SDK Best Practices */}
                            <section id="sdk-best-practices" className="scroll-mt-32 space-y-8">
                                <h2 className="text-3xl font-bold text-white tracking-tight">Best Practices</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                                        <h4 className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
                                            <CheckCircle className="w-4 h-4" /> Do's
                                        </h4>
                                        <ul className="space-y-3 text-sm text-gray-400">
                                            <li className="flex gap-2"><span>•</span> <span>Use environment variables (e.g., `PROMPTFORGE_API_KEY`) for keys.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Implement the **Singleton pattern** for the client in Serverless to avoid socket exhaustion.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Wrap calls in try/catch and check `result.success` before processing data.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Leverage **TypeScript types** (e.g., `ExecuteResult`) for compile-time safety.</span></li>
                                        </ul>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-4">
                                        <h4 className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-xs">
                                            <XCircle className="w-4 h-4" /> Don'ts
                                        </h4>
                                        <ul className="space-y-3 text-sm text-gray-400">
                                            <li className="flex gap-2"><span>•</span> <span>**Never** call the SDK from the browser; your secret key will be exposed.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Don't hardcode prompt strings; manage logic in Studio for instant updates.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Don't ignore `meta` fields; tracking `latencyMs` is key to performance auditing.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Don't use short timeouts for complex reasoning tasks (default to 30s+).</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* API Authentication */}
                            <section id="api-auth" className="scroll-mt-32 space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Shield className="h-8 w-8 text-red-500" />
                                    Authentication
                                </h2>
                                <p className="text-gray-400 text-lg">
                                    Pass your API key in the custom <code className="text-brand-purple">x-api-key</code> header for all REST requests.
                                </p>
                                <div className="p-6 bg-[#0F0F12] border border-white/10 rounded-2xl font-mono text-sm text-gray-300">
                                    <span className="text-gray-500">GET /v1/ping</span>
                                    <br />
                                    x-api-key: pf_live_9283...
                                </div>
                            </section>

                            {/* API Endpoint */}
                            <section id="api-endpoint" className="scroll-mt-32 space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tight">
                                    Main Execution Endpoint
                                </h2>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <span className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">POST</span>
                                    <code className="text-white font-mono">/api/v1/execute</code>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Required Body</h4>
                                        <ul className="space-y-3">
                                            <ParamItem name="version_id" type="UUID" required description="ID found in Studio History." />
                                            <ParamItem name="variables" type="Map" description="Dynamic template values." />
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Optional Meta</h4>
                                        <ul className="space-y-3">
                                            <ParamItem name="ab_version_id" type="UUID" description="For A/B experiment routing." />
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* API Response Example */}
                            <section id="api-response" className="scroll-mt-32 space-y-6">
                                <h2 className="text-3xl font-bold text-white tracking-tight">Response Format</h2>
                                <CodeBlock
                                    language="json"
                                    code={`{
  "success": true,
  "data": "The LLM output text goes here...",
  "meta": {
    "model": "gemini-2.0-flash",
    "cached": false,
    "latency_ms": 1240,
    "tokens_input": 45,
      "tokens_output": 112
    }
  }
}`}
                                />
                            </section>

                            {/* API Full Examples */}
                            <section id="api-examples" className="scroll-mt-32 space-y-8">
                                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Globe className="h-8 w-8 text-blue-500" />
                                    Full API Example (Python)
                                </h2>
                                <p className="text-gray-400">
                                    Integration example for Python-based microservices using the `requests` library.
                                </p>
                                <CodeBlock
                                    language="python"
                                    code={`import requests
import os

def call_promptforge(version_id, variables):
    url = "https://prompt-forge-studio.vercel.app/api/v1/execute"
    headers = {
        "x-api-key": os.getenv("PROMPTFORGE_API_KEY"),
        "Content-Type": "application/json"
    }
    payload = {
        "version_id": version_id,
        "variables": variables
    }

    response = requests.post(url, json=payload, headers=headers)
    result = response.json()

    if result.get("success"):
        return result["data"]
    return None

# Usage
output = call_promptforge("c123...", {"topic": "AI Docs"})`}
                                />
                            </section>

                            {/* API Best Practices */}
                            <section id="api-best-practices" className="scroll-mt-32 space-y-8">
                                <h2 className="text-3xl font-bold text-white tracking-tight">Best Practices</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                                        <h4 className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
                                            <CheckCircle className="w-4 h-4" /> Do's
                                        </h4>
                                        <ul className="space-y-3 text-sm text-gray-400">
                                            <li className="flex gap-2"><span>•</span> <span>Use the `x-api-key` header with a **pf_live_** or **pf_test_** prefix.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Set a `Content-Type: application/json` header for POST requests.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Monitor the `meta` fields (`tokens_input/output`) to manage LLM burn rates.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Implement a retry mechanism with exponential backoff for 5xx errors.</span></li>
                                        </ul>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 space-y-4">
                                        <h4 className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-xs">
                                            <XCircle className="w-4 h-4" /> Don'ts
                                        </h4>
                                        <ul className="space-y-3 text-sm text-gray-400">
                                            <li className="flex gap-2"><span>•</span> <span>Don't share API keys in frontend `fetch` calls or public repos.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Avoid sending massive data in `variables` unless the model supports high context.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Don't ignore rate limit headers (`x-ratelimit-remaining`) if present.</span></li>
                                            <li className="flex gap-2"><span>•</span> <span>Don't manually concatenate prompt variables; the engine handles injection safely.</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison Section */}
            <div id="comparison" className="max-w-6xl mx-auto mt-32 relative z-10 scroll-mt-32">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">When to use which?</h2>
                    <p className="text-gray-400">Choose the integration method that fits your architecture.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-brand-purple/30 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6 border border-brand-purple/20 group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-brand-purple" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Node.js SDK</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-gray-400">**Next.js & Vercel**: Optimized for edge runtime and serverless stability.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-gray-400">**Safety**: Native TypeScript definitions for full IDE IntelliSense.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-gray-400">**Automatic Mapping**: Transparently handles convention differences (e.g. snake_case).</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Globe className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">REST API</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-gray-400">**Cross-Language**: Use with Python, Rust, Go, or Ruby microservices.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-gray-400">**Zero Dependencies**: No extra package bloat; just 100% standard HTTPS.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                <span className="text-gray-400">**Control**: Precise control over request headers and streaming (coming soon).</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CodeBlock({ code, language = 'typescript' }: { code: string, language?: string }) {
    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple/20 to-brand-violet/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0F0F12] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{language}</span>
                </div>
                <div className="p-6 overflow-x-auto">
                    <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                        {code}
                    </pre>
                </div>
            </div>
        </div>
    )
}

function ParamItem({ name, type, required, description }: any) {
    return (
        <li className="space-y-1">
            <div className="flex items-center gap-2">
                <code className="text-brand-purple font-mono font-bold">{name}</code>
                <span className="text-[10px] text-gray-600 font-bold uppercase">{type}</span>
                {required && <span className="text-[10px] text-red-500 font-bold uppercase">Required</span>}
            </div>
            <p className="text-sm text-gray-500 leading-snug">{description}</p>
        </li>
    )
}
