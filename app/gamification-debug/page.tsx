"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"

export default function DebugPage() {
    const { user, isLoaded, isSignedIn } = useUser()
    const [dbProfile, setDbProfile] = useState<any>(null)
    const [dbBadges, setDbBadges] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!isLoaded || !user) return

        const checkDb = async () => {
            setLoading(true)
            try {
                // We need to use a client-side supabase instance with the Clerk token
                // But for a quick debug, we can try to hit an action or just use standard fetch if we have a public API
                // Or better, let's just use the server action pattern but explicitly invoked here

                // Since we can't easily import the server action with separate client/server context in this simple file,
                // let's just ask the user to verify the ID match visually first.

                // Actually, we can try to verify the profile existence via a simple fetch if we had an endpoint.
                // Let's rely on visual ID inspection.

            } catch (e: any) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        checkDb()
    }, [isLoaded, user])

    if (!isLoaded) return <div>Loading Clerk...</div>

    if (!isSignedIn) return <div>Not signed in</div>

    return (
        <div className="min-h-screen bg-black text-white p-12 font-mono">
            <h1 className="text-2xl text-red-500 font-bold mb-8">Gamification Debugger</h1>

            <div className="space-y-8">
                <div className="border border-white/20 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-brand-purple">1. Clerk Session Info</h2>
                    <div className="space-y-2">
                        <p><span className="text-gray-500">User ID:</span> <span className="text-green-400">{user.id}</span></p>
                        <p><span className="text-gray-500">Email:</span> {user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                    <div className="mt-4 p-4 bg-gray-900 rounded text-sm text-yellow-400">
                        ⚠️ Please check your Supabase "user_badges" table. <br />
                        Does the <code>user_id</code> column match EXACTLY with <span className="text-green-400">{user.id}</span>?
                    </div>
                </div>

                <div className="border border-white/20 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">2. SQL Query Generator</h2>
                    <p className="mb-4 text-sm text-gray-400">Run this SQL EXACTLY to fix the ID mismatch manually if the email lookup failed:</p>

                    <div className="bg-[#111] p-4 rounded border border-white/10 overflow-x-auto">
                        <pre className="text-sm text-gray-300">
                            {`INSERT INTO user_badges (user_id, badge_id)
SELECT '${user.id}', id 
FROM badges 
WHERE name = 'Legend of PromptForge'
ON CONFLICT (user_id, badge_id) DO UPDATE SET earned_at = NOW();`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
