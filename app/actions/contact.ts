"use server"

import { Resend } from "resend"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabaseAdmin"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormState = {
    success?: boolean
    error?: string
    validationErrors?: {
        name?: string[]
        email?: string[]
        subject?: string[]
        message?: string[]
    }
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    }

    const validatedFields = contactFormSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            validationErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { name, email, subject, message } = validatedFields.data
    const contactEmail = process.env.CONTACT_EMAIL

    if (!contactEmail) {
        console.error("CONTACT_EMAIL environment variable is not set")
        return { error: "Configuration error. Please try again later." }
    }

    try {
        // Save to Supabase
        const supabase = createAdminClient()
        const { error: dbError } = await supabase
            .from('contact_messages')
            .insert({
                name,
                email,
                subject,
                message,
                status: 'unread',
            })

        if (dbError) {
            console.error("Failed to save contact message to DB:", dbError)
            // We continue to send the email even if DB save fails, or should we return error?
            // User likely wants the email more. We will log it.
        }

        // Read the logo file
        const fs = await import("fs")
        const path = await import("path")
        const logoPath = path.join(process.cwd(), "public", "logo_navi.png")
        const logoBuffer = await fs.promises.readFile(logoPath)
        const logoBase64 = logoBuffer.toString("base64")

        const { error } = await resend.emails.send({
            from: "PromptForge Contact <onboarding@resend.dev>",
            to: contactEmail,
            subject: `[Contact Form] ${subject}`,
            replyTo: email,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #e4e4e7; background-color: #050508; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: #18181b; padding: 40px; border-radius: 16px; border: 1px solid #27272a; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1); }
                        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #27272a; }
                        .logo { max-height: 40px; width: auto; }
                        .field { margin-bottom: 20px; }
                        .label { font-weight: 600; color: #a1a1aa; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
                        .value { font-size: 1.1em; color: #ffffff; }
                        .message-box { background: #27272a; padding: 20px; border-radius: 12px; border: 1px solid #3f3f46; margin-top: 5px; color: #ffffff; }
                        .footer { margin-top: 40px; pt: 20px; border-top: 1px solid #27272a; text-align: center; color: #52525b; font-size: 0.8em; }
                        .highlight { color: #8b5cf6; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="cid:logo_navi" alt="PromptForge Studio" class="logo" />
                        </div>
                        
                        <div class="field">
                            <div class="label">Subject</div>
                            <div class="value">${subject}</div>
                        </div>

                        <div class="field">
                            <div class="label">Active User</div>
                            <div class="value">${name} <span style="color: #71717a; font-size: 0.9em;">(${email})</span></div>
                        </div>

                        <div class="field">
                            <div class="label">Message</div>
                            <div class="message-box">
                                ${message.replace(/\n/g, "<br>")}
                            </div>
                        </div>

                        <div class="footer">
                            <p>Sent via PromptForge Studio Contact Form</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            attachments: [
                {
                    filename: 'logo_navi.png',
                    content: logoBase64,
                    contentId: 'logo_navi',
                },
            ],
        })

        if (error) {
            console.error("Resend error:", error)
            return { error: "Failed to send message. Please try again." }
        }

        return { success: true }
    } catch (error) {
        console.error("Server action error:", error)
        return { error: "Something went wrong. Please try again." }
    }
}
