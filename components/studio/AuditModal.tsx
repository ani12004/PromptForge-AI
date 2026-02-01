"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react"
import type { AuditResult } from "@/app/actions/audit"

interface AuditModalProps {
    isOpen: boolean
    onClose: () => void
    result: AuditResult | null
}

export function AuditModal({ isOpen, onClose, result }: AuditModalProps) {
    if (!isOpen || !result) return null

    // Determine color based on score
    const scoreColor = result.score >= 80 ? "text-green-400" :
        result.score >= 50 ? "text-yellow-400" : "text-red-400"

    const scoreRingColor = result.score >= 80 ? "stroke-green-500" :
        result.score >= 50 ? "stroke-yellow-500" : "stroke-red-500"

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4"
                    >
                        <div className="pointer-events-auto bg-[#0F0F0F] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Prompt Audit Report</h2>
                                    <p className="text-sm text-gray-500 mt-1">AI-powered critique of your current input.</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">

                                {/* Score Section */}
                                <div className="flex items-center justify-center py-4">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                                            <circle
                                                cx="64" cy="64" r="60"
                                                stroke="currentColor" strokeWidth="8" fill="transparent"
                                                strokeDasharray={377}
                                                strokeDashoffset={377 - (377 * result.score) / 100}
                                                className={`transition-all duration-1000 ease-out ${scoreRingColor}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-4xl font-bold ${scoreColor}`}>{result.score}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Quality</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Strengths */}
                                {result.strengths.length > 0 && (
                                    <div>
                                        <h3 className="flex items-center gap-2 text-sm font-bold text-green-400 uppercase tracking-wider mb-3">
                                            <CheckCircle className="w-4 h-4" /> Strong Points
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.strengths.map((s, i) => (
                                                <li key={i} className="text-sm text-gray-300 pl-6 relative before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-green-500/50">
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Weaknesses */}
                                {result.weaknesses.length > 0 && (
                                    <div>
                                        <h3 className="flex items-center gap-2 text-sm font-bold text-red-400 uppercase tracking-wider mb-3">
                                            <AlertTriangle className="w-4 h-4" /> Areas to Improve
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.weaknesses.map((w, i) => (
                                                <li key={i} className="text-sm text-gray-300 pl-6 relative before:absolute before:left-2 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-red-500/50">
                                                    {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {result.suggestions.length > 0 && (
                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                                        <h3 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">
                                            <Lightbulb className="w-4 h-4" /> Actionable Advice
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.suggestions.map((s, i) => (
                                                <li key={i} className="text-sm text-gray-300 flex gap-2">
                                                    <span className="text-blue-500 font-bold">→</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
