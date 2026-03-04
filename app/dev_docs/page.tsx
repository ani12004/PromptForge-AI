import type { Metadata } from "next"
import { DevDocsClient } from "@/components/marketing/DevDocsClient"

export const metadata: Metadata = {
    title: "Developer Documentation",
    description: "Complete internal developer documentation for PromptForge Studio.",
    robots: { index: false, follow: false },
}

export default function DevDocsPage() {
    return <DevDocsClient />
}
