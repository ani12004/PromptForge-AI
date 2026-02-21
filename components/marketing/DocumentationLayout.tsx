"use client"

import React from "react"
import { Book, ChevronRight, Package, Globe, ExternalLink, ArrowLeft, BookOpen, Zap } from "lucide-react"
import Link from "next/link"

interface DocumentationLayoutProps {
    children: React.ReactNode
    activeTab: 'sdk' | 'api' | 'home'
    navigationItems: { name: string; href: string }[]
}

export function DocumentationLayout({ children, activeTab, navigationItems }: DocumentationLayoutProps) {
    return (
        <div className="pb-32 pt-32 px-6 bg-[#050508] min-h-screen">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[80vw] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

            {/* Breadcrumbs */}
            <div className="max-w-6xl mx-auto mb-8 relative z-10">
                <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white capitalize">{activeTab === 'home' ? 'Overview' : activeTab.toUpperCase()}</span>
                </nav>
            </div>

            <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 hidden md:block">
                    <div className="glass-panel p-6 rounded-2xl sticky top-32 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">Quick Navigation</h4>
                        <ul className="space-y-1">
                            {navigationItems.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-4">Jump To</p>
                            <div className="flex flex-col gap-2">
                                {activeTab !== 'home' && (
                                    <Link
                                        href="/docs/introduction"
                                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                                    >
                                        <BookOpen className="h-3 w-3 text-emerald-500" />
                                        Core Concepts
                                    </Link>
                                )}
                                {activeTab !== 'sdk' && (
                                    <Link
                                        href="/docs/sdk"
                                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                                    >
                                        <Package className="h-3 w-3 text-blue-500" />
                                        SDK Docs
                                    </Link>
                                )}
                                {activeTab !== 'api' && (
                                    <Link
                                        href="/docs/api"
                                        className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                                    >
                                        <Globe className="h-3 w-3 text-violet-500" />
                                        API Reference
                                    </Link>
                                )}
                                <Link
                                    href="/docs/examples"
                                    className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                                >
                                    <Zap className="h-3 w-3 text-amber-500" />
                                    SDK Examples
                                </Link>
                                <Link
                                    href="/docs"
                                    className="flex items-center justify-center gap-2 py-2 mt-2 text-gray-600 hover:text-gray-400 transition-all text-xs"
                                >
                                    <ArrowLeft className="h-3 w-3" /> Back to Hub
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2">
                    {children}
                </div>
            </div>
        </div>
    )
}

export function CodeBlock({ code, language = 'typescript' }: { code: string, language?: string }) {
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

export function ParamItem({ name, type, required, description }: any) {
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
