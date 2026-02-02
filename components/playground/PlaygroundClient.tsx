"use client"

import React, { useState } from "react"
import { SCENARIOS, Scenario, Evaluation } from "./types"
import { PromptEditor } from "./PromptEditor"
import { AnalysisPanel } from "./AnalysisPanel"
import { Button } from "@/components/ui/Button"
import { ChevronRight, Play, RefreshCw, Terminal, AlertCircle, Sparkles } from "lucide-react"

export function PlaygroundClient() {
    // State
    const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0])
    const [prompt, setPrompt] = useState(SCENARIOS[0].initialPrompt)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

    // Handlers
    const handleScenarioChange = (scenarioId: string) => {
        const scenario = SCENARIOS.find(s => s.id === scenarioId)
        if (scenario) {
            setSelectedScenario(scenario)
            setPrompt(scenario.initialPrompt)
            setEvaluation(null)
        }
    }

    const handleRunAnalysis = async () => {
        setIsAnalyzing(true)
        setEvaluation(null)

        try {
            const response = await fetch("/api/playground/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    scenarioId: selectedScenario.id
                })
            })

            const data = await response.json()
            if (data.success) {
                setEvaluation(data.evaluation)
            }
        } catch (error) {
            console.error("Analysis failed:", error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020204] pt-24 px-4 md:px-8 pb-12 flex flex-col">
            {/* Header */}
            <div className="max-w-7xl mx-auto w-full mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-brand-purple/10 rounded-lg border border-brand-purple/20">
                        <Terminal className="h-5 w-5 text-brand-purple" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Prompt Engineering Playground</h1>
                </div>
                <p className="text-gray-400 text-sm max-w-2xl">
                    Master the art of prompting by solving real-world challenges. Get instant AI feedback on your syntax, constraints, and clarity.
                </p>
            </div>

            {/* Main Workspace */}
            <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]">

                {/* Left Panel: Scenario & Editor */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* Scenario Bar */}
                    <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Active Mission</label>
                            <select
                                className="w-full bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                                value={selectedScenario.id}
                                onChange={(e) => handleScenarioChange(e.target.value)}
                            >
                                {SCENARIOS.map(s => (
                                    <option key={s.id} value={s.id} className="bg-[#18181b] text-white">
                                        {s.title} ({s.difficulty})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${selectedScenario.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                selectedScenario.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {selectedScenario.difficulty}
                            </span>
                        </div>
                    </div>

                    {/* Task Description */}
                    <div className="glass-panel p-5 rounded-xl border border-white/10 bg-white/[0.02]">
                        <h3 className="text-sm font-bold text-white mb-2">Objective</h3>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{selectedScenario.task}</p>

                        <div className="flex gap-2 flex-wrap">
                            {selectedScenario.constraints.map((c, i) => (
                                <span key={i} className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                                    <AlertCircle className="h-3 w-3 text-brand-purple" />
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 min-h-[300px]">
                        <PromptEditor
                            value={prompt}
                            onChange={setPrompt}
                            disabled={isAnalyzing}
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-white"
                            onClick={() => setPrompt(selectedScenario.initialPrompt)}
                            disabled={isAnalyzing}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            size="lg"
                            className="bg-brand-purple hover:bg-brand-purple/90 shadow-glow"
                            onClick={handleRunAnalysis}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? "Analyzing..." : (
                                <>
                                    <Play className="h-4 w-4 mr-2 fill-current" />
                                    Run Simulation
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right Panel: Analysis */}
                <div className="lg:col-span-5 glass-panel rounded-2xl border border-white/10 bg-[#0F0F12] overflow-hidden flex flex-col shadow-2xl">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-brand-purple" />
                            Prompt DNA Analysis
                        </h3>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <AnalysisPanel evaluation={evaluation} isAnalyzing={isAnalyzing} />
                    </div>
                </div>

            </div>
        </div>
    )
}
