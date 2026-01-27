"use client"

import React from "react"
import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

export function ABTestingArena() {
    return (
        <section className="container mx-auto px-6 py-24 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-6">
                        <Trophy className="h-4 w-4 text-brand-purple" />
                        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">A/B Testing Arena</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Find the winning prompt combination.
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        Generated three versions of a prompt? Run them against our benchmark suite to see which one performs better on reasoning capability and token efficiency.
                    </p>

                    <button className="px-8 py-3 rounded-full bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
                        Start Benchmarking
                    </button>
                </div>

                {/* Visual Representation */}
                <div className="order-2 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple/20 to-brand-violet/20 rounded-3xl blur-2xl opacity-40" />
                    <Card className="relative bg-[#0A0A0A] border-white/10 p-8 overflow-hidden h-full min-h-[400px] flex flex-col items-center justify-center">
                        {/* Status Icon */}
                        <div className="mb-4 relative">
                            <div className="absolute inset-0 bg-brand-purple/40 blur-xl rounded-full" />
                            <Trophy className="h-16 w-16 text-brand-purple relative z-10" />
                        </div>

                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-white">DATASET B</h3>
                            <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">WINNER</span>
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {/* Line Chart Mockup */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Growth Metrics (Time)</span>
                                <div className="h-32 w-full relative flex items-end px-2 pb-2 gap-1">
                                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {/* Line A */}
                                        <path d="M0,80 L25,70 L50,65 L75,55 L100,40" fill="none" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="2" />
                                        {/* Line B (Winner) */}
                                        <path d="M0,80 L25,60 L50,45 L75,25 L100,10" fill="none" stroke="#9333EA" strokeWidth="2" />
                                        {/* Points */}
                                        <circle cx="25" cy="60" r="2" fill="#9333EA" />
                                        <circle cx="50" cy="45" r="2" fill="#9333EA" />
                                        <circle cx="75" cy="25" r="2" fill="#9333EA" />
                                        <circle cx="100" cy="10" r="2" fill="#9333EA" />
                                        {/* Winner Tag */}
                                        <foreignObject x="80" y="0" width="20" height="20">
                                            <Trophy className="h-4 w-4 text-brand-purple animate-bounce" />
                                        </foreignObject>
                                    </svg>
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="border-r border-t last:border-b border-white/[0.03]" />
                                        ))}
                                    </div>

                                    <div className="absolute bottom-2 left-4 flex items-center gap-4 text-[10px] text-gray-500">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-purple/30"></span> Dataset A</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-purple"></span> Dataset B</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bar Chart Mockup */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">Category Analysis</span>
                                <div className="h-32 w-full flex items-end justify-between gap-2 px-1">
                                    <div className="w-full bg-brand-purple/30 h-[40%] rounded-t-sm relative group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white bg-black/80 px-1 py-0.5 rounded transition-opacity">40%</div>
                                    </div>
                                    <div className="w-full bg-brand-purple/50 h-[65%] rounded-t-sm relative group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white bg-black/80 px-1 py-0.5 rounded transition-opacity">65%</div>
                                    </div>
                                    <div className="w-full bg-brand-purple/30 h-[30%] rounded-t-sm relative group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white bg-black/80 px-1 py-0.5 rounded transition-opacity">30%</div>
                                    </div>
                                    <div className="w-full bg-brand-purple/60 h-[55%] rounded-t-sm relative group">
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white bg-black/80 px-1 py-0.5 rounded transition-opacity">55%</div>
                                    </div>
                                    <div className="w-full bg-brand-purple h-[85%] rounded-t-sm relative group">
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-brand-purple animate-pulse"><Trophy className="h-3 w-3" /></div>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] text-white bg-black/80 px-1 py-0.5 rounded transition-opacity">85%</div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-[8px] text-gray-500 uppercase">
                                    <span>M1</span>
                                    <span>M2</span>
                                    <span>M3</span>
                                    <span>M4</span>
                                    <span>M5</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
