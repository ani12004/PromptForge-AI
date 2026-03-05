# Prompt Forge Studio: The Complete A-Z Reference Guide

This document serves as the absolute, comprehensive single source of truth for the entire **Prompt Forge Studio** project. It covers the core mission, V1 consumer application, gamification engine, UI/UX structure, V2 Prompt-as-a-Service (PaaS) backend engine, database schemas, and the technology stack.

---

## 1. Project Overview & Mission
**Prompt Forge Studio** is an advanced development environment (ADE) for prompt engineering. It acts as middleware between human intent and large language model (LLM) execution.

*   **The Problem:** Raw prompts are often ambiguous, missing constraints, or unstructured, leading to suboptimal LLM performance.
*   **The Solution:** The platform uses heuristics and semantic analysis to detect weaknesses in user inputs, automatically restructuring them into high-fidelity, production-grade instructions that improve AI consistency and lower latency.
*   **Target Audience:** Prompt Engineers, AI Developers, and Product Managers.

---

## 2. Technology Stack
*   **Frontend Ecosystem:** Next.js 15 (App Router), React 19, TypeScript
*   **Styling & UI:** Tailwind CSS v4, Framer Motion (Animations), Class Variance Authority (CVA), Lucide Icons
*   **Authentication:** Clerk (V1 App) + Supabase Auth
*   **Database:** Supabase (PostgreSQL)
*   **Caching Layer:** Upstash Redis (Serverless exact-match caching)
*   **AI Engine Models:** Gemini (Google), Llama/Nemotron (NVIDIA), Llama/Mixtral (Groq)
*   **Validation:** Zod

---

## 3. Site Structure & Layout Architecture (Next.js App Router)

### Global Design System: "Cyber-Modern"
*   **Colors/Theme:** Deep dark mode (`#050508`) with vibrant purple accents (`#8b5cf6`).
*   **Typography:** Inter (for UI clarity) and Poppins (for impactful headings).
*   **Visual Elements:** Glassmorphism (backdrop-blur panels), subtle gradients, floating elements, shadow-glow.

### Route Layouts
1.  **Standard Layout (Global Wrapper):** Used for marketing, legal, settings, profile. Features a fixed, frosted navbar, centered content containers, and standard footer.
2.  **Studio/App Layout (`/studio`, `/dashboard`):** Specialized for heavy web-app workflows. Features a persistent Left Sidebar (navigation/history), full viewport height workspace, and hides the footer to maximize real estate.
3.  **Admin Layout (`/admin`):** Enforces role-based access control (RBAC), adds system-monitoring visualizations.

### Key Pages / Routes Breakdown
*   **Public/Marketing:**
    *   `/` (Home): Hero section, interactive demo components, features grid, pricing tease, FAQ.
    *   `/about`: Mission statement and team (Anil Suthar).
    *   `/features`: Mental models detailing Understand, Build, and Compete phases.
    *   `/pricing`: Subscription plans (Hobbyist vs. Pro).
*   **User Hub:**
    *   `/dashboard`: Post-login home. Shows KPI stats (Tokens used, Cost), subscription tier, and recent project grid.
    *   `/profile`: User profile management, Badge showcase.
*   **The Core Studio Engine (`/studio`):**
    *   The primary IDE workspace. Split-panel design. Left: Raw Input & Granular Controls. Right: Live Output, Diffusion View, Audit critique.
*   **Gamification Playground (`/playground`):**
    *   Interactive educational arena. Includes "Fixer Mode" (debug bad prompts), "Builder Mode" (construct via templates), and "Battle Mode" (predict AI outputs).
*   **Admin Control Panel (`/admin`):**
    *   System health metrics, user management, contact form inbox (with Resend email integration), and global broadcasting.

---

## 4. The Unified Features Matrix

### V1 Features (The Consumer ADE Interface)
*   **Cognitive Depth Control:** Users adjust the LLM's query expansion level (Short, Medium, Detailed, Granular).
*   **Real-time Output Status:** Animated loaders that show what stage of injection the prompt is undergoing (Goal -> Context -> Constraints).
*   **Version History Diffing:** Users can view side-by-side diffs (A/B testing) of how a prompt was changed over time.
*   **AI Prompt Auditor:** A pre-execution critique engine that reads the user's prompt and suggests security/clarity improvements before costing tokens.
*   **Subscription Gating:** Pro users (authenticated via Clerk/Supabase profiles) get access to deeper analysis and unlimited generations.

### The Gamification System
*   **XP & Leveling:** Users earn points for using the app and doing challenges.
*   **Badges System (15+ Badges):**
    *   *Common:* Prompt Rookie, Curious Mind.
    *   *Skilled:* Constraint Master, Builder Apprentice.
    *   *Advanced:* Prompt Surgeon, Battle Commander.
    *   *Expert:* Master Fixer, Oracle.
    *   *Legendary:* Legend of PromptForge.

### V2 Features (The PaaS Core Engine)
*(Added via the 1-Day Minimal V2 Implementation replacing complex Git architectures)*
*   **Programmatic API Execution:** A robust `/api/v1/execute` REST endpoint designed for machine-to-machine calls.
*   **Linear Versioning:** A straightforward, sequential prompt versioning system (no complex branching).
*   **Cascading Model Router (`lib/router.ts`):** 
    *   Dynamically selects the AI model via the modular `lib/ai` provider system.
    *   Supports Google Gemini, NVIDIA, and Groq.
    *   Heuristics: If prompt length > 4000 chars OR contains reasoning keywords ("step-by-step", "<think>") => Routes to higher-tier models (e.g., Gemini Pro).
    *   Otherwise => Routes to **Gemini**: `gemini-2.5-flash` (Default), `gemini-1.5-pro`, etc. for high-throughput, low-latency execution.
*   **Exact-Match Caching (`lib/cache.ts`):** 
    *   Powered by Upstash Redis.
    *   Generates MD5 hash of `version_id` + sorted variables.
    *   Bypasses the LLM entirely on a hash hit, dropping latency to <50ms.
*   **Asynchronous Telemetry:** Non-blocking writes to `v2_execution_logs` mapping the version ID, latency, model used, and cache status.

---

## 5. Complete Database Schema (Supabase)

Prompt Forge utilizes two distinct schema approaches harmonized in the same database. The `public` schema contains tables for the V1 web IDE, and the `v2_` prefixed tables represent the headless PaaS API engine.

### V1 Web Application Tables
1.  **`profiles`**: Maps to Auth provider. Stores `subscription_tier`, `role`, `avatar_url`.
2.  **`prompts`**: Main container for web IDE prompts. (Columns: `original_prompt`, `refined_prompt`, `intent`, `detail_level`).
3.  **`prompt_versions`**: The version history for web IDE edits.
4.  **`prompt_analytics` & `prompt_executions`**: Telemetry and latency metrics for web queries.
5.  **`badges`**: Definitions of all gamification badges (Rarity, Unlock Conditions).
6.  **`user_badges`**: Join table tracking which users have earned which badges.
7.  **`experiments` & `experiment_variants`**: Used for the A/B prompt testing arena.
8.  **`notifications`**: In-app user notifications.
9.  **`admin_audit_logs`**: Tracks admin panel actions.
10. **`contact_messages`**: Inbox for the `/contact` route.

### V2 PaaS API Tables (The Headless Engine)
These are intentionally isolated from the Web Application tables for clean separation of concerns:
1.  **`v2_prompts`**: Lightweight container for API prompt definitions (`name`, `description`).
2.  **`v2_prompt_versions`**: The linear execution templates utilized by the API (`version_tag`, `system_prompt`, `template`). Contains unique index on `(prompt_id, version_tag)`.
3.  **`v2_execution_logs`**: The programmatic audit trail written to asynchronously upon every API hit (`latency_ms`, `model_used`, `cached_hit`).

---

## 6. Execution Flow (V2 API)
When a client application queries the V2 backend to execute a prompt dynamically:

1.  **Request `[POST] /api/v1/execute`**: Client sends JSON payload: `{ "version_id": "UUID", "variables": { "name": "Alice" } }`.
2.  **Zod Parsing:** Payload is validated.
3.  **DB Fetch (Admin Role):** `v2_prompt_versions` is queried via `lib/supabase.ts` (using Service Role to bypass row level security for programmatic server-side access).
4.  **Cache Hash Generation:** Variables are alphabetically sorted, stringified with version ID, and hashed via standard Node.js `crypto` MD5.
5.  **Redis Interception (`lib/cache.ts`):** Checks Upstash Redis for the hash. On cache hit, returns immediately.
6.  **Router Evaluation (`lib/router.ts`):** On cache miss, system instructions and variables are examined. The prompt is injected. The heuristic model selector chooses between Pro or Flash tiers.
7.  **LLM Execution:** The Google Generative AI SDK calls the selected endpoint.
8.  **Telemetry Dispatch:** Asynchronously (without `await`), a log is written to `v2_execution_logs` and Redis is updated.
9.  **Response Delivery:** JSON returned the client with raw output and performance meta-data.

---

## 7. Next Steps & Expansion Roadmap
*   **Building Visual Studio Support for V2:** Integrating the `v2_prompts` UI management inside the `/studio` dashboard (currently manual DB).
*   **SDK Generation:** Creating `npm install @promptforge/sdk` for easy Node/Python integration for enterprise clients.
*   **Semantic Caching:** Upgrading the exact-match Redis cache to a Vector Database-backed semantic cache (understanding intent similarity rather than string equality).
*   **Billing Infrastructure:** Hooking Stripe meters into the `v2_execution_logs` table for usage-based PaaS billing.
