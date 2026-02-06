---
name: feature-based-module-structure
description: Enforces a feature-based (domain-first) folder structure for scalable React and Next.js applications. This skill should be used when designing, reviewing, or refactoring project structure to ensure clear ownership, clean boundaries, and long-term maintainability.
license: MIT
metadata:
  author: internal
  version: "1.0.0"
---

# Feature-Based Module Structure

A scalable, production-grade folder organization strategy that groups code by **business feature** instead of technical type. This structure is optimized for large React / Next.js applications and AI-assisted codebases.

---

## When to Apply

Reference this skill when:

- Designing a new React or Next.js project
- Refactoring an existing folder structure
- Adding a new major feature or domain
- Reviewing architecture for scalability issues
- Enforcing clean boundaries between features
- Preparing a codebase for multi-team collaboration

---

## Core Principle

> **Everything related to a feature lives together.**

A feature owns its:

- UI components
- Hooks
- API calls / services
- Types and schemas
- Utilities and constants

This minimizes cross-feature coupling and maximizes cohesion.

---

## Canonical Structure

```text
modules/                    # Feature-based folders
├── auth/                   # Authentication feature
│   ├── components/         # Auth-specific UI
│   ├── hooks/              # useAuth, useSession, etc.
│   ├── services/           # API calls / SDK wrappers
│   ├── schemas/            # Validation schemas (zod)
│   ├── constants.ts
│   └── index.ts            # Public API
│
├── interviews/             # Interviews feature
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types.ts
│   ├── utils.ts
│   └── index.ts
│
└── shared/                 # Optional, feature-agnostic only
    ├── components/
    ├── hooks/
    └── utils/
```
