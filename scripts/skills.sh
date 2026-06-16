#!/usr/bin/env bash

set -Eeuo pipefail

MAX_JOBS=10

add_skill() {
  local url="$1"
  local skill="${2:-}"

  if [[ -n "$skill" && -d ".agents/skills/$skill" ]]; then
    echo "Skipping $skill"
    return
  fi

  while (( $(jobs -rp | wc -l) >= MAX_JOBS )); do
    wait -n
  done

  (
    echo "Installing ${skill:-default}..."
    set +e
    if [[ -n "$skill" ]]; then
      npx skills add "$url" -s "$skill" -a "universal" -y
    else
      npx skills add "$url" -a "universal" -y
    fi

    mkdir -p .claude/skills
    for skill_dir in .agents/skills/*; do
      if [[ -d "$skill_dir" ]]; then
        skill_name=$(basename "$skill_dir")
        ln -sf "$(pwd)/$skill_dir" ".claude/skills/$skill_name"
      fi
    done

    local rc=$?
    if [[ $rc -eq 0 ]]; then
      echo "✓ ${skill:-done}"
    else
      echo "✗ ${skill:-default} failed (skipped)"
    fi
  ) &
}

# General
add_skill https://github.com/vercel-labs/skills find-skills

# Browser
add_skill https://github.com/xixu-me/skills use-my-browser
add_skill https://github.com/vercel-labs/agent-browser agent-browser
add_skill https://github.com/browser-use/browser-use browser-use

# Code
add_skill https://github.com/github/awesome-copilot refactor
add_skill https://github.com/affaan-m/everything-claude-code security-review
add_skill https://github.com/google-labs-code/stitch-skills enhance-prompt
add_skill https://github.com/addyosmani/web-quality-skills performance
add_skill https://github.com/anthropics/skills skill-creator
add_skill https://github.com/roin-orca/skills simple
add_skill https://github.com/lllllllama/ai-paper-reproduction-skill minimal-run-and-audit
add_skill https://github.com/lllllllama/ai-paper-reproduction-skill env-and-assets-bootstrap
add_skill https://github.com/lllllllama/ai-paper-reproduction-skill repo-intake-and-plan
add_skill https://github.com/lllllllama/ai-paper-reproduction-skill paper-context-resolver
add_skill https://github.com/wshobson/agents security-requirement-extraction
add_skill https://github.com/useai-pro/openclaw-skills-security skill-vetter
add_skill https://github.com/obra/superpowers requesting-code-review
add_skill https://github.com/coreyhaines31/marketingskills copywriting
add_skill https://github.com/coreyhaines31/marketingskills seo-audit
add_skill https://github.com/scrapegraphai/just-scrape just-scrape
add_skill https://github.com/xixu-me/skills develop-userscripts
add_skill https://github.com/pbakaus/impeccable impeccable
add_skill https://github.com/obra/superpowers using-superpowers
add_skill https://github.com/obra/superpowers writing-plans
add_skill https://github.com/obra/superpowers systematic-debugging
add_skill https://github.com/obra/superpowers brainstorming
add_skill https://github.com/arvindrk/extract-design-system extract-design-system
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit turborepo-monorepo
add_skill https://github.com/vercel/turborepo turborepo
add_skill https://github.com/vercel-labs/agent-skills writing-guidelines
add_skill https://github.com/github/awesome-copilot create-readme
add_skill https://github.com/qu-skills/skills web-search
add_skill https://github.com/qu-skills/skills python-executor
add_skill https://github.com/qu-skills/skills agent-tools

# UI/UX
add_skill https://github.com/anthropics/skills frontend-design
add_skill https://github.com/leonxlnx/taste-skill design-taste-frontend
add_skill https://github.com/shadcn/ui shadcn
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit shadcn-ui
add_skill https://github.com/nextlevelbuilder/ui-ux-pro-max-skill ui-ux-pro-max
add_skill https://github.com/vercel-labs/agent-skills web-design-guidelines

# Tailwind
add_skill https://github.com/secondsky/claude-skills tailwind-v4-shadcn
add_skill https://github.com/lombiq/tailwind-agent-skills tailwind-4-docs
add_skill https://github.com/josiahsiegel/claude-plugin-marketplace tailwindcss-advanced-layouts
add_skill https://github.com/mastra-ai/mastra tailwind-best-practices
add_skill https://github.com/wshobson/agents tailwind-design-system
add_skill https://github.com/heygen-com/hyperframes tailwind
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit tailwind-css-patterns
add_skill https://github.com/jezweb/claude-skills tailwind-theme-builder

# React
add_skill https://github.com/vercel-labs/json-render react
add_skill https://github.com/vercel-labs/agent-skills vercel-react-view-transitions
add_skill https://github.com/vercel-labs/agent-skills vercel-composition-patterns
add_skill https://github.com/vercel-labs/agent-skills vercel-react-best-practices
add_skill https://github.com/google-labs-code/stitch-skills react:components
add_skill https://github.com/github/awesome-copilot react19-concurrent-patterns
add_skill https://github.com/wshobson/agents react-modernization
add_skill https://github.com/callstackincubator/agent-device react-devtools
add_skill https://react-aria.adobe.com
add_skill https://github.com/asyrafhussin/agent-skills react-vite-best-practices
add_skill https://github.com/nickcrew/claude-ctx-plugin react-performance-optimization
add_skill https://github.com/softaworks/agent-toolkit react-dev
add_skill https://github.com/jeffallan/claude-skills react-expert
add_skill https://github.com/remix-run/agent-skills react-router-framework-mode
add_skill https://github.com/vercel-labs/json-render react-pdf
add_skill https://github.com/vercel-labs/json-render react-three-fiber

# State Management
add_skill https://github.com/vercel-labs/json-render zustand
add_skill https://github.com/wshobson/agents react-state-management

# Next.js
add_skill https://github.com/sickn33/antigravity-awesome-skills nextjs-best-practices
add_skill https://github.com/wshobson/agents nextjs-app-router-patterns
add_skill https://github.com/wsimmonds/claude-nextjs-skills nextjs-app-router-fundamentals
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-app-router
add_skill https://github.com/mindrally/skills nextjs-react-typescript
add_skill https://github.com/affaan-m/everything-claude-code nextjs-turbopack
add_skill https://github.com/vercel/nextjs-skills next-cache-components
add_skill https://github.com/mohamed-hossam1/nextjs-cache-architecture nextjs-cache-architecture
add_skill https://github.com/jeffallan/claude-skills nextjs-developer
add_skill https://github.com/laguagu/claude-code-nextjs-skills nextjs-seo
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-performance
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-data-fetching
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-deployment
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-authentication
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-code-review
add_skill https://github.com/laguagu/claude-code-nextjs-skills nextjs-shadcn
add_skill https://github.com/vercel/vercel-plugin next-upgrade

# Docker
add_skill https://github.com/github/awesome-copilot multi-stage-dockerfile
add_skill https://github.com/sickn33/antigravity-awesome-skills docker-expert
add_skill https://github.com/affaan-m/everything-claude-code docker-patterns
add_skill https://github.com/manutej/luxor-claude-marketplace docker-compose-orchestration
add_skill https://github.com/microsoft/azure-skills azure-kubernetes

# TypeScript
add_skill https://github.com/wshobson/agents typescript-advanced-types
add_skill https://github.com/sickn33/antigravity-awesome-skills typescript-expert
add_skill https://github.com/dotneet/claude-code-marketplace typescript-react-reviewer
add_skill https://github.com/0xbigboss/claude-code typescript-best-practices

# Bun
add_skill https://bun.sh/docs bun
add_skill https://github.com/affaan-m/everything-claude-code bun-runtime
add_skill https://github.com/sickn33/antigravity-awesome-skills bun-development

# PostgreSQL
add_skill https://github.com/wshobson/agents postgresql-table-design
add_skill https://github.com/github/awesome-copilot postgresql-optimization
add_skill https://github.com/github/awesome-copilot postgresql-code-review

# Prisma
add_skill https://github.com/prisma/skills prisma-database-setup
add_skill https://github.com/prisma/skills prisma-client-api
add_skill https://github.com/prisma/skills prisma-cli
add_skill https://github.com/prisma/skills prisma-upgrade-v7
add_skill https://github.com/prisma/skills prisma-driver-adapter-implementation
add_skill https://github.com/sickn33/antigravity-awesome-skills prisma-expert
add_skill https://github.com/wshobson/agents database-migration

# Testing
add_skill https://github.com/anthropics/skills webapp-testing
add_skill https://github.com/currents-dev/playwright-best-practices-skill playwright-best-practices
add_skill https://github.com/wshobson/agents e2e-testing-patterns
add_skill https://github.com/wshobson/agents javascript-testing-patterns
add_skill https://github.com/github/awesome-copilot javascript-typescript-jest
add_skill https://github.com/obra/superpowers test-driven-development
add_skill https://github.com/coreyhaines31/marketingskills ab-testing
add_skill https://github.com/github/awesome-copilot playwright-generate-test
add_skill https://github.com/antfu/skills vitest
add_skill https://github.com/testdino-hq/playwright-skill playwright-skill
add_skill https://github.com/browserbase/skills ui-test
add_skill https://github.com/affaan-m/everything-claude-code e2e-testing
add_skill https://github.com/addyosmani/agent-skills browser-testing-with-devtools
add_skill https://github.com/cognitedata/builder-skills test-coverage
add_skill https://github.com/trailofbits/skills property-based-testing
add_skill https://github.com/itechmeat/llm-code react-testing-library

# Authentication
add_skill https://github.com/better-auth/skills better-auth-security-best-practices
add_skill https://github.com/better-auth/skills create-auth-skill
add_skill https://github.com/better-auth/skills email-and-password-best-practices
add_skill https://github.com/better-auth/skills two-factor-authentication-best-practices
add_skill https://github.com/vercel-labs/portless oauth
add_skill https://github.com/wshobson/agents auth-implementation-patterns

# Caveman
add_skill https://github.com/juliusbrussee/caveman caveman-help
add_skill https://github.com/juliusbrussee/caveman caveman-compress
add_skill https://github.com/juliusbrussee/caveman caveman-commit
add_skill https://github.com/juliusbrussee/caveman caveman-review

# Documentation
add_skill https://github.com/anthropics/knowledge-work-plugins documentation
add_skill https://github.com/github/awesome-copilot update-oo-component-documentation
add_skill https://github.com/github/awesome-copilot create-oo-component-documentation
add_skill https://github.com/addyosmani/agent-skills documentation-and-adrs
add_skill https://github.com/github/awesome-copilot documentation-writer

# Deployment
add_skill https://github.com/railwayapp/railway-skills deployment
add_skill https://github.com/affaan-m/everything-claude-code deployment-patterns
add_skill https://github.com/wshobson/agents deployment-pipeline-design

# Office Files
add_skill https://github.com/anthropics/skills docx
add_skill https://github.com/anthropics/skills pdf
add_skill https://github.com/anthropics/skills pptx
add_skill https://github.com/anthropics/skills xlsx

# Matt Pocock's Skills
add_skill https://github.com/mattpocock/skills

# Excalidraw
add_skill https://github.com/github/awesome-copilot excalidraw-diagram-generator

# PRD
add_skill https://github.com/github/awesome-copilot prd

# Git/GitHub
add_skill https://github.com/github/awesome-copilot gh-cli
add_skill https://github.com/github/awesome-copilot git-commit
add_skill https://github.com/xixu-me/skills github-actions-docs
add_skill https://github.com/github/awesome-copilot github-issues
add_skill https://github.com/github/awesome-copilot git-flow-branch-creator

# CI/CD
add_skill https://github.com/addyosmani/agent-skills ci-cd-and-automation

# Python
add_skill https://github.com/wshobson/agents python-performance-optimization
add_skill https://github.com/wshobson/agents python-testing-patterns
add_skill https://github.com/wshobson/agents python-design-patterns
add_skill https://github.com/github/awesome-copilot dataverse-python-production-code
add_skill https://github.com/github/awesome-copilot dataverse-python-advanced-patterns
add_skill https://github.com/github/awesome-copilot dataverse-python-quickstart
add_skill https://github.com/wshobson/agents python-project-structure
add_skill https://github.com/wshobson/agents python-packaging
add_skill https://github.com/wshobson/agents python-error-handling
add_skill https://github.com/wshobson/agents python-anti-patterns
add_skill https://github.com/wshobson/agents python-type-safety
add_skill https://github.com/wshobson/agents python-configuration
add_skill https://github.com/wshobson/agents python-observability
add_skill https://github.com/wshobson/agents python-resilience
add_skill https://github.com/wshobson/agents python-background-jobs
add_skill https://github.com/wshobson/agents async-python-patterns
add_skill https://github.com/trailofbits/skills modern-python
add_skill https://github.com/0xbigboss/claude-code python-best-practices
add_skill https://github.com/jiatastic/open-python-skills python-backend
add_skill https://github.com/astral-sh/claude-code-plugins uv
add_skill https://github.com/wshobson/agents uv-package-manager

# FastAPI
add_skill https://github.com/fastapi/fastapi fastapi
add_skill https://github.com/wshobson/agents fastapi-templates
add_skill https://github.com/mindrally/skills fastapi-python
add_skill https://github.com/jeffallan/claude-skills fastapi-expert
add_skill https://github.com/thebushidocollective/han fastapi-async-patterns

# Vercel AI SDK
add_skill https://github.com/vercel/ai ai-sdk
add_skill https://github.com/sickn33/antigravity-awesome-skills vercel-ai-sdk-expert
add_skill https://github.com/vercel/ai-elements ai-elements

# Zod
add_skill https://github.com/pproenca/dot-skills zod
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit zod-validation-utilities

# Framer Motion
add_skill https://github.com/patricio0312rev/skills framer-motion-animator

# Accessibility
add_skill https://github.com/addyosmani/web-quality-skills accessibility

# Icons
add_skill https://github.com/better-auth/better-icons better-icons

# TanStack
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-query
add_skill https://github.com/deckardger/tanstack-agent-skills tanstack-query-best-practices
add_skill https://github.com/deckardger/tanstack-agent-skills tanstack-start-best-practices
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-table
add_skill https://github.com/deckardger/tanstack-agent-skills tanstack-router-best-practices
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-router
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-form
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-start
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-virtual
add_skill https://github.com/deckardger/tanstack-agent-skills tanstack-integration-best-practices
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-devtools
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-store
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-db
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-cli
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-pacer
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-ai
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-config
add_skill https://github.com/tanstack-skills/tanstack-skills tanstack-ranger

# Design / Taste extras (leonxlnx/taste-skill)
add_skill https://github.com/leonxlnx/taste-skill high-end-visual-design
add_skill https://github.com/leonxlnx/taste-skill redesign-existing-projects
add_skill https://github.com/leonxlnx/taste-skill minimalist-ui
add_skill https://github.com/leonxlnx/taste-skill image-to-code
add_skill https://github.com/leonxlnx/taste-skill brandkit

# Forms
add_skill https://github.com/pproenca/dot-skills react-hook-form
add_skill https://github.com/jezweb/claude-skills react-hook-form-zod

# Vercel
add_skill https://github.com/vercel-labs/agent-skills vercel-optimize
add_skill https://github.com/vercel-labs/agent-skills vercel-cli-with-tokens
add_skill https://github.com/vercel-labs/agent-skills deploy-to-vercel

# Remotion
add_skill https://github.com/remotion-dev/skills remotion-best-practices

# Storybook
add_skill https://github.com/dalestudy/skills storybook

# Search & Scraping
add_skill https://github.com/firecrawl/cli
add_skill https://github.com/firecrawl/firecrawl-workflows
add_skill https://github.com/firecrawl/skills
add_skill https://github.com/apify/agent-skills
add_skill https://github.com/brave/brave-search-skills
add_skill https://github.com/tavily-ai/skills

# AI / LLM
add_skill https://github.com/openai/skills
add_skill https://github.com/langchain-ai/langchain-skills
add_skill https://github.com/google-gemini/gemini-skills
add_skill https://github.com/huggingface/skills
add_skill https://github.com/pinecone-io/skills

# Databases
add_skill https://github.com/neondatabase/agent-skills
add_skill https://github.com/redis/agent-skills
add_skill https://github.com/planetscale/database-skills
add_skill https://github.com/clickhouse/agent-skills

# Email & Communication
add_skill https://github.com/resend/resend-skills
add_skill https://github.com/livekit/agent-skills

# Voice & Audio
add_skill https://github.com/deepgram/skills
add_skill https://github.com/elevenlabs/skills

# Video
add_skill https://github.com/runwayml/skills

# Feature Flags
add_skill https://github.com/launchdarkly/agent-skills

# Workflow & Automation
add_skill https://github.com/n8n-io/n8n
add_skill https://github.com/triggerdotdev/skills
add_skill https://github.com/temporalio/skill-temporal-developer

# Data & Backend
add_skill https://github.com/dagster-io/skills
add_skill https://github.com/encoredev/skills
add_skill https://github.com/streamlit/agent-skills
add_skill https://github.com/dbt-labs/dbt-agent-skills

# Security & Code Quality
add_skill https://github.com/semgrep/skills
add_skill https://github.com/bitwarden/ai-plugins

# Web3
add_skill https://github.com/coinbase/agentic-wallet-skills
add_skill https://github.com/base/skills

# Alternative Runtimes & Frameworks
add_skill https://github.com/denoland/skills
add_skill https://github.com/sveltejs/ai-tools

# Other
add_skill https://github.com/wshobson/agents dependency-upgrade

# Kubb
add_skill https://github.com/kubb-labs/kubb

wait

echo "All installations completed."
