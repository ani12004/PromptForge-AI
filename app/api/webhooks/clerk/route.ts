import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    // Sync to Supabase using Secure Admin Client
    const supabase = createAdminClient();

    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url, ...attributes } = evt.data;

        const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : null;
        const fullName = `${first_name || ''} ${last_name || ''}`.trim();

        const { error } = await supabase
            .from('profiles')
            .upsert({
                user_id: id,
                email: email,
                full_name: fullName,
                avatar_url: image_url,
            })

        if (error) console.error('Supabase upsert error:', error);
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('user_id', id);

        if (error) console.error('Supabase delete error:', error);
    }

    return NextResponse.json({ success: true, message: 'Webhook received' })
}
