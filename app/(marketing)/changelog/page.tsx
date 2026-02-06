import { Badge } from "../../../components/ui/Badge"
import { Separator } from "../../../components/ui/Separator"
import { Metadata } from "next"
import { CheckCircle2, Gamepad2, Sparkles, Zap, Bug, GitCommit } from "lucide-react"

export const metadata: Metadata = {
    title: "Changelog - PromptForge Studio",
    description: "Track the evolution of PromptForge Studio. New features, improvements, and fixes.",
}

// Data derived from CHANGELOG.md
const RELEASES = [
    {
        version: "1.4.0",
        date: "February 03, 2026",
        title: "Badge Notifications",
        description: "A polish update introducing a sophisticated notification system for gamification achievements.",
        type: "minor",
        changes: [
            {
                type: "added",
                items: [
                    "**Badge Notification System**: New global popup system for earnable badges.",
                    "**Visual Polish**: Rarity-colored toasts and confetti celebrations for high-tier achievements.",
                    "**Global Context**: Centralized provider for triggering notifications from anywhere."
                ]
            }
        ]
    },
    {
        version: "1.3.0",
        date: "February 03, 2026",
        title: "Strategy & Aesthetics",
        description: "Official rollout of our India-first pricing strategy and a complete visual polish of the core experience.",
        type: "major",
        changes: [
            {
                type: "changed",
                items: [
                    "**Pricing Strategy**: Introduced new ₹0 Hobbyist vs ₹99/mo Pro plans (India-First).",
                    "**Home Page**: Applied premium fade-in animations to all major sections for a seamless flow.",
                    "**Admin Profile**: Replaced generic crown icon with the official 'Approved' badge."
                ]
            },
            {
                type: "added",
                items: [
                    "**4-Key API Architecture**: Intelligent load balancing with dedicated keys for Fixer, Playground, and Analysis.",
                    "**Usage Limits**: Implemented soft-limits for Pro (500/day) and hard-limits for Free (15/day).",
                    "**Safety Logic**: Graceful degradation during high traffic instead of raw error messages."
                ]
            }
        ]
    },
    {
        version: "1.2.0",
        date: "February 02, 2026",
        title: "Gamification & Playground",
        description: "A massive update introducing gamified learning, badges, and a comprehensive playground suite.",
        type: "major",
        changes: [
            {
                type: "added",
                items: [
                    "**Gamification System**: Comprehensive badge and achievement system with 15+ unique badges.",
                    "**Playground**: New interactive learning area with Fixer, Builder, Battle, and Precision modes.",
                    "**Profile Achievements**: Dedicated section to showcase earned badges and level progress.",
                    "**Onboarding**: Interactive 'How to Play' guides for all game modes."
                ]
            },
            {
                type: "changed",
                items: [
                    "**Home Page**: Replaced demo button with direct access to Playground.",
                    "**Security**: Protected /playground routes with authentication middleware.",
                    "**Performance**: Optimized badge fetching with Service Role clients for reliability."
                ]
            }
        ]
    },
    {
        version: "1.1.0",
        date: "February 01, 2026",
        title: "Accounts & SEO",
        description: "Focus on user identity management and discoverability.",
        type: "minor",
        changes: [
            {
                type: "added",
                items: [
                    "**Profile Editing**: Full sync between Clerk and Supabase for avatars and names.",
                    "**SEO Suite**: Enhanced metadata, OpenGraph tags, and sitemap generation.",
                    "**Verification**: Google Site Verification integration."
                ]
            },
            {
                type: "fixed",
                items: [
                    "Fixed type safety issues in Analysis Panel.",
                    "Resolved missing icon imports in production builds."
                ]
            }
        ]
    },
    {
        version: "1.0.0",
        date: "January 25, 2026",
        title: "Initial Launch",
        description: "The foundation of PromptForge Studio. Studio, A/B Testing, and Granular Controls.",
        type: "major",
        changes: [
            {
                type: "added",
                items: [
                    "**Studio**: Advanced Prompt Editor with Cognitive Depth controls.",
                    "**A/B Arena**: Side-by-side prompt comparison laboratory.",
                    "**Granular Controls**: Sliders for Temperature, Top-P, and Top-K.",
                    "**Infrastructure**: Clerk Auth + Supabase DB + Next.js 15."
                ]
            }
        ]
    }
]

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-[#020204] pt-32 pb-20">
            {/* Header */}
            <div className="container mx-auto px-6 max-w-4xl text-center mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-6">
                    <HistoryIcon className="h-4 w-4 text-brand-purple" />
                    <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Project History</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Changelog</h1>
                <p className="text-xl text-gray-400">
                    Stay up to date with the latest features, improvements, and fixes.
                </p>
            </div>

            {/* Timeline */}
            <div className="container mx-auto px-6 max-w-3xl relative">
                <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent transform -translate-x-1/2" />

                <div className="space-y-24">
                    {RELEASES.map((release, index) => (
                        <div key={release.version} className="relative group">
                            {/* Dot */}
                            <div className="absolute left-[27px] md:left-1/2 top-0 w-4 h-4 bg-[#020204] border-2 border-brand-purple rounded-full transform -translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

                            <div className="grid md:grid-cols-2 gap-8 md:gap-16 pt-2">
                                {/* Left Side (Date & Version) */}
                                <div className={`md:text-right pl-16 md:pl-0 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2 md:text-left'}`}>
                                    <div className="sticky top-32">
                                        <h2 className="text-3xl font-bold text-white mb-2">{release.version}</h2>
                                        <p className="text-brand-purple font-medium mb-4">{release.title}</p>
                                        <p className="text-sm text-gray-500 font-mono mb-4">{release.date}</p>
                                        <Badge variant="outline" className={
                                            release.type === 'major' ? "border-brand-purple/50 text-brand-purple bg-brand-purple/10" : "border-slate-700 text-slate-400"
                                        }>
                                            {release.type === 'major' ? 'Major Release' : 'Update'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Right Side (Content) */}
                                <div className={`pl-16 md:pl-0 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1 md:text-right'}`}>
                                    <div className={`p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors ${index % 2 !== 0 ? 'md:text-left' : ''}`}>
                                        <p className="text-gray-300 italic mb-6 leading-relaxed">"{release.description}"</p>

                                        <div className="space-y-6">
                                            {release.changes.map((change, i) => (
                                                <div key={i}>
                                                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${index % 2 !== 0 && 'md:flex-row-reverse md:justify-end'}`}>
                                                        {change.type === 'added' && <Zap className="w-4 h-4 text-emerald-400" />}
                                                        {change.type === 'changed' && <Sparkles className="w-4 h-4 text-amber-400" />}
                                                        {change.type === 'fixed' && <Bug className="w-4 h-4 text-rose-400" />}
                                                        <span className={{
                                                            'added': 'text-emerald-400',
                                                            'changed': 'text-amber-400',
                                                            'fixed': 'text-rose-400'
                                                        }[change.type]}>{change.type}</span>
                                                    </h3>
                                                    <ul className="space-y-3">
                                                        {change.items.map((item, j) => (
                                                            <li key={j} className="text-gray-400 leading-relaxed text-sm">
                                                                <span dangerouslySetInnerHTML={{
                                                                    __html: item.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-medium">$1</span>')
                                                                }} />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function HistoryIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    )
}
