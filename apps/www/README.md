# Interviewer.ai Frontend Client (`apps/www`)

Welcome to the frontend client documentation for **Interviewer.ai**, a state-of-the-art, AI-powered interview preparation and career building platform.

---

## 💡 Project Idea & What We Do in Interviewer.ai

**Interviewer.ai** is designed to bridge the gap between candidate preparation and real-world hiring environments. It merges real-time speech analytics, secure code execution, and ATS (Applicant Tracking System) optimizations into a seamless platform.

### Core Features:
1. **🎙️ AI Empathic Mock Interviews**:
   Allows candidates to perform voice-based mock interviews. Utilizing Hume AI's Empathic Voice Interface (EVI), the system streams audio in real-time, detecting verbal cues (fluency, confidence, emotions) and providing deep analytical scoring powered by Gemini / LLM evaluators.
2. **💻 Coding Practice & Sandbox IDE**:
   A LeetCode-like environment where users solve coding challenges. Written code is validated via an AST (Abstract Syntax Tree) hash cache, and if it's a new solution, it is securely compiled and executed within an isolated Judge0 Sandbox.
3. **💼 Resume Builder & ATS Matcher**:
   An interactive form to construct professional resumes. Integrated with a python-based backend service that parses PDF text, compares it with dynamic job descriptions, highlights missing keywords, and optimizes ATS scoring.

---

## 📂 Complete Folder Structure

Below is the exhaustive file tree for the Next.js `www` client workspace located at [apps/www](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www):

```text
apps/www/
├── .env
├── .gitignore
├── README.md
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── noise.webp
│   ├── vercel.svg
│   ├── window.svg
│   └── images/
│       ├── ai-interview-preview-36af0e.png
│       ├── coding-practice-preview-16338e.png
│       ├── mask-group-1.svg
│       ├── mask-group-2.svg
│       ├── mesh-background.svg
│       └── resume-builder-preview-36af0e.png
└── src/
    ├── env.ts
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── auth/
    │   │   ├── forgot-password/
    │   │   │   └── page.tsx
    │   │   ├── reset-password/
    │   │   │   └── page.tsx
    │   │   ├── signin/
    │   │   │   └── page.tsx
    │   │   ├── signup/
    │   │   │   └── page.tsx
    │   │   └── verify-code/
    │   │       └── page.tsx
    │   ├── dashboard/
    │   │   └── page.tsx
    │   ├── interview/
    │   │   ├── setup/
    │   │   │   └── page.tsx
    │   │   └── technical/
    │   │       └── page.tsx
    │   ├── problems/
    │   │   ├── page.tsx
    │   │   └── [slug]/
    │   │       └── page.tsx
    │   ├── profile/
    │   │   └── page.tsx
    │   ├── resume-builder/
    │   │   └── page.tsx
    │   └── settings/
    │       ├── page.tsx
    │       ├── interview/
    │       │   └── page.tsx
    │       ├── notifications/
    │       │   └── page.tsx
    │       ├── privacy/
    │       │   └── page.tsx
    │       └── profile/
    │           └── page.tsx
    ├── lib/
    │   ├── auth-client.ts
    │   ├── auth-guard.tsx
    │   └── utils.ts
    ├── modules/
    │   ├── auth/
    │   │   ├── auth-input.tsx
    │   │   ├── auth-layout.tsx
    │   │   ├── code-digit-input.tsx
    │   │   ├── forgot-password-page.tsx
    │   │   ├── index.ts
    │   │   ├── reset-password-page.tsx
    │   │   ├── sign-in-page.tsx
    │   │   ├── sign-up-page.tsx
    │   │   ├── verify-code-page.tsx
    │   │   └── schemas/
    │   │       ├── forgot-password.schema.ts
    │   │       ├── index.ts
    │   │       ├── reset-password.schema.ts
    │   │       ├── sign-in.schema.ts
    │   │       ├── sign-up.schema.ts
    │   │       └── verify-code.schema.ts
    │   ├── coding-practice/
    │   │   ├── constants.ts
    │   │   ├── index.ts
    │   │   ├── components/
    │   │   │   ├── code-panel.tsx
    │   │   │   ├── coding-practice-page.tsx
    │   │   │   ├── example-case.tsx
    │   │   │   ├── index.ts
    │   │   │   ├── problem-panel.tsx
    │   │   │   └── test-case-view.tsx
    │   │   └── pages/
    │   │       └── index.ts
    │   ├── dashboard/
    │   │   ├── index.ts
    │   │   ├── components/
    │   │   │   ├── index.ts
    │   │   │   ├── quick-actions.tsx
    │   │   │   ├── recent-interviews.tsx
    │   │   │   ├── skills-overview.tsx
    │   │   │   ├── stats-cards.tsx
    │   │   │   └── weekly-goals.tsx
    │   │   └── pages/
    │   │       ├── dashboard.page.tsx
    │   │       └── index.ts
    │   ├── interview/
    │   │   ├── index.ts
    │   │   ├── pages/
    │   │   │   ├── index.ts
    │   │   │   ├── setup-interview-page.tsx
    │   │   │   └── technical-interview-page.tsx
    │   │   └── schemas/
    │   │       └── index.ts
    │   ├── landing/
    │   │   ├── index.ts
    │   │   └── components/
    │   │       ├── additional-features-section.tsx
    │   │       ├── features-section.tsx
    │   │       ├── footer.tsx
    │   │       ├── header.tsx
    │   │       ├── hero-section.tsx
    │   │       ├── how-it-works-section.tsx
    │   │       ├── index.ts
    │   │       ├── pricing-section.tsx
    │   │       └── success-stories-section.tsx
    │   ├── problem/
    │   │   ├── index.ts
    │   │   ├── components/
    │   │   │   ├── index.ts
    │   │   │   └── problems-page.tsx
    │   │   └── hooks/
    │   │       ├── index.ts
    │   │       └── use-problems-infinite.ts
    │   ├── resume-builder/
    │   │   ├── index.ts
    │   │   ├── types.ts
    │   │   ├── components/
    │   │   │   ├── education-section.tsx
    │   │   │   ├── index.ts
    │   │   │   ├── personal-info-section.tsx
    │   │   │   ├── resume-preview.tsx
    │   │   │   ├── skills-section.tsx
    │   │   │   └── work-experience-section.tsx
    │   │   ├── contexts/
    │   │   │   ├── index.ts
    │   │   │   └── resume-context.tsx
    │   │   ├── pages/
    │   │   │   ├── index.ts
    │   │   │   └── resume-builder-page.tsx
    │   │   └── schemas/
    │   │       └── index.ts
    │   └── settings/
    │       ├── index.ts
    │       ├── components/
    │       │   ├── index.ts
    │       │   └── settings-card.tsx
    │       ├── layouts/
    │       │   ├── index.ts
    │       │   └── settings-layout.tsx
    │       ├── pages/
    │       │   ├── index.ts
    │       │   ├── interview-settings-page.tsx
    │       │   ├── notifications-page.tsx
    │       │   ├── privacy-security-page.tsx
    │       │   └── profile-account-page.tsx
    │       └── schemas/
    │           ├── index.ts
    │           └── profile-account.schema.ts
    └── shared/
        ├── components/
        │   ├── index.ts
        │   ├── menu.tsx
        │   ├── settings-icon.tsx
        │   ├── theme-toggle.tsx
        │   ├── backgrounds/
        │   │   └── grid-background.tsx
        │   └── ui/
        │       ├── animated-badge.tsx
        │       ├── badge.tsx
        │       ├── button.tsx
        │       ├── card.tsx
        │       ├── checkbox.tsx
        │       ├── dropdown-menu.tsx
        │       ├── flow-button.tsx
        │       ├── heading.tsx
        │       ├── input.tsx
        │       ├── label.tsx
        │       ├── paragraph.tsx
        │       ├── progress.tsx
        │       ├── resizable.tsx
        │       ├── scroll-area.tsx
        │       ├── select.tsx
        │       ├── separator.tsx
        │       ├── skeleton.tsx
        │       ├── sonner.tsx
        │       ├── spotlight-card.tsx
        │       ├── sub-heading.tsx
        │       ├── switch.tsx
        │       ├── tabs.tsx
        │       ├── textarea.tsx
        │       └── wobble-card.tsx
        ├── hooks/
        │   ├── use-intersection-observer.ts
        │   └── use-is-mounted.tsx
        └── providers/
            ├── query.provider.tsx
            └── theme.provider.tsx
```

---

## 📝 Comprehensive File and Directory Directory Guide

### Root Level Configurations
*   [.env](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/.env): Local environment variable overrides.
*   [.gitignore](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/.gitignore): Git ignore rules for node modules, next builds, and environment files.
*   [components.json](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/components.json): Configuration settings for tailwind/shadcn UI library component generation.
*   [next-env.d.ts](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/next-env.d.ts): Auto-generated TypeScript definitions for Next.js features.
*   [next.config.ts](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/next.config.ts): The main Next.js configuration containing routing, rewrite rules, and compiler parameters.
*   [package.json](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/package.json): Defines dependencies, devDependencies, and development script commands.
*   [postcss.config.mjs](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/postcss.config.mjs): PostCSS pipeline settings for compiling Tailwind CSS.
*   [tsconfig.json](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/tsconfig.json): TypeScript project configuration and path aliases.

### Static Assets: `public/`
*   Root Vectors: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.
*   [noise.webp](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/public/noise.webp): Grain texture web image.
*   [public/images/](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/public/images):
    *   `ai-interview-preview-36af0e.png`: Feature preview image for AI interviews.
    *   `coding-practice-preview-16338e.png`: Feature preview image for coding workspace.
    *   `resume-builder-preview-36af0e.png`: Feature preview image for resume builder.
    *   `mask-group-1.svg`, `mask-group-2.svg`: UI masks for styling.
    *   `mesh-background.svg`: Dynamic mesh backdrop style.

### Next.js Routing: `src/app/`
*   [favicon.ico](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/favicon.ico): Site favicon.
*   [globals.css](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/globals.css): Global CSS variables and Tailwind utilities.
*   [layout.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/layout.tsx): Top-level layout that injects standard providers, font styles, and body wrappers.
*   [page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/page.tsx): Main index landing page.
*   **`auth/` Directory**: Route endpoints for authentication paths.
    *   [auth/forgot-password/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/auth/forgot-password/page.tsx): Request code page.
    *   [auth/reset-password/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/auth/reset-password/page.tsx): Choose new password page.
    *   [auth/signin/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/auth/signin/page.tsx): Login page.
    *   [auth/signup/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/auth/signup/page.tsx): Registration page.
    *   [auth/verify-code/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/auth/verify-code/page.tsx): Authentication code check page.
*   [dashboard/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/dashboard/page.tsx): Main interactive user dashboard page.
*   **`interview/` Directory**: Routing for candidate practice rooms.
    *   [interview/setup/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/interview/setup/page.tsx): Setup options screen for selecting mock templates.
    *   [interview/technical/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/interview/technical/page.tsx): Streaming voice interactive simulation.
*   **`problems/` Directory**:
    *   [problems/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/problems/page.tsx): LeetCode problem bank interface.
    *   [problems/\[slug\]/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/problems/[slug]/page.tsx): Dynamic route rendering Monaco editor workspace for solving coding tasks.
*   [profile/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/profile/page.tsx): Shows user profile options.
*   [resume-builder/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/resume-builder/page.tsx): Resume generator form layout.
*   **`settings/` Directory**: Page routes for app configuration settings.
    *   [settings/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/settings/page.tsx): Core entry.
    *   [settings/interview/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/settings/interview/page.tsx): Prompt and audio configuration settings.
    *   [settings/notifications/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/settings/notifications/page.tsx): Notification configuration.
    *   [settings/privacy/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/settings/privacy/page.tsx): Data rights and security settings.
    *   [settings/profile/page.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/app/settings/profile/page.tsx): User detail controls.

### Client Environment Variables: `src/`
*   [env.ts](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/env.ts): Parses environment variables via T3-Env / Zod to ensure configuration correctness before launch.

### Core Libraries & Guards: `src/lib/`
*   [auth-client.ts](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/lib/auth-client.ts): Client hook and operations initialized from `better-auth`.
*   [auth-guard.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/lib/auth-guard.tsx): Checks session validation to block unauthenticated requests.
*   [utils.ts](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/lib/utils.ts): Tailwind CSS helper function utilities (`cn`).

### Module Logic: `src/modules/`
Contains page content components split by feature domain rather than routing directories.
*   **`auth/`**:
    *   Components: `auth-input.tsx` (Form inputs), `auth-layout.tsx` (Grid columns), `code-digit-input.tsx` (Pin verification layout).
    *   Pages: `forgot-password-page.tsx`, `reset-password-page.tsx`, `sign-in-page.tsx`, `sign-up-page.tsx`, `verify-code-page.tsx`.
    *   [schemas/](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/modules/auth/schemas): Zod schema validations for forms: `forgot-password.schema.ts`, `reset-password.schema.ts`, `sign-in.schema.ts`, `sign-up.schema.ts`, `verify-code.schema.ts`.
    *   `index.ts`: Entry exports.
*   **`coding-practice/`**:
    *   Components:
        *   `code-panel.tsx`: The Monaco editor UI wrapper with compiler submission logic.
        *   `coding-practice-page.tsx`: Structure of the coding practice grid.
        *   `example-case.tsx`: Render of test parameters.
        *   `problem-panel.tsx`: Code difficulty and instructions description panel.
        *   `test-case-view.tsx`: Verification state and execution logs output.
    *   `constants.ts`: Language mappings and static boilerplates.
    *   `index.ts` and `pages/index.ts`: Export interfaces.
*   **`dashboard/`**:
    *   Components:
        *   `quick-actions.tsx`: Fast-route triggers for launching mock sessions.
        *   `recent-interviews.tsx`: List of completed sessions and scores.
        *   `skills-overview.tsx`: Grid showing competency charts.
        *   `stats-cards.tsx`: Interactive stat metric indicators.
        *   `weekly-goals.tsx`: Learning milestone indicators.
    *   Pages: `dashboard.page.tsx` containing the primary grid layout.
    *   `index.ts` and `pages/index.ts`: Export definitions.
*   **`interview/`**:
    *   Pages: `setup-interview-page.tsx` (category picker layout) and `technical-interview-page.tsx` (streams voice context).
    *   `index.ts`, `pages/index.ts`, and `schemas/index.ts`: Export wrappers.
*   **`landing/`**:
    *   Components: Visual sections.
        *   `hero-section.tsx`: Headline & quick CTA buttons.
        *   `features-section.tsx`: Product features showcase.
        *   `additional-features-section.tsx`: Secondary features grid.
        *   `how-it-works-section.tsx`: Stepper showing recruitment cycle stages.
        *   `pricing-section.tsx`: Membership tiers.
        *   `success-stories-section.tsx`: Student feedback.
        *   `header.tsx` & `footer.tsx`: Primary navigation layouts.
    *   `index.ts`: Exports.
*   **`problem/`**:
    *   Components: `problems-page.tsx` (the list overview UI).
    *   Hooks: `use-problems-infinite.ts` (manages paging search queues).
    *   `index.ts`: Exports.
*   **`resume-builder/`**:
    *   Components: Section forms.
        *   `education-section.tsx`: Degree fields.
        *   `personal-info-section.tsx`: Contact information fields.
        *   `skills-section.tsx`: Technical competence inputs.
        *   `work-experience-section.tsx`: Jobs experience forms.
        *   `resume-preview.tsx`: Live styled PDF layout rendering.
    *   Contexts: `resume-context.tsx` (global React Context for managing form state).
    *   Pages: `resume-builder-page.tsx`.
    *   `types.ts`: TypeScript schemas for experiences, educations, and skills.
    *   `index.ts`, `pages/index.ts`, and `schemas/index.ts`: Export declarations.
*   **`settings/`**:
    *   Components: `settings-card.tsx` (grid section wrapper).
    *   Layouts: `settings-layout.tsx` (side-navigation panels).
    *   Pages: `interview-settings-page.tsx` (voice controls), `notifications-page.tsx`, `privacy-security-page.tsx`, `profile-account-page.tsx` (profile updates).
    *   Schemas: `profile-account.schema.ts` (zod rules for settings forms).
    *   `index.ts`, `components/index.ts`, `layouts/index.ts`, `pages/index.ts`, and `schemas/index.ts`: Modular exports.

### Shared Features: `src/shared/`
*   **`components/`**: Core shared widgets.
    *   `menu.tsx`: Mobile and desktop sidebars.
    *   `settings-icon.tsx`: Render configurations.
    *   `theme-toggle.tsx`: Selects dark, light, or system themes.
    *   `backgrounds/grid-background.tsx`: Renders a background grid.
    *   `index.ts`: Main exports.
    *   **`ui/`**: Atomic components (Radix primitives styled with Tailwind).
        *   Text Elements: `heading.tsx`, `sub-heading.tsx`, `paragraph.tsx`.
        *   Forms: `button.tsx`, `checkbox.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `textarea.tsx`, `switch.tsx`.
        *   Layouts & Overlays: `card.tsx`, `dropdown-menu.tsx`, `resizable.tsx`, `scroll-area.tsx`, `separator.tsx`, `tabs.tsx`.
        *   Animations & Aesthetics: `animated-badge.tsx`, `badge.tsx`, `flow-button.tsx`, `progress.tsx`, `skeleton.tsx`, `sonner.tsx` (Toast messages), `spotlight-card.tsx`, `wobble-card.tsx`.
*   **`hooks/`**:
    *   [use-intersection-observer.ts](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/shared/hooks/use-intersection-observer.ts): Detects elements scrolling into the viewport.
    *   [use-is-mounted.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/shared/hooks/use-is-mounted.tsx): Safely manages browser-only operations.
*   **`providers/`**:
    *   [query.provider.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/shared/providers/query.provider.tsx): Standard Query Client injection for API calls.
    *   [theme.provider.tsx](file:///d:/MINE/Software Engineering/Projects/HTI/interviewer-ai/apps/www/src/shared/providers/theme.provider.tsx): Stores system theme properties.
