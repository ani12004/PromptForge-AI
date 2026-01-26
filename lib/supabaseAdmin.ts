import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with the Service Role Key.
 * THIS CLIENT BYPASSES ALL ROW LEVEL SECURITY (RLS).
 * It should ONLY be used in secure server-side contexts (e.g., Webhooks, Cron Jobs).
 */
export const createAdminClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Missing Supabase Environment Variables for Admin Client')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
