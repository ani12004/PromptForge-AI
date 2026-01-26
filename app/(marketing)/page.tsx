"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Sparkles, Zap, Sliders, Trophy, ArrowRight, CheckCircle2, ChevronDown, Lock, Shield, Play } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { InteractiveInputDemo } from "@/components/interactive/InteractiveInputDemo"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
    return (
        <div className="flex flex-col gap-32 pb-32 overflow-hidden">

            {/* Hero Section */}
            <section className="relative pt-32 pb-10 md:pt-48 md:pb-20 px-6">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-brand-purple/20 blur-[120px] rounded-full opacity-40 pointer-events-none" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-brand-violet/10 blur-[80px] rounded-full pointing-events-none animate-float-delayed" />

                <div className="container mx-auto max-w-6xl text-center relative z-10">


                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="block"
                        >
                            Master the Art of
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-gradient block mt-2 pb-4"
                        >
                            Prompt Engineering
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Transform vague ideas into production-ready AI prompts in seconds using our advanced intent analysis engine.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
                    >
                        <Link href="/studio">
                            <Button size="lg" className="h-14 px-10 text-lg shadow-glow hover:scale-105 transition-all duration-300 bg-brand-purple hover:bg-brand-purple/90 rounded-full">
                                Start Forging Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="h-14 px-10 text-lg rounded-full bg-white/[0.05] border-white/10 hover:bg-white/10 backdrop-blur-md"
                        >
                            <Play className="mr-2 h-4 w-4 fill-current" /> Watch Demo
                        </Button>
                    </motion.div>

                    {/* Interactive Demo */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="relative mx-auto max-w-4xl"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-b from-brand-purple/20 to-transparent rounded-2xl blur-xl opacity-30" />
                        <InteractiveInputDemo />

                        {/* Floating Stats - Decoration */}
                        <div className="absolute -left-12 top-0 hidden lg:block animate-float">
                            <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 shadow-2xl">
                                <div className="bg-green-500/20 p-2 rounded-xl"><CheckCircle2 className="text-green-500 h-6 w-6" /></div>
                                <div>
                                    <div className="text-xl font-bold text-white">98%</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-12 bottom-0 hidden lg:block animate-float-delayed">
                            <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 shadow-2xl">
                                <div className="bg-brand-violet/20 p-2 rounded-xl"><Zap className="text-brand-violet h-6 w-6" /></div>
                                <div>
                                    <div className="text-xl font-bold text-white">10x</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Speed</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>



            {/* Features Section */}
            <section className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-6">
                        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Features</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Forge Better Prompts</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Our platform provides the tools you need to optimize, manage, and scale your AI interactions with precision.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="h-6 w-6 text-amber-400" />}
                        title="Intent Analysis"
                        description="Our engine understands what you mean, not just what you say. It decodes ambiguity and restructures your intent into clear instructions."
                    />
                    <FeatureCard
                        icon={<Sliders className="h-6 w-6 text-cyan-400" />}
                        title="Granular Control"
                        description="Adjust verbosity, creativity, and structure with precision sliders. Tweak every aspect of the output to match your needs."
                    />
                    <FeatureCard
                        icon={<Trophy className="h-6 w-6 text-brand-purple" />}
                        title="A/B Testing"
                        description="Generate multiple variations and test them against each other. Use data to find the winning prompt structure."
                    />
                    <FeatureCard
                        icon={<Sparkles className="h-6 w-6 text-pink-400" />}
                        title="Auto-Refinement"
                        description="One-click optimization to fix common prompt engineering pitfalls using our proprietary heuristics engine."
                    />
                    <FeatureCard
                        icon={<Lock className="h-6 w-6 text-emerald-400" />}
                        title="Enterprise Security"
                        description="Your prompts and data are encrypted at rest and in transit. Role-based access control for team collaboration."
                    />
                    <FeatureCard
                        icon={<Shield className="h-6 w-6 text-indigo-400" />}
                        title="Model Agnostic"
                        description="Optimized presets for GPT-4, Claude 3, and Gemini. Write once, deploy everywhere with model-specific tuning."
                    />
                </div>
            </section>

            {/* Interface Preview Section */}
            <section className="container mx-auto px-6 max-w-7xl">
                <div className="relative rounded-3xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl shadow-brand-purple/10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />

                    <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-16 items-center relative z-10">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 mb-6">
                                <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Workflow</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for consistency.</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Stop guessing. PromptForge gives you a structured environment to build, test, and version your prompts.
                                ensuring reliability across all your AI configurations.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Version Control for Prompts', 'Real-time Cost Estimation', 'Collaborative Workspaces'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-gray-300">
                                        <div className="bg-brand-purple/20 p-1 rounded-full"><CheckCircle2 className="h-4 w-4 text-brand-purple" /></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/docs">
                                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl h-12 px-6">
                                    Explore Documentation
                                </Button>
                            </Link>
                        </div>

                        <div className="order-1 lg:order-2 relative">
                            {/* Abstract UI Representation */}
                            <div className="relative aspect-square md:aspect-[4/3] rounded-xl bg-[#0F0F0F] border border-white/10 shadow-2xl overflow-hidden group">
                                {/* Header Fake */}
                                <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-green-500/20" />
                                </div>
                                {/* Content Fake */}
                                <div className="p-6 space-y-4">
                                    <div className="h-8 w-1/3 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-white/5 rounded animate-pulse delay-75" />
                                        <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse delay-100" />
                                        <div className="h-4 w-4/6 bg-white/5 rounded animate-pulse delay-150" />
                                    </div>
                                    <div className="pt-8 grid grid-cols-2 gap-4">
                                        <div className="h-24 bg-brand-purple/5 border border-brand-purple/20 rounded-xl p-4">
                                            <div className="h-6 w-8 bg-brand-purple/40 rounded mb-2" />
                                            <div className="h-3 w-16 bg-white/10 rounded" />
                                        </div>
                                        <div className="h-24 bg-white/5 border border-white/5 rounded-xl p-4">
                                            <div className="h-6 w-8 bg-white/20 rounded mb-2" />
                                            <div className="h-3 w-16 bg-white/10 rounded" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-brand-purple/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                    <FAQItem
                        question="How does the intent analysis work?"
                        answer="Our proprietary NLP engine analyzes the semantic structure of your input, identifying ambiguity and vague terms. It then maps these to proven prompt patterns to generate a precise, optimized instruction set."
                    />
                    <FAQItem
                        question="Can I use this for any model?"
                        answer="Yes! PromptForge is model-agnostic. While we have specific optimizations for GPT-4, Claude, and Gemini, the core engineering principles we apply improve performance across all Large Language Models."
                    />
                    <FAQItem
                        question="Is my data secure?"
                        answer="Absolutely. We do not use your prompt data to train our own models. All processing is done via secure, encrypted channels, and enterprise plans offer private instance options."
                    />
                    <FAQItem
                        question="What is the difference between Basic and Expert modes?"
                        answer="Basic mode handles all the complexity for you, making best-guess assumptions. Expert mode gives you full control over parameters like temperature, top-p, and specific rhetorical structures within the prompt."
                    />
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-6">
                <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden bg-brand-purple p-12 md:p-24 text-center">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

                    {/* Glowing effect */}
                    <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[100%] bg-white/20 blur-[100px] rounded-full mix-blend-overlay pointer-events-none" />

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                            Ready to master your AI?
                        </h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join thousands of developers and creators who are already forging the future.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/studio">
                                <Button size="lg" className="h-16 px-12 text-xl font-bold bg-white text-brand-purple hover:bg-white/90 shadow-xl shadow-black/20 rounded-full border-0">
                                    Get Started Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card variant="feature" className="p-8 h-full glass-card hover:glass-card-hover group">
            <div className="mb-6 p-4 bg-white/[0.05] rounded-2xl w-fit border border-white/[0.05] group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-base">{description}</p>
        </Card>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            className="border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden transition-all duration-300 hover:bg-white/[0.04]"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="text-lg font-medium text-white">{question}</span>
                <ChevronDown className={cn("h-5 w-5 text-gray-500 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
