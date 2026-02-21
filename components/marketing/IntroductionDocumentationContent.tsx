"use client"

import React from "react"
import { BookOpen, Key, Puzzle, Zap, Shield, Cpu, Info } from "lucide-react"

export function IntroductionDocumentationContent() {
    return (
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Introduction</h1>
                <p className="text-gray-400 text-lg">
                    PromptForge Studio V2 is a "Prompt-as-a-Service" platform designed for high-performance AI integration.
                </p>
            </div>

            {/* Prerequisites */}
            <section id="basics-prereqs" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Key className="h-8 w-8 text-amber-500" />
                    Prerequisites
                </h2>
                <div className="space-y-4 text-gray-400 text-lg">
                    <p>Before you can execute prompts programmatically, you must complete two simple steps:</p>
                    <ol className="list-decimal list-inside space-y-3 pl-4">
                        <li>
                            <strong className="text-white">Generate an API Key:</strong> Visit the <span className="text-brand-purple">Settings</span> sidebar in PromptForge Studio to generate your secret API key.
                        </li>
                        <li>
                            <strong className="text-white">Save a Prompt:</strong> Create and save a prompt in the Studio. Each saved prompt version generates a unique <code className="text-brand-purple">Version ID</code> which you'll use for execution.
                        </li>
                    </ol>
                </div>
            </section>

            {/* Core Concepts */}
            <section id="basics-concepts" className="scroll-mt-32 space-y-12">
                <h2 className="text-3xl font-bold text-white tracking-tight">Core Concepts</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 hover:border-brand-purple/20 transition-all">
                        <div className="p-3 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 w-fit mb-4">
                            <Puzzle className="h-6 w-6 text-brand-purple" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Dynamic Variables</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Any text wrapped in <code className="text-brand-purple">{"{{variable_name}}"}</code> in your Studio prompt is automatically treated as a dynamic template. These are substituted at runtime via the SDK or API.
                        </p>
                    </div>

                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 hover:border-brand-violet/20 transition-all">
                        <div className="p-3 rounded-2xl bg-brand-violet/10 border border-brand-violet/20 w-fit mb-4">
                            <Cpu className="h-6 w-6 text-brand-violet" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Model Routing</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            PromptForge automatically routes your requests to the best-performing model (Flash vs Pro) based on complexity and prompt length, ensuring optimal cost-performance balance.
                        </p>
                    </div>

                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 hover:border-emerald-500/20 transition-all">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 w-fit mb-4">
                            <Zap className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Semantic Caching</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Our proprietary engine checks for semantically similar requests. If a match is found, the cached result is returned in sub-50ms, significantly reducing latency and costs.
                        </p>
                    </div>

                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4 hover:border-red-500/20 transition-all">
                        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 w-fit mb-4">
                            <Shield className="h-6 w-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Enterprise Safety</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Built-in PII detection and prompt injection filters ensure that your LLM integrations are secure and compliant with enterprise standards.
                        </p>
                    </div>
                </div>
            </section>

            {/* Troubleshooting */}
            <section id="basics-trouble" className="scroll-mt-32 space-y-6">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Info className="h-8 w-8 text-blue-400" />
                    Troubleshooting
                </h2>
                <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                        <h4 className="text-white font-bold mb-2">401 Unauthorized</h4>
                        <p className="text-sm text-gray-500">Ensure your <code className="text-brand-purple">x-api-key</code> is correct and currently active in your dashboard settings.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
                        <h4 className="text-white font-bold mb-2">404 Version Not Found</h4>
                        <p className="text-sm text-gray-500">Ensure the <code className="text-brand-purple">version_id</code> exists in your workspace and hasn't been deleted.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
