# PromptForge Studio — Complete Developer Documentation

> **Version:** 1.4.0 | **Last Updated:** March 2026 | **Author:** Anil Suthar  
> **Live URL:** [prompt-forge-studio.vercel.app](https://prompt-forge-studio.vercel.app)  
> **Repository:** [github.com/ani12004/Prompt-Forge-Studio](https://github.com/ani12004/Prompt-Forge-Studio)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Directory Structure](#4-directory-structure)
5. [Environment Variables](#5-environment-variables)
6. [Getting Started](#6-getting-started)
7. [Database Schema (Supabase)](#7-database-schema-supabase)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Routing & Middleware](#9-routing--middleware)
10. [Design System & Theming](#10-design-system--theming)
11. [Page & Layout Architecture](#11-page--layout-architecture)
12. [Server Actions Reference](#12-server-actions-reference)
13. [API Routes Reference](#13-api-routes-reference)
14. [Core Library Modules (`lib/`)](#14-core-library-modules-lib)
15. [Component Library](#15-component-library)
16. [The Studio Engine](#16-the-studio-engine)
17. [Gamification & Playground](#17-gamification--playground)
18. [V2 PaaS Execution Engine](#18-v2-paas-execution-engine)
19. [Node.js SDK (`promptforge-server-sdk`)](#19-nodejs-sdk-promptforge-server-sdk)
20. [Forge CLI (`prompt-forge-ai-cli`)](#20-forge-cli-prompt-forge-ai-cli)
21. [SEO & Security](#21-seo--security)
22. [Deployment (Vercel)](#22-deployment-vercel)
23. [Changelog](#23-changelog)

---

## 1. Project Overview

**PromptForge Studio** is an advanced development environment (ADE) for prompt engineering. It serves as middleware between human intent and LLM execution, using heuristic analysis and semantic understanding to detect ambiguity in natural language, then restructuring requests into high-fidelity, production-grade AI prompts.

### The Problem
Raw prompts are often ambiguous, missing constraints, or unstructured — leading to suboptimal LLM performance, wasted tokens, and inconsistent outputs.

### The Solution
The platform automatically restructures user intent into optimized prompts that improve AI consistency, reduce latency, and lower costs. It provides:
- A **web-based Studio IDE** for interactive prompt crafting
- A **gamified Playground** for learning prompt engineering
- A **headless PaaS API** for programmatic prompt execution
- An **npm SDK** and **CLI tool** for developer integration

### Target Audience
- Prompt Engineers
- AI/ML Developers
- Product Managers building AI features
- Enterprise teams managing prompt libraries

---

## 2. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.1.4 |
| **UI Library** | React | 19.2.3 |
| **Language** | TypeScript | ^5 |
| **Styling** | Tailwind CSS | v4 |
| **Animations** | Framer Motion | ^12.29.0 |
| **Icons** | Lucide React | ^0.562.0 |
| **Typography Plugin** | @tailwindcss/typography | ^0.5.19 |
| **CSS Utilities** | clsx, tailwind-merge, CVA | latest |
| **Authentication** | Clerk (@clerk/nextjs) | ^6.36.9 |
| **Database** | Supabase (PostgreSQL) | ^2.91.0 |
| **Supabase SSR** | @supabase/ssr | ^0.8.0 |
| **Caching** | Upstash Redis | ^1.36.2 |
| **AI Engine** | Google Generative AI SDK | ^0.24.1 |
| **AI Engine (alt)** | @google/genai | ^1.42.0 |
| **Validation** | Zod | ^4.3.6 |
| **Email** | Resend | ^6.8.0 |
| **Webhook Verification** | Svix | ^1.84.1 |
| **Smooth Scrolling** | Lenis | ^1.3.17 |
| **Confetti Effects** | canvas-confetti | ^1.9.4 |
| **Markdown Rendering** | react-markdown + remark-gfm | latest |
| **Analytics** | @vercel/analytics | ^1.6.1 |
| **Infrastructure** | Vercel (standalone output) | — |

---

## 3. Architecture Overview

The application follows a **three-layer architecture**:

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                       │
│  Next.js App Router (React 19 Server Components)     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Marketing │  │  Studio  │  │   Playground     │  │
│  │  Pages    │  │   IDE    │  │   (Gamified)     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
├─────────────────────────────────────────────────────┤
│                   SERVER LAYER                       │
│  ┌──────────────┐  ┌───────────────────────────┐   │
│  │ Server       │  │ API Routes                 │   │
│  │ Actions (11) │  │ /api/v1/execute            │   │
│  │ generate.ts  │  │ /api/v1/keys               │   │
│  │ audit.ts     │  │ /api/v1/cli                │   │
│  │ analytics.ts │  │ /api/webhooks/clerk        │   │
│  │ ...          │  │ /api/playground/analyze     │   │
│  └──────────────┘  └───────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│                 INFRASTRUCTURE                       │
│  ┌─────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Clerk  │  │ Supabase │  │  Upstash Redis   │  │
│  │  Auth   │  │ Postgres │  │  (Cache + Rate)  │  │
│  └─────────┘  └──────────┘  └──────────────────┘  │
│                    ┌──────────────────┐              │
│                    │ Google Gemini AI │              │
│                    │ NVIDIA AI APIs   │              │
│                    └──────────────────┘              │
└─────────────────────────────────────────────────────┘
```

### SDK/API Execution Flow

```
SDK/CLI → POST /api/v1/execute
  → API Key Validation (SHA-256 hash lookup in v2_api_keys)
  → Rate Limiting (Upstash Redis, 120 req/min per key)
  → Zod Payload Validation
  → Guardrails Check (PII, profanity)
  → Prompt Fetch (v2_prompt_versions → v1 fallback)
  → Ownership Verification (key.user_id === prompt.user_id)
  → Variable Injection ({{var}} replacement)
  → Exact-Match Cache Check (MD5 hash → Redis)
  → [Cache Miss] → Model Router (Flash vs Pro heuristics)
  → LLM Execution (Gemini or NVIDIA)
  → Schema Validation (optional)
  → Async Telemetry Log (v2_execution_logs)
  → JSON Response
```

---

## 4. Directory Structure

```
PromptForge AI/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Clerk, fonts, global styles)
│   ├── globals.css               # Design system tokens + utilities
│   ├── icon.png                  # Favicon
│   ├── sitemap.ts                # Dynamic sitemap generator
│   ├── robots.ts                 # Robots.txt configuration
│   │
│   ├── (auth)/                   # Auth route group (Clerk SSO)
│   ├── (legal)/                  # Legal pages (Privacy, Terms)
│   ├── (marketing)/              # Public pages (Home, About, Features, Pricing, etc.)
│   │
│   ├── actions/                  # Server Actions (11 files)
│   │   ├── generate.ts           # Core prompt refinement engine
│   │   ├── audit.ts              # Prompt security auditor
│   │   ├── analyze.ts            # Prompt analysis
│   │   ├── analytics.ts          # Dashboard analytics queries
│   │   ├── auth.ts               # Auth helper actions
│   │   ├── community.ts          # Community forum CRUD
│   │   ├── contact.ts            # Contact form + admin inbox
│   │   ├── gamification.ts       # Badge/XP award system
│   │   ├── notifications.ts      # User notification system
│   │   ├── save-prompt.ts        # Prompt persistence
│   │   └── subscription.ts       # Tier checking
│   │
│   ├── api/                      # API Routes
│   │   ├── v1/
│   │   │   ├── execute/route.ts  # PaaS prompt execution endpoint
│   │   │   ├── cli/route.ts      # CLI-specific proxy endpoint
│   │   │   └── keys/
│   │   │       ├── route.ts      # API key CRUD
│   │   │       └── revoke/route.ts
│   │   ├── webhooks/clerk/route.ts  # Clerk → Supabase user sync
│   │   └── playground/analyze/      # Playground analysis endpoint
│   │
│   ├── admin/                    # Admin dashboard (RBAC-protected)
│   ├── dashboard/                # User dashboard
│   ├── studio/                   # Prompt Studio IDE
│   │   ├── layout.tsx            # Studio-specific sidebar layout
│   │   ├── page.tsx              # Main editor workspace
│   │   ├── analytics/            # Usage analytics view
│   │   ├── history/              # Prompt history view
│   │   ├── keys/                 # API key management view
│   │   └── notifications/        # Notification center view
│   ├── playground/               # Gamified learning environment
│   ├── profile/                  # User profile + badges
│   ├── settings/                 # User settings
│   ├── login/                    # Login page
│   └── sso-callback/             # Clerk SSO callback handler
│
├── components/                   # React Components (52 files)
│   ├── dashboard/                # Dashboard-specific components
│   ├── gamification/             # Badge system (BadgeProvider, BadgeToast, etc.)
│   ├── interactive/              # Interactive demo component
│   ├── layout/                   # Shell, Navbar, Footer, UserMenu
│   ├── marketing/                # Landing page sections, Pricing, Docs
│   ├── playground/               # Game modes (Fixer, Builder, Battle, Precision)
│   ├── studio/                   # Editor, Controls, Modals, Result panels
│   └── ui/                       # Reusable primitives (Button, Card, Toast, etc.)
│
├── lib/                          # Core utility libraries (12 files)
│   ├── router.ts                 # Cascading AI model router
│   ├── cache.ts                  # Upstash Redis caching layer
│   ├── rate-limit.ts             # Fixed-window rate limiter
│   ├── guardrails.ts             # Input safety checks (PII, profanity)
│   ├── api-keys.ts               # API key generation + validation
│   ├── intelligence.ts           # Prompt analysis + cost optimization
│   ├── supabase.ts               # Admin Supabase client (Service Role)
│   ├── supabaseAdmin.ts          # Admin client (server-only)
│   ├── supabaseClient.ts         # User-scoped Supabase client (Clerk JWT)
│   ├── admin.ts                  # Admin role checker
│   ├── constants.ts              # Navigation links + site config
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
│
├── forge-cli/                    # CLI Tool (npm: prompt-forge-ai-cli)
│   └── src/
│       ├── index.js              # CLI entrypoint (Commander.js)
│       ├── studio.js             # Interactive REPL shell
│       ├── ui.js                 # Terminal UI (chalk, figlet, boxen)
│       ├── auth.js               # API key management
│       ├── config.js             # Project config loader
│       ├── init.js               # Project scaffolding
│       ├── core/
│       │   ├── logger.js         # Structured JSON logging
│       │   ├── health-tracker.js # Provider health tracking
│       │   └── failover.js       # Retry + failover engine
│       └── models/
│           ├── gemini.js         # Gemini model driver
│           └── nvidia.js         # NVIDIA model driver
│
├── promptforge-sdk/              # Node.js SDK (npm: promptforge-server-sdk v1.0.7)
│   └── src/
│       ├── index.ts              # Entry point (re-exports)
│       ├── client.ts             # PromptForgeClient class
│       ├── types.ts              # TypeScript interfaces
│       ├── errors.ts             # PromptForgeError class
│       └── utils.ts              # fetchWithTimeout utility
│
├── public/                       # Static assets (logos, badges, OG images)
├── schema.sql                    # Gamification badge schema + seed data
├── add_notification.sql          # Notification table migration
├── award_legendary.sql           # Legendary badge award script
│
├── middleware.ts                  # Clerk auth middleware
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config (standalone output)
├── postcss.config.mjs            # PostCSS config
├── eslint.config.mjs             # ESLint config (next/core-web-vitals + TS)
├── vercel.json                   # Security headers + deployment config
└── LICENSE                       # Proprietary license
```

---

## 5. Environment Variables

Create a `.env.local` file in the project root with the following required variables:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk frontend publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk backend secret key |
| `CLERK_WEBHOOK_SECRET` | ✅ | Svix webhook signing secret from Clerk Dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (bypasses RLS) |
| `GEMINI_API_KEY` | ✅ | Primary Google Gemini API key ("Mechanic") |
| `GEMINI_API_KEY_2` | ⚡ | Secondary key for free-tier users ("Gamer") |
| `GEMINI_API_KEY_4` | ⚡ | Priority key for Pro users ("Viper") |
| `GEMINI_API_KEY_5` | ⚡ | Additional fallback key |
| `NVIDIA_API_KEY` | ⚡ | NVIDIA AI API key for Llama/Nemotron models |
| `UPSTASH_REDIS_REST_URL` | ⚡ | Upstash Redis REST URL (caching + rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | ⚡ | Upstash Redis REST token |
| `RESEND_API_KEY` | ⚡ | Resend email service key (admin inbox replies) |

> ✅ = Required for basic operation | ⚡ = Optional but recommended for full functionality

### API Key Routing Strategy (4-Key System)
The generate action uses a multi-key pool with priority routing:
- **Key 1 ("Mechanic"):** `GEMINI_API_KEY` — Free-tier fallback
- **Key 2 ("Gamer"):** `GEMINI_API_KEY_2` — Free-tier primary (high traffic)
- **Key 4 ("Viper"):** `GEMINI_API_KEY_4` — Pro-tier primary
- **Key 5:** `GEMINI_API_KEY_5` — Additional Pro fallback

---

## 6. Getting Started

### Prerequisites
- **Node.js** ≥ 18.0.0
- **npm** (included with Node.js)
- A **Supabase** project with tables created
- A **Clerk** application configured
- At least one **Google Gemini API key**

### Installation

```bash
# Clone the repository
git clone https://github.com/ani12004/Prompt-Forge-Studio.git
cd "PromptForge AI"

# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
# Execute schema.sql and add_notification.sql in your Supabase SQL editor

# Start the development server
npm run dev
```

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Next.js dev server (hot reload) |
| `build` | `npm run build` | Production build |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |

---

## 7. Database Schema (Supabase)

The database uses **two schema generations** in the same PostgreSQL instance:

### V1 Tables (Web Application)

| Table | Purpose | Key Columns |
|---|---|---|
| `profiles` | User profiles (synced from Clerk) | `id`, `email`, `full_name`, `avatar_url`, `subscription_tier`, `role` |
| `prompts` | Prompt containers | `id`, `user_id`, `original_prompt`, `refined_prompt`, `intent`, `detail_level`, `model_used`, `current_version_id` |
| `prompt_versions` | Version history for prompts | `id`, `prompt_id`, `version_number`, `content`, `model_config`, `changelog`, `created_by` |
| `prompt_analytics` | Aggregated usage analytics | `prompt_id`, token counts, latency metrics |
| `prompt_executions` | Individual execution records | Latency, model, cost per execution |
| `badges` | Badge definitions (15+ badges) | `name`, `description`, `icon`, `rarity`­ (Common→Legendary), `unlock_condition` |
| `user_badges` | User→Badge join table | `user_id`, `badge_id`, `earned_at` |
| `experiments` | A/B test experiments | Experiment definitions |
| `experiment_variants` | A/B test variants | Variant configurations |
| `notifications` | User notifications | `user_id`, `message`, `read` |
| `admin_audit_logs` | Admin action audit trail | Action type, admin user, timestamp |
| `contact_messages` | Contact form submissions | `name`, `email`, `message`, `read` |
| `community_posts` | Community forum posts | `user_id`, `title`, `content`, `likes` |
| `community_replies` | Threaded replies | `post_id`, `user_id`, `content` |

### V2 Tables (PaaS API Engine)

| Table | Purpose | Key Columns |
|---|---|---|
| `v2_prompts` | API prompt definitions | `id`, `user_id`, `name`, `description` |
| `v2_prompt_versions` | Execution templates | `id`, `prompt_id`, `version_tag`, `system_prompt`, `template`, `published` |
| `v2_api_keys` | API key store (SHA-256 hashed) | `id`, `user_id`, `key_hash`, `prefix`, `revoked`, `last_used_at` |
| `v2_execution_logs` | Execution telemetry | `version_id`, `api_key_id`, `latency_ms`, `model_used`, `cached_hit`, `tokens_input`, `tokens_output`, `cost_micro_usd` |

### Row Level Security (RLS)
- All tables have RLS **enabled**
- `badges`: Public read access for all users
- `user_badges`: Users can only read/insert their own badges
- V2 API tables use **Service Role** client (bypasses RLS for server-side access)
- Community tables use Admin client for inserts to avoid JWT issues

### Badge Rarity Tiers

| Tier | Examples | Count |
|---|---|---|
| **Common** | Prompt Rookie, Curious Mind, Helper | 3 |
| **Skilled** | Constraint Master, Battle Analyst, Builder Apprentice, Consistent | 4 |
| **Advanced** | Prompt Surgeon, Precision Engineer, Battle Commander, Streak Mindset | 4 |
| **Expert** | Prompt Architect, Master Fixer, Oracle | 3 |
| **Legendary** | Legend of PromptForge | 1 |

---

## 8. Authentication & Authorization

### Clerk Integration
- **Provider:** Clerk (`@clerk/nextjs` v6.36.9)
- **Root Layout:** `ClerkProvider` wraps the entire application
- **Middleware:** `clerkMiddleware` protects routes via `createRouteMatcher`

### Three Supabase Client Types

| Client | File | Purpose | RLS |
|---|---|---|---|
| **User Client** | `lib/supabaseClient.ts` | User-scoped queries with Clerk JWT | ✅ Enforced |
| **Admin Client** | `lib/supabaseAdmin.ts` | Server-only operations (webhooks, cron) | ❌ Bypassed |
| **API Admin** | `lib/supabase.ts` | V2 API execution engine | ❌ Bypassed |

### User Client Usage
```typescript
const token = await getToken({ template: "supabase" });
const supabase = createClerkSupabaseClient(token);
// Queries are scoped to the authenticated user via RLS
```

### Admin Role Check
```typescript
// lib/admin.ts
export async function isAdmin(): Promise<boolean> {
    const { userId } = await auth();
    const supabase = createAdminClient();
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
    return profile?.role === 'admin';
}
```

### Clerk Webhook Sync (`/api/webhooks/clerk`)
When Clerk fires `user.created`, `user.updated`, or `user.deleted` events, the webhook handler:
1. Verifies the Svix signature
2. Upserts/deletes the user in the `profiles` table using the Admin client
3. Syncs `email`, `full_name`, and `avatar_url`

---

## 9. Routing & Middleware

### Protected Routes
Defined in `middleware.ts`:

```typescript
const isProtectedRoute = createRouteMatcher([
    '/studio(.*)',
    '/dashboard(.*)',
    '/profile(.*)',
    '/playground(.*)',
]);
```

Any request to these routes calls `auth.protect()`, redirecting unauthenticated users to the login page.

### Route Groups (Next.js App Router)

| Group | Path Prefix | Purpose |
|---|---|---|
| `(auth)` | `/sign-in`, `/sign-up` | Clerk auth pages |
| `(legal)` | `/privacy`, `/terms` | Legal documents |
| `(marketing)` | `/`, `/about`, `/features`, `/pricing`, `/contact`, `/docs`, `/community` | Public pages |

### Matcher Configuration
The middleware matcher skips static assets (`_next`, images, fonts, etc.) but always runs for `/api` and `/trpc` routes.

---

## 10. Design System & Theming

### Theme: "Cyber-Modern" Dark Mode

Defined in `app/globals.css` using Tailwind CSS v4 `@theme` directive:

| Token | Value | Usage |
|---|---|---|
| `--color-brand-purple` | `#8b5cf6` | Primary accent |
| `--color-brand-violet` | `#d8b4fe` | Light accent |
| `--color-brand-indigo` | `#6366f1` | Secondary accent |
| `--color-brand-dark` | `#050508` | Page background |
| `--color-brand-darker` | `#020204` | Deeper background |
| `--color-brand-surface` | `#0f0f13` | Card/panel background |
| `--color-status-success` | `#34d399` | Success indicators |
| `--color-status-error` | `#f87171` | Error indicators |
| `--shadow-glow` | 60px purple glow | Hover effects |
| `--shadow-glass` | 32px dark shadow | Glass panels |

### Typography
- **UI Font:** Inter (`--font-inter`)
- **Heading Font:** Poppins (`--font-poppins`, weights: 400–700)
- Both loaded via `next/font/google` with `display: swap`

### Custom Utility Classes

| Class | Effect |
|---|---|
| `.glass-panel` | Frosted glass effect (`backdrop-blur-xl`, translucent surface) |
| `.glass-card` | Interactive glass card with hover transition |
| `.glass-card-hover` | Purple border glow on hover |
| `.text-gradient` | White→Violet→Purple gradient text |
| `.text-gradient-purple` | Purple→Indigo gradient text |
| `.animate-fade-in-up` | Entrance animation (opacity + translateY) |
| `.animate-float` | 6s floating animation |
| `.animate-pulse-slow` | 4s subtle opacity pulse |

### Custom Scrollbar
Minimal 6px scrollbar with `#333` thumb on transparent track.

---

## 11. Page & Layout Architecture

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── ClerkProvider
│   └── <html> + <body>
│       ├── Global gradient background (fixed, z-[-1])
│       └── BadgeProvider (gamification context)
│           └── Shell (Navbar + Footer wrapper)
│               └── {children}
│
├── StudioLayout (app/studio/layout.tsx)
│   └── Left Sidebar (History, Analytics, Keys, Notifications)
│       └── Main workspace area
│
└── AdminLayout (app/admin/)
    └── RBAC enforcement + system monitoring
```

### Page Route Map

| Route | Page Type | Auth Required | Description |
|---|---|---|---|
| `/` | Marketing | ❌ | Landing page with hero, features, interactive demos, FAQ |
| `/about` | Marketing | ❌ | Mission, values, team |
| `/features` | Marketing | ❌ | Feature breakdown (Understand, Build, Compete) |
| `/pricing` | Marketing | ❌ | Subscription plans (Hobbyist vs Pro) |
| `/contact` | Marketing | ❌ | Contact form |
| `/docs` | Marketing | ❌ | Documentation hub (Introduction, SDK, API) |
| `/community` | Marketing | ❌ | Discussion forum |
| `/login` | Auth | ❌ | Login page |
| `/privacy` | Legal | ❌ | Privacy policy |
| `/terms` | Legal | ❌ | Terms of service |
| `/dashboard` | App | ✅ | User hub (stats, recent prompts, tier info) |
| `/studio` | App | ✅ | Main prompt editor IDE |
| `/studio/history` | App | ✅ | Prompt version history |
| `/studio/analytics` | App | ✅ | Usage analytics |
| `/studio/keys` | App | ✅ | API key management |
| `/studio/notifications` | App | ✅ | Notification center |
| `/playground` | App | ✅ | Gamified prompt challenges |
| `/profile` | App | ✅ | Profile + badge showcase |
| `/settings` | App | ✅ | User settings |
| `/admin` | Admin | ✅ + Admin Role | System dashboard, user management, inbox |

---

## 12. Server Actions Reference

All server actions are in `app/actions/` and use the `"use server"` directive.

### `generate.ts` — Core Engine
**Function:** `refinePrompt(prompt, detailLevel, options)`

The heart of PromptForge. Converts raw user input into optimized prompts.

**Flow:**
1. Input validation (minimum 3 chars)
2. Demo mode fallback (no API keys → mock response)
3. Authentication gate (Clerk `auth()`)
4. Tier detection (free vs pro from `profiles.subscription_tier`)
5. Rate limiting: Free = 3/min, 15/day | Pro = 15/min, 500/day
6. Feature gating (Granular mode = Pro only)
7. API key pool selection based on tier
8. System prompt construction with detail level modifier
9. Provider routing (NVIDIA direct API or Gemini cascading fallback)
10. Gemini cascading fallback: tries models in order — `gemini-3.1-pro` → `gemini-3-pro` → `gemini-3-flash` → `gemini-2.5-pro` → `gemini-2.5-flash` → `gemini-2-pro-exp` → `gemini-2-flash` → `gemini-1.5-pro` → `gemini-1.5-flash`
11. DB persistence (prompt + version insert)
12. Returns `{ success, content, promptId, versionId }`

**Detail Levels:**
| Level | Modifier |
|---|---|
| Short | Minimal structure, concise constraints |
| Medium | Clear sections, essential constraints |
| Detailed | Fully structured, examples included |
| Granular | Exhaustive step-by-step (Pro only) |

### `audit.ts` — Prompt Auditor
Pre-execution security and clarity analysis. Checks for vague instructions, injection vulnerabilities, and produces improvement suggestions.

### `analytics.ts` — Dashboard Analytics
Fetches user-specific KPI data: token usage, cost tracking, prompt counts, model distribution.

### `gamification.ts` — Badge & XP System
Award badges based on unlock conditions, track XP/levels, validate badge eligibility.

### `community.ts` — Forum CRUD
Create/read posts and replies, like/unlike, thread management using Admin client.

### `contact.ts` — Contact + Admin Inbox
Contact form submission, admin inbox reads, email replies via Resend.

### `save-prompt.ts` — Prompt Persistence
Save/update prompt versions, manage version history.

### `subscription.ts` — Tier Checking
Check user subscription tier from profiles table.

### `notifications.ts` — Notification System
CRUD for user notifications.

---

## 13. API Routes Reference

### `POST /api/v1/execute` — Prompt Execution
The primary PaaS endpoint for programmatic prompt execution.

**Headers:**
| Header | Required | Description |
|---|---|---|
| `x-api-key` | ✅ | PromptForge API key (`pf_live_...`) |
| `Content-Type` | ✅ | `application/json` |

**Request Body (Zod-validated):**
```json
{
    "version_id": "uuid-of-prompt-version",
    "variables": { "name": "Alice", "topic": "Space" },
    "ab_version_id": "optional-uuid-for-ab-testing",
    "required_schema": { "optional": "schema-keys" }
}
```

**Success Response (200):**
```json
{
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
}
```

**Error Codes:**

| Status | Code | Cause |
|---|---|---|
| 401 | `MISSING_API_KEY` | No `x-api-key` header |
| 403 | `INVALID_API_KEY` | Key not found or revoked |
| 429 | — | Rate limit exceeded (120/min) |
| 400 | — | Invalid payload or guardrail block |
| 404 | — | Prompt version not found (includes debug info) |
| 422 | — | Output failed schema validation |
| 500 | — | Internal server error |

### `POST /api/v1/keys` — API Key Management
Create new API keys. Returns the raw key **once** (stored as SHA-256 hash).

### `POST /api/v1/keys/revoke` — Revoke API Key
Soft-revoke an API key by setting `revoked: true`.

### `POST /api/v1/cli` — CLI Proxy
Proxy endpoint for the Forge CLI tool.

### `POST /api/webhooks/clerk` — User Sync Webhook
Receives Clerk webhook events, verifies Svix signatures, syncs user data to Supabase `profiles`.

### `POST /api/playground/analyze` — Prompt Analysis
Analyzes prompt structure for the Playground learning environment.

---

## 14. Core Library Modules (`lib/`)

### `router.ts` — Cascading Model Router
**Function:** `routeAndExecutePrompt(systemPrompt, template, variables, forcedModel?)`

**Routing Heuristics:**
- If `template.length > 4000` OR system prompt contains "step-by-step" OR template contains `<think>` → Route to **`gemini-2.0-pro-exp-02-05`** (Pro tier)
- Otherwise → Route to **`gemini-2.5-flash`** (fast, cheap)
- If model starts with `nvidia/` → Direct NVIDIA API call

**Cost Calculation:**
| Model Type | Input (per token) | Output (per token) |
|---|---|---|
| Gemini Pro | 1.25 µUSD | 5.00 µUSD |
| Gemini Flash | 0.075 µUSD | 0.30 µUSD |
| NVIDIA | ~0.1 µUSD | ~0.3 µUSD |

### `cache.ts` — Exact-Match Caching
**Function:** `withCache<T>(key, fetcher, ttlSeconds?)`

- Powered by **Upstash Redis** (serverless)
- Default TTL: **1 hour** (3600s)
- Cache key format: `pf:exec:{md5(version_id + sorted_variables)}`
- Cache miss → executes fetcher → stores result async (fire-and-forget)
- Graceful degradation: if Redis is down, falls through to fetcher
- Cache hit latency: **< 50ms**

### `rate-limit.ts` — Fixed-Window Rate Limiter
**Function:** `checkRateLimit(identifier, limit, windowSeconds)`

- Uses Redis `INCR` + `EXPIRE` for sliding windows
- **Fail-open** design: if Redis is unavailable, requests are allowed
- API execution limit: **120 req/min per API key**

### `guardrails.ts` — Input Safety
**Functions:**
- `runGuardrails(input)` — Blocks profanity and PII (email patterns, phone numbers)
- `validateSchema(output, requiredSchema)` — Validates JSON output against expected keys

### `api-keys.ts` — API Key Management
- `generateApiKey()` — Generates `pf_live_` prefixed keys with SHA-256 hashing
- `hashKey(rawKey)` — SHA-256 hash for storage/lookup
- `validateApiKey(rawKey)` — Validates key exists and isn't revoked, updates `last_used_at` async

### `intelligence.ts` — Prompt Intelligence
- `analyzePrompt(prompt)` — Heuristic analysis: detects redundancy, checks for schema definitions, suggests improvements
- `getCostOptimizationStats()` — Aggregates execution logs for cost insights
- `computeABTestWinRate(versionA, versionB)` — Compares A/B test variant traffic

---

## 15. Component Library

### Layout Components (`components/layout/`)

| Component | File | Description |
|---|---|---|
| `Shell` | `Shell.tsx` | Wraps children with Navbar and Footer |
| `Navbar` | `Navbar.tsx` | Fixed frosted-glass navbar with responsive mobile menu |
| `Footer` | `Footer.tsx` | Site-wide footer with navigation links |
| `UserMenu` | `UserMenu.tsx` | Clerk-integrated user dropdown menu |

### Studio Components (`components/studio/`)

| Component | Description |
|---|---|
| `PromptEditor` | Main text area for raw prompt input |
| `PromptResult` | Displays refined prompt output |
| `AdvancedControls` | Temperature, TopP, TopK sliders |
| `CognitiveStatus` | Animated loader showing generation stages |
| `AuditModal` | Security/quality audit report modal |
| `VersionComparator` | Side-by-side diff view of prompt versions |
| `SavePromptModal` | Save/export prompt dialog |
| `UpgradeModal` | Pro upgrade upsell when limits reached |
| `LiveAnalysis` | Real-time prompt analysis indicators |

### Playground Components (`components/playground/`)

| Component | Description |
|---|---|
| `PlaygroundClient` | Main playground orchestrator |
| `PlaygroundLanding` | Mode selection landing page |
| `GameShell` | Game wrapper with XP/progress tracking |
| `HowToPlay` | Mode-specific instruction modal |
| `AnalysisPanel` | Prompt analysis results display |
| `modes/FixerMode` | Debug/repair broken prompts |
| `modes/BuilderMode` | Template-based prompt construction |
| `modes/BattleMode` | AI vs User prompt prediction |
| `modes/PrecisionMode` | Constraint-matching challenges |

### UI Primitives (`components/ui/`)

| Component | Description | Pattern |
|---|---|---|
| `Button` | Primary button with variants | CVA |
| `Card` | Glass-morphism card | CSS utility |
| `Badge` | Rarity-styled badge display | — |
| `Input` | Styled text input | — |
| `Accordion` | Expandable FAQ sections | — |
| `Slider` | Range slider for controls | — |
| `Toast` | Notification toast popup | — |
| `CopyButton` | One-click copy to clipboard | — |
| `SpotlightCard` | Hover-spotlight effect card | — |
| `PricingToggle` | Monthly/yearly toggle | — |
| `Separator` | Visual divider | — |

---

## 16. The Studio Engine

The Studio (`/studio`) is the primary IDE workspace — a split-panel interface for prompt engineering.

### Layout
- **Desktop:** Side-by-side split (Input | Output)  
- **Mobile:** Stacked (Input above Output)
- **Left Sidebar:** Quick navigation to History, Analytics, Keys, Notifications

### Workflow
1. User enters raw prompt in `PromptEditor`
2. Adjusts `GranularOptions` (Temperature, TopP, TopK) and detail level
3. Clicks **"Generate"** → calls `refinePrompt()` server action
4. `CognitiveStatus` shows animated thinking stages
5. Refined prompt appears in `PromptResult`
6. User can **Audit** (security check), **Compare** (version diff), or **Save**

### Subscription Gating
| Feature | Free | Pro |
|---|---|---|
| Generations/day | 15 | 500 |
| Rate limit | 3/min | 15/min |
| Granular mode | ❌ | ✅ |
| API key priority | Standard pool | Priority ("Viper") pool |

---

## 17. Gamification & Playground

### Badge System
- **15+ unique badges** across 5 rarity tiers
- Badge images stored in `/public/badges/`
- Managed via `BadgeProvider` React context (global)
- `BadgeToast` component shows earn notifications with confetti for Expert/Legendary

### Playground Game Modes

| Mode | Description | Learning Goal |
|---|---|---|
| **Fixer** | Debug broken prompts | Identify and fix common prompt issues |
| **Builder** | Construct prompts from templates | Learn structured prompt patterns |
| **Battle** | Predict which prompt wins | Develop prompt evaluation skills |
| **Precision** | Match exact constraints | Master constraint engineering |

---

## 18. V2 PaaS Execution Engine

The V2 engine provides headless prompt execution via REST API, designed for machine-to-machine integration.

### Key Architecture Decisions
- **Isolated Schema:** V2 tables (`v2_*`) are separate from V1 web app tables
- **Linear Versioning:** Sequential version tags (no Git-style branching)
- **Ownership Enforcement:** API key `user_id` must match prompt `user_id`
- **Published Lock:** Only `published: true` versions can be executed via API
- **V1 Fallback:** If version ID not found in V2, checks `prompt_versions` then `prompts` (backwards compatibility)

### Execution Pipeline
```
POST /api/v1/execute
  │
  ├── Auth: x-api-key → SHA-256 → v2_api_keys lookup
  ├── Rate Limit: 120/min/key (Redis INCR)
  ├── Validate: Zod schema (version_id UUID, variables)
  ├── Guardrails: PII + profanity check on variables
  │
  ├── Fetch: v2_prompt_versions (+ ownership check)
  │   └── Fallback: prompt_versions → prompts
  │
  ├── A/B Split: 50/50 random if ab_version_id provided
  │
  ├── Cache: MD5(version_id + sorted vars) → Redis GET
  │   ├── HIT: Return cached result (0 tokens, ~50ms)
  │   └── MISS: Continue to router
  │
  ├── Router: Heuristic model selection
  │   ├── Large/complex → gemini-2.0-pro
  │   ├── Standard → gemini-2.5-flash
  │   └── nvidia/* prefix → NVIDIA API
  │
  ├── Execute: LLM call via Google/NVIDIA SDK
  ├── Schema Validate: Optional JSON output check
  ├── Telemetry: Async insert to v2_execution_logs
  └── Return: JSON with data + metadata
```

---

## 19. Node.js SDK (`promptforge-server-sdk`)

**npm:** `promptforge-server-sdk` v1.0.7  
**License:** MIT

### Installation
```bash
npm install promptforge-server-sdk
```

### Usage
```typescript
import { PromptForgeClient } from 'promptforge-server-sdk';

const client = new PromptForgeClient({
    apiKey: process.env.PROMPTFORGE_API_KEY,
    baseURL: "https://prompt-forge-studio.vercel.app",
    timeoutMs: 30000,    // Default: 30s
    maxRetries: 2,       // Default: 2
});

const result = await client.execute({
    versionId: "your-version-uuid",
    variables: { name: "Alice", topic: "Space" },
    abVersionId: "optional-ab-variant-uuid",
    requiredSchema: { title: "string" }, // Optional
});

if (result.success) {
    console.log(result.data);          // Generated output
    console.log(result.meta.latencyMs); // Performance data
}
```

### SDK Methods

| Method | Description |
|---|---|
| `execute(params)` | Execute a prompt version with variables |
| `abTest(params)` | Run an A/B test experiment |
| `getLogs(params?)` | Retrieve execution logs |
| `getCosts()` | Get cost analytics |

### SDK Internals
- **Retry Logic:** Exponential backoff (2^attempt seconds), retries on 5xx and 429
- **No Client-Side Usage:** SDK must only be used server-side (API keys exposed otherwise)
- **Case Mapping:** Backend `snake_case` → SDK `CamelCase` (e.g., `latency_ms` → `latencyMs`)

### TypeScript Interfaces
```typescript
interface PromptForgeOptions {
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
    maxRetries?: number;
}

interface ExecuteParams {
    versionId: string;
    variables?: Record<string, string>;
    abVersionId?: string;
    requiredSchema?: any;
}

interface ExecuteResponse {
    success: boolean;
    data: string;
    meta: {
        model: string;
        cached: boolean;
        latencyMs: number;
        tokensInput: number;
        tokensOutput: number;
        costMicroUsd: number;
        servedVersion: string;
    };
}
```

---

## 20. Forge CLI (`prompt-forge-ai-cli`)

**npm:** `prompt-forge-ai-cli` v1.0.0  
**License:** ISC

### Installation
```bash
npm install -g prompt-forge-ai-cli
```

### Quick Start
```bash
forge init my-project   # Scaffold a new project
cd my-project
forge                   # Launch interactive studio
```

### Studio Commands

| Command | Description |
|---|---|
| `:help` | Show all available commands |
| `:model` | Switch primary AI model |
| `:auto` | Toggle auto-failover ON/OFF |
| `:debug` | Toggle debug mode (HTTP status, latency, tokens) |
| `:doctor` | Run connectivity diagnostics |
| `:benchmark` | Compare all models on same prompt |
| `:health` | Show model health statistics |
| `:history` | Show session prompt history |
| `:key` | Set your PromptForge API key |
| `:clear` | Clear terminal |
| `:exit` | Exit Forge Studio |

### CLI Architecture
- **Entrypoint:** Commander.js
- **Terminal UI:** chalk, figlet, boxen, ora, gradient-string
- **Model Drivers:** Gemini + NVIDIA (via PromptForge proxy)
- **Failover:** Exponential backoff + automatic model cascading
- **Health Tracking:** Persistent stats in `~/.forge/health.json`
- **Logging:** Structured JSON logs with rotation at `~/.forge/logs.json`

---

## 21. SEO & Security

### SEO Implementation
- **Metadata:** Comprehensive OpenGraph + Twitter Card meta tags in root layout
- **Google Verification:** `qsBUZ3zd_jjvAZVRc4fxlerl_32C6kvZCIcbUCaTDRk`
- **Sitemap:** Dynamic `sitemap.ts` covering 10 public routes with priority scoring
- **robots.txt:** Allows all public routes; disallows `/dashboard/`, `/studio/`, `/admin/`, `/settings/`, `/profile/`
- **Canonical URL:** `https://prompt-forge-studio.vercel.app`

### Security Headers (`vercel.json`)

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | Allows self, Clerk, Cloudflare, Google Fonts, Supabase, Vercel Analytics |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=()` |

### API Security
- **API Key Hashing:** SHA-256 (raw key never stored)
- **Rate Limiting:** 120 req/min per key (Redis-backed)
- **Input Guardrails:** PII detection (email, phone), profanity filter
- **Ownership Verification:** API key user must match prompt owner
- **Webhook Verification:** Svix signature validation on Clerk webhooks

---

## 22. Deployment (Vercel)

### Configuration
- **Output Mode:** `standalone` (in `next.config.ts`)
- **Remote Images:** Allowed from `img.clerk.com`
- **Build Command:** `next build`
- **Framework Preset:** Next.js (auto-detected by Vercel)

### Required Vercel Environment Variables
All variables from [Section 5](#5-environment-variables) must be set in the Vercel project dashboard under Settings → Environment Variables.

### Post-Deployment Checklist
1. Set all environment variables in Vercel
2. Configure Clerk webhook URL to `https://your-domain.vercel.app/api/webhooks/clerk`
3. Run database migrations in Supabase SQL editor
4. Verify Google Search Console verification
5. Test API key generation at `/studio/keys`
6. Validate webhook sync by creating a test user

---

## 23. Changelog

| Version | Date | Highlights |
|---|---|---|
| **1.4.0** | 2026-02-03 | Badge notification system, confetti effects, global BadgeProvider |
| **1.2.0** | 2026-02-02 | Gamification (badges, XP), Playground (4 modes), debug tools, notifications |
| **1.1.0** | 2026-02-01 | Profile editing, SEO enhancements, Google verification |
| **1.0.0** | 2026-01-25 | Initial release — Studio, A/B Testing, Granular Controls, Clerk auth, Supabase, dark UI |

---

## License

**Copyright © 2026 PromptForge Studio. All Rights Reserved.**

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this source code is strictly prohibited. See the [LICENSE](../LICENSE) file for full details.
