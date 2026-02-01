"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Save, Check, GitBranch, Terminal } from "lucide-react"
import { useState } from "react"
import { Toast } from "@/components/ui/Toast"

interface Version {
    id: string
    content: string
    timestamp: number
    detailLevel: string
    promptId?: string
    versionId?: string
}

interface PromptResultProps {
    versions: Version[]
    isGenerating: boolean
}

export function PromptResult({ versions, isGenerating }: PromptResultProps) {
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    // Default to latest if nothing selected
    const activeVersion = selectedVersionId
        ? versions.find(v => v.id === selectedVersionId)
        : versions[0]

    const handleCopy = () => {
        if (!activeVersion) return
        navigator.clipboard.writeText(activeVersion.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!activeVersion && !isGenerating) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <div className="w-16 h-16 rounded-2xl bg-[#0F0F0F] border border-white/5 flex items-center justify-center mb-4">
                    <Terminal className="w-6 h-6 opacity-20" />
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-gray-600">System Ready</p>
                <p className="text-sm text-gray-500 mt-2">Awaiting input stream...</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            {/* Version Header */}
            {versions.length > 0 && (
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {versions.map((v, i) => (
                        <button
                            key={v.id}
                            onClick={() => setSelectedVersionId(v.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all whitespace-nowrap ${(activeVersion?.id === v.id)
                                ? "bg-white/10 border-white/20 text-white"
                                : "border-transparent text-gray-600 hover:text-gray-400 hover:bg-white/5"
                                }`}
                        >
                            <GitBranch className="w-3 h-3" />
                            <span>v{versions.length - i}.0</span>
                            {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />}
                        </button>
                    ))}
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 relative rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#0A0A0A] to-transparent z-10" />

                <div className="h-full overflow-auto p-6 font-mono text-sm leading-relaxed text-gray-300">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeVersion?.id || "empty"}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="whitespace-pre-wrap"
                        >
                            {activeVersion?.content}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Toolbar */}
                <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FeedbackButtons
                        versionId={activeVersion?.versionId}
                        promptVersionId={activeVersion?.versionId} // Ensure we pass the ID correctly
                    />
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-[#1A1A1A] border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Copy to Clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
            </div>

            {/* Meta Info */}
            {activeVersion && (
                <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                    <div className="flex gap-4">
                        <span>Depth: {activeVersion.detailLevel}</span>
                        <span>{(activeVersion.content.length / 5).toFixed(0)} Tokens</span>
                    </div>
                </div>
            )}
        </div>
    )
}

import { ThumbsUp, ThumbsDown } from "lucide-react"
import { submitFeedback } from "@/app/actions/analytics"

function FeedbackButtons({ versionId, promptVersionId }: { versionId?: string, promptVersionId?: string }) {
    const [status, setStatus] = useState<'idle' | 'up' | 'down'>('idle');
    const targetId = versionId || promptVersionId;

    if (!targetId) return null;

    const handleVote = async (score: number, type: 'up' | 'down') => {
        if (status !== 'idle') return; // Prevent double voting for now
        setStatus(type);
        try {
            await submitFeedback(targetId, score);
        } catch (e) {
            console.error(e);
            setStatus('idle'); // Revert on failure
        }
    };

    return (
        <>
            <button
                onClick={() => handleVote(1, 'up')}
                disabled={status !== 'idle'}
                className={`p-2 rounded-lg border transition-colors ${status === 'up'
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-[#1A1A1A] border-white/10 hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                title="Helpful"
            >
                <ThumbsUp className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleVote(-1, 'down')}
                disabled={status !== 'idle'}
                className={`p-2 rounded-lg border transition-colors ${status === 'down'
                    ? "bg-red-500/20 border-red-500/50 text-red-400"
                    : "bg-[#1A1A1A] border-white/10 hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                title="Not Helpful"
            >
                <ThumbsDown className="w-4 h-4" />
            </button>
        </>
    );
}
