"use client"
import { useState, useEffect } from "react"
import { refinePrompt } from "@/app/actions/generate"
import { Toast, ToastType } from "@/components/ui/Toast"
import { PromptEditor } from "@/components/studio/PromptEditor"
import { PromptResult } from "@/components/studio/PromptResult"
import { CognitiveStatus } from "@/components/studio/CognitiveStatus"
import { motion, AnimatePresence } from "framer-motion"
import { GranularOptions } from "@/components/studio/AdvancedControls"
import { VersionComparator } from "@/components/studio/VersionComparator"
import { UpgradeModal } from "@/components/studio/UpgradeModal"
import { getUserSubscription } from "@/app/actions/subscription"
import { Sparkles, Trophy } from "lucide-react"
import { auditPrompt, type AuditResult } from "@/app/actions/audit"
import { AuditModal } from "@/components/studio/AuditModal"
import { SavePromptModal } from "@/components/studio/SavePromptModal"
import { useSearchParams } from "next/navigation"
import { getPrompt } from "@/app/actions/save-prompt"

// Types
interface Version {
    id: string
    content: string
    timestamp: number
    detailLevel: string
    promptId?: string
    versionId?: string
}

export default function StudioPage() {
    // Core State
    const [prompt, setPrompt] = useState("")
    const [detailLevel, setDetailLevel] = useState("Medium")
    const [isGenerating, setIsGenerating] = useState(false)
    const [versions, setVersions] = useState<Version[]>([])

    // Granular Options State
    const [granularOptions, setGranularOptions] = useState<GranularOptions>({
        provider: "gemini",
        model: "gemini-1.5-flash",
        temperature: 0.7,
        topP: 0.95,
        topK: 40
    })

    const [showComparator, setShowComparator] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null)

    const searchParams = useSearchParams()

    useEffect(() => {
        getUserSubscription().then(setSubscriptionTier)

        // Handle prompt loading from history
        const loadId = searchParams.get('id')
        const loadType = searchParams.get('type') as 'v1' | 'v2' | null

        if (loadId) {
            getPrompt(loadId, loadType || 'v1').then(res => {
                if (res.success && res.content) {
                    setPrompt(res.content)
                    showToast(`Loaded prompt: ${res.metadata?.name || 'from history'}`)
                }
            })
        }
    }, [searchParams])

    const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
        msg: "", type: "success", visible: false
    })

    const [isAuditing, setIsAuditing] = useState(false)
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
    const [showAuditModal, setShowAuditModal] = useState(false)

    // Save Prompt State
    const [showSaveModal, setShowSaveModal] = useState(false)

    const showToast = (msg: string, type: ToastType = "success") => {
        setToast({ msg, type, visible: true })
    }

    const handleAudit = async () => {
        if (!prompt.trim() || prompt.length < 10) return;

        setIsAuditing(true);
        try {
            const result = await auditPrompt(prompt);
            if (result.success && result.data) {
                setAuditResult(result.data);
                setShowAuditModal(true);
            } else {
                showToast(result.error || "Audit failed", "error");
            }
        } catch (e) {
            showToast("System Error during audit", "error");
        } finally {
            setIsAuditing(false);
        }
    }

    const handleGenerate = async () => {
        if (!prompt.trim()) return

        if (prompt.trim().length < 10) {
            showToast("Prompt too short: Please enter at least 10 characters.", "error")
            return
        }

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
            const actionPromise = refinePrompt(prompt, detailLevel, granularOptions)

            const [_, response] = await Promise.all([
                minTime,
                Promise.race([actionPromise, timeoutPromise])
            ])

            if (response && !response.success) {
                // 3. System-Responsible Error Mapping
                const rawError = response.error || "Unknown Error"
                const elapsed = Date.now() - startTime

                let finalMessage = "System Error: Unable to complete enhancement."

                if (rawError.includes("Limit Reached")) {
                    setShowUpgradeModal(true)
                    setIsGenerating(false)
                    return
                }

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
                } else {
                    finalMessage = rawError
                }

                showToast(finalMessage, "error")

            } else if (response && response.success && response.content) {
                // Success Path
                const newVersion: Version = {
                    id: crypto.randomUUID(),
                    content: response.content,
                    timestamp: Date.now(),
                    detailLevel,
                    promptId: response.promptId,
                    versionId: response.versionId
                }
                setVersions(prev => [newVersion, ...prev])
                showToast("Enhancement complete. Logic optimized.")
            } else {
                showToast("System Error: The AI engine returned an empty response.", "error")
            }

        } catch (error: any) {
            // 4. Handle Client-Side Crashes / Timeouts
            console.error("Studio Generation Logic Error:", error)

            let userMessage = "Unexpected Error: " + (error.message || "The system encountered a state discrepancy.")

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
            <div className={`flex-1 flex flex-col min-h-[50vh] lg:min-h-auto relative z-10 transition-all duration-500 ease-in-out ${isGenerating ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}>
                <div className="flex-1 p-6 flex flex-col w-full h-full max-w-5xl mx-auto">

                    {/* Simplified Header */}
                    <header className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white tracking-tight">Studio</h1>
                            {subscriptionTier === 'pro' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-brand-purple/20 text-brand-purple uppercase border border-brand-purple/20">PRO</span>
                            )}
                        </div>
                        <button
                            onClick={() => setShowComparator(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Trophy className="w-3 h-3" />
                            Benchmark
                        </button>
                    </header>

                    <div className="flex-1 min-h-0">
                        <PromptEditor
                            prompt={prompt}
                            setPrompt={setPrompt}
                            detailLevel={detailLevel}
                            setDetailLevel={setDetailLevel}
                            onGenerate={handleGenerate}
                            isGenerating={isGenerating}
                            granularOptions={granularOptions}
                            setGranularOptions={setGranularOptions}
                            onAudit={handleAudit}
                            isAuditing={isAuditing}
                            onSaveClick={() => setShowSaveModal(true)}
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
            {/* A/B Testing Overlay */}
            {showComparator && (
                <VersionComparator
                    versions={versions}
                    onClose={() => setShowComparator(false)}
                />
            )}

            {/* Audit Modal */}
            <AuditModal
                isOpen={showAuditModal}
                onClose={() => setShowAuditModal(false)}
                result={auditResult}
            />

            {/* Save Prompt Modal */}
            <SavePromptModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                template={prompt}
                onSaved={(promptId, versionId, name) => {
                    showToast(`Successfully saved prompt: ${name}`)
                }}
            />

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </div>
    )
}
