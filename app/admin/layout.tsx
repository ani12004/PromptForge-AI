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

                {children}
            </div>
        </div>
    )
}
