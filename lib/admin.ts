import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabaseAdmin"

export async function isAdmin() {
    const { userId } = await auth()

    if (!userId) {
        return false
    }

    const supabase = createAdminClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single()

    return profile?.role === 'admin'
}
