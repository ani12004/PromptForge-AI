"use client"

import { useState, useEffect } from "react"
import { getDashboardMetrics, getTopPrompts, DashboardMetrics, TopPrompt } from "@/app/actions/analytics"
import { motion } from "framer-motion"
import { Activity, Cpu, DollarSign, Zap, TrendingUp, ThumbsUp, Calendar } from "lucide-react"

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
    const [topPrompts, setTopPrompts] = useState<TopPrompt[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const [m, t] = await Promise.all([getDashboardMetrics(), getTopPrompts()])
                if (m.success && m.data) setMetrics(m.data)
                if (t.success && t.data) setTopPrompts(t.data)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 font-mono text-sm">
                <span className="animate-pulse">Loading Intelligence...</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8 text-gray-200 font-sans">
            <header className="mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-2">
                    Performance Analytics
                </h1>
                <p className="text-gray-500">Real-time insights on your prompt engineering efficiency.</p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <StatCard
                    label="Total Prompts"
                    value={metrics?.totalPrompts || 0}
                    icon={Activity}
                    color="text-blue-400"
                />
                <StatCard
                    label="Total Tokens"
                    value={(metrics?.totalTokens || 0).toLocaleString()}
                    icon={Cpu}
                    color="text-purple-400"
                />
                <StatCard
                    label="Est. Cost"
                    value={`$${((metrics?.totalCost || 0) / 1000000).toFixed(4)}`}
                    icon={DollarSign}
                    color="text-green-400"
                    subvalue="micro-USD basis"
                />
                <StatCard
                    label="Avg Latency"
                    value={`${metrics?.avgLatency || 0}ms`}
                    icon={Zap}
                    color="text-yellow-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Usage Chart (CSS Bar Chart) */}
                <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6 text-gray-400">
                        <TrendingUp className="w-5 h-5" />
                        <h3 className="font-semibold text-sm uppercase tracking-wider">30-Day Activity</h3>
                    </div>

                    <div className="h-64 flex items-end gap-2 px-2">
                        {metrics?.usageOverTime && metrics.usageOverTime.length > 0 ? (
                            metrics.usageOverTime.map((item, i) => {
                                const max = Math.max(...metrics.usageOverTime.map(d => d.count))
                                const height = (item.count / max) * 100
                                return (
                                    <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                            className="w-full bg-brand-purple/20 border-t border-brand-purple/50 rounded-t-sm group-hover:bg-brand-purple/40 transition-colors relative min-h-[4px]"
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                {item.count} prompts <br /> {item.date}
                                            </div>
                                        </motion.div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm italic">
                                No activity recorded yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Prompts */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6 text-gray-400">
                        <ThumbsUp className="w-5 h-5" />
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Top Rated</h3>
                    </div>

                    <div className="space-y-4">
                        {topPrompts.length > 0 ? (
                            topPrompts.map((p, i) => (
                                <div key={p.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-full">
                                            v{i + 1}
                                        </span>
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(p.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed mb-3 group-hover:text-white transition-colors">
                                        {p.content}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                                        <span>{p.tokens} TOKENS</span>
                                        <span>${(p.cost / 1000000).toFixed(5)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-600 text-sm">
                                No positive feedback yet. <br /> Start generating and voting!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color, subvalue }: any) {
    return (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
                <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-100">{value}</h2>
                {subvalue && <p className="text-[10px] text-gray-600 mt-1">{subvalue}</p>}
            </div>
        </div>
    )
}
