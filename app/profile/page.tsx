"use client"

import { useUser, useClerk } from "@clerk/nextjs"
import { Loader2, Shield, User, LogOut, Github, Trophy } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getUserRole } from "@/app/actions/auth"
import { getBadges } from "@/app/actions/gamification"
import { Badge, UserBadge } from "@/components/playground/types"
import { BadgeGrid } from "@/components/gamification/BadgeGrid"

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser()
    const { signOut } = useClerk()
    const router = useRouter()
    const [role, setRole] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Badges State
    const [badges, setBadges] = useState<Badge[]>([])
    const [userBadges, setUserBadges] = useState<UserBadge[]>([])
    const [isLoadingBadges, setIsLoadingBadges] = useState(true)

    useEffect(() => {
        if (isLoaded && user) {
            setFirstName(user.firstName || "")
            setLastName(user.lastName || "")
            getUserRole().then(setRole)

            // Fetch Badges
            getBadges().then(data => {
                setBadges(data.badges)
                setUserBadges(data.userBadges)
                setIsLoadingBadges(false)
            })
        }
    }, [isLoaded, user])

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

    const handleUpdateProfile = async () => {
        setIsSaving(true)
        try {
            await user.update({
                firstName: firstName,
                lastName: lastName,
            })
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating profile:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsSaving(true)
        try {
            await user.setProfileImage({ file })
        } catch (error) {
            console.error("Error updating image:", error)
        } finally {
            setIsSaving(false)
        }
    }

    // Note: Clerk client SDK doesn't natively support "delete image" to revert to placeholder easily 
    // without using the <UserProfile /> component or backend API. 
    // We will focus on "Update" / "Add" as requested, effectively "replacing" the image.

    const githubAccount = user.externalAccounts.find(acc => acc.provider.includes("github"))

    return (
        <div className="min-h-screen bg-[#050508] text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Profile</h1>
                        <p className="text-gray-400">Manage your personal information & achievements</p>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">Back to Dashboard</Button>
                    </Link>
                </header>

                <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex items-start gap-6 relative z-10">
                        <div className="relative group">
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || "User"}
                                className="w-24 h-24 rounded-full border-2 border-white/10 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <label className="text-xs text-white font-medium cursor-pointer">
                                    Change
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={isSaving}
                                    />
                                </label>
                            </div>
                            {isSaving && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            {!isEditing ? (
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-semibold text-white">
                                            {user.fullName || user.username || "User"}
                                        </h2>
                                        {role === 'admin' && (
                                            <img
                                                src="/approved.png"
                                                alt="Admin"
                                                className="w-5 h-5 object-contain -mt-1"
                                                title="Administrator"
                                            />
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-2 text-brand-purple hover:bg-brand-purple/10 h-8 px-2"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                    <p className="text-gray-400">{user.primaryEmailAddress?.emailAddress}</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">First Name</label>
                                            <input
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-purple/50"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">Last Name</label>
                                            <input
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-brand-purple/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleUpdateProfile}
                                            disabled={isSaving}
                                            className="bg-brand-purple hover:bg-brand-purple/90"
                                        >
                                            {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                            Save
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {githubAccount && (
                                <div className="flex items-center gap-2 mt-3 text-sm bg-green-500/10 text-green-400 px-3 py-1 rounded-full w-fit border border-green-500/20">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Verified GitHub User: @{githubAccount.username}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Achievements & Badges
                        </h3>

                        {isLoadingBadges ? (
                            <div className="flex items-center justify-center p-12">
                                <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
                            </div>
                        ) : (
                            <BadgeGrid badges={badges} userBadges={userBadges} />
                        )}
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
