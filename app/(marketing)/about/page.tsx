import { Card } from "@/components/ui/Card"
import { Github, Linkedin, Heart } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us - The Mission",
    description: "Meet the team behind PromptForge AI. We are dedicated to bridging the gap between human intent and AI understanding.",
    openGraph: {
        title: "About PromptForge AI | The Mission",
        description: "Meet the team behind PromptForge AI. Bridging the gap between human intent and AI understanding.",
    }
}

export default function AboutPage() {
    return (
        <div className="pb-32 pt-32 px-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-brand-purple/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-4xl text-center mb-20 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 mb-6">
                    <Heart className="h-4 w-4 text-brand-indigo fill-brand-indigo/20" />
                    <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Our Mission</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
                    Bridging Human Intent & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-violet">AI Understanding</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                    We believe that the bottleneck of the future isn't AI capability, but how effectively humans can communicate with it. PromptForge is built to solve that precision gap.
                </p>
            </div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <ValueCard
                        title="Transparency"
                        desc="We don't hide the magic. Our tools show you exactly how your prompts are being transformed analysis."
                    />
                    <ValueCard
                        title="Precision"
                        desc="Vague prompts yield vague results. We treat prompt engineering as a science, with measurable impact."
                    />
                    <ValueCard
                        title="User-Centric"
                        desc="Built for developers who need robust, repeatable, and scalable prompt pipelines for production."
                    />
                </div>

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Meet the Team</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">The engineers and designers behind the platform.</p>
                </div>

                <div className="flex justify-center">
                    <TeamCard
                        name="Anil Suthar"
                        role="Founder & CEO"
                        imageSrc="/anil_suthar_profile.jpg"
                        githubUrl="https://github.com/ani12004"
                        linkedinUrl="https://www.linkedin.com/in/sutharani738/"
                    />
                </div>
            </div>
        </div>
    )
}

function ValueCard({ title, desc }: { title: string, desc: string }) {
    return (
        <Card className="p-8 border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group h-full">
            <div className="w-12 h-1 bg-brand-purple/50 mb-6 rounded-full group-hover:w-20 transition-all duration-300" />
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-brand-purple transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-base">{desc}</p>
        </Card>
    )
}

import Image from "next/image"

function TeamCard({ name, role, imageSrc, githubUrl, linkedinUrl }: { name: string, role: string, imageSrc: string, githubUrl?: string, linkedinUrl?: string }) {
    return (
        <Card variant="interactive" className="p-6 text-center group bg-[#0A0A0A] border-white/5 hover:border-brand-purple/30 max-w-sm w-full">
            <div className="w-32 h-32 rounded-full bg-white/5 mx-auto mb-6 overflow-hidden transition-all duration-500 border border-white/10 group-hover:border-brand-purple/50 shadow-lg relative">
                <Image
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover transition-all duration-500"
                />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-brand-purple transition-colors">{name}</h3>
            <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-medium text-[10px]">{role}</p>
            <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                {githubUrl && (
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                    </a>
                )}
                {linkedinUrl && (
                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
                    </a>
                )}
            </div>
        </Card>
    )
}
