import { Metadata } from "next"
import { DocumentationPageClient } from "@/components/marketing/DocumentationPageClient"

export const metadata: Metadata = {
    title: "Documentation - API Reference & Guide",
    description: "Complete guide and API reference for the PromptForge Engine. Learn best practices for prompt engineering.",
    openGraph: {
        title: "PromptForge Documentation | The Complete Guide",
        description: "Complete guide and API reference for the PromptForge Engine. Learn best practices.",
    }
}

export default function DocumentationPage() {
    return <DocumentationPageClient />
}
