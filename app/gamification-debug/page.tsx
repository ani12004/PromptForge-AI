"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"

export default function DebugPage() {
    const { user, isLoaded } = useUser()
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        if (user) {
            import("@/app/actions/gamification").then(mod => {
                mod.getBadges().then(res => setData(res))
            })
        }
    }, [user])

    if (!isLoaded || !data) return <div className="p-10 text-white">Loading Debug Data...</div>

    const { badges, userBadges } = data

    // Find Fixer Apprentice specifically
    const fixerBadge = badges.find((b: any) => b.name === 'Fixer Apprentice')
    const userHasFixer = userBadges.find((ub: any) => ub.badge_id === fixerBadge?.id)

    return (
        <div className="min-h-screen bg-black text-white p-12 font-mono text-xs">
            <h1 className="text-xl text-red-500 font-bold mb-8">Gamification Deep Dive</h1>

            <div className="grid grid-cols-2 gap-8">
                <div className="border p-4 border-white/20">
                    <h2 className="text-lg font-bold text-blue-400 mb-2">My User Info</h2>
                    <p>User ID: <span className="text-green-400">{user?.id}</span></p>
                    <p>Total User Badges: {userBadges.length}</p>

                    <div className="mt-4 p-2 bg-gray-900 border border-white/10">
                        <strong>Fixer Apprentice Status:</strong><br />
                        Badge ID: {fixerBadge?.id || 'NOT FOUND'}<br />
                        Unlock Condition: {fixerBadge?.unlock_condition || 'NULL'}<br />
                        Earned: {userHasFixer ? 'YES ✅' : 'NO ❌'}
                    </div>

                    <h3 className="mt-4 font-bold">Raw User Badges</h3>
                    <pre className="mt-2 max-h-96 overflow-auto bg-black border p-2">
                        {JSON.stringify(userBadges, null, 2)}
                    </pre>
                </div>

                <div className="border p-4 border-white/20">
                    <h2 className="text-lg font-bold text-purple-400 mb-2">All Badges ({badges.length})</h2>
                    <pre className="mt-2 max-h-[800px] overflow-auto bg-black border p-2">
                        {JSON.stringify(badges, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}
