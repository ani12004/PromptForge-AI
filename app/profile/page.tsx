"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { Loader2, Shield, User, LogOut, Github } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser()
    const { signOut } = useClerk()
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push("/login")
        }
    }, [isLoaded, isSignedIn, router])

    if (!isLoaded || !isSignedIn || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
        )
    }

    const githubAccount = user.externalAccounts.find(acc => acc.provider.includes("github"))

    return (
        <div className="min-h-screen bg-[#050508] text-white p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Profile</h1>
                        <p className="text-gray-400">Manage your personal information</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">Back to Dashboard</Button>
                    </Link>
                </header>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex items-start gap-6 relative z-10">
                        <div className="relative">
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                className="w-24 h-24 rounded-full border-2 border-white/10"
                            />
                            {githubAccount && (
                                <div className="absolute -bottom-1 -right-1 bg-[#181717] p-1.5 rounded-full border border-white/10">
                                    <Github className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-1">
                            <h2 className="text-2xl font-semibold text-white">
                                {user.fullName || user.username || "User"}
                            </h2>
                            <p className="text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>

                            {githubAccount && (
                                <div className="flex items-center gap-2 mt-3 text-sm bg-green-500/10 text-green-400 px-3 py-1 rounded-full w-fit border border-green-500/20">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Verified GitHub User: @{githubAccount.username}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-brand-purple" />
                            Account Information
                        </h3>

                        <div className="grid gap-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">User ID</label>
                                <code className="text-sm font-mono text-gray-300">{user.id}</code>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-300">{user.primaryEmailAddress?.emailAddress}</span>
                                    {user.primaryEmailAddress?.verification.status === "verified" && (
                                        <span className="bg-brand-purple/20 text-brand-purple text-[10px] px-1.5 py-0.5 rounded border border-brand-purple/30">Verified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-0 h-auto px-4 py-2"
                            onClick={() => signOut(() => router.push("/"))}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
