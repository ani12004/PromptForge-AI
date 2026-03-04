"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
    Book, Search, ChevronDown, ChevronRight, Copy, Check, Layers, Server,
    Database, Shield, Palette, Layout, Zap, Code, Terminal, Package, Lock,
    Globe, Cpu, Key, FileJson, Rocket, FolderTree, Settings, Users,
    Gamepad2, BarChart3, Mail, Eye, EyeOff, ArrowUp
} from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────

interface DocSection {
    id: string
    title: string
    icon: React.ReactNode
    color: string
    content: React.ReactNode
}

const SECTIONS: DocSection[] = [
    {
        id: "overview", title: "Project Overview", icon: <Book className="w-4 h-4" />, color: "text-brand-purple",
        content: <OverviewSection />
    },
    {
        id: "tech-stack", title: "Technology Stack", icon: <Layers className="w-4 h-4" />, color: "text-blue-400",
        content: <TechStackSection />
    },
    {
        id: "architecture", title: "Architecture", icon: <Server className="w-4 h-4" />, color: "text-emerald-400",
        content: <ArchitectureSection />
    },
    {
        id: "directory", title: "Directory Structure", icon: <FolderTree className="w-4 h-4" />, color: "text-amber-400",
        content: <DirectorySection />
    },
    {
        id: "env-vars", title: "Environment Variables", icon: <Key className="w-4 h-4" />, color: "text-red-400",
        content: <EnvVarsSection />
    },
    {
        id: "getting-started", title: "Getting Started", icon: <Rocket className="w-4 h-4" />, color: "text-cyan-400",
        content: <GettingStartedSection />
    },
    {
        id: "database", title: "Database Schema", icon: <Database className="w-4 h-4" />, color: "text-orange-400",
        content: <DatabaseSection />
    },
    {
        id: "auth", title: "Authentication", icon: <Shield className="w-4 h-4" />, color: "text-rose-400",
        content: <AuthSection />
    },
    {
        id: "routing", title: "Routing & Middleware", icon: <Globe className="w-4 h-4" />, color: "text-violet-400",
        content: <RoutingSection />
    },
    {
        id: "design-system", title: "Design System", icon: <Palette className="w-4 h-4" />, color: "text-pink-400",
        content: <DesignSystemSection />
    },
    {
        id: "server-actions", title: "Server Actions", icon: <Zap className="w-4 h-4" />, color: "text-yellow-400",
        content: <ServerActionsSection />
    },
    {
        id: "api-routes", title: "API Routes", icon: <Globe className="w-4 h-4" />, color: "text-green-400",
        content: <ApiRoutesSection />
    },
    {
        id: "lib-modules", title: "Core Libraries", icon: <Code className="w-4 h-4" />, color: "text-sky-400",
        content: <LibModulesSection />
    },
    {
        id: "components", title: "Components", icon: <Layout className="w-4 h-4" />, color: "text-indigo-400",
        content: <ComponentsSection />
    },
    {
        id: "studio", title: "Studio Engine", icon: <Cpu className="w-4 h-4" />, color: "text-brand-purple",
        content: <StudioSection />
    },
    {
        id: "gamification", title: "Gamification", icon: <Gamepad2 className="w-4 h-4" />, color: "text-amber-400",
        content: <GamificationSection />
    },
    {
        id: "v2-paas", title: "V2 PaaS Engine", icon: <Server className="w-4 h-4" />, color: "text-emerald-400",
        content: <V2PaaSSection />
    },
    {
        id: "sdk", title: "Node.js SDK", icon: <Package className="w-4 h-4" />, color: "text-blue-400",
        content: <SDKSection />
    },
    {
        id: "cli", title: "Forge CLI", icon: <Terminal className="w-4 h-4" />, color: "text-green-400",
        content: <CLISection />
    },
    {
        id: "security", title: "SEO & Security", icon: <Lock className="w-4 h-4" />, color: "text-red-400",
        content: <SecuritySection />
    },
    {
        id: "deployment", title: "Deployment", icon: <Rocket className="w-4 h-4" />, color: "text-cyan-400",
        content: <DeploymentSection />
    },
]

// ─── Main Component ──────────────────────────────────────────────────

export function DevDocsClient() {
    const [search, setSearch] = useState("")
    const [activeId, setActiveId] = useState("overview")
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
    const [showScrollTop, setShowScrollTop] = useState(false)
    const observerRef = useRef<IntersectionObserver | null>(null)

    const filtered = SECTIONS.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search.toLowerCase())
    )

    const toggle = useCallback((id: string) => {
        setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
    }, [])

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
                if (visible.length > 0) setActiveId(visible[0].target.id)
            },
            { rootMargin: "-20% 0px -70% 0px" }
        )
        const els = document.querySelectorAll("[data-doc-section]")
        els.forEach(el => observerRef.current?.observe(el))
        return () => observerRef.current?.disconnect()
    }, [filtered])

    useEffect(() => {
        const handler = () => setShowScrollTop(window.scrollY > 600)
        window.addEventListener("scroll", handler, { passive: true })
        return () => window.removeEventListener("scroll", handler)
    }, [])

    return (
        <div className="min-h-screen pb-32 pt-28 px-4 md:px-6 bg-[#050508]">
            {/* Background glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[500px] bg-brand-purple/8 blur-[150px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="max-w-7xl mx-auto relative z-10 mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-4">
                    <Book className="h-3.5 w-3.5 text-brand-purple" />
                    <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">Internal · Developer Reference</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3 font-[family-name:var(--font-poppins)]">
                    PromptForge Studio <span className="text-gradient-purple">Documentation</span>
                </h1>
                <p className="text-gray-500 text-base max-w-2xl">
                    Complete architecture, API reference, database schema, and integration guide. Everything a developer needs.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 relative z-10">
                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-28 glass-panel rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-white/5">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5">
                                <Search className="w-3.5 h-3.5 text-gray-600" />
                                <input
                                    type="text"
                                    placeholder="Search sections..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="bg-transparent text-sm text-white placeholder:text-gray-600 outline-none flex-1 w-full"
                                />
                            </div>
                        </div>
                        {/* Nav items */}
                        <nav className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <ul className="space-y-0.5">
                                {filtered.map(s => (
                                    <li key={s.id}>
                                        <a
                                            href={`#${s.id}`}
                                            onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }) }}
                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${activeId === s.id
                                                ? "bg-brand-purple/10 text-white border border-brand-purple/20 font-semibold"
                                                : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            <span className={activeId === s.id ? s.color : "text-gray-600"}>{s.icon}</span>
                                            {s.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        {/* Footer */}
                        <div className="p-3 border-t border-white/5 text-center">
                            <span className="text-[10px] text-gray-700 uppercase tracking-widest">v1.4.0 · March 2026</span>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="min-w-0 space-y-8">
                    {filtered.map(section => (
                        <section
                            key={section.id}
                            id={section.id}
                            data-doc-section
                            className="scroll-mt-28 rounded-2xl border border-white/5 bg-white/[0.015] backdrop-blur-sm overflow-hidden transition-all hover:border-white/10"
                        >
                            {/* Section Header (clickable toggle) */}
                            <button
                                onClick={() => toggle(section.id)}
                                className="w-full flex items-center gap-3 px-6 py-5 text-left group"
                            >
                                <span className={`${section.color} transition-transform ${collapsed[section.id] ? "" : "scale-110"}`}>{section.icon}</span>
                                <h2 className="text-lg font-bold text-white flex-1 font-[family-name:var(--font-poppins)]">{section.title}</h2>
                                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${collapsed[section.id] ? "-rotate-90" : ""}`} />
                            </button>
                            {/* Section Content */}
                            {!collapsed[section.id] && (
                                <div className="px-6 pb-6 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                                    {section.content}
                                </div>
                            )}
                        </section>
                    ))}
                </main>
            </div>

            {/* Scroll to top */}
            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple hover:bg-brand-purple/30 transition-all backdrop-blur-xl shadow-glow-sm"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    )
}

// ─── Reusable Sub-Components ─────────────────────────────────────────

function CodeBlock({ code, language = "typescript", title }: { code: string; language?: string; title?: string }) {
    const [copied, setCopied] = useState(false)
    const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    return (
        <div className="relative group my-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple/15 to-brand-indigo/15 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative bg-[#0a0a0d] border border-white/8 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/30" />
                            <div className="w-2 h-2 rounded-full bg-amber-500/30" />
                            <div className="w-2 h-2 rounded-full bg-green-500/30" />
                        </div>
                        {title && <span className="text-[10px] text-gray-500 font-medium">{title}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{language}</span>
                        <button onClick={copy} className="p-1 rounded hover:bg-white/5 transition-colors" title="Copy">
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-600" />}
                        </button>
                    </div>
                </div>
                <pre className="p-4 overflow-x-auto text-[13px] font-mono text-gray-400 leading-relaxed"><code>{code}</code></pre>
            </div>
        </div>
    )
}

function InfoTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
    return (
        <div className="overflow-x-auto my-4 rounded-xl border border-white/5">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-white/[0.03] border-b border-white/5">
                        {headers.map((h, i) => <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                            {row.map((cell, j) => (
                                <td key={j} className={`px-4 py-2.5 ${j === 0 ? "text-white font-mono text-[13px] font-medium" : "text-gray-500"}`}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function Callout({ type, children }: { type: "info" | "warn" | "tip"; children: React.ReactNode }) {
    const styles = {
        info: "bg-blue-500/5 border-blue-500/15 text-blue-400",
        warn: "bg-amber-500/5 border-amber-500/15 text-amber-400",
        tip: "bg-emerald-500/5 border-emerald-500/15 text-emerald-400",
    }
    return <div className={`my-4 px-4 py-3 rounded-xl border text-sm ${styles[type]}`}>{children}</div>
}

function P({ children }: { children: React.ReactNode }) {
    return <p className="text-gray-400 text-sm leading-relaxed mb-3">{children}</p>
}

function Tag({ children, color = "purple" }: { children: React.ReactNode; color?: string }) {
    return <code className={`text-brand-${color} bg-brand-${color}/10 px-1.5 py-0.5 rounded text-xs font-mono`}>{children}</code>
}

// ─── Section Content ─────────────────────────────────────────────────

function OverviewSection() {
    return (<>
        <P><strong className="text-white">PromptForge Studio</strong> is an advanced development environment (ADE) for prompt engineering. It serves as middleware between human intent and LLM execution, using heuristic analysis to detect ambiguity in natural language, then restructuring requests into high-fidelity, production-grade AI prompts.</P>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            {[
                { title: "The Problem", desc: "Raw prompts are ambiguous, missing constraints, or unstructured — leading to suboptimal LLM performance.", color: "rose" },
                { title: "The Solution", desc: "Automatically restructure intent into optimized prompts that improve AI consistency, reduce latency, and lower costs.", color: "emerald" },
                { title: "Target Users", desc: "Prompt Engineers, AI/ML Developers, Product Managers building AI features, Enterprise teams.", color: "blue" },
            ].map(c => (
                <div key={c.title} className={`p-4 rounded-xl bg-${c.color}-500/5 border border-${c.color}-500/10`}>
                    <h4 className={`text-xs font-bold uppercase tracking-wider text-${c.color}-400 mb-2`}>{c.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
            ))}
        </div>
        <P>The platform provides a <strong className="text-white">web-based Studio IDE</strong>, a <strong className="text-white">gamified Playground</strong>, a <strong className="text-white">headless PaaS API</strong>, an <strong className="text-white">npm SDK</strong>, and a <strong className="text-white">CLI tool</strong>.</P>
    </>)
}

function TechStackSection() {
    return (
        <InfoTable
            headers={["Technology", "Version", "Purpose"]}
            rows={[
                ["Next.js (App Router)", "16.1.4", "Full-stack React framework"],
                ["React", "19.2.3", "UI library"],
                ["TypeScript", "^5", "Type-safe JavaScript"],
                ["Tailwind CSS", "v4", "Utility-first CSS"],
                ["Framer Motion", "^12.29.0", "Animations & transitions"],
                ["Clerk", "^6.36.9", "Authentication provider"],
                ["Supabase", "^2.91.0", "PostgreSQL database + auth"],
                ["Upstash Redis", "^1.36.2", "Serverless caching & rate limiting"],
                ["Google Generative AI", "^0.24.1", "Gemini LLM models"],
                ["Zod", "^4.3.6", "Runtime schema validation"],
                ["Resend", "^6.8.0", "Transactional email"],
                ["Svix", "^1.84.1", "Webhook signature verification"],
                ["Lucide React", "^0.562.0", "Icon library"],
                ["Lenis", "^1.3.17", "Smooth scrolling"],
                ["canvas-confetti", "^1.9.4", "Celebration effects"],
                ["@vercel/analytics", "^1.6.1", "Web analytics"],
            ]}
        />
    )
}

function ArchitectureSection() {
    return (<>
        <P>The application follows a <strong className="text-white">three-layer architecture</strong>: Client → Server → Infrastructure.</P>
        <CodeBlock language="text" title="System Architecture" code={`┌──────────────────── CLIENT LAYER ─────────────────────┐
│  Next.js App Router (React 19 Server Components)      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │ Marketing │  │  Studio  │  │   Playground     │    │
│  │  Pages    │  │   IDE    │  │   (Gamified)     │    │
│  └──────────┘  └──────────┘  └──────────────────┘    │
├───────────────────── SERVER LAYER ────────────────────┤
│  ┌──────────────┐  ┌─────────────────────────────┐   │
│  │ Server       │  │ API Routes                   │   │
│  │ Actions (11) │  │ /api/v1/execute              │   │
│  │ generate.ts  │  │ /api/v1/keys                 │   │
│  │ audit.ts     │  │ /api/webhooks/clerk          │   │
│  └──────────────┘  └─────────────────────────────┘   │
├───────────────── INFRASTRUCTURE ──────────────────────┤
│  ┌─────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │  Clerk  │  │ Supabase │  │  Upstash Redis   │    │
│  │  Auth   │  │ Postgres │  │  (Cache + Rate)  │    │
│  └─────────┘  └──────────┘  └──────────────────┘    │
│                ┌──────────────────┐                    │
│                │ Google Gemini AI │                    │
│                │ NVIDIA AI APIs   │                    │
│                └──────────────────┘                    │
└───────────────────────────────────────────────────────┘`} />
        <P>The V2 PaaS execution flow traverses: <strong className="text-white">API Key Auth → Rate Limit → Zod Validation → Guardrails → Prompt Fetch → Cache Check → Model Router → LLM → Telemetry → Response</strong>.</P>
    </>)
}

function DirectorySection() {
    return (
        <CodeBlock language="text" title="Project Root" code={`PromptForge AI/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Clerk, fonts, globals)
│   ├── globals.css             # Design system tokens + utilities
│   ├── sitemap.ts / robots.ts  # SEO config
│   ├── (auth)/                 # Clerk auth pages
│   ├── (legal)/                # Privacy, Terms pages
│   ├── (marketing)/            # Public: Home, About, Features, Pricing, Docs, Contact
│   ├── actions/ (11 files)     # Server Actions (generate, audit, analytics, etc.)
│   ├── api/v1/                 # REST API (execute, keys, cli)
│   ├── api/webhooks/clerk/     # Clerk → Supabase user sync
│   ├── admin/                  # Admin dashboard (RBAC)
│   ├── dashboard/              # User dashboard
│   ├── studio/                 # Prompt Studio IDE + sub-routes
│   ├── playground/             # Gamified prompt challenges
│   └── dev_docs/               # This page!
├── components/ (52 files)      # React components
│   ├── layout/                 # Shell, Navbar, Footer, UserMenu
│   ├── studio/                 # Editor, Controls, Modals, Result
│   ├── playground/             # Game modes (Fixer, Builder, Battle, Precision)
│   ├── marketing/              # Landing, Pricing, Docs components
│   ├── ui/                     # Reusable primitives (Button, Card, Toast, etc.)
│   └── gamification/           # Badge system (BadgeProvider, BadgeToast)
├── lib/ (12 files)             # Core utilities
│   ├── router.ts               # Cascading AI model router
│   ├── cache.ts                # Upstash Redis caching
│   ├── rate-limit.ts           # Fixed-window rate limiter
│   ├── guardrails.ts           # Input safety (PII, profanity)
│   ├── api-keys.ts             # API key gen + validation
│   ├── intelligence.ts         # Prompt analysis + cost stats
│   └── supabase*.ts            # 3 Supabase client variants
├── forge-cli/                  # CLI Tool (npm: prompt-forge-ai-cli)
├── promptforge-sdk/            # Node.js SDK (npm: promptforge-server-sdk)
├── schema.sql                  # Badge database schema + seed
├── middleware.ts               # Clerk auth middleware
├── vercel.json                 # Security headers
└── package.json                # Dependencies`} />
    )
}

function EnvVarsSection() {
    return (<>
        <Callout type="warn">Never commit <code>.env.local</code> to version control. All keys below must be set in Vercel Dashboard for production.</Callout>
        <InfoTable
            headers={["Variable", "Required", "Description"]}
            rows={[
                ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "✅", "Clerk frontend key"],
                ["CLERK_SECRET_KEY", "✅", "Clerk backend secret"],
                ["CLERK_WEBHOOK_SECRET", "✅", "Svix webhook signing secret"],
                ["NEXT_PUBLIC_SUPABASE_URL", "✅", "Supabase project URL"],
                ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "✅", "Supabase anonymous key"],
                ["SUPABASE_SERVICE_ROLE_KEY", "✅", "Supabase service role (bypasses RLS)"],
                ["GEMINI_API_KEY", "✅", "Primary Gemini key (\"Mechanic\")"],
                ["GEMINI_API_KEY_2", "⚡", "Free-tier primary (\"Gamer\")"],
                ["GEMINI_API_KEY_4", "⚡", "Pro-tier priority (\"Viper\")"],
                ["GEMINI_API_KEY_5", "⚡", "Additional fallback pool"],
                ["NVIDIA_API_KEY", "⚡", "NVIDIA AI (Llama/Nemotron)"],
                ["UPSTASH_REDIS_REST_URL", "⚡", "Upstash Redis URL"],
                ["UPSTASH_REDIS_REST_TOKEN", "⚡", "Upstash Redis token"],
                ["RESEND_API_KEY", "⚡", "Email service (admin inbox)"],
            ]}
        />
        <Callout type="info">✅ = Required for basic operation · ⚡ = Optional but recommended. The 4-Key routing system assigns keys by tier: Key 1 (Mechanic) → free fallback, Key 2 (Gamer) → free primary, Key 4 (Viper) → Pro priority.</Callout>
    </>)
}

function GettingStartedSection() {
    return (<>
        <P>Prerequisites: <strong className="text-white">Node.js ≥ 18</strong>, a Supabase project, a Clerk application, and at least one Gemini API key.</P>
        <CodeBlock language="bash" title="Setup Commands" code={`# Clone & install
git clone https://github.com/ani12004/Prompt-Forge-Studio.git
cd "PromptForge AI"
npm install

# Configure environment
cp .env.example .env.local   # Fill in your API keys

# Run database migrations (in Supabase SQL editor)
# Execute: schema.sql, add_notification.sql

# Start dev server
npm run dev`} />
        <InfoTable
            headers={["Script", "Command", "Description"]}
            rows={[
                ["dev", "npm run dev", "Start Next.js dev server (hot reload)"],
                ["build", "npm run build", "Production build"],
                ["start", "npm run start", "Start production server"],
                ["lint", "npm run lint", "Run ESLint"],
            ]}
        />
    </>)
}

function DatabaseSection() {
    return (<>
        <P>The database uses <strong className="text-white">two schema generations</strong> in the same PostgreSQL instance. V1 tables power the web app, V2 tables (<code className="text-brand-purple">v2_*</code> prefix) power the headless PaaS API.</P>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-2">V1 Tables (Web App)</h4>
        <InfoTable
            headers={["Table", "Purpose"]}
            rows={[
                ["profiles", "User profiles synced from Clerk (tier, role, avatar)"],
                ["prompts", "Prompt containers (original, refined, intent, detail_level)"],
                ["prompt_versions", "Version history for prompt edits"],
                ["badges", "15+ badge definitions (Common → Legendary)"],
                ["user_badges", "User ↔ Badge join table"],
                ["experiments", "A/B test experiment definitions"],
                ["notifications", "User notification system"],
                ["contact_messages", "Contact form submissions"],
                ["community_posts", "Forum posts"],
                ["community_replies", "Threaded forum replies"],
            ]}
        />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-2">V2 Tables (PaaS API)</h4>
        <InfoTable
            headers={["Table", "Purpose"]}
            rows={[
                ["v2_prompts", "API prompt definitions (name, description)"],
                ["v2_prompt_versions", "Execution templates (system_prompt, template, published)"],
                ["v2_api_keys", "API keys stored as SHA-256 hashes"],
                ["v2_execution_logs", "Telemetry (latency, model, tokens, cost, cache_hit)"],
            ]}
        />
        <Callout type="info">All tables have RLS enabled. V2 API tables use the Service Role client to bypass RLS for server-side programmatic access.</Callout>
    </>)
}

function AuthSection() {
    return (<>
        <P>Authentication uses <strong className="text-white">Clerk</strong> for user management with data synced to <strong className="text-white">Supabase</strong> via webhooks. Three distinct Supabase clients serve different access patterns.</P>
        <InfoTable
            headers={["Client", "File", "RLS", "Purpose"]}
            rows={[
                ["User Client", "lib/supabaseClient.ts", "✅ Enforced", "User-scoped queries with Clerk JWT"],
                ["Admin Client", "lib/supabaseAdmin.ts", "❌ Bypassed", "Server-only (webhooks, cron, community)"],
                ["API Admin", "lib/supabase.ts", "❌ Bypassed", "V2 API execution engine"],
            ]}
        />
        <CodeBlock language="typescript" title="User Client Usage" code={`const token = await getToken({ template: "supabase" });
const supabase = createClerkSupabaseClient(token);
// All queries are scoped by RLS to the authenticated user`} />
        <CodeBlock language="typescript" title="Admin Role Check (lib/admin.ts)" code={`export async function isAdmin(): Promise<boolean> {
    const { userId } = await auth();
    const supabase = createAdminClient();
    const { data } = await supabase
        .from('profiles').select('role')
        .eq('id', userId).single();
    return data?.role === 'admin';
}`} />
    </>)
}

function RoutingSection() {
    return (<>
        <P>Clerk middleware protects authenticated routes. Public marketing pages are accessible without login.</P>
        <CodeBlock language="typescript" title="middleware.ts — Protected Routes" code={`const isProtectedRoute = createRouteMatcher([
    '/studio(.*)',
    '/dashboard(.*)',
    '/profile(.*)',
    '/playground(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
});`} />
        <InfoTable
            headers={["Route Group", "Path", "Auth", "Description"]}
            rows={[
                ["(marketing)", "/, /about, /features, /pricing, /docs, /contact", "❌", "Public marketing pages"],
                ["(legal)", "/privacy, /terms", "❌", "Legal documents"],
                ["(auth)", "/sign-in, /sign-up", "❌", "Clerk auth pages"],
                ["studio", "/studio/*", "✅", "Prompt Studio IDE + sub-routes"],
                ["dashboard", "/dashboard", "✅", "User dashboard"],
                ["playground", "/playground", "✅", "Gamified learning"],
                ["admin", "/admin", "✅ + Admin", "System management"],
            ]}
        />
    </>)
}

function DesignSystemSection() {
    return (<>
        <P>Theme: <strong className="text-white">&quot;Cyber-Modern&quot; Dark Mode</strong>. Defined in <code className="text-brand-purple">globals.css</code> using Tailwind v4 <code className="text-brand-purple">@theme</code> directive.</P>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-4">
            {[
                { name: "brand-purple", hex: "#8b5cf6", bg: "bg-[#8b5cf6]" },
                { name: "brand-violet", hex: "#d8b4fe", bg: "bg-[#d8b4fe]" },
                { name: "brand-indigo", hex: "#6366f1", bg: "bg-[#6366f1]" },
                { name: "brand-dark", hex: "#050508", bg: "bg-[#050508] border border-white/10" },
                { name: "brand-surface", hex: "#0f0f13", bg: "bg-[#0f0f13] border border-white/10" },
                { name: "status-success", hex: "#34d399", bg: "bg-[#34d399]" },
                { name: "status-error", hex: "#f87171", bg: "bg-[#f87171]" },
            ].map(c => (
                <div key={c.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                    <div className={`w-6 h-6 rounded-md ${c.bg}`} />
                    <div><p className="text-[11px] text-white font-mono">{c.hex}</p><p className="text-[10px] text-gray-600">{c.name}</p></div>
                </div>
            ))}
        </div>
        <InfoTable
            headers={["Class", "Effect"]}
            rows={[
                [".glass-panel", "Frosted glass (backdrop-blur-xl, translucent surface)"],
                [".glass-card", "Interactive glass card with hover transition"],
                [".text-gradient", "White → Violet → Purple gradient text"],
                [".text-gradient-purple", "Purple → Indigo gradient text"],
                [".animate-fade-in-up", "Entrance animation (opacity + translateY)"],
                [".animate-float", "6s floating animation"],
            ]}
        />
        <P>Typography: <strong className="text-white">Inter</strong> (UI) + <strong className="text-white">Poppins</strong> (Headings), loaded via <code className="text-brand-purple">next/font/google</code>.</P>
    </>)
}

function ServerActionsSection() {
    return (<>
        <P>All server actions are in <code className="text-brand-purple">app/actions/</code> using the <code className="text-brand-purple">&quot;use server&quot;</code> directive.</P>
        <InfoTable
            headers={["Action File", "Key Function", "Description"]}
            rows={[
                ["generate.ts", "refinePrompt()", "Core engine — converts raw input to optimized prompts"],
                ["audit.ts", "auditPrompt()", "Pre-execution security & clarity analysis"],
                ["analytics.ts", "getAnalytics()", "Dashboard KPI data and usage stats"],
                ["gamification.ts", "awardBadge()", "Badge/XP award system"],
                ["community.ts", "createPost()", "Forum CRUD (posts, replies, likes)"],
                ["contact.ts", "submitContact()", "Contact form + admin inbox + Resend replies"],
                ["save-prompt.ts", "savePrompt()", "Prompt persistence & version management"],
                ["subscription.ts", "checkTier()", "User subscription tier lookup"],
                ["notifications.ts", "getNotifications()", "Notification CRUD"],
                ["analyze.ts", "analyzePrompt()", "Prompt structure analysis"],
                ["auth.ts", "getAuthUser()", "Auth helper utilities"],
            ]}
        />
        <Callout type="tip">The <code>generate.ts</code> action is the most complex — it handles auth gating, tier detection, rate limiting (Free: 3/min, 15/day | Pro: 15/min, 500/day), feature gating (Granular = Pro only), API key pool selection, provider routing (Gemini/NVIDIA), cascading model fallback (9 Gemini models), and DB persistence.</Callout>
    </>)
}

function ApiRoutesSection() {
    return (<>
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">POST /api/v1/execute — Prompt Execution</h4>
        <P>The primary PaaS endpoint for programmatic prompt execution.</P>
        <CodeBlock language="json" title="Request Body (Zod-validated)" code={`{
    "version_id": "uuid-of-prompt-version",
    "variables": { "name": "Alice", "topic": "Space" },
    "ab_version_id": "optional-uuid-for-ab-testing",
    "required_schema": { "title": "string" }
}`} />
        <CodeBlock language="json" title="Success Response (200)" code={`{
    "success": true,
    "data": "Generated prompt output...",
    "meta": {
        "model": "gemini-2.5-flash",
        "cached": false,
        "latency_ms": 1234,
        "tokens_input": 150,
        "tokens_output": 300,
        "cost_micro_usd": 45,
        "served_version": "uuid"
    }
}`} />
        <InfoTable
            headers={["Status", "Code", "Cause"]}
            rows={[
                ["401", "MISSING_API_KEY", "No x-api-key header"],
                ["403", "INVALID_API_KEY", "Key not found or revoked"],
                ["429", "RATE_LIMITED", "Exceeded 120 req/min"],
                ["400", "GUARDRAIL_BLOCK", "PII or profanity detected"],
                ["404", "NOT_FOUND", "Prompt version not found"],
                ["422", "SCHEMA_FAIL", "Output failed schema validation"],
            ]}
        />
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mt-6 mb-2">Other API Routes</h4>
        <InfoTable
            headers={["Route", "Method", "Description"]}
            rows={[
                ["/api/v1/keys", "POST", "Create new API keys (returns raw key once)"],
                ["/api/v1/keys/revoke", "POST", "Soft-revoke an API key"],
                ["/api/v1/cli", "POST", "CLI proxy endpoint"],
                ["/api/webhooks/clerk", "POST", "Clerk → Supabase user sync (Svix verified)"],
                ["/api/playground/analyze", "POST", "Playground prompt analysis"],
            ]}
        />
    </>)
}

function LibModulesSection() {
    return (<>
        <InfoTable
            headers={["Module", "Key Export", "Description"]}
            rows={[
                ["router.ts", "routeAndExecutePrompt()", "Cascading model router — Flash vs Pro heuristics + NVIDIA support"],
                ["cache.ts", "withCache()", "Upstash Redis exact-match caching (1hr TTL, <50ms hits)"],
                ["rate-limit.ts", "checkRateLimit()", "Fixed-window rate limiter (fail-open on Redis errors)"],
                ["guardrails.ts", "runGuardrails()", "PII detection (email, phone) + profanity filter"],
                ["api-keys.ts", "generateApiKey()", "pf_live_ prefixed keys with SHA-256 storage"],
                ["intelligence.ts", "analyzePrompt()", "Heuristic prompt analysis + cost optimization stats"],
                ["supabase.ts", "getSupabaseAdmin()", "Service Role client for V2 API engine"],
                ["supabaseAdmin.ts", "createAdminClient()", "Server-only admin client (webhooks, cron)"],
                ["supabaseClient.ts", "createClerkSupabaseClient()", "User-scoped client with Clerk JWT"],
                ["admin.ts", "isAdmin()", "Checks profiles.role === 'admin'"],
                ["constants.ts", "NAV_LINKS, SITE_CONFIG", "Navigation + site configuration"],
                ["utils.ts", "cn()", "clsx + tailwind-merge class merger"],
            ]}
        />
        <Callout type="tip"><strong>Router Heuristics:</strong> prompt length &gt; 4000 chars OR &quot;step-by-step&quot; / &quot;&lt;think&gt;&quot; keywords → routes to <code>gemini-2.0-pro</code>. Otherwise → <code>gemini-2.5-flash</code>. Cost: Pro = 1.25/5.00 µUSD, Flash = 0.075/0.30 µUSD per token (input/output).</Callout>
    </>)
}

function ComponentsSection() {
    return (<>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Layout (4 components)</h4>
        <P><code className="text-brand-purple">Shell</code> wraps children with <code className="text-brand-purple">Navbar</code> + <code className="text-brand-purple">Footer</code>. The Navbar is a fixed frosted-glass bar with responsive mobile menu. <code className="text-brand-purple">UserMenu</code> integrates Clerk user dropdown.</P>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Studio (9 components)</h4>
        <InfoTable headers={["Component", "Description"]} rows={[
            ["PromptEditor", "Main text area for raw prompt input"],
            ["PromptResult", "Displays refined prompt output"],
            ["AdvancedControls", "Temperature, TopP, TopK sliders"],
            ["CognitiveStatus", "Animated loader showing generation stages"],
            ["AuditModal", "Security/quality audit report modal"],
            ["VersionComparator", "Side-by-side diff view of versions"],
            ["SavePromptModal", "Save/export prompt dialog"],
            ["UpgradeModal", "Pro upgrade upsell when limits reached"],
        ]} />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">UI Primitives (11 components)</h4>
        <P>Button (CVA variants), Card, Badge, Input, Accordion, Slider, Toast, CopyButton, SpotlightCard, PricingToggle, Separator.</P>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Playground (12 components)</h4>
        <P>PlaygroundClient orchestrator, GameShell, HowToPlay modal, AnalysisPanel, 4 game mode components (FixerMode, BuilderMode, BattleMode, PrecisionMode), data files, and types.</P>
    </>)
}

function StudioSection() {
    return (<>
        <P>The Studio (<code className="text-brand-purple">/studio</code>) is the primary IDE workspace — a <strong className="text-white">split-panel interface</strong> for prompt engineering.</P>
        <P><strong className="text-white">Desktop:</strong> Side-by-side (Input | Output). <strong className="text-white">Mobile:</strong> Stacked. Left sidebar provides quick navigation to History, Analytics, Keys, Notifications.</P>
        <P><strong className="text-white">Workflow:</strong> User enters raw prompt → adjusts controls (Temperature, TopP, TopK, detail level) → clicks Generate → <code className="text-brand-purple">refinePrompt()</code> server action → CognitiveStatus shows thinking stages → refined prompt appears → user can Audit, Compare versions, or Save.</P>
        <InfoTable
            headers={["Feature", "Free Tier", "Pro Tier"]}
            rows={[
                ["Generations/day", "15", "500"],
                ["Rate limit", "3/min", "15/min"],
                ["Granular mode", "❌", "✅"],
                ["API key priority", "Standard pool", "\"Viper\" priority pool"],
            ]}
        />
    </>)
}

function GamificationSection() {
    return (<>
        <P><strong className="text-white">15+ unique badges</strong> across 5 rarity tiers, with <strong className="text-white">confetti effects</strong> for Expert/Legendary. Managed via <code className="text-brand-purple">BadgeProvider</code> (global React context).</P>
        <InfoTable
            headers={["Tier", "Examples", "Count"]}
            rows={[
                ["Common", "Prompt Rookie, Curious Mind, Helper", "3"],
                ["Skilled", "Constraint Master, Battle Analyst, Builder Apprentice, Consistent", "4"],
                ["Advanced", "Prompt Surgeon, Precision Engineer, Battle Commander, Streak Mindset", "4"],
                ["Expert", "Prompt Architect, Master Fixer, Oracle", "3"],
                ["Legendary", "Legend of PromptForge", "1"],
            ]}
        />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Playground Game Modes</h4>
        <InfoTable headers={["Mode", "Description", "Learning Goal"]} rows={[
            ["Fixer", "Debug broken prompts", "Identify and fix common prompt issues"],
            ["Builder", "Construct from templates", "Learn structured prompt patterns"],
            ["Battle", "Predict which prompt wins", "Develop prompt evaluation skills"],
            ["Precision", "Match exact constraints", "Master constraint engineering"],
        ]} />
    </>)
}

function V2PaaSSection() {
    return (<>
        <P>The V2 engine provides <strong className="text-white">headless prompt execution</strong> via REST API for machine-to-machine integration.</P>
        <Callout type="info"><strong>Key decisions:</strong> Isolated V2 schema, linear versioning (no Git branching), ownership enforcement (API key user_id must match prompt user_id), published-only execution, V1 fallback for backwards compatibility.</Callout>
        <CodeBlock language="text" title="Execution Pipeline" code={`POST /api/v1/execute
  ├── Auth: x-api-key → SHA-256 → v2_api_keys lookup
  ├── Rate Limit: 120/min/key (Redis INCR)
  ├── Validate: Zod schema (version_id UUID, variables)
  ├── Guardrails: PII + profanity check on variables
  ├── Fetch: v2_prompt_versions (+ ownership check)
  │   └── Fallback: prompt_versions → prompts
  ├── A/B Split: 50/50 random if ab_version_id provided
  ├── Cache: MD5(version_id + sorted vars) → Redis GET
  │   ├── HIT → Return cached (0 tokens, ~50ms)
  │   └── MISS → Continue to router
  ├── Router: Heuristic model selection
  ├── Execute: LLM call (Gemini or NVIDIA)
  ├── Schema Validate: Optional JSON output check
  ├── Telemetry: Async insert to v2_execution_logs
  └── Return: JSON { success, data, meta }`} />
    </>)
}

function SDKSection() {
    return (<>
        <P><strong className="text-white">npm:</strong> <code className="text-brand-purple">promptforge-server-sdk</code> v1.0.7 · <strong className="text-white">License:</strong> MIT</P>
        <CodeBlock language="bash" code={`npm install promptforge-server-sdk`} />
        <CodeBlock language="typescript" title="Usage Example" code={`import { PromptForgeClient } from 'promptforge-server-sdk';

const client = new PromptForgeClient({
    apiKey: process.env.PROMPTFORGE_API_KEY,
    baseURL: "https://prompt-forge-studio.vercel.app",
    timeoutMs: 30000,   // Default: 30s
    maxRetries: 2,      // Default: 2 (exponential backoff)
});

const result = await client.execute({
    versionId: "your-version-uuid",
    variables: { name: "Alice", topic: "Space" },
});

if (result.success) {
    console.log(result.data);           // Generated output
    console.log(result.meta.latencyMs); // Performance data
    console.log(result.meta.cached);    // Cache hit?
}`} />
        <InfoTable headers={["Method", "Description"]} rows={[
            ["execute(params)", "Execute a prompt version with variables"],
            ["abTest(params)", "Run an A/B test experiment"],
            ["getLogs(params?)", "Retrieve execution logs"],
            ["getCosts()", "Get cost analytics"],
        ]} />
        <Callout type="warn"><strong>Never</strong> call the SDK from client-side code — your API key will be exposed. Use it in Server Actions or API Routes only.</Callout>
    </>)
}

function CLISection() {
    return (<>
        <P><strong className="text-white">npm:</strong> <code className="text-brand-purple">prompt-forge-ai-cli</code> v1.0.0 · <strong className="text-white">License:</strong> ISC</P>
        <CodeBlock language="bash" code={`npm install -g prompt-forge-ai-cli
forge init my-project
cd my-project
forge   # Launch interactive studio`} />
        <InfoTable headers={["Command", "Description"]} rows={[
            [":help", "Show all available commands"],
            [":model", "Switch primary AI model"],
            [":auto", "Toggle auto-failover ON/OFF"],
            [":debug", "Toggle debug mode (HTTP status, latency, tokens)"],
            [":doctor", "Run connectivity diagnostics"],
            [":benchmark", "Compare all models on same prompt"],
            [":health", "Show model health statistics"],
            [":history", "Show session prompt history"],
            [":key", "Set your PromptForge API key"],
        ]} />
        <P>Built with: Commander.js, chalk, figlet, boxen, ora, gradient-string. Features intelligent failover with exponential backoff, multi-model support, persistent health tracking (<code className="text-brand-purple">~/.forge/health.json</code>), and structured JSON logging.</P>
    </>)
}

function SecuritySection() {
    return (<>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Security Headers (vercel.json)</h4>
        <InfoTable headers={["Header", "Value"]} rows={[
            ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"],
            ["Content-Security-Policy", "self + Clerk + Cloudflare + Google Fonts + Supabase"],
            ["X-Frame-Options", "DENY"],
            ["X-Content-Type-Options", "nosniff"],
            ["Referrer-Policy", "strict-origin-when-cross-origin"],
            ["Permissions-Policy", "geolocation=(), camera=(), microphone=()"],
        ]} />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">API Security</h4>
        <P>API Keys are SHA-256 hashed (raw key never stored). Rate limiting at 120 req/min/key via Redis. Input guardrails block PII (email, phone patterns) and profanity. Webhook signatures verified via Svix.</P>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">SEO</h4>
        <P>Comprehensive OpenGraph + Twitter Card meta tags. Google Site Verification active. Dynamic sitemap covers 10 public routes. robots.txt disallows <code className="text-brand-purple">/dashboard/</code>, <code className="text-brand-purple">/studio/</code>, <code className="text-brand-purple">/admin/</code>.</P>
    </>)
}

function DeploymentSection() {
    return (<>
        <P>Deployed on <strong className="text-white">Vercel</strong> with <code className="text-brand-purple">standalone</code> output mode. Remote images allowed from <code className="text-brand-purple">img.clerk.com</code>.</P>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4 mb-2">Post-Deployment Checklist</h4>
        <div className="space-y-2 my-3">
            {[
                "Set all environment variables in Vercel Dashboard",
                "Configure Clerk webhook URL → /api/webhooks/clerk",
                "Run database migrations in Supabase SQL editor",
                "Verify Google Search Console verification",
                "Test API key generation at /studio/keys",
                "Validate webhook sync by creating a test user",
            ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <div className="w-5 h-5 rounded-md bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple text-[10px] font-bold mt-0.5 shrink-0">{i + 1}</div>
                    {item}
                </div>
            ))}
        </div>
    </>)
}
