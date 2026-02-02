import { Metadata } from "next"
import { ContactPageClient } from "@/components/marketing/ContactPageClient"

export const metadata: Metadata = {
    title: "Contact Us - Support & Sales",
    description: "Get in touch with PromptForge AI. Contact our support team or sales department for enterprise inquiries.",
    openGraph: {
        title: "Contact PromptForge | Get in Touch",
        description: "Get in touch with PromptForge AI. Contact our support team or sales department.",
    }
}

export default function ContactPage() {
    return <ContactPageClient />
}
