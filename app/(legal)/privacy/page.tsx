import { Accordion, AccordionItem } from "@/components/ui/Accordion"

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">Privacy Policy</h1>
            <p className="text-gray-400 mb-12 leading-relaxed text-lg">
                Last updated: January 26, 2026. <br /><br />
                At PromptForge Studio, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclosure, and safeguard your data when you visit our website and use our AI middleware services.
            </p>

            <Accordion items={[
                {
                    title: "1. Information We Collect",
                    content: "We collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with support. This includes:\n\n• Personal Indentification Information: Name, email address, and billing information.\n• Account Credentials: Passwords and security tokens (encrypted).\n• User Content: Prompts, inputs, and other data you submit to our AI processing engine.\n• Usage Data: Information about how you interact with our service, including IP addresses, browser types, and access times."
                },
                {
                    title: "2. How We Use Your Information",
                    content: "We use the collected information for specific purposes:\n\n• Service Provision: To operate, maintain, and provide the features of PromptForge Studio.\n• Personalization: To tailor the experience and improve our AI prompt engineering algorithms based on usage patterns.\n• Communication: To send you service-related notices, updates, and security alerts.\n• Analytics: To monitor and analyze trends, usage, and activities in connection with our Service."
                },
                {
                    title: "3. Data Sharing and Disclosure",
                    content: "We do not sell your personal data. We may share information in the following circumstances:\n\n• Service Providers: With third-party vendors who perform services on our behalf (e.g., payment processing via Stripe/LemonSqueezy, authentication via Clerk, database hosting via Supabase).\n• Legal Compliance: If required by law or in response to valid requests by public authorities.\n• Business Transfers: In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business."
                },
                {
                    title: "4. Data Security",
                    content: "We implement robust security measures to protect your data, including:\n\n• Encryption: All sensitive data (API keys, passwords) is encrypted at rest and in transit.\n• Access Controls: Strict role-based access controls (RBAC) and Row Level Security (RLS) within our databases.\n• Regular Audits: We conduct regular security assessments.\n\nHowever, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security."
                },
                {
                    title: "5. Your Data Rights",
                    content: "Depending on your location, you may have the following rights:\n\n• Access: The right to request copies of your personal data.\n• Rectification: The right to request correction of inaccurate information.\n• Erasure: The right to request deletion of your personal data ('Right to be Forgotten').\n• Portability: The right to request the transfer of your data to another organization."
                },
                {
                    title: "6. Children's Privacy",
                    content: "Our Service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it."
                },
                {
                    title: "7. Changes to This Policy",
                    content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. You are advised to review this Privacy Policy periodically for any changes."
                },
                {
                    title: "8. Contact Us",
                    content: "If you have any questions about this Privacy Policy, please contact us at: legal@promptforge.ai"
                }
            ]} />
        </div>
    )
}
