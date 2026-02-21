"use client"

import { History, Search, Calendar, Ghost, Copy, Zap, Check } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"
import Link from "next/link"
import { Sparkles } from "lucide-react"

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

                const { data: v1Data, error: v1Error } = await supabase
                    .from('prompts')
                    .select('*')
                    .eq('user_id', userId)

                // Fetch V2 Prompts (joining with v2_prompts to filter by user_id)
                const { data: v2Data, error: v2Error } = await supabase
                    .from('v2_prompt_versions')
                    .select('id, version_tag, template, created_at, v2_prompts!inner(name, description, user_id)')
                    .eq('v2_prompts.user_id', userId)
                    .order('created_at', { ascending: false })

                const v1Mapped = (v1Data || []).map((p: any) => ({
                    ...p,
                    type: 'v1' as const,
                    display_name: 'Playground Prompt',
                    content: p.original_prompt,
                    result: p.refined_prompt,
                    sdk_id: p.current_version_id || p.id // Priority to version ID
                }))

                const v2Mapped = (v2Data || []).map(pv => ({
                    id: pv.id,
                    created_at: pv.created_at,
                    model_used: 'V2 Template',
                    detail_level: pv.version_tag,
                    display_name: (pv.v2_prompts as any)?.name || 'Saved Prompt',
                    content: pv.template,
                    result: 'Ready for SDK use',
                    type: 'v2' as const,
                    sdk_id: pv.id
                }))

                const combined = [...v1Mapped, ...v2Mapped].sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )

                setPrompts(combined)
                if (v1Error) console.error("V1 Error:", v1Error)
                if (v2Error) console.error("V2 Error:", v2Error)
            } catch (err) {
                console.error("Failed to load history", err)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [userId, getToken])

    const filteredPrompts = prompts.filter(p =>
        p.content.toLowerCase().includes(search.toLowerCase()) ||
        p.result.toLowerCase().includes(search.toLowerCase()) ||
        p.display_name?.toLowerCase().includes(search.toLowerCase())
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
                    {filteredPrompts.map((p) => (
                        <div key={p.id} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-2 text-xs font-mono text-gray-500 uppercase">
                                    <span className={`px-2 py-0.5 rounded ${p.type === 'v2' ? 'bg-brand-purple/20 text-brand-purple border border-brand-purple/20' : 'bg-white/5'}`}>
                                        {p.type === 'v2' ? 'V2' : 'V1'}
                                    </span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded">{p.model_used || "AI Model"}</span>
                                    <span className="bg-white/5 px-2 py-0.5 rounded">{p.detail_level}</span>
                                    {p.current_version_id && (
                                        <span className="bg-brand-purple/5 border border-brand-purple/10 text-brand-purple/80 px-2 py-0.5 rounded flex items-center gap-1">
                                            <Zap className="w-2.5 h-2.5" />
                                            {p.current_version_id.split('-')[0]}...
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(p.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/studio?id=${p.id}&type=${p.type}`}>
                                        <button className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all" title="Open in Studio">
                                            <Sparkles className="w-3 h-3" />
                                            USE IN STUDIO
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const id = p.sdk_id
                                            navigator.clipboard.writeText(id)
                                            setCopiedId(p.id)
                                            setTimeout(() => setCopiedId(null), 2000)
                                        }}
                                        className="flex items-center gap-1.5 px-2 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded text-[10px] font-bold text-brand-purple hover:bg-brand-purple/20 transition-all"
                                        title="Copy SDK ID"
                                    >
                                        {copiedId === p.id ? (
                                            <Check className="w-3 h-3" />
                                        ) : (
                                            <Zap className="w-3 h-3" />
                                        )}
                                        {copiedId === p.id ? "COPIED" : "COPY SDK ID"}
                                    </button>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(p.result)}
                                        className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"
                                        title="Copy Result"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 font-mono uppercase">{p.type === 'v2' ? 'Name' : 'Input'}</div>
                                    <p className="text-gray-300 line-clamp-3 text-sm">{p.display_name || p.content}</p>
                                    {p.type === 'v2' && <p className="text-gray-500 text-xs mt-1 line-clamp-1">{p.content}</p>}
                                </div>
                                <div className="relative pl-6 border-l border-white/10">
                                    <div className="text-xs text-brand-purple mb-1 font-mono uppercase">{p.type === 'v2' ? 'Status' : 'Refined Result'}</div>
                                    <p className="text-white line-clamp-3 text-sm font-mono">{p.result}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
