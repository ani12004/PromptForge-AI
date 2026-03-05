import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { generateApiKey } from '@/lib/api-keys';
import { sanitizeErrorForClient } from '@/lib/security';

export async function GET() {
    // SECURITY: Server-side authentication — userId from Clerk session, not client
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
        .from('v2_api_keys')
        .select('id, name, prefix, created_at, last_used_at, revoked')
        .eq('user_id', userId) // Uses server-verified userId
        .order('created_at', { ascending: false });

    if (error) {
        const msg = sanitizeErrorForClient(error, "API Keys GET");
        return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ keys: data });
}

export async function POST(req: Request) {
    // SECURITY: Server-side authentication — userId from Clerk session, not client
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: "Missing key name" }, { status: 400 });
        }

        const { rawKey, keyHash, prefix } = generateApiKey();

        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('v2_api_keys')
            .insert({
                user_id: userId, // Uses server-verified userId
                name,
                key_hash: keyHash,
                prefix
            })
            .select('id, name, prefix, created_at')
            .single();

        if (error) throw error;

        // Return rawKey ONLY once on creation
        return NextResponse.json({
            key: data,
            rawKey: rawKey
        });
    } catch (err: any) {
        const msg = sanitizeErrorForClient(err, "API Keys POST");
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
