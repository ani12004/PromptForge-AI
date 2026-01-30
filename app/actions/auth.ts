"use server"

import { auth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/lib/supabaseClient"

export async function getUserRole() {
    const { userId, getToken } = await auth()

    if (!userId) {
        return null
    }

    try {
        const token = await getToken({ template: "supabase" })
        const supabase = createClerkSupabaseClient(token)
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', userId)
            .single()

        return profile?.role || 'user'
    } catch (error) {
        console.error("Failed to fetch user role", error)
        return 'user'
    }
}
