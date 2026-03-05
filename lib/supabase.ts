import { createClient, SupabaseClient } from '@supabase/supabase-js';

// SECURITY: Singleton pattern to avoid creating excessive connections
let adminClient: SupabaseClient | null = null;

// We export an admin client using the service role because the execution API 
// needs to bypass RLS to fetch prompt definitions safely on the server.
export const getSupabaseAdmin = () => {
    if (adminClient) return adminClient;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables');
    }

    adminClient = createClient(supabaseUrl, supabaseServiceKey);
    return adminClient;
};
