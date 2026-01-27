"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Sliders, Settings2, BarChart3, Radio } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

export function GranularControls() {
    return (
        <section className="container mx-auto px-6 py-24 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Visual Representation (Left) */}
                <div className="order-2 lg:order-1 relative">
                    <div className="absolute -inset-1 bg-gradient-to-l from-brand-indigo/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-40" />
                    <Card className="relative bg-[#0A0A0A] border-white/10 p-8 overflow-hidden h-full min-h-[450px] flex flex-col justify-center">
                        <div className="relative z-10 space-y-8">

                            {/* Sliders Group */}
                            <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                    <span>CREATIVE TEMPERATURE</span>
                                    <span className="text-cyan-400 font-mono">0.7</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                                    <div className="absolute top-0 left-0 h-full w-[70%] bg-cyan-500 rounded-full group-hover:bg-cyan-400 transition-colors" />
                                    <div className="absolute top-1/2 left-[70%] -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-cyan-500/50" />
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                    <span>MAX TOKENS</span>
                                    <span className="text-brand-purple font-mono">2048</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                                    <div className="absolute top-0 left-0 h-full w-[45%] bg-brand-purple rounded-full group-hover:bg-brand-purple/80 transition-colors" />
                                    <div className="absolute top-1/2 left-[45%] -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-brand-purple/50" />
                                </div>
                            </div>

                            {/* Knobs Group */}
                            <div className="grid grid-cols-3 gap-4">
                                <Knob label="Velocity" value={75} color="text-emerald-400" border="border-emerald-500/30" />
                                <Knob label="Stability" value={92} color="text-amber-400" border="border-amber-500/30" />
                                <Knob label="Power" value={40} color="text-rose-400" border="border-rose-500/30" />
                            </div>

                            {/* Switches Mockup */}
                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-6 bg-brand-indigo rounded-full relative">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </div>
                                    <span className="text-sm font-medium text-white">Auto-Optimize</span>
                                </div>
                                <div className="h-4 w-4 rounded-full bg-green-500/20 border border-green-500 animate-pulse" />
                            </div>

                        </div>
                    </Card>
                </div>

                {/* Text Content (Right) */}
                <div className="order-1 lg:order-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/20 mb-6">
                        <Settings2 className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Granular Controls</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Dial in the details.
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Adjust output verbosity, creativity temperature, and formatting constraints with simple sliders. We translate your preferences into technical system prompts automatically.
                    </p>

                    <button className="px-8 py-3 rounded-full bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
                        Explore Controls
                    </button>
                </div>

            </div>
        </section>
    )
}

function Knob({ label, value, color, border }: { label: string, value: number, color: string, border: string }) {
    return (
        <div className="flex flex-col items-center gap-2 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className={cn("w-16 h-16 rounded-full border-2 flex items-center justify-center relative", border)}>
                <div className="absolute inset-2 border border-white/10 rounded-full" />
                <span className={cn("font-bold font-mono text-lg", color)}>{value}%</span>
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
        </div>
    )
}
