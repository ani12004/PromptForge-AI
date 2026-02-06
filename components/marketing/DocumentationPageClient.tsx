"use client"

import React from "react"
import { Book, Code, Terminal, Zap, Layers, Shield, Cpu, Key, FileJson } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import Link from "next/link"

export function DocumentationPageClient() {
    return (
        <div className="pb-32 pt-32 px-6">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[80vw] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

            {/* Header */}
            <div className="max-w-4xl mx-auto relative z-10 text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-6">
                    <Book className="h-4 w-4 text-brand-purple" />
                    <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Documentation</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">PromptForge Guide</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    The complete reference for building, testing, and deploying production-grade AI prompts with the PromptForge Engine.
                </p>
            </div>

            <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 hidden md:block">
                    <div className="glass-panel p-6 rounded-2xl sticky top-32 border border-white/5 bg-white/[0.02]">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Table of Contents</h4>
                        <ul className="space-y-1">
                            <li>
                                <a href="#getting-started" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-purple/10 text-brand-purple font-medium">
                                    <Zap className="h-4 w-4" /> Getting Started
                                </a>
                            </li>
                            <li>
                                <a href="#studio" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                    <Layers className="h-4 w-4" /> Studio Features
                                </a>
                            </li>
                            <li>
                                <a href="#api" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                    <Terminal className="h-4 w-4" /> API Reference
                                </a>
                            </li>
                            <li>
                                <a href="#best-practices" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                                    <Code className="h-4 w-4" /> Best Practices
                                </a>
                            </li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Need Help?</h4>
                            <Link href="/contact">
                                <Button variant="secondary" className="w-full text-sm">Contact Support</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-16">

                    {/* Section 1: Introduction */}
                    <section id="getting-started" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10"><Zap className="h-6 w-6 text-amber-500" /></div>
                            <h2 className="text-3xl font-bold text-white">Getting Started</h2>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                                PromptForge Studio acts as a sophisticated middleware between your application and LLM providers.
                                We help you structure, version, and optimize prompts so you can focus on building features, not wrestling with strings.
                            </p>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold shrink-0">1</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Create an Account</h3>
                                        <p className="text-gray-400">Sign up for a free Hobbyist account. No credit card required for the first 50 prompts.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold shrink-0">2</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Configure Providers</h3>
                                        <p className="text-gray-400">Navigate to Settings and add your OpenAI or Anthropic API keys. We store these using AES-256 encryption.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-8 w-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold shrink-0">3</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Create Your First Prompt</h3>
                                        <p className="text-gray-400">Go to the Studio and start drafting. Use our templates to get a head start.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Studio */}
                    <section id="studio" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10"><Layers className="h-6 w-6 text-blue-500" /></div>
                            <h2 className="text-3xl font-bold text-white">Studio Features</h2>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <p className="text-gray-400 mb-8">
                                The Studio is your command center. It goes beyond a simple text editor by offering real-time intelligence.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Card className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">
                                    <Cpu className="h-6 w-6 text-indigo-400 mb-4" />
                                    <h4 className="text-white font-bold mb-2">Heuristic Engine</h4>
                                    <p className="text-sm text-gray-500">Automatically detects ambiguous instructions, negative constraints, and potential hallucinations before you even run the prompt.</p>
                                </Card>
                                <Card className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">
                                    <FileJson className="h-6 w-6 text-green-400 mb-4" />
                                    <h4 className="text-white font-bold mb-2">Version Control</h4>
                                    <p className="text-sm text-gray-500">Every save creates a new immutable version. Roll back instantly if a new prompt degrades performance.</p>
                                </Card>
                                <Card className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">
                                    <Key className="h-6 w-6 text-amber-400 mb-4" />
                                    <h4 className="text-white font-bold mb-2">Variable Injection</h4>
                                    <p className="text-sm text-gray-500">Use <code className="bg-white/10 px-1 rounded text-white">{"{{variable}}"}</code> syntax to create dynamic templates. We validate these variables at runtime.</p>
                                </Card>
                                <Card className="p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.04]">
                                    <Shield className="h-6 w-6 text-red-400 mb-4" />
                                    <h4 className="text-white font-bold mb-2">Safety Rails</h4>
                                    <p className="text-sm text-gray-500">Built-in guardrails against PII leakage and injection attacks. Toggle them per-project.</p>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: API */}
                    <section id="api" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10"><Terminal className="h-6 w-6 text-red-500" /></div>
                            <h2 className="text-3xl font-bold text-white">API Reference</h2>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <p className="text-gray-400 mb-6">
                                Integrate PromptForge directly into your CI/CD pipeline or application runtime.
                            </p>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-4">Authentication</h3>
                                <p className="text-gray-400 mb-4">Include your API key in the <code className="text-brand-purple">Authorization</code> header.</p>
                                <div className="bg-[#0F0F0F] rounded-lg p-4 border border-white/10 font-mono text-sm text-gray-300">
                                    Authorization: Bearer pf_live_92839482...
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-4">Endpoints</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold uppercase">POST</span>
                                        <div className="flex-1">
                                            <code className="text-white font-mono block mb-2">/v1/optimize</code>
                                            <p className="text-sm text-gray-400">Takes a raw prompt and returns the refined version.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase">GET</span>
                                        <div className="flex-1">
                                            <code className="text-white font-mono block mb-2">/v1/prompts/{'{id}'}</code>
                                            <p className="text-sm text-gray-400">Retrieves the latest production version of a specific prompt.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Response Example</h3>
                                <div className="relative rounded-xl overflow-hidden bg-[#0F0F0F] border border-white/10">
                                    <div className="p-4 overflow-x-auto">
                                        <pre className="text-sm font-mono text-gray-300">
                                            {"{"}
                                            <span className="text-green-400">"id"</span>: <span className="text-yellow-400">"req_89234"</span>,
                                            <span className="text-green-400">"optimized_prompt"</span>: <span className="text-yellow-400">"Analyze the following text for sentiment..."</span>,
                                            <span className="text-green-400">"metadata"</span>: {"{"}
                                            <span className="text-green-400">"model"</span>: <span className="text-yellow-400">"gpt-4"</span>,
                                            <span className="text-green-400">"tokens"</span>: <span className="text-blue-400">142</span>,
                                            <span className="text-green-400">"latency_ms"</span>: <span className="text-blue-400">24</span>
                                            {"}"}
                                            {"}"}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Best Practices */}
                    <section id="best-practices" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10"><Code className="h-6 w-6 text-green-500" /></div>
                            <h2 className="text-3xl font-bold text-white">Best Practices</h2>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">1. Be Explicit</h3>
                                    <p className="text-gray-400 text-sm">LLMs cannot read minds. Instead of "Write a short summary", try "Write a 50-word summary focusing on the key value propositions."</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">2. Use Delimiters</h3>
                                    <p className="text-gray-400 text-sm">Separate context from instructions using triple quotes, backticks, or XML tags. This Prevents prompt injection.</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">3. Chain of Thought</h3>
                                    <p className="text-gray-400 text-sm">Ask the model to "think step by step" before providing the final answer. This significantly improves reasoning capabilities.</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">4. Iterative Refinement</h3>
                                    <p className="text-gray-400 text-sm">Don't expect perfection on the first try. Use the Studio to tweak temperature and top-p values based on the output.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
