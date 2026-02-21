import { Metadata } from "next"
import Link from "next/link"
import { Package, Globe, ArrowRight, Book, Zap, Shield, Cpu, Layers, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const metadata: Metadata = {
    title: "Documentation Hub - PromptForge",
    description: "Choose between our Node.js SDK guide and REST API reference.",
}

export default function DocumentationPage() {
    return (
        <div className="pb-32 pt-32 px-6 bg-[#050508] min-h-screen relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20">
                        <Book className="h-4 w-4 text-brand-purple" />
                        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Developer Center</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Documentation Hub</h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Select your integration method to get started with the PromptForge Engine.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Introduction Card */}
                    <Link href="/docs/introduction" className="group">
                        <div className="glass-panel p-10 h-full rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden text-left">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <BookOpen className="h-32 w-32 text-emerald-500" />
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 w-fit mb-8">
                                <BookOpen className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">Core Concepts</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Learn about prerequisites, dynamic variable injection, semantic caching, and intelligent model routing.
                            </p>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold group-hover:gap-4 transition-all">
                                Get Started <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* SDK Card */}
                    <Link href="/docs/sdk" className="group">
                        <div className="glass-panel p-10 h-full rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/30 transition-all duration-500 relative overflow-hidden text-left">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Package className="h-32 w-32 text-brand-purple" />
                            </div>
                            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 w-fit mb-8">
                                <Package className="h-8 w-8 text-blue-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">Node.js SDK</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                High-performance server-side library with built-in caching and intelligent routing. Perfect for Next.js and Edge.
                            </p>
                            <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:gap-4 transition-all">
                                Explore SDK Docs <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* API Card */}
                    <Link href="/docs/api" className="group">
                        <div className="glass-panel p-10 h-full rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-violet/30 transition-all duration-500 relative overflow-hidden text-left">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Globe className="h-32 w-32 text-brand-violet" />
                            </div>
                            <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 w-fit mb-8">
                                <Globe className="h-8 w-8 text-violet-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-violet-400 transition-colors">REST API</h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Language-agnostic interface for executing prompts. Ideal for Python, Go, or custom integrations.
                            </p>
                            <div className="flex items-center gap-2 text-violet-400 font-bold group-hover:gap-4 transition-all">
                                View API Reference <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <HubFeature icon={Zap} title="Sub-50ms Latency" description="Powered by semantic edge caching." />
                    <HubFeature icon={Shield} title="Safe & Secure" description="Built-in PII and prompt injection filters." />
                    <HubFeature icon={Cpu} title="Smart Routing" description="Flash vs Pro model cascading." />
                    <HubFeature icon={Layers} title="Unified Schema" description="One API for all major LLM providers." />
                </div>
            </div>
        </div>
    )
}

function HubFeature({ icon: Icon, title, description }: any) {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
            <Icon className="h-5 w-5 text-gray-500 mb-3" />
            <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
            <p className="text-xs text-gray-600">{description}</p>
        </div>
    )
}
