"use client"

import React, { useState } from "react"
import { X, Trophy, Split, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Version {
    id: string
    content: string
    timestamp: number
    detailLevel: string
}

interface VersionComparatorProps {
    versions: Version[]
    onClose: () => void
}

export function VersionComparator({ versions, onClose }: VersionComparatorProps) {
    const [selectedIds, setSelectedIds] = useState<[string | null, string | null]>([null, null])
    const [isBenchmarking, setIsBenchmarking] = useState(false)
    const [result, setResult] = useState<{ winnerId: string; insights: string[] } | null>(null)

    const handleSelect = (id: string) => {
        // If already selected, deselect
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => {
                if (prev[0] === id) return [null, prev[1]]
                if (prev[1] === id) return [prev[0], null]
                return prev
            })
            setResult(null)
            return
        }

        // Fill empty slot
        setSelectedIds(prev => {
            if (!prev[0]) return [id, prev[1]]
            if (!prev[1]) return [prev[0], id]
            // Replace second if both full
            return [prev[0], id]
        })
        setResult(null)
    }

    const runBenchmark = async () => {
        if (!selectedIds[0] || !selectedIds[1]) return
        setIsBenchmarking(true)

        // Mock Benchmark Delay
        await new Promise(r => setTimeout(r, 2000))

        const v1 = versions.find(v => v.id === selectedIds[0])
        const v2 = versions.find(v => v.id === selectedIds[1])

        if (!v1 || !v2) return

        // Simple Heuristic Winner
        const v1Score = v1.content.length * (v1.detailLevel === "Granular" ? 1.5 : 1)
        const v2Score = v2.content.length * (v2.detailLevel === "Granular" ? 1.5 : 1)

        const winnerId = v1Score > v2Score ? v1.id : v2.id

        setResult({
            winnerId,
            insights: [
                "Higher structural complexity detected.",
                "More explicit constraint definitions.",
                "Better handling of edge cases modeled."
            ]
        })
        setIsBenchmarking(false)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col pt-24 animate-in fade-in duration-300">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0A0A0A]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-purple/20 rounded-lg">
                        <Split className="h-5 w-5 text-brand-purple" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">A/B Benchmark Arena</h2>
                        <p className="text-xs text-gray-400">Select two iterations to compare performance projection.</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar: Version Picker */}
                <div className="w-80 border-r border-white/10 overflow-y-auto p-4 space-y-4 bg-[#0F0F0F]">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Available Iterations</h3>
                    {versions.length === 0 ? (
                        <div className="text-sm text-gray-600 text-center py-8">No prompts generated yet.</div>
                    ) : (
                        versions.map((v) => {
                            const isSelected = selectedIds.includes(v.id)
                            const index = selectedIds.indexOf(v.id)
                            const isWinner = result?.winnerId === v.id

                            return (
                                <div
                                    key={v.id}
                                    onClick={() => handleSelect(v.id)}
                                    className={cn(
                                        "p-4 rounded-xl border cursor-pointer transition-all duration-200 relative group",
                                        isSelected
                                            ? "bg-brand-purple/10 border-brand-purple/50 shadow-glow-sm"
                                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-gray-400">
                                            {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                        <div className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold border",
                                            v.detailLevel === "Granular" ? "border-red-500/20 text-red-400 bg-red-500/10" :
                                                v.detailLevel === "Detailed" ? "border-orange-500/20 text-orange-400 bg-orange-500/10" :
                                                    "border-blue-500/20 text-blue-400 bg-blue-500/10"
                                        )}>
                                            {v.detailLevel}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300 line-clamp-3 font-mono text-[11px] leading-relaxed opacity-80">
                                        {v.content}
                                    </p>

                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute -right-2 -top-2 w-6 h-6 bg-brand-purple rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-black">
                                            {index === 0 ? "A" : "B"}
                                        </div>
                                    )}

                                    {/* Winner Indicator */}
                                    {isWinner && (
                                        <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none flex items-center justify-center bg-green-500/5">
                                            <Trophy className="h-8 w-8 text-green-500 animate-bounce drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Main Arena */}
                <div className="flex-1 flex flex-col bg-[#050505] relative">
                    {/* Toolbar */}
                    <div className="h-14 border-b border-white/5 flex items-center justify-center gap-4">
                        <button
                            disabled={!selectedIds[0] || !selectedIds[1] || isBenchmarking}
                            onClick={runBenchmark}
                            className="bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 transition-all"
                        >
                            {isBenchmarking ? <span className="animate-pulse">Analyzing...</span> : <>
                                <Trophy className="h-4 w-4" /> Run Benchmark
                            </>}
                        </button>
                    </div>

                    <div className="flex-1 grid grid-cols-2 divide-x divide-white/5 overflow-hidden">
                        {[0, 1].map((idx) => {
                            const vId = selectedIds[idx]
                            const version = versions.find(v => v.id === vId)
                            const isWinner = result?.winnerId === vId && !!result

                            return (
                                <div key={idx} className="flex flex-col h-full relative group">
                                    {/* Column Header */}
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-400">
                                                {idx === 0 ? "A" : "B"}
                                            </div>
                                            {version ? (
                                                <div className="text-sm">
                                                    <div className="font-mono text-gray-300">{version.detailLevel} Mode</div>
                                                    <div className="text-xs text-gray-500">{version.content.length} chars</div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-600 italic">Select a version...</span>
                                            )}
                                        </div>
                                        {version && (
                                            <button
                                                onClick={() => copyToClipboard(version.content)}
                                                className="text-xs hover:text-white text-gray-500 transition-colors"
                                            >
                                                Copy
                                            </button>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 relative min-h-0">
                                        <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
                                            {version ? (
                                                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed font-ligatures-none pb-32">
                                                    {version.content}
                                                </pre>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-700 gap-4">
                                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center">
                                                        <span className="text-lg font-bold text-gray-600">+</span>
                                                    </div>
                                                    <p>Select prompt from sidebar</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Result Overlay */}
                                        {result && (
                                            <div className={cn("absolute inset-x-0 bottom-0 p-6 backdrop-blur-xl border-t transition-all duration-500 z-10",
                                                isWinner ? "bg-green-950/40 border-green-500/30" : "bg-red-950/20 border-red-500/10 opacity-60 grayscale"
                                            )}>
                                                {isWinner ? (
                                                    <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
                                                        <h4 className="flex items-center gap-2 text-green-400 font-bold mb-3 shadow-green-glow">
                                                            <CheckCircle2 className="h-5 w-5 fill-green-500/20" />
                                                            Winning Variation
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {result.insights.map((insight, i) => (
                                                                <li key={i} className="text-xs text-green-100/80 flex items-start gap-2 theme-transition">
                                                                    <div className="mt-1.5 w-1 h-1 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                                                                    {insight}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center text-red-500/40 font-mono text-xs uppercase tracking-widest">
                                                        Analysis indicates suboptimal performance
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
