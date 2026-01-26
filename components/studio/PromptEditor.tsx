"use client"
import { useState, useEffect, useRef } from "react"
import { Sparkles, Zap, Layers, Target, Shield, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LiveAnalysis } from "./LiveAnalysis"

interface PromptEditorProps {
    prompt: string
    setPrompt: (value: string) => void
    detailLevel: string
    setDetailLevel: (value: string) => void
    onGenerate: () => void
    isGenerating: boolean
}

const DETAIL_LEVELS = [
    { label: "Short", desc: "Concise, direct output.", icon: Zap },
    { label: "Medium", desc: "Balanced detail & brevity.", icon: Layers },
    { label: "Detailed", desc: "Comprehensive, structured.", icon: Target },
    { label: "Granular", desc: "Maximum depth & edges.", icon: Shield },
]

export function PromptEditor({ prompt, setPrompt, detailLevel, setDetailLevel, onGenerate, isGenerating }: PromptEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [focused, setFocused] = useState(false)

    // Heuristic State
    const [stats, setStats] = useState({
        hasGoal: false,
        hasContext: false,
        hasConstraints: false,
        score: 0
    })

    // Simple Heuristic Engine
    useEffect(() => {
        const lower = prompt.toLowerCase()
        const hasGoal = lower.length > 10 && (lower.includes("create") || lower.includes("write") || lower.includes("generate") || lower.includes("act as"))
        const hasContext = prompt.length > 50 && (lower.includes("for") || lower.includes("because") || lower.includes("context") || lower.includes("using"))
        const hasConstraints = lower.includes("no ") || lower.includes("without") || lower.includes("only") || lower.includes("must") || lower.includes("format")

        let score = 0
        if (hasGoal) score += 30
        if (hasContext) score += 40
        if (hasConstraints) score += 30
        if (prompt.length < 10) score = 0 // Baseline

        setStats({ hasGoal, hasContext, hasConstraints, score })
    }, [prompt])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            onGenerate()
        }
    }

    return (
        <div className={`flex flex-col h-full relative transition-all duration-500 ${focused ? "scale-[1.01]" : "scale-100"}`}>

            {/* Header / Meta controls */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Construction Surface</span>
                    {stats.score > 80 && <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-mono">OPTIMIZED</span>}
                </div>
                <LiveAnalysis score={stats.score} />
            </div>

            {/* Smart Editor Surface */}
            <div className={`relative flex-1 rounded-xl bg-[#0F0F0F] border transition-all duration-300 group overflow-hidden ${focused ? "border-brand-purple/50 shadow-glow" : "border-white/10 hover:border-white/20"}`}>

                {/* Background Semantic Hints (Visual only) */}
                <div className="absolute inset-0 pointer-events-none p-6 opacity-20">
                    {!prompt && (
                        <div className="flex flex-col gap-8 text-sm font-mono text-gray-500">
                            <div className="border-l-2 border-brand-purple pl-4 pt-1">
                                <span className="block text-brand-purple mb-1">[GOAL]</span>
                                What should the system create?
                            </div>
                            <div className="border-l-2 border-gray-700 pl-4 pt-1">
                                <span className="block text-gray-500 mb-1">[CONTEXT]</span>
                                Who is this for? Why now?
                            </div>
                            <div className="border-l-2 border-gray-700 pl-4 pt-1">
                                <span className="block text-gray-500 mb-1">[CONSTRAINTS]</span>
                                Format, length, tone?
                            </div>
                        </div>
                    )}
                </div>

                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full bg-transparent p-6 text-base md:text-lg font-mono text-white/90 focus:outline-none resize-none relative z-10 placeholder:text-transparent"
                    spellCheck={false}
                />

                {/* Bottom Status Bar */}
                <div className="absolute bottom-0 inset-x-0 h-10 bg-[#0A0A0A]/90 backdrop-blur border-t border-white/5 flex items-center justify-between px-4 text-xs font-mono z-20">
                    <div className="flex gap-4">
                        <span className={`transition-colors duration-300 ${stats.hasGoal ? "text-brand-purple" : "text-gray-600"}`}>
                            ● GOAL
                        </span>
                        <span className={`transition-colors duration-300 ${stats.hasContext ? "text-blue-400" : "text-gray-600"}`}>
                            ● CONTEXT
                        </span>
                        <span className={`transition-colors duration-300 ${stats.hasConstraints ? "text-orange-400" : "text-gray-600"}`}>
                            ● CONSTRAINTS
                        </span>
                    </div>
                    <div className="text-gray-500">
                        {prompt.length} chars
                    </div>
                </div>
            </div>

            {/* Controls Area */}
            <div className="mt-6 flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">

                {/* Detail Level "Power Lever" */}
                <div className="flex-1 w-full md:w-auto">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3 block">Cognitive Depth</label>
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 w-full md:w-fit">
                        {DETAIL_LEVELS.map((level) => {
                            const active = detailLevel === level.label
                            const Icon = level.icon
                            return (
                                <button
                                    key={level.label}
                                    onClick={() => setDetailLevel(level.label)}
                                    className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${active ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                        }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 ${active ? "text-brand-purple" : ""}`} />
                                    <span>{level.label}</span>
                                    {active && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute inset-0 border border-white/10 rounded-md"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                    {/* Micro-description */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={detailLevel}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="text-[10px] text-gray-500 mt-2 font-mono pl-1 h-3"
                        >
                            {`>> SYSTEM_MODE: ${DETAIL_LEVELS.find(l => l.label === detailLevel)?.desc}`}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Main Action */}
                <button
                    onClick={onGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="group relative flex items-center gap-3 bg-brand-purple text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-purple/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(124,58,237,0.3)] w-full md:w-auto justify-center"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isGenerating ? "FORGING..." : "INITIATE FORGE"}
                        {!isGenerating && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </span>
                    {/* Subtle Glow */}
                    <div className="absolute inset-0 rounded-lg bg-brand-purple/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </div>
    )
}
