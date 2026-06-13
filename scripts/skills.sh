#!/usr/bin/env bash

set -Eeuo pipefail

MAX_JOBS=10

add_skill() {
  local url="$1"
  local skill="$2"

  if [[ -d ".agents/skills/$skill" ]]; then
    echo "Skipping $skill"
    return
  fi

  while [[ $(jobs -p | wc -l) -ge $MAX_JOBS ]]; do
    sleep 1
  done

  (
    echo "Installing $skill..."

    npx skills add "$url" \
      --skill "$skill" \
      --yes

    echo "✓ $skill"
  ) &
}

add_skill https://github.com/vercel-labs/skills find-skills

add_skill https://github.com/browser-use/browser-use browser-use
add_skill https://github.com/vercel-labs/agent-browser agent-browser
add_skill https://github.com/github/awesome-copilot refactor
add_skill https://github.com/affaan-m/everything-claude-code security-review
add_skill https://github.com/google-labs-code/stitch-skills enhance-prompt
add_skill https://github.com/addyosmani/web-quality-skills performance

add_skill https://github.com/anthropics/skills frontend-design
add_skill https://github.com/leonxlnx/taste-skill design-taste-frontend
add_skill https://github.com/shadcn/ui shadcn
add_skill https://github.com/nextlevelbuilder/ui-ux-pro-max-skill ui-ux-pro-max
add_skill https://github.com/vercel-labs/agent-skills web-design-guidelines

add_skill https://github.com/secondsky/claude-skills tailwind-v4-shadcn
add_skill https://github.com/lombiq/tailwind-agent-skills tailwind-4-docs
add_skill https://github.com/josiahsiegel/claude-plugin-marketplace tailwindcss-advanced-layouts
add_skill https://github.com/mastra-ai/mastra tailwind-best-practices
add_skill https://github.com/wshobson/agents tailwind-design-system
add_skill https://github.com/heygen-com/hyperframes tailwind
add_skill https://github.com/giuseppe-trisciuoglio/developer-kit tailwind-css-patterns
add_skill https://github.com/jezweb/claude-skills tailwind-theme-builder

add_skill https://github.com/vercel-labs/json-render react
add_skill https://github.com/google-labs-code/stitch-skills react:components
add_skill https://github.com/vercel-labs/agent-skills vercel-react-view-transitions
add_skill https://github.com/vercel-labs/agent-skills vercel-composition-patterns
add_skill https://github.com/vercel-labs/agent-skills vercel-react-best-practices
add_skill https://github.com/sickn33/antigravity-awesome-skills nextjs-best-practices
add_skill https://github.com/wshobson/agents nextjs-app-router-patterns
add_skill https://github.com/mindrally/skills nextjs-react-typescript
add_skill https://github.com/affaan-m/everything-claude-code nextjs-turbopack

add_skill https://github.com/github/awesome-copilot multi-stage-dockerfile
add_skill https://github.com/sickn33/antigravity-awesome-skills docker-expert
add_skill https://github.com/affaan-m/everything-claude-code docker-patterns
add_skill https://github.com/manutej/luxor-claude-marketplace docker-compose-orchestration
add_skill https://github.com/microsoft/azure-skills azure-kubernetes

add_skill https://github.com/wshobson/agents typescript-advanced-types
add_skill https://github.com/sickn33/antigravity-awesome-skills typescript-expert
add_skill https://github.com/dotneet/claude-code-marketplace typescript-react-reviewer
add_skill https://github.com/0xbigboss/claude-code typescript-best-practices

add_skill https://bun.sh/docs bun
add_skill https://github.com/affaan-m/everything-claude-code bun-runtime
add_skill https://github.com/sickn33/antigravity-awesome-skills bun-development

add_skill https://github.com/wshobson/agents postgresql-table-design
add_skill https://github.com/github/awesome-copilot postgresql-optimization
add_skill https://github.com/github/awesome-copilot postgresql-code-review

add_skill https://github.com/prisma/skills prisma-database-setup
add_skill https://github.com/prisma/skills prisma-client-api
add_skill https://github.com/prisma/skills prisma-cli
add_skill https://github.com/prisma/skills prisma-upgrade-v7
add_skill https://github.com/prisma/skills prisma-driver-adapter-implementation
add_skill https://github.com/sickn33/antigravity-awesome-skills prisma-expert
add_skill https://github.com/wshobson/agents database-migration

add_skill https://github.com/anthropics/skills webapp-testing
add_skill https://github.com/currents-dev/playwright-best-practices-skill playwright-best-practices
add_skill https://github.com/wshobson/agents e2e-testing-patterns
add_skill https://github.com/wshobson/agents javascript-testing-patterns
add_skill https://github.com/github/awesome-copilot javascript-typescript-jest
add_skill https://github.com/obra/superpowers test-driven-development

add_skill https://github.com/addyosmani/agent-skills ci-cd-and-automation


add_skill https://github.com/juliusbrussee/caveman caveman-help
add_skill https://github.com/juliusbrussee/caveman caveman-compress
add_skill https://github.com/juliusbrussee/caveman caveman-commit
add_skill https://github.com/juliusbrussee/caveman caveman-review
add_skill https://github.com/mattpocock/skills caveman

add_skill https://github.com/obra/superpowers requesting-code-review

add_skill https://github.com/anthropics/knowledge-work-plugins documentation
add_skill https://github.com/github/awesome-copilot update-oo-component-documentation
add_skill https://github.com/github/awesome-copilot create-oo-component-documentation
add_skill https://github.com/addyosmani/agent-skills documentation-and-adrs
add_skill https://github.com/github/awesome-copilot documentation-writer

add_skill https://github.com/coreyhaines31/marketingskills ab-testing

add_skill https://github.com/railwayapp/railway-skills deployment
add_skill https://github.com/sickn33/antigravity-awesome-skills vercel-deployment
add_skill https://github.com/affaan-m/everything-claude-code deployment-patterns
add_skill https://github.com/wshobson/agents deployment-pipeline-design

add_skill https://github.com/anthropics/skills docx
add_skill https://github.com/anthropics/skills pdf
add_skill https://github.com/anthropics/skills pptx

add_skill https://github.com/coreyhaines31/marketingskills copywriting

add_skill https://github.com/coreyhaines31/marketingskills seo-audit

add_skill https://github.com/scrapegraphai/just-scrape just-scrape

add_skill https://github.com/xixu-me/skills use-my-browser

add_skill https://github.com/xixu-me/skills develop-userscripts

add_skill https://github.com/xixu-me/skills github-actions-docs

add_skill https://github.com/pbakaus/impeccable impeccable

add_skill https://github.com/obra/superpowers using-superpowers

add_skill https://github.com/obra/superpowers writing-plans

add_skill https://github.com/obra/superpowers systematic-debugging

add_skill https://github.com/obra/superpowers brainstorming

add_skill https://github.com/arvindrk/extract-design-system extract-design-system

add_skill https://github.com/mattpocock/skills handoff
add_skill https://github.com/mattpocock/skills zoom-out
add_skill https://github.com/mattpocock/skills prototype
add_skill https://github.com/mattpocock/skills write-a-skill
add_skill https://github.com/mattpocock/skills to-issues
add_skill https://github.com/mattpocock/skills to-prd
add_skill https://github.com/mattpocock/skills triage
add_skill https://github.com/mattpocock/skills diagnose
add_skill https://github.com/mattpocock/skills tdd
add_skill https://github.com/mattpocock/skills grill-me
add_skill https://github.com/mattpocock/skills grill-with-docs
add_skill https://github.com/mattpocock/skills improve-codebase-architecture

add_skill https://github.com/anthropics/skills skill-creator

add_skill https://github.com/roin-orca/skills simple

add_skill https://github.com/lllllllama/ai-paper-reproduction-skill minimal-run-and-audit

add_skill https://github.com/lllllllama/ai-paper-reproduction-skill env-and-assets-bootstrap

add_skill https://github.com/lllllllama/ai-paper-reproduction-skill repo-intake-and-plan

add_skill https://github.com/lllllllama/ai-paper-reproduction-skill paper-context-resolver

add_skill https://github.com/wshobson/agents security-requirement-extraction

add_skill https://github.com/useai-pro/openclaw-skills-security skill-vetter

add_skill https://github.com/github/awesome-copilot excalidraw-diagram-generator

add_skill https://github.com/github/awesome-copilot prd

add_skill https://github.com/github/awesome-copilot gh-cli

add_skill https://github.com/github/awesome-copilot git-commit

add_skill https://github.com/wshobson/agents python-performance-optimization
add_skill https://github.com/wshobson/agents python-design-patterns
add_skill https://github.com/wshobson/agents uv-package-manager
add_skill https://github.com/astral-sh/claude-code-plugins uv
add_skill https://github.com/github/awesome-copilot dataverse-python-production-code

wait

echo "All installations completed."
