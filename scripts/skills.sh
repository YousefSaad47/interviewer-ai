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

# Only install the few skills the AI actually needs for the current task.
# Installing hundreds of skills waste a lot of tokens just for the AI to load
# the skills, which fills the context window on every session init.

# ## Zod
# add_skill https://github.com/pproenca/dot-skills zod
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit zod-validation-utilities

# # Forms
# add_skill https://github.com/pproenca/dot-skills react-hook-form
# add_skill https://github.com/jezweb/claude-skills react-hook-form-zod

# # Search & Scraping
# add_skill https://github.com/firecrawl/cli
# add_skill https://github.com/firecrawl/firecrawl-workflows
# add_skill https://github.com/firecrawl/skills

# # Authentication
# add_skill https://github.com/better-auth/skills better-auth-security-best-practices
# add_skill https://github.com/better-auth/skills create-auth-skill
# add_skill https://github.com/better-auth/skills email-and-password-best-practices
# add_skill https://github.com/better-auth/skills two-factor-authentication-best-practices

# # Accessibility
# add_skill https://github.com/addyosmani/web-quality-skills accessibility

# # UI/UX
# add_skill https://github.com/anthropics/skills frontend-design
# add_skill https://github.com/leonxlnx/taste-skill design-taste-frontend
# add_skill https://github.com/shadcn/ui shadcn
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit shadcn-ui
# add_skill https://github.com/nextlevelbuilder/ui-ux-pro-max-skill ui-ux-pro-max
# add_skill https://github.com/vercel-labs/agent-skills web-design-guidelines

# # Tailwind
# add_skill https://github.com/secondsky/claude-skills tailwind-v4-shadcn
# add_skill https://github.com/lombiq/tailwind-agent-skills tailwind-4-docs
# add_skill https://github.com/josiahsiegel/claude-plugin-marketplace tailwindcss-advanced-layouts
# add_skill https://github.com/mastra-ai/mastra tailwind-best-practices
# add_skill https://github.com/wshobson/agents tailwind-design-system
# add_skill https://github.com/heygen-com/hyperframes tailwind
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit tailwind-css-patterns
# add_skill https://github.com/jezweb/claude-skills tailwind-theme-builder

# # React
# add_skill https://github.com/vercel-labs/json-render react
# add_skill https://github.com/vercel-labs/agent-skills vercel-react-view-transitions
# add_skill https://github.com/vercel-labs/agent-skills vercel-composition-patterns
# add_skill https://github.com/vercel-labs/agent-skills vercel-react-best-practices
# add_skill https://github.com/google-labs-code/stitch-skills react:components
# add_skill https://github.com/github/awesome-copilot react19-concurrent-patterns
# add_skill https://github.com/wshobson/agents react-modernization
# add_skill https://github.com/callstackincubator/agent-device react-devtools
# add_skill https://react-aria.adobe.com
# add_skill https://github.com/asyrafhussin/agent-skills react-vite-best-practices
# add_skill https://github.com/nickcrew/claude-ctx-plugin react-performance-optimization
# add_skill https://github.com/softaworks/agent-toolkit react-dev
# add_skill https://github.com/jeffallan/claude-skills react-expert
# add_skill https://github.com/remix-run/agent-skills react-router-framework-mode
# add_skill https://github.com/vercel-labs/json-render react-pdf
# add_skill https://github.com/vercel-labs/json-render react-three-fiber

# # State Management
# add_skill https://github.com/vercel-labs/json-render zustand
# add_skill https://github.com/wshobson/agents react-state-management

# # Next.js
# add_skill https://github.com/sickn33/antigravity-awesome-skills nextjs-best-practices
# add_skill https://github.com/wshobson/agents nextjs-app-router-patterns
# add_skill https://github.com/wsimmonds/claude-nextjs-skills nextjs-app-router-fundamentals
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-app-router
# add_skill https://github.com/mindrally/skills nextjs-react-typescript
# add_skill https://github.com/affaan-m/everything-claude-code nextjs-turbopack
# add_skill https://github.com/vercel/nextjs-skills next-cache-components
# add_skill https://github.com/mohamed-hossam1/nextjs-cache-architecture nextjs-cache-architecture
# add_skill https://github.com/jeffallan/claude-skills nextjs-developer
# add_skill https://github.com/laguagu/claude-code-nextjs-skills nextjs-seo
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-performance
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-data-fetching
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-deployment
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-authentication
# add_skill https://github.com/giuseppe-trisciuoglio/developer-kit nextjs-code-review
# add_skill https://github.com/laguagu/claude-code-nextjs-skills nextjs-shadcn
# add_skill https://github.com/vercel/vercel-plugin next-upgrade

# # Express.js
# add_skill https://github.com/aj-geddes/useful-ai-prompts nodejs-express-server
# add_skill https://github.com/pluginagentmarketplace/custom-plugin-nodejs express-rest-api
# add_skill https://github.com/mindrally/skills express-typescript

# Prisma
add_skill https://github.com/prisma/skills prisma-database-setup
add_skill https://github.com/prisma/skills prisma-client-api
add_skill https://github.com/prisma/skills prisma-cli
add_skill https://github.com/prisma/skills prisma-upgrade-v7
add_skill https://github.com/prisma/skills prisma-driver-adapter-implementation
add_skill https://github.com/sickn33/antigravity-awesome-skills prisma-expert
add_skill https://github.com/wshobson/agents database-migration

# PostgreSQL
add_skill https://github.com/wshobson/agents postgresql-table-design
add_skill https://github.com/github/awesome-copilot postgresql-optimization
add_skill https://github.com/github/awesome-copilot postgresql-code-review

# Databases
add_skill https://github.com/neondatabase/agent-skills
add_skill https://github.com/redis/agent-skills
add_skill https://github.com/planetscale/database-skills
add_skill https://github.com/clickhouse/agent-skills

wait

echo "All installations completed."
