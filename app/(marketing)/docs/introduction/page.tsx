import { Metadata } from "next"
import { DocumentationLayout } from "@/components/marketing/DocumentationLayout"
import { IntroductionDocumentationContent } from "@/components/marketing/IntroductionDocumentationContent"

export const metadata: Metadata = {
    title: "Introduction - PromptForge Documentation",
    description: "Learn the core concepts of PromptForge: Variable Injection, Model Routing, and Semantic Caching.",
}

export default function IntroDocsPage() {
    const navItems = [
        { name: "Prerequisites", href: "#basics-prereqs" },
        { name: "Core Concepts", href: "#basics-concepts" },
        { name: "Troubleshooting", href: "#basics-trouble" },
    ]

    return (
        <DocumentationLayout activeTab="home" navigationItems={navItems}>
            <IntroductionDocumentationContent />
        </DocumentationLayout>
    )
}
