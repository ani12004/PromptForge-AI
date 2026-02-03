"use client"

import React, { useState } from "react"
import { FixerChallenge } from "../types"
import { PromptEditor } from "../PromptEditor"
import { Button } from "@/components/ui/Button"
import { AlertTriangle, CheckCircle, RefreshCw, Eye, EyeOff } from "lucide-react"

interface ModeFixerProps {
    challenge: FixerChallenge;
    onComplete: (xp: number) => void;
}

export function ModeFixer({ challenge, onComplete }: ModeFixerProps) {
    const [prompt, setPrompt] = useState(challenge.badPrompt)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [result, setResult] = useState<{ success: boolean; score: number; feedback: string } | null>(null)

    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        // Simulate API call
        setTimeout(() => {
            // Simple heuristic for demo: valid if length > original + 10 chars
            const isImproved = prompt.length > challenge.badPrompt.length + 15;
            const score = isImproved ? 85 : 40;

            setResult({
                success: isImproved,
                score,
                feedback: isImproved
                    ? "Great job! You added specificity and context."
                    : "The prompt is still too vague. Try identifying the hidden intent."
            })

            if (isImproved) {
                // Wait a bit then trigger complete
                // In real app, user would click "Continue"
            }
            setIsAnalyzing(false)
        }, 1500)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
            {/* Left: Editor */}
            <div className="flex flex-col gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-white">Debug This Prompt</h3>
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="text-xs flex items-center gap-1.5 text-gray-500 hover:text-brand-purple transition-colors"
                        >
                            {showHint ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            {showHint ? "Hide Intent" : "Reveal Intent"}
                        </button>
                    </div>

                    {showHint && (
                        <div className="mb-4 p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-lg">
                            <p className="text-sm text-brand-purple">
                                <span className="font-bold">Hidden Intent: </span>
                                {challenge.hiddenIntent}
                            </p>
                        </div>
                    )}

                    <div className="h-64 mb-4">
                        <PromptEditor value={prompt} onChange={setPrompt} disabled={isAnalyzing} />
                    </div>

                    <div className="flex justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPrompt(challenge.badPrompt)}
                            className="text-gray-500"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="bg-brand-purple"
                        >
                            {isAnalyzing ? "Analyzing..." : "Fix Prompt"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right: Feedback */}
            <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-[#0F0F12] flex flex-col justify-center items-center text-center">
                {!result ? (
                    <div className="opacity-50">
                        <AlertTriangle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-500">Waiting for submission...</h3>
                        <p className="text-sm text-gray-600 mt-2">Rewrite the prompt on the left to match the hidden intent.</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className={`h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 ${result.success ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {result.success ? <CheckCircle className="h-10 w-10" /> : <AlertTriangle className="h-10 w-10" />}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">{result.score}/100</h2>
                        <p className={`text-lg font-medium mb-6 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                            {result.feedback}
                        </p>

                        {result.success && (
                            <Button
                                onClick={() => {
                                    if (result.success) {
                                        onComplete(challenge.xpReward)
                                        setResult(null) // Reset or hide to prevent double click
                                    }
                                }}
                                className="bg-white text-black hover:bg-gray-200"
                            >
                                Claim {challenge.xpReward} XP & Continue
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
