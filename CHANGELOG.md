# Changelog

All notable changes to the **PromptForge Studio** project will be documented in this file.

## [1.4.0] - 2026-02-03
### Added
- **Badge Notification System**: Implemented a global "Toast" popup ecosystem for gamification.
    - **BadgeToast**: Custom component to display earned badges with rarity-specific styles and animations.
    - **Confetti**: Added celebration effects for high-tier badges (Legendary/Expert).
    - **Global Context**: Wrapped app in `BadgeProvider` to allow triggering awards from anywhere.

## [1.2.0] - 2026-02-02
### Added
- **Gamification System**: Created a comprehensive badge and achievement system.
    - **Badges Table**: SQL schema for storing badge definitions and user progress.
    - **Custom Badge Assets**: Integrated 15+ unique PNG badge images for varying rarity tiers (Common to Legendary).
    - **Profile Integration**: Added an "Achievements" section to the user profile to display earned badges.
    - **Sorting**: Badges are now sorted by rarity (Common -> Legendary).
- **Prompt Engineering Playground**: A new interactive learning area with 4 distinct game modes:
    - **Fixer Mode**: Repair broken prompts.
    - **Builder Mode**: Template-based prompt construction.
    - **Battle Mode**: Predict AI outcomes.
    - **Precision Mode**: Constraint adherence challenges.
- **Onboarding**: Added a "How to Play" modal with mode-specific instructions.
- **Debug Tools**: Added `/gamification-debug` page for diagnosing user ID and badge issues.
- **Notifications**: Added system for global notifications (SQL script provided).

### Changed
- **Home Page**: Replaced "Watch Demo" button with a direct link to the **Playground**.
- **Middleware**: Protected the `/playground` route to ensure only authenticated users can access it.
- **Admin**: Updated `getBadges` to use a Service Role client, ensuring reliable badge fetching bypassing complex RLS scenarios.

## [1.1.0] - 2026-02-01
### Added
- **Profile Editing**: Users can now update their profile information (Name, Avatar) which syncs between Clerk and Supabase.
- **SEO Enhancements**: Added comprehensive metadata, OpenGraph tags, and sitemap.xml.
- **Google Verification**: Added Google Site Verification meta tag.

### Fixed
- **Playground Analysis**: Fixed type safety issues in the AnalysisPanel and restored the analyze API functionality.
- **Sparkles Icon**: Resolved missing import in PlaygroundClient.

## [1.0.0] - 2026-01-25
### Initial Release
- **Studio**: Advanced Prompt Editor with "Cognitive Depth" controls.
- **A/B Testing Arena**: Compare prompt variations side-by-side.
- **Granular Controls**: Sliders for Temperature, Top-P, and Top-K.
- **Authentication**: integrated Clerk for user management.
- **Database**: Supabase PostgreSQL integration for saving prompts and history.
- **UI/UX**: Premium dark mode aesthetic with glassmorphism effects using Tailwind CSS and Framer Motion.
