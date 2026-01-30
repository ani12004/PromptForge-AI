import { UserMenu } from "@/components/layout/UserMenu"
import { Sparkles, History, Settings, Home, LogOut, Bell } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"

export default async function StudioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { userId, getToken } = await auth();
    let planName = "Free Plan";

    if (userId) {
        try {
            const token = await getToken({ template: "supabase" });
            const supabase = createClerkSupabaseClient(token);
            const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_tier')
                .eq('user_id', userId)
                .single();

            if (profile?.subscription_tier === 'pro') {
                planName = "Pro Plan";
            }
        } catch (error) {
            console.error("Failed to fetch plan:", error);
        }
    }

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-[#050508] overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-brand-dark to-brand-dark pointer-events-none z-0" />

            {/* Sidebar */}
            <aside className="w-16 md:w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col justify-between p-4 z-20 relative">
                <div className="flex flex-col gap-8">
                    {/* Nav Items */}
                    <nav className="flex flex-col gap-2 pt-4">
                        <Link href="/studio" className="flex items-center gap-3 p-3 rounded-xl bg-brand-purple/10 text-brand-purple border border-brand-purple/20 shadow-glow-sm">
                            <Sparkles className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Editor</span>
                        </Link>
                        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <Home className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Dashboard</span>
                        </Link>
                        <Link href="/studio/history" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <History className="h-5 w-5" />
                            <span className="hidden md:block font-medium">History</span>
                        </Link>
                        <Link href="/settings" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <Settings className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Settings</span>
                        </Link>
                        <Link href="/studio/notifications" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <Bell className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Notifications</span>
                        </Link>
                    </nav>
                </div>

                {/* User Profile */}
                <div className="p-2 flex items-center gap-3 border-t border-white/5 pt-4">
                    <div className="w-full">
                        <UserMenu direction="right" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-10 w-full">
                {children}
            </main>
        </div>
    )
}
