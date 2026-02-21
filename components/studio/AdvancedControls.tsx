"use client"

import React from "react"
import { Slider } from "@/components/ui/Slider"
import { motion } from "framer-motion"
import { Info, ChevronDown, Cpu, Globe } from "lucide-react"

export interface GranularOptions {
    provider?: "gemini"
    model?: string
    temperature: number
    topP: number
    topK: number
}

interface AdvancedControlsProps {
    options: GranularOptions
    onChange: (options: GranularOptions) => void
}

export function AdvancedControls({ options, onChange }: AdvancedControlsProps) {
    const handleChange = (key: keyof GranularOptions, value: any) => {
        onChange({ ...options, [key]: value })
    }

    const currentProvider = options.provider || "gemini"
    const currentModel = options.model || "gemini-1.5-flash"

    const PROVIDERS: Record<string, { id: string; name: string }[]> = {
        gemini: [
            { id: "gemini-3.1-pro", name: "Gemini 3.1 Pro" },
            { id: "gemini-3-pro", name: "Gemini 3 Pro" },
            { id: "gemini-3-flash", name: "Gemini 3 Flash" },
            { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
            { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
            { id: "gemini-2-pro-exp", name: "Gemini 2 Pro Exp" },
            { id: "gemini-2-flash", name: "Gemini 2 Flash" },
            { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
            { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
        ]
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0F0F0F] border-t border-white/5 p-6 rounded-b-xl space-y-6"
        >
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Intelligence Configuration</h3>
                <div className="group/tooltip relative">
                    <Info className="h-3 w-3 text-gray-500 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black border border-white/10 rounded-lg text-xs text-gray-400 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                        Adjusting these values controls which AI provider and model are used for generation, as well as creative parameters.
                    </div>
                </div>
            </div>

            {/* Provider & Model Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                {/* Provider Selector */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Globe className="w-3 h-3" /> AI Provider
                    </label>
                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 gap-1">
                        {["gemini"].map((p) => {
                            const active = currentProvider === p

                            return (
                                <button
                                    key={p}
                                    onClick={() => {
                                        const newModels = PROVIDERS[p as keyof typeof PROVIDERS]
                                        onChange({
                                            ...options,
                                            provider: p as "gemini",
                                            model: newModels[0].id
                                        })
                                    }}
                                    className={`relative flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 
                                        ${active ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                                >
                                    Google Gemini
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Model Selector */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Cpu className="w-3 h-3" /> Model Version
                    </label>
                    <div className="relative group/select">
                        <select
                            value={currentModel}
                            onChange={(e) => handleChange("model", e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white appearance-none focus:outline-none focus:border-brand-purple/50 transition-all cursor-pointer"
                        >
                            {PROVIDERS[currentProvider as keyof typeof PROVIDERS].map((m) => (
                                <option key={m.id} value={m.id} className="bg-[#0A0A0A]">{m.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none transition-transform group-hover/select:translate-y-[-40%]" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Temperature */}
                <div className="space-y-3">
                    <Slider
                        label="Temperature"
                        value={options.temperature}
                        min={0}
                        max={1}
                        step={0.1}
                        valueDisplay={options.temperature}
                        onChange={(e) => handleChange("temperature", parseFloat(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">
                        Controls randomness. Higher values (0.8+) make output more random/creative. Lower values (0.2) make it more focused/deterministic.
                    </p>
                </div>

                {/* Top P */}
                <div className="space-y-3">
                    <Slider
                        label="Top P"
                        value={options.topP}
                        min={0}
                        max={1}
                        step={0.05}
                        valueDisplay={options.topP}
                        onChange={(e) => handleChange("topP", parseFloat(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">
                        Nucleus sampling. Limits user pool to top P probability mass. 0.95 is standard for balanced generation.
                    </p>
                </div>

                {/* Top K */}
                <div className="space-y-3">
                    <Slider
                        label="Top K"
                        value={options.topK}
                        min={1}
                        max={100}
                        step={1}
                        valueDisplay={options.topK}
                        onChange={(e) => handleChange("topK", parseInt(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-500 leading-tight">
                        Limits the next token selection to the top K most likely tokens. Lower values reduce risk of hallucinations.
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
