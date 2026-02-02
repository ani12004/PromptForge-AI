import { Metadata } from "next"
import { PricingPageClient } from "@/components/marketing/PricingPageClient"

export const metadata: Metadata = {
    title: "Pricing - Transparent & Simple",
    description: "Start specific free or upgrade for professional prompt engineering tools. Transparent pricing for individuals and teams.",
    openGraph: {
        title: "PromptForge Pricing | Simple & Transparent",
        description: "Start specific free or upgrade for professional prompt engineering tools. Transparent pricing for individuals and teams.",
    }
}

export default function PricingPage() {
    return <PricingPageClient />
}
