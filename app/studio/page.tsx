"use client"
import { useState, useEffect } from "react"
import { refinePrompt } from "@/app/actions/generate"
import { Toast, ToastType } from "@/components/ui/Toast"
import { PromptEditor } from "@/components/studio/PromptEditor"
import { PromptResult } from "@/components/studio/PromptResult"
import { CognitiveStatus } from "@/components/studio/CognitiveStatus"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface Version {
    id: string
    content: string
    timestamp: number
    detailLevel: string
}

export default function StudioPage() {
    // Core State
    const [prompt, setPrompt] = useState("")
    const [detailLevel, setDetailLevel] = useState("Medium")
    const [isGenerating, setIsGenerating] = useState(false)
    const [versions, setVersions] = useState<Version[]>([])

    // Toast State
    const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
        msg: "", type: "success", visible: false
    })

    const showToast = (msg: string, type: ToastType = "success") => {
        setToast({ msg, type, visible: true })
    }

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        // 1. Client-Side Offline Check (Strict)
        if (typeof navigator !== "undefined" && !navigator.onLine) {
            showToast("Network Error: You appear to be offline. Please check your connection.", "error")
            return
        }

        setIsGenerating(true)
        const startTime = Date.now()

        // 2. Timeout Controller (45s Safe Limit for Netlify/Gemini)
        // Differentiates "Slow/Hang" from "Error"
        const TIMEOUT_MS = 45000
        const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT_EXCEEDED")), TIMEOUT_MS)
        )

        // UX: Artificial "Cognitive Delay" (min 2.5s) to allow reading the status steps
        const minTime = new Promise(resolve => setTimeout(resolve, 2500))

        try {
            // Race: Action vs Timeout
            const actionPromise = refinePrompt(prompt, detailLevel)

            const [_, result] = await Promise.all([
                minTime,
                Promise.race([actionPromise, timeoutPromise])
            ])

            if (result && result.startsWith("Error:")) {
                // 3. System-Responsible Error Mapping
                const rawError = result.replace("Error: ", "")
                const elapsed = Date.now() - startTime

                let finalMessage = "System Error: Unable to complete enhancement."

                if (rawError.includes("failed to fetch") || rawError.includes("Connection failed")) {
                    // Heuristic: If it failed FAST (< 2s), likely network/DNS. If SLOW, likely timeout/overload.
                    if (elapsed < 2000) {
                        finalMessage = "Connection Error: Unable to reach the AI engine."
                    } else {
                        finalMessage = "The enhancement engine didn’t respond in time. Please try again."
                    }
                } else if (rawError.includes("API Key")) {
                    finalMessage = "Configuration Error: System credentials missing."
                } else if (rawError.includes("Model") || rawError.includes("Overloaded")) {
                    finalMessage = "Capacity Warning: The AI service is momentarily busy."
                }

                showToast(finalMessage, "error")

            } else if (result) {
                // Success Path
                const newVersion: Version = {
                    id: crypto.randomUUID(),
                    content: result,
                    timestamp: Date.now(),
                    detailLevel
                }
                setVersions(prev => [newVersion, ...prev])
                showToast("Enhancement complete. Logic optimized.")
            } else {
                showToast("System Error: The AI engine returned an empty response.", "error")
            }

        } catch (error: any) {
            // 4. Handle Client-Side Crashes / Timeouts
            console.error("Studio Generation Logic Error:", error)

            let userMessage = "Unexpected Error: The system encountered a state discrepancy."

            if (error.message === "TIMEOUT_EXCEEDED") {
                userMessage = "Operation Timeout: The AI service is momentarily unavailable."
            } else if (error.message?.includes("fetch")) {
                userMessage = "Network Interruption: Connection to the server was lost."
            }

            // Always preserve input
            showToast(userMessage + " Your input is preserved.", "error")

        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="h-full flex flex-col lg:flex-row bg-transparent overflow-hidden text-gray-200 font-sans selection:bg-brand-purple/30 selection:text-white">
            <Toast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            {/* LEFT PANEL: Construction Surface */}
            <div className={`flex-1 flex flex-col min-h-[50vh] lg:min-h-auto border-b lg:border-b-0 lg:border-r border-white/5 relative z-10 transition-all duration-500 ease-in-out ${isGenerating ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}>
                <div className="flex-1 p-6 md:p-8 flex flex-col max-w-4xl mx-auto w-full">
                    <header className="mb-4">
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Prompt Studio</span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-brand-purple/20 border border-brand-purple/30 text-brand-purple uppercase shadow-glow-sm">PRO</span>
                        </h1>
                    </header>

                    <div className="flex-1 h-full min-h-0">
                        <PromptEditor
                            prompt={prompt}
                            setPrompt={setPrompt}
                            detailLevel={detailLevel}
                            setDetailLevel={setDetailLevel}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Intelligence & Results */}
            <div className="flex-1 bg-black/20 backdrop-blur-sm flex flex-col relative z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-purple/10 via-transparent to-transparent opacity-60" />

                <div className="flex-1 p-6 h-full overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20"
                            >
                                <CognitiveStatus />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full"
                            >
                                <PromptResult
                                    versions={versions}
                                    isGenerating={isGenerating}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
