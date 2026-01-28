"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { Settings, User, Key, Shield, Monitor, LogOut, Github, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function UniversalSettingsPage() {
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
            <div className="flex h-screen items-center justify-center bg-[#050508]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
        )
    }

    const githubAccount = user.externalAccounts.find(acc => acc.provider.includes("github"))

    return (
        <div className="min-h-screen bg-[#050508] text-white p-8 pt-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between pb-8 border-b border-white/5">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Settings className="h-8 w-8 text-brand-purple" />
                            Settings
                        </h1>
                        <p className="text-gray-400">Manage your profile, account, and studio preferences.</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">Back to Dashboard</Button>
                    </Link>
                </header>

                {/* Profile Section */}
                <section className="grid md:grid-cols-[240px_1fr] gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-400" />
                            Profile
                        </h2>
                        <p className="text-sm text-gray-400">Your public profile and personal details.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="flex items-start gap-6">
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                className="w-20 h-20 rounded-full border-2 border-white/10"
                            />
                            <div className="flex-1 space-y-1">
                                <h3 className="text-xl font-semibold text-white">
                                    {user.fullName || user.username || "User"}
                                </h3>
                                <p className="text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                        ID: <code className="font-mono">{user.id}</code>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Studio Preferences */}
                <section className="grid md:grid-cols-[240px_1fr] gap-8 pt-6 border-t border-white/5">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-purple-400" />
                            Studio
                        </h2>
                        <p className="text-sm text-gray-400">Customize your workspace and API keys.</p>
                    </div>
                    <div className="space-y-6">
                        {/* Theme */}
                        <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                            <div className="flex items-center justify-between mb-2">
                                <label className="font-medium text-white">Theme</label>
                                <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-brand-purple">
                                    <option>Dark (Default)</option>
                                    <option>Midnight</option>
                                    <option>OLED</option>
                                </select>
                            </div>
                            <p className="text-sm text-gray-500">Choose the look and feel of your studio interface.</p>
                        </div>

                        {/* API Keys */}
                        <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-2 mb-4">
                                <Key className="h-4 w-4 text-yellow-400" />
                                <h3 className="font-medium text-white">API Configuration</h3>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">OpenAI API Key (Optional)</label>
                                <input
                                    type="password"
                                    placeholder="sk-..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-brand-purple placeholder:text-gray-700 font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-2">Used for running improved models directly from your account.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Connected Accounts */}
                <section className="grid md:grid-cols-[240px_1fr] gap-8 pt-6 border-t border-white/5">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-400" />
                            Connections
                        </h2>
                        <p className="text-sm text-gray-400">Manage external account linkages.</p>
                    </div>
                    <div className="glass-panel p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#181717] p-2 rounded-lg border border-white/10">
                                    <Github className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                        GitHub
                                        {githubAccount && (
                                            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 uppercase tracking-wide">Connected</span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {githubAccount
                                            ? `Connected as @${githubAccount.username}`
                                            : "Link your GitHub account for easy access."}
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary" className="bg-white/5 hover:bg-white/10 text-white border-white/10">
                                {githubAccount ? "Manage" : "Connect"}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="grid md:grid-cols-[240px_1fr] gap-8 pt-6 border-t border-white/5">
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-red-400 flex items-center gap-2">
                            Danger Zone
                        </h2>
                    </div>
                    <div>
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20"
                            onClick={() => signOut(() => router.push("/"))}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out of PromptForge
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    )
}
