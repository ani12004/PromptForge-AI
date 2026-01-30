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
