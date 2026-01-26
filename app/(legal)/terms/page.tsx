import { Accordion, AccordionItem } from "@/components/ui/Accordion"

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">Terms of Use</h1>
            <p className="text-gray-400 mb-12 leading-relaxed text-lg">
                Last updated: January 26, 2026. <br /><br />
                Please read these Terms of Use ("Terms", "Agreement") carefully before using the PromptForge AI website and services operated by PromptForge AI ("us", "we", or "our"). Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
            </p>

            <Accordion items={[
                {
                    title: "1. Acceptance of Terms",
                    content: "By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service."
                },
                {
                    title: "2. Description of Service",
                    content: "PromptForge AI provides an advanced middleware platform for prompt engineering and optimization. We utilize artificial intelligence technologies to refine and structure user inputs. You acknowledge that AI-generated content may vary in accuracy and should be verified before production use."
                },
                {
                    title: "3. User Accounts",
                    content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password."
                },
                {
                    title: "4. Intellectual Property",
                    content: "The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of PromptForge AI and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of PromptForge AI."
                },
                {
                    title: "5. Restrictions on Use",
                    content: "You agree not to use the Service: \n\n• In any way that violates any applicable national or international law or regulation.\n• To exploit, harm, or attempt to exploit or harm minors in any way.\n• To transmit any advertising or promotional material without our prior written consent.\n• To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service."
                },
                {
                    title: "6. Subscription and Billing",
                    content: "Certain parts of the Service are billed on a subscription basis ('Subscription(s)'). You will be billed in advance on a recurring and periodic basis ('Billing Cycle'). At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or PromptForge AI cancels it."
                },
                {
                    title: "7. Limitation of Liability",
                    content: "In no event shall PromptForge AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service."
                },
                {
                    title: "8. Disclaimer",
                    content: "Your use of the Service is at your sole risk. The Service is provided on an 'AS IS' and 'AS AVAILABLE' basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance."
                },
                {
                    title: "9. Termination",
                    content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease."
                },
                {
                    title: "10. Governing Law",
                    content: "These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which PromptForge AI is established, without regard to its conflict of law provisions."
                }
            ]} />
        </div>
    )
}
