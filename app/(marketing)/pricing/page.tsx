"use client"
import * as React from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { PricingToggle } from "@/components/ui/PricingToggle"
import { cn } from "@/lib/utils"

export default function PricingPage() {
    const [isYearly, setIsYearly] = React.useState(true)

    return (
        <div className="pb-32 pt-24 md:pt-32">
            <div className="text-center mb-16 px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">Simple, Transparent Pricing</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Start for free, upgrade for power. No hidden credits or token upcharges.
                </p>
                <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
            </div>

            <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative z-10">

                {/* Free Plan */}
                <Card className="p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-3xl">
                    <h3 className="text-xl font-bold mb-2 text-white">Hobbyist</h3>
                    <div className="text-4xl font-bold mb-6 text-white">$0<span className="text-sm font-normal text-gray-500">/mo</span></div>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">Perfect for experimenting with prompt engineering basics.</p>
                    <Button variant="secondary" className="w-full mb-8 rounded-xl h-12 bg-white/5 hover:bg-white/10 border-white/10 text-white">Get Started</Button>
                    <ul className="space-y-4">
                        <FeatureItem>30 Prompts / mo</FeatureItem>
                        <FeatureItem>Basic Analysis</FeatureItem>
                        <FeatureItem>Community Templates</FeatureItem>
                        <FeatureItem>Export to JSON</FeatureItem>
                    </ul>
                </Card>

                {/* Pro Plan */}
                <Card className="p-8 border-brand-purple/30 bg-brand-purple/[0.05] relative overflow-hidden shadow-2xl shadow-brand-purple/10 rounded-3xl scale-105 border-t-brand-purple/50">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />
                    <div className="absolute top-0 right-0 bg-brand-purple text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-lg">POPULAR</div>

                    <h3 className="text-xl font-bold mb-2 text-white">Pro Engineer</h3>
                    <div className="text-4xl font-bold mb-6 text-white">
                        ${isYearly ? "29" : "39"}
                        <span className="text-sm font-normal text-gray-400">/mo</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-8 leading-relaxed">For developers building critical AI features and production pipelines.</p>
                    <Button variant="primary" className="w-full mb-8 shadow-glow rounded-xl h-12 font-medium bg-brand-purple hover:bg-brand-purple/90">Start Pro Trial</Button>
                    <ul className="space-y-4">
                        <FeatureItem active>Unlimited Prompts</FeatureItem>
                        <FeatureItem active>Granular & Expert Modes</FeatureItem>
                        <FeatureItem active>Advanced Intent Analysis</FeatureItem>
                        <FeatureItem active>A/B Testing Suite</FeatureItem>
                        <FeatureItem active>API Access</FeatureItem>
                        <FeatureItem active>Priority Support</FeatureItem>
                    </ul>
                </Card>

                {/* Enterprise Plan */}
                <Card className="p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-3xl">
                    <h3 className="text-xl font-bold mb-2 text-white">Enterprise</h3>
                    <div className="text-4xl font-bold mb-6 text-white">Custom</div>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">For teams requiring security, compliance, and dedicated infrastructure.</p>
                    <Button variant="secondary" className="w-full mb-8 rounded-xl h-12 bg-white/5 hover:bg-white/10 border-white/10 text-white">Contact Sales</Button>
                    <ul className="space-y-4">
                        <FeatureItem>SSO & SAML</FeatureItem>
                        <FeatureItem>On-premise Deployment</FeatureItem>
                        <FeatureItem>Dedicated Success Manager</FeatureItem>
                        <FeatureItem>Custom SLAs</FeatureItem>
                    </ul>
                </Card>

            </div>
        </div>
    )
}

function FeatureItem({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
    return (
        <li className="flex items-center gap-3 text-sm text-gray-400">
            <div className={`rounded-full p-0.5 ${active ? "bg-brand-purple/20 text-brand-purple" : "bg-white/10 text-gray-400"}`}>
                <Check className="h-3 w-3" />
            </div>
            <span className={active ? "text-gray-200 font-medium" : ""}>{children}</span>
        </li>
    )
}
