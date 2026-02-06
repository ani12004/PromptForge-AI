"use server"

import { createAdminClient } from "@/lib/supabaseAdmin"
import { isAdmin } from "@/lib/admin"
// Resend import removed as we are switching to In-App Notifications

// Helper to ensure admin access
async function checkAdmin() {
    const isAllowed = await isAdmin()
    if (!isAllowed) {
        throw new Error("Unauthorized Access")
    }
}

export async function getAdminStats() {
    await checkAdmin()
    const supabase = createAdminClient()

    const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    const { count: totalMessages, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })

    const { count: unreadMessages, error: unreadError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread')

    if (usersError || messagesError || unreadError) {
        console.error("Error fetching stats", usersError, messagesError, unreadError)
        return { totalUsers: 0, totalMessages: 0, unreadMessages: 0 }
    }

    return {
        totalUsers: totalUsers || 0,
        totalMessages: totalMessages || 0,
        unreadMessages: unreadMessages || 0
    }
}

export async function getUsers() {
    await checkAdmin()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) {
        console.error("Error fetching users", error)
        return []
    }
    return data
}

export async function getContactMessages() {
    await checkAdmin()
    const supabase = createAdminClient()

    const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

    if (error) {
        console.error("Error fetching messages", error)
        return []
    }
    return data
}

// Renamed to generic "broadcast" since we now use notifications
export async function sendBroadcastNotification(prevState: any, formData: FormData) {
    await checkAdmin()
    const supabase = createAdminClient()

    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!subject || !message) {
        return { error: "Title and Message are required" }
    }

    // Insert Global Notification (user_id = null)
    const { error } = await supabase
        .from('notifications')
        .insert({
            title: subject,
            message: message,
            type: 'info',
            user_id: null // Global
        })

    if (error) {
        console.error("Failed to create notification", error)
        return { error: "Failed to publish notification" }
    }

    return {
        success: true,
        message: "Notification published to all users."
    }
}

export async function updateMessageStatus(id: string, status: 'read' | 'unread') {
    await checkAdmin()
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error("Error updating message status", error)
        return { error: "Failed to update status" }
    }

    return { success: true }
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailReply(to: string, subject: string, message: string, replyContent: string) {
    await checkAdmin()

    if (!process.env.RESEND_API_KEY) {
        return { error: "RESEND_API_KEY is missing" }
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'PromptForge Studio <onboarding@resend.dev>', // Using testing domain as user has no custom domain
            to: [to],
            // Ensure subject starts with Re: if not present
            subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Inter', sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181b; border: 1px solid #333; border-radius: 12px; margin-top: 40px; }
                    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #333; margin-bottom: 20px; }
                    .logo { height: 40px; }
                    .content { font-size: 16px; line-height: 1.6; color: #e5e7eb; }
                    .quote { margin-top: 20px; padding: 15px; background-color: #27272a; border-left: 4px solid #8b5cf6; color: #9ca3af; font-size: 14px; border-radius: 4px; }
                    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #333; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                         <!-- Assuming public folder is served at root domain. If not, user needs updates -->
                        <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://promptforge.ai'}/logo_navi.png" alt="PromptForge Studio" class="logo" />
                    </div>
                    
                    <div class="content">
                        ${replyContent.replace(/\n/g, '<br/>')}
                    </div>

                    <div class="quote">
                        <strong>On ${new Date().toLocaleDateString()}, you wrote:</strong><br/>
                        ${message}
                    </div>

                    <div class="footer">
                        &copy; ${new Date().getFullYear()} PromptForge Studio. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            `
        });

        if (error) {
            console.error("Resend Error:", error);
            return { error: error.message };
        }

        return { success: true };
    } catch (e) {
        console.error("Failed to send email:", e);
        return { error: "Internal Server Error" };
    }
}

export async function updateUserSubscription(userId: string, tier: 'free' | 'pro') {
    await checkAdmin()
    const supabase = createAdminClient()

    const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: tier })
        .eq('id', userId)

    if (error) {
        console.error("Error updating subscription", error)
        return { error: "Failed to update subscription" }
    }

    return { success: true }
}

export async function banUser(userId: string) {
    await checkAdmin()
    const supabase = createAdminClient()

    // Ban for 100 years (approx)
    const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: "876000h"
    })

    if (error) {
        console.error("Error banning user", error)
        return { error: "Failed to ban user" }
    }

    return { success: true }
}

export async function deleteUser(userId: string) {
    await checkAdmin()
    const supabase = createAdminClient()

    // Explicitly delete from profiles first to ensure UI updates immediately
    // ignoring error as the user might not have a profile or it might cascade
    await supabase.from('profiles').delete().eq('id', userId)

    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
        console.error("Error deleting user", error)
        return { error: "Failed to delete user" }
    }

    return { success: true }
}
