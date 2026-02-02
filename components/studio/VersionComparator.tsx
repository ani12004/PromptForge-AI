"use client"

import React, { useState } from "react"
import { X, Trophy, Split, FlaskConical, Copy } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
    const [mounted, setMounted] = useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleSelect = (idx: 0 | 1, id: string) => {
        const newIds = [...selectedIds] as [string | null, string | null]
        newIds[idx] = id
        setSelectedIds(newIds)
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

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex flex-col pt-16 lg:pt-0"
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

                {/* Modal Content */}
                <div className="relative flex-1 flex flex-col bg-[#0F0F0F] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-300">

                    {/* Header */}
                    <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A0A] relative z-10 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20">
                                <FlaskConical className="h-5 w-5 text-brand-purple" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white leading-none">A/B Laboratory</h2>
                                <p className="text-xs text-gray-500 mt-1 font-mono">Compare generative performance & structural integrity.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                disabled={!selectedIds[0] || !selectedIds[1] || isBenchmarking}
                                onClick={runBenchmark}
                                className="bg-brand-purple hover:bg-brand-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                            >
                                {isBenchmarking ? <span className="animate-pulse">ANALYZING...</span> : <>
                                    <Trophy className="h-4 w-4" /> BEGIN ANALYSIS
                                </>}
                            </button>
                            <div className="h-8 w-px bg-white/10 mx-2" />
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Main Arena: Split View */}
                    <div className="flex-1 flex overflow-hidden">
                        {[0, 1].map((idx) => {
                            const vId = selectedIds[idx]
                            const version = versions.find(v => v.id === vId)
                            const isWinner = result?.winnerId === vId && !!result
                            const isLoser = result?.winnerId && result.winnerId !== vId

                            return (
                                <div key={idx} className={cn(
                                    "flex-1 flex flex-col relative transition-all duration-500",
                                    idx === 0 ? "border-r border-white/5" : "",
                                    isWinner ? "bg-green-500/[0.02]" : isLoser ? "bg-red-500/[0.01]" : ""
                                )}>

                                    {/* Column Header / Selector */}
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border",
                                                idx === 0 ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                                            )}>
                                                {idx === 0 ? "A" : "B"}
                                            </div>

                                            <div className="relative flex-1 max-w-sm">
                                                <select
                                                    value={vId || ""}
                                                    onChange={(e) => handleSelect(idx as 0 | 1, e.target.value)}
                                                    className="w-full bg-[#1A1A1A] border border-white/10 text-white text-xs rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-white/20 font-mono"
                                                >
                                                    <option value="" disabled>-- Select Iteration --</option>
                                                    {versions.map(v => (
                                                        <option key={v.id} value={v.id}>
                                                            {new Date(v.timestamp).toLocaleTimeString()} - {v.detailLevel} ({v.content.length} chars)
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {version && (
                                            <button
                                                onClick={() => copyToClipboard(version.content)}
                                                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                                                title="Copy Content"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 relative overflow-hidden group">
                                        {version ? (
                                            <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
                                                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300 leading-relaxed font-ligatures-none pb-32">
                                                    {version.content}
                                                </pre>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700 select-none">
                                                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center mb-4 transition-colors group-hover:border-white/10">
                                                    <Split className="w-8 h-8 opacity-20" />
                                                </div>
                                                <p className="text-sm font-mono opacity-50">Select an iteration above to load</p>
                                            </div>
                                        )}

                                        {/* Result Overlay */}
                                        <AnimatePresence>
                                            {isWinner && (
                                                <motion.div
                                                    initial={{ y: 100, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: 100, opacity: 0 }}
                                                    className="absolute bottom-6 inset-x-6 p-5 rounded-xl bg-[#0F1E15] border border-green-500/20 shadow-2xl backdrop-blur-md z-20"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                                            <Trophy className="w-5 h-5 text-green-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-green-400 font-bold text-sm uppercase tracking-wider mb-2">Dominant Variation</h4>
                                                            <ul className="space-y-1">
                                                                {result?.insights.map((insight, i) => (
                                                                    <li key={i} className="text-xs text-green-200/60 flex items-center gap-2">
                                                                        <span className="w-1 h-1 rounded-full bg-green-500" />
                                                                        {insight}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>,
        document.body
    )
}
