"use client"

import React from "react"
import { AnalysisResult } from "./types"
import { Sparkles, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface AnalysisPanelProps {
    evaluation: AnalysisResult | null;
    isAnalyzing: boolean;
}

export function AnalysisPanel({ evaluation, isAnalyzing }: AnalysisPanelProps) {
    if (isAnalyzing) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-pulse">
                <Sparkles className="h-12 w-12 text-brand-purple mb-4 animate-spin-slow" />
                <h3 className="text-lg font-bold text-white mb-2">Analyzing Prompt DNA...</h3>
                <p className="text-gray-500">Evaluating intent precision and constraints.</p>
            </div>
        )
    }

    if (!evaluation) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-600">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 opacity-50" />
                </div>
                <p>Submit your prompt to see the analysis.</p>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Overall Score */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-brand-purple/20 bg-brand-purple/5 relative">
                    <span className="text-3xl font-bold text-white">{evaluation.overallScore}</span>
                    <span className="absolute text-[10px] bottom-4 text-brand-purple font-bold">SCORE</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Metrics</h4>
                {evaluation.metrics.map((metric) => (
                    <div key={metric.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{metric.name}</span>
                            <span className="text-gray-400 font-mono">{metric.score}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.score}%` }}
                                className={`h-full rounded-full ${metric.score > 80 ? 'bg-green-500' : metric.score > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            />
                        </div>
                        <p className="text-[10px] text-gray-500">{metric.description}</p>
                    </div>
                ))}
            </div>

            {/* Feedback */}
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">AI Insights</h4>

                {evaluation.strengths.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                            <CheckCircle2 className="h-4 w-4" /> Strong Points
                        </div>
                        <ul className="text-sm text-gray-400 ml-6 list-disc space-y-1">
                            {evaluation.strengths.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {evaluation.weaknesses.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                            <AlertTriangle className="h-4 w-4" /> Areas for Improvement
                        </div>
                        <ul className="text-sm text-gray-400 ml-6 list-disc space-y-1">
                            {evaluation.weaknesses.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Improved Prompt */}
            <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-xl p-4">
                <h4 className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> Improved Version
                </h4>
                <div className="bg-black/40 p-3 rounded-lg border border-black/20">
                    <p className="text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {evaluation.improvements}
                    </p>
                </div>
            </div>
        </div>
    )
}
