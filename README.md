![PromptForge AI](public/logo_navi.png)

# PromptForge AI

PromptForge AI is a specialized middleware platform designed to bridge the gap between human intent and large language model (LLM) execution. It serves as an advanced development environment for prompt engineering, allowing developers and prompt engineers to structure, refine, and optimize raw inputs into production-grade instructions.

The system leverages heuristic analysis and semantic understanding to detect ambiguity in natural language, automatically restructuring requests into high-fidelity prompts that improve model performance, consistency, and reduced latency across various LLM providers.

## Key Features

### Semantic Intent Analysis
The core engine analyzes user input to determine the underlying objective—whether it be code generation, creative writing, or data analysis. It identifies vague constraints and negative patterns, replacing them with precise, enforceable instructions.

### Studio Environment
A dedicated workspace for crafting and iterating on prompts. The Studio offers real-time feedback, version history, and "cognitive status" updates that visualize the refinement process as it happens.

### Subscription & Quota Management
Integrated limits ensure fair usage across the platform:
- **Hobbyist Tier**: Access to standard refinement tools with a monthly cap on generations.
- **Pro Engineer Tier**: Unlimited access to the refinement engine, priority processing, and advanced intent analysis features.

### Robust History & Persistence
All generated prompts and their versions are stored securely. Users can revisit previous iterations, compare outputs, and retrieve optimized prompts for immediate use in production workflows.

### Secure Architecture
Built with enterprise-grade security in mind:
- **Authentication**: Managed via Clerk with strict session handling.
- **Data Storage**: Row Level Security (RLS) enabled on Supabase to ensure complete data isolation between users.
- **Encryption**: API keys and sensitive configuration data are managed via secure environment variables.

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Server Actions, Supabase (PostgreSQL), Clerk Webhooks
- **AI / Logic**: Google Gemini 1.5 Pro/Flash models
- **Infrastructure**: Vercel-ready architecture

## License

**Copyright (c) 2026 PromptForge AI. All Rights Reserved.**

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this source code is strictly prohibited. 
See the [LICENSE](LICENSE) file for more details.
