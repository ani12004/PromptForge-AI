"use client"
import { useState, useRef } from "react"
import { Sparkles, Zap, Layers, Target, Shield, ArrowRight, Settings2, Fingerprint, Activity, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AdvancedControls, GranularOptions } from "./AdvancedControls"

interface PromptEditorProps {
    prompt: string
    setPrompt: (value: string) => void
    detailLevel: string
    setDetailLevel: (value: string) => void
    onGenerate: () => void
    isGenerating: boolean
    granularOptions: GranularOptions
    setGranularOptions: (opts: GranularOptions) => void
    onAudit: () => void
    isAuditing: boolean
    onSaveClick: () => void
}

const DETAIL_LEVELS = [
    { label: "Short", desc: "Concise", icon: Zap },
    { label: "Medium", desc: "Balanced", icon: Layers },
    { label: "Detailed", desc: "Robust", icon: Target },
    { label: "Granular", desc: "Expert", icon: Shield },
]

export function PromptEditor({
    prompt,
    setPrompt,
    detailLevel,
    setDetailLevel,
    onGenerate,
    isGenerating,
    granularOptions,
    setGranularOptions,
    onAudit,
    isAuditing,
    onSaveClick
}: PromptEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [focused, setFocused] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)

    // Heuristic State
    // Derived State (Heuristics)
    const lower = prompt.toLowerCase()
    const hasGoal = lower.length > 10 && (lower.includes("create") || lower.includes("write") || lower.includes("generate") || lower.includes("act as"))
    const hasContext = prompt.length > 50 && (lower.includes("for") || lower.includes("because") || lower.includes("context") || lower.includes("using"))
    const hasConstraints = lower.includes("no ") || lower.includes("without") || lower.includes("only") || lower.includes("must") || lower.includes("format")

    let score = 0
    if (hasGoal) score += 30
    if (hasContext) score += 40
    if (hasConstraints) score += 30
    if (prompt.length < 10) score = 0 // Baseline

    const stats = { hasGoal, hasContext, hasConstraints, score }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            onGenerate()
        }
    }

    return (
        <div className={`flex flex-col h-full relative transition-all duration-500`}>

            {/* Main Editor Surface */}
            <div className={`relative flex-1 rounded-2xl bg-[#0F0F0F] border transition-all duration-300 group overflow-hidden flex flex-col ${focused ? "border-brand-purple/40 shadow-xl shadow-brand-purple/5" : "border-white/5 hover:border-white/10"}`}>

                {/* Top Bar (Subtle) */}
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <span className={`w-2 h-2 rounded-full transition-colors ${stats.hasGoal ? "bg-brand-purple shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-white/10"}`} title="Goal Detected" />
                            <span className={`w-2 h-2 rounded-full transition-colors ${stats.hasContext ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "bg-white/10"}`} title="Context Detected" />
                            <span className={`w-2 h-2 rounded-full transition-colors ${stats.hasConstraints ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" : "bg-white/10"}`} title="Constraints Detected" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-gray-600 font-mono">
                            {prompt.length} chars
                        </span>
                    </div>

                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`text-[10px] font-mono flex items-center gap-1.5 transition-colors px-2 py-1 rounded hover:bg-white/5 ${showAdvanced ? "text-brand-purple" : "text-gray-500 hover:text-white"}`}
                    >
                        <Settings2 className="w-3 h-3" />
                        {showAdvanced ? "CLOSE CONFIG" : `${granularOptions.provider === 'openai' ? 'GPT' : 'GEMINI'} · ${granularOptions.model?.replace('gemini-', '').replace('gpt-', '').toUpperCase() || 'AUTO'}`}
                    </button>
                </div>

                {/* Advanced Controls Panel */}
                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-b border-white/5 bg-black/20"
                        >
                            <AdvancedControls
                                options={granularOptions}
                                onChange={setGranularOptions}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text Area */}
                <div className="flex-1 relative">
                    {/* Placeholder Hints */}
                    {!prompt && (
                        <div className="absolute inset-0 p-6 pointer-events-none opacity-20 flex flex-col justify-center items-center text-center gap-4">
                            <Fingerprint className="w-12 h-12 text-gray-600" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-400">Start typing your raw idea...</p>
                                <p className="text-xs text-gray-600">We&apos;ll help you structure it.</p>
                            </div>
                        </div>
                    )}

                    <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-full bg-transparent p-6 text-base md:text-lg font-mono text-white/90 focus:outline-none resize-none relative z-10 placeholder:text-transparent selection:bg-brand-purple/30"
                        spellCheck={false}
                    />
                </div>

                {/* Bottom Toolbar & Actions */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex flex-col xl:flex-row gap-4 xl:items-center justify-between">

                    {/* Left: Detail Level Selector */}
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 self-start xl:self-auto">
                        {DETAIL_LEVELS.map((level) => {
                            const active = detailLevel === level.label
                            const Icon = level.icon
                            return (
                                <button
                                    key={level.label}
                                    onClick={() => setDetailLevel(level.label)}
                                    className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 flex items-center gap-2 ${active ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                                    title={level.desc}
                                >
                                    <Icon className={`w-3 h-3 ${active ? "text-brand-purple" : ""}`} />
                                    <span>{level.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 w-full xl:w-auto">
                        <button
                            onClick={onAudit}
                            disabled={isAuditing || !prompt.trim()}
                            className="px-4 py-2 rounded-lg border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isAuditing ? <Activity className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                            {isAuditing ? "SCANNING..." : "AUDIT"}
                        </button>

                        <button
                            onClick={onSaveClick}
                            disabled={!prompt.trim()}
                            className="px-4 py-2 rounded-lg border border-white/10 text-xs font-bold text-gray-400 hover:text-brand-purple hover:border-brand-purple/50 hover:bg-brand-purple/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                            title="Save Prompt to Database"
                        >
                            <Save className="w-3 h-3" />
                            SAVE
                        </button>

                        <button
                            onClick={onGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="group relative flex-1 xl:flex-none flex items-center gap-2 bg-brand-purple text-white px-6 py-2 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-purple/90 transition-all active:scale-95 shadow-[0_0_15px_rgba(124,58,237,0.25)] justify-center min-w-[140px]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="w-4 h-4 animate-spin" />
                                        <span>FORGING...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>ENHANCE</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
