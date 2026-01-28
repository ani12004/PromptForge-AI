import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"

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

    const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        full_name: user.fullName || user.username || "Unknown",
    })

    const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

    const initialPrompt = searchParams.prompt

    return (
        <div className="min-h-screen bg-[#050508] pt-24 px-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-30 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, <span className="text-white font-medium">{user.firstName || "Forger"}</span></p>

                        <div className="mt-4 flex items-center gap-3">
                            {!error ? (
                                <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <span className="text-xs font-medium text-green-500">System Connected</span>
                                </div>
                            ) : (
                                <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                    <span className="text-xs font-medium text-red-500">Sync Error</span>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {initialPrompt ? (
                    <div className="mb-10 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-6 w-1 rounded bg-brand-purple" />
                            <h2 className="text-xl font-semibold text-white">Draft Prompt</h2>
                        </div>
                        <div className="glass-panel p-8 rounded-2xl border border-brand-purple/30 bg-brand-purple/[0.03] shadow-glow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <p className="text-lg text-white mb-6 leading-relaxed relative z-10">{initialPrompt}</p>
                            <div className="flex gap-3 relative z-10">
                                <button className="px-5 py-2.5 bg-brand-purple text-white rounded-xl text-sm font-medium hover:bg-brand-purple/90 shadow-lg shadow-purple-900/20 transition-all hover:-translate-y-0.5">
                                    Analyze with Gemini
                                </button>
                                <button className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 backdrop-blur-md transition-all">
                                    Refine Logic
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02] h-64 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/[0.04] transition-colors group">
                        <div className="p-4 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <span className="text-3xl filter drop-shadow-lg">🗄️</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Supabase Profile</h3>
                            <div className="mt-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 mx-auto w-fit">
                                <p className="text-xs text-gray-400 font-mono">{user.id.slice(0, 8)}...</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02] h-64 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/[0.04] transition-colors group">
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <span className="text-3xl filter drop-shadow-lg">🤖</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">AI Engine</h3>
                            <div className="mt-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto w-fit">
                                <p className="text-xs text-blue-400 font-medium">Gemini Pro Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-dashed border-white/10 bg-transparent h-64 flex flex-col items-center justify-center text-center gap-4 hover:border-white/20 hover:bg-white/[0.01] transition-all cursor-pointer">
                        <div className="p-3 bg-white/5 rounded-full">
                            <span className="text-xl text-gray-500">+</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">New Project</p>
                    </div>
                </div>

                {/* Recent Prompts Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Prompts</h2>
                        <a href="/studio/history" className="text-sm text-brand-purple hover:text-white transition-colors">View All</a>
                    </div>

                    {prompts && prompts.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-3">
                            {prompts.map((prompt: any) => (
                                <div key={prompt.id} className="glass-panel p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all group group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-purple/5 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-start justify-between mb-3 relative z-10">
                                        <div className="px-2 py-1 rounded bg-white/5 text-[10px] uppercase font-mono text-gray-400 border border-white/5">
                                            {prompt.model_used || "AI"}
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(prompt.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed relative z-10">
                                        {prompt.refined_prompt || prompt.original_prompt}
                                    </p>
                                    <div className="flex items-center gap-2 mt-auto relative z-10">
                                        <div className="h-1 w-1 rounded-full bg-brand-purple" />
                                        <span className="text-xs text-gray-500 font-medium">{prompt.detail_level}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 rounded-2xl border border-white/5 bg-white/[0.01] border-dashed">
                            <p className="text-gray-500">No prompts generated yet. Start creating!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
