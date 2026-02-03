import { isAdmin } from "@/lib/admin"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isAllowed = await isAdmin()

    if (!isAllowed) {
        redirect("/")
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#050508] relative overflow-hidden selection:bg-brand-purple/30 text-white">
            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-brand-purple/20 blur-[120px] rounded-full mix-blend-screen opacity-20 pointer-events-none -translate-y-1/2" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen opacity-20 pointer-events-none translate-y-1/3" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                            Command Center
                        </h1>
                        <p className="text-gray-400 text-lg">System Overview & Management</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-emerald-400 tracking-wide uppercase">System Online</span>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}
