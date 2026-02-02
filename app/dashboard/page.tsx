import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"
import Link from "next/link"
import { Sparkles, ArrowRight, Zap, History, Plus, Layers, Command, Ghost, Crown } from "lucide-react"

// Add searchParams prop to the page
export default async function DashboardPage({
    searchParams,
}: {
    searchParams: { prompt?: string }
}) {
    const user = await currentUser()
    const { getToken } = await auth()

    if (!user) {
        redirect("/login")
    }

    const token = await getToken({ template: "supabase" })
    const supabase = createClerkSupabaseClient(token)

    // Sync profile on visit
    const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        full_name: user.fullName || user.username || "Unknown",
    })

    // Fetch stats
    const { count: promptCount } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Fetch recent prompts
    const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4)

    const initialPrompt = searchParams.prompt

    return (
        <div className="min-h-screen bg-[#020204] pt-24 px-6 md:px-8 relative overflow-hidden selection:bg-brand-purple/30">
            {/* Dynamic Background */}
            <div className="fixed top-0 left-0 w-[800px] h-[800px] bg-brand-purple/10 blur-[150px] rounded-full opacity-20 pointer-events-none mix-blend-screen animate-pulse-slow" />
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full opacity-20 pointer-events-none mix-blend-screen" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Greeting */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-gray-300">System Operational</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-indigo-400">{user.firstName || "Creator"}</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Your creative studio is ready. You have <span className="text-white font-semibold">{promptCount || 0}</span> prompts in your library.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/studio">
                            <button className="group relative px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-brand-purple" />
                                    New Prompt
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Featured Card: AI Studio */}
                    <Link href="/studio" className="lg:col-span-2 group">
                        <div className="h-full glass-panel p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-brand-purple/30 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                <div className="w-24 h-24 bg-brand-purple/20 rounded-full blur-2xl group-hover:bg-brand-purple/30" />
                                <Command className="h-16 w-16 text-white/10 absolute top-8 right-8 group-hover:text-brand-purple/50 transition-colors" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="h-12 w-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                        <Zap className="h-6 w-6 text-brand-purple" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Prompt Studio</h3>
                                    <p className="text-gray-400 max-w-md">Access the advanced editor with real-time analysis, variable injection, and multi-model testing.</p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-sm font-medium text-white group-hover:translate-x-2 transition-transform">
                                    Launch Studio <ArrowRight className="h-4 w-4 text-brand-purple" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Secondary Card: Stats/Quick Actions */}
                    <div className="space-y-6">
                        <Link href="/profile">
                            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all group h-full">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Ghost className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">PRO</span>
                                </div>
                                <h3 className="text-lg font-bold text-white">My Profile</h3>
                                <p className="text-sm text-gray-400 mt-1">Manage subscription and settings</p>
                            </div>
                        </Link>

                        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/[0.02] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none" />
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                    <Crown className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Pro Plan Active</h3>
                                    <p className="text-xs text-amber-400/80">Next billing: Mar 1, 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Projects Section */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <History className="h-5 w-5 text-gray-500" />
                            Recent Activity
                        </h2>
                        <Link href="/studio/history">
                            <button className="text-sm text-gray-400 hover:text-white transition-colors hover:underline underline-offset-4">
                                View Full History
                            </button>
                        </Link>
                    </div>

                    {prompts && prompts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {prompts.map((prompt: any, i: number) => (
                                <Link href={`/studio?id=${prompt.id}`} key={prompt.id}>
                                    <div className="group h-full p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-purple/20 transition-all duration-300 relative overflow-hidden flex flex-col">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-2xl" />

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{prompt.model_used || "AI Model"}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{new Date(prompt.created_at).toLocaleDateString()}</span>
                                        </div>

                                        <p className="text-gray-300 text-sm font-medium line-clamp-3 mb-4 leading-relaxed group-hover:text-white transition-colors">
                                            {prompt.refined_prompt || prompt.original_prompt}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-xs text-gray-500">{prompt.detail_level || "Standard"}</span>
                                            <ArrowRight className="h-3 w-3 text-gray-600 group-hover:text-brand-purple -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] text-center">
                            <Layers className="h-12 w-12 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No prompts created yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">Start your journey by creating your first optimized prompt in the studio.</p>
                            <Link href="/studio">
                                <button className="px-6 py-2 bg-brand-purple/10 text-brand-purple border border-brand-purple/20 rounded-xl text-sm font-medium hover:bg-brand-purple/20 transition-colors">
                                    Create First Prompt
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
