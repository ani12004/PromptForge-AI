import { UserButton } from "@clerk/nextjs"
import { Sparkles, History, Settings, Home, LogOut } from "lucide-react"
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
        <div className="flex h-screen bg-[#050508] overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-brand-purple/10 via-brand-dark to-brand-dark pointer-events-none z-0" />

            {/* Sidebar */}
            <aside className="w-16 md:w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col justify-between p-4 z-10 relative">
                <div className="flex flex-col gap-8">
                    {/* Logo Area */}
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 pl-2">
                        <div className="relative h-12 w-44 hidden md:block">
                            <Image
                                src="/logo_navi.png"
                                alt="PromptForge"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                        {/* Mobile Logo Fallback (Icon only) if needed, or just hide/adjust. 
                            The original code had 'hidden md:block' for text. 
                            The sidebar is 'w-16 md:w-64'. 
                            For mobile (w-16), a wide logo won't fit. 
                            I should show the icon only or a smaller version for mobile/collapsed state.
                            The user said "do same as navi bar". Navbar has full logo. 
                            But sidebar collapses. 
                            Let's check the behavior.
                            Sidebar css: `w-16 md:w-64`.
                            If w-16 (64px), we need an icon. 
                            The 'logo_navi.png' is the full text. 
                            We have 'app/icon.png' (the old favicon/logo icon). Maybe use that for mobile?
                            Or just render the icon part of logo_navi if I can crop? No.
                            I will use `app/icon.png` (which is now `app/icon.png` from previous step) for the small state? 
                            Wait, I removed `public/logo.png`. I have `app/icon.png` (renamed from `logo_icon.png`).
                            So for mobile (w-16), I should show `icon.png`.
                            For desktop (w-64), show `logo_navi.png`.
                        */}
                        <div className="relative h-10 w-10 md:hidden">
                            <Image
                                src="/icon.png"
                                alt="PromptForge"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex flex-col gap-2">
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
                        <Link href="/studio/settings" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                            <Settings className="h-5 w-5" />
                            <span className="hidden md:block font-medium">Settings</span>
                        </Link>
                    </nav>
                </div>

                {/* User Profile */}
                <div className="p-2 flex items-center gap-3 border-t border-white/5 pt-4">
                    <UserButton afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9 border-2 border-white/10"
                            }
                        }}
                    />
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-medium text-white">My Account</span>
                        <span className="text-xs text-brand-purple font-medium">{planName}</span>
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
