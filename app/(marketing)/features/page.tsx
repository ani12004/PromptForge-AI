import { Zap, Sliders, Trophy, Sparkles, Wand2, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ABTestingVisual } from "@/components/marketing/ABTestingArena"
import { GranularControlsVisual } from "@/components/marketing/GranularControls"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Features - Intent Analysis & A/B Testing",
    description: "Explore our suite of prompt engineering tools including Deep Intent Analysis, Granular Controls, and our A/B Testing Arena.",
    openGraph: {
        title: "PromptForge Features | Intent Analysis & A/B Testing",
        description: "Explore our suite of prompt engineering tools including Deep Intent Analysis, Granular Controls, and our A/B Testing Arena.",
    }
}

export default function FeaturesPage() {
    return (
        <div className="pb-32 pt-32 px-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-[50vw] h-[500px] bg-brand-purple/10 blur-[150px] rounded-full opacity-30 pointer-events-none" />

            <div className="container mx-auto px-6 mb-24 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                    <Wand2 className="h-4 w-4 text-brand-purple" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Product Tour</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
                    Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-violet">Prompt Engineers</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Comprehensive tools to refine, test, and manage your AI prompts with efficient, data-driven workflows.
                </p>
            </div>

            <div className="container mx-auto px-6 max-w-6xl space-y-32 relative z-10">
                {/* Feature 1 */}
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block p-3 rounded-xl bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20">
                            <Zap className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Deep Intent Analysis</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Stop guessing what the AI needs. Our engine analyzes your raw concept and identifies ambiguity, missing context, and structural weaknesses before you even hit generate.
                        </p>
                        <Button variant="outline" size="lg" className="rounded-full">Try Analysis Demo</Button>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                            <Card variant="static" className="min-h-[400px] flex items-center justify-center border-white/10 bg-[#0F0F13] p-0 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-50" />
                                <img src="/feature-analysis.png" alt="Intent Analysis UI" className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700" />
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Feature 2 (Reversed) */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-6 border border-cyan-500/20">
                            <Sliders className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Granular Controls</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Adjust output verbosity, creativity temperature, and formatting constraints with simple sliders. We translate your preferences into technical system prompts automatically.
                        </p>
                        <Button variant="outline" size="lg" className="rounded-full">Explore Controls</Button>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative group">
                            <GranularControlsVisual />
                        </div>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block p-3 rounded-xl bg-brand-purple/10 text-brand-purple mb-6 border border-brand-purple/20">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">A/B Testing Arena</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Generated three versions of a prompt? Run them against our benchmark suite to see which one performs better on reasoning capability and token efficiency.
                        </p>
                        <Button variant="outline" size="lg" className="rounded-full">Start Benchmarking</Button>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative group">
                            <ABTestingVisual />
                        </div>
                    </div>
                </div>

                {/* Feature 4 (Reversed) - Playground */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                    <div className="flex-1">
                        <div className="inline-block p-3 rounded-xl bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
                            <Gamepad2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Gamified Playground</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Level up your skills in our interactive playground. Fix broken prompts, battle AI predictions, and earn legendary badges as you master the art of prompt engineering.
                        </p>
                        <Button variant="outline" size="lg" className="rounded-full">Enter Playground</Button>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                            <Card variant="static" className="min-h-[400px] flex items-center justify-center border-white/10 bg-[#0F0F13] p-0 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50" />
                                <div className="p-8 text-center">
                                    <div className="grid grid-cols-3 gap-4 mb-6 opacity-80">
                                        <div className="h-24 w-20 bg-white/5 rounded-lg border border-white/10 mx-auto" ></div>
                                        <div className="h-24 w-20 bg-brand-purple/20 rounded-lg border border-brand-purple/40 mx-auto shadow-[0_0_15px_rgba(168,85,247,0.3)]" ></div>
                                        <div className="h-24 w-20 bg-white/5 rounded-lg border border-white/10 mx-auto" ></div>
                                    </div>
                                    <p className="text-emerald-400 font-mono text-sm">BADGE UNLOCKED: PROMPT ARCHITECT</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
