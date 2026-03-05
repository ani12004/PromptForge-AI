import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sanitizeErrorForClient } from '@/lib/security';

export async function POST(req: Request) {
    // SECURITY: Server-side authentication — userId from Clerk session, not client
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { keyId } = await req.json();
        if (!keyId) {
            return NextResponse.json({ error: "Missing keyId" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();
        const { error } = await supabase
            .from('v2_api_keys')
            .update({ revoked: true })
            .eq('id', keyId)
            .eq('user_id', userId); // Uses server-verified userId

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        const msg = sanitizeErrorForClient(err, "API Keys Revoke");
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
