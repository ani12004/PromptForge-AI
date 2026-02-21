"use client"

import { History, Search, Calendar, Ghost, Copy, Zap, Check } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"

export default function HistoryPage() {
    const { getToken, userId } = useAuth()
    const [prompts, setPrompts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userId) return
            try {
                const token = await getToken({ template: 'supabase' })
                const supabase = createClerkSupabaseClient(token)

                const { data, error } = await supabase
                    .from('prompts')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })

                if (data) setPrompts(data)
                if (error) console.error("Error fetching history:", error)
            } catch (err) {
                console.error("Failed to load history", err)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [userId, getToken])

    const filteredPrompts = prompts.filter(p =>
        p.original_prompt.toLowerCase().includes(search.toLowerCase()) ||
        p.refined_prompt.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="h-full flex flex-col p-8 max-w-5xl mx-auto overflow-y-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <History className="h-8 w-8 text-brand-purple" />
                    Prompt History
                </h1>
                <p className="text-gray-400">View and manage your past prompt generations and iterations.</p>
            </header>

            {/* Search Bar */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search history..."
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple/50 transition-colors"
                />
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-2 border-brand-purple border-t-transparent rounded-full" />
                </div>
            ) : filteredPrompts.length === 0 ? (
                /* Empty State */
                <div className="flex-1 rounded-2xl border border-white/5 bg-white/5 border-dashed flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Ghost className="h-10 w-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No history yet</h3>
                    <p className="text-gray-400 max-w-sm mb-8">
                        Your generated prompts and their versions will appear here automatically.
                    </p>
                </div>
            ) : (
                /* List View */
                <div className="space-y-4 pb-12">
                    {filteredPrompts.map((prompt) => (
                        <div key={prompt.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-2 text-xs font-mono text-gray-500 uppercase">
                                    <span className="bg-white/5 px-2 py-0.5 rounded">{prompt.model_used || "AI Model"}</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded">{prompt.detail_level}</span>
                                    {prompt.current_version_id && (
                                        <span className="bg-brand-purple/5 border border-brand-purple/10 text-brand-purple/80 px-2 py-0.5 rounded flex items-center gap-1">
                                            <Zap className="w-2.5 h-2.5" />
                                            {prompt.current_version_id.split('-')[0]}...
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(prompt.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            const id = prompt.current_version_id || prompt.id
                                            navigator.clipboard.writeText(id)
                                            setCopiedId(id)
                                            setTimeout(() => setCopiedId(null), 2000)
                                        }}
                                        className="flex items-center gap-1.5 px-2 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded text-[10px] font-bold text-brand-purple hover:bg-brand-purple/20 transition-all"
                                        title="Copy SDK ID"
                                    >
                                        {copiedId === (prompt.current_version_id || prompt.id) ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <Zap className="w-3 h-3" />
                                        )}
                                        {copiedId === (prompt.current_version_id || prompt.id) ? "COPIED" : "COPY SDK ID"}
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(prompt.refined_prompt)}
                                        className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                        title="Copy Refined Result"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 font-mono uppercase">Input</div>
                                    <p className="text-gray-300 line-clamp-3 text-sm">{prompt.original_prompt}</p>
                                </div>
                                <div className="relative pl-6 border-l border-white/10">
                                    <div className="text-xs text-brand-purple mb-1 font-mono uppercase">Refined Result</div>
                                    <p className="text-white line-clamp-3 text-sm font-mono">{prompt.refined_prompt}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
