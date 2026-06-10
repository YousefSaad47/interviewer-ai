---
name: Bun
description: Use when building, testing, or deploying JavaScript/TypeScript applications. Reach for Bun when you need to run scripts, manage packages, bundle code, or test applications with a single unified toolkit.
metadata:
    mintlify-proj: bun
    version: "1.0"
---

# Bun Skill

## Product Summary

Bun is an all-in-one JavaScript/TypeScript toolkit that replaces Node.js, npm, and bundlers with a single binary. It includes a fast runtime (powered by JavaScriptCore), package manager, test runner, and bundler—all optimized for speed and modern JavaScript.

**Key files and commands:**
- `bunfig.toml` — Configuration file (optional, in project root)
- `package.json` — Standard Node.js package manifest
- `bun run <script>` — Execute scripts or files (28x faster than npm run)
- `bun install` — Install dependencies (25x faster than npm)
- `bun test` — Run Jest-compatible tests
- `bun build` — Bundle code for browsers or servers
- `bun <file.ts>` — Execute TypeScript/JSX directly

**Primary docs:** https://bun.com/docs

---

## When to Use

Use Bun when:

- **Running scripts or files** — Execute `.ts`, `.tsx`, `.js`, `.jsx` files directly without compilation setup
- **Managing dependencies** — Install, add, remove packages faster than npm/yarn/pnpm
- **Testing** — Write Jest-compatible tests with TypeScript support, snapshots, and watch mode
- **Bundling** — Build applications for browsers or servers with native TypeScript/JSX support
- **Building HTTP servers** — Create REST APIs or full-stack apps with `Bun.serve()`
- **Replacing Node.js** — Use as a drop-in Node.js replacement in existing projects
- **Monorepos** — Manage workspaces with fast installs and filtered script execution

Do not use Bun for:
- Projects requiring specific Node.js APIs not yet supported (check [compatibility page](/runtime/nodejs-compat))
- Environments where Bun binary cannot be installed

---

## Quick Reference

### Essential Commands

| Task | Command |
|------|---------|
| Run a file | `bun run index.ts` or `bun index.ts` |
| Run a script | `bun run dev` (from package.json) |
| Install dependencies | `bun install` |
| Add a package | `bun add react` |
| Add dev dependency | `bun add -d @types/node` |
| Remove a package | `bun remove react` |
| Run tests | `bun test` |
| Watch tests | `bun test --watch` |
| Build for browser | `bun build ./index.tsx --outdir ./dist` |
| Build for server | `bun build ./server.ts --target bun --outdir ./dist` |
| Execute a package | `bunx cowsay "Hello"` |

### File Types Supported (No Config Needed)

- `.ts`, `.tsx` — TypeScript and JSX
- `.js`, `.jsx` — JavaScript and JSX
- `.json`, `.jsonc`, `.toml`, `.yaml` — Data files (imported as objects)
- `.html` — HTML with asset bundling
- `.css` — CSS bundling
- `.wasm`, `.node` — Native modules

### Configuration Sections in bunfig.toml

```toml
# Runtime behavior
[run]
shell = "system"  # or "bun"
bun = true        # alias node to bun

# Package manager
[install]
optional = true
dev = true
peer = true
production = false
linker = "hoisted"  # or "isolated"

# Test runner
[test]
root = "."
preload = ["./setup.ts"]
coverage = false
randomize = false

# Server defaults
[serve]
port = 3000
```

---

## Decision Guidance

### When to Use `bun run` vs `bun <file>`

| Scenario | Use |
|----------|-----|
| Executing a package.json script | `bun run dev` |
| Running a TypeScript file directly | `bun index.ts` |
| Running a file with Bun flags | `bun --watch index.ts` |
| Ambiguous name (could be script or file) | `bun run <name>` (prioritizes scripts) |

### When to Use `--linker hoisted` vs `--linker isolated`

| Scenario | Use |
|----------|-----|
| New monorepo/workspace | `isolated` (prevents phantom dependencies) |
| New single-package project | `hoisted` (traditional npm behavior) |
| Existing project (pre-v1.3.2) | `hoisted` (backward compatible) |
| Strict dependency isolation needed | `isolated` |

### When to Bundle vs Run Directly

| Scenario | Use |
|----------|-----|
| Development server | `bun run server.ts` (no bundling) |
| Production deployment | `bun build server.ts --target bun` (bundled) |
| Browser application | `bun build app.tsx --target browser` |
| Single executable | `bun build app.ts --compile --outfile mycli` |

### Test Execution: Sequential vs Concurrent

| Scenario | Use |
|----------|-----|
| Tests with shared state | `test.serial()` or default (sequential) |
| Independent async tests | `test.concurrent()` or `--concurrent` flag |
| Gradual migration | `concurrentTestGlob` in bunfig.toml |

---

## Workflow

### 1. Initialize a Project

```bash
bun init my-app
cd my-app
```

This creates `package.json`, `tsconfig.json`, and a starter `index.ts`.

### 2. Install Dependencies

```bash
bun install
```

Creates `bun.lock` (text-based lockfile). Commit this to version control.

### 3. Add Packages

```bash
bun add react
bun add -d @types/react
```

Updates `package.json` and `bun.lock`.

### 4. Write and Run Code

Create `index.ts`:
```ts
const greeting = "Hello, Bun!";
console.log(greeting);
```

Run it:
```bash
bun index.ts
```

### 5. Create an HTTP Server

```ts
const server = Bun.serve({
  port: 3000,
  routes: {
    "/": () => new Response("Hello!"),
    "/api/data": () => Response.json({ message: "data" }),
  },
});

console.log(`Server running at ${server.url}`);
```

Run with:
```bash
bun run index.ts
```

### 6. Write Tests

Create `math.test.ts`:
```ts
import { test, expect } from "bun:test";

test("2 + 2 = 4", () => {
  expect(2 + 2).toBe(4);
});
```

Run tests:
```bash
bun test
bun test --watch
```

### 7. Bundle for Production

```bash
bun build ./src/index.tsx --outdir ./dist --minify
```

For a server:
```bash
bun build ./server.ts --target bun --outdir ./dist
```

For a single executable:
```bash
bun build ./cli.ts --compile --outfile mycli
```

### 8. Configure bunfig.toml (Optional)

```toml
[run]
shell = "system"

[install]
linker = "isolated"

[test]
coverage = true
```

---

## Common Gotchas

- **Flag placement matters** — `bun --watch run dev` ✓, `bun run dev --watch` ✗ (flags after `run` are passed to the script)
- **Lifecycle scripts disabled by default** — Add packages to `trustedDependencies` in `package.json` to allow `postinstall` scripts
- **Auto-install can mask issues** — Set `install.auto = "disable"` in bunfig.toml if you want explicit `bun install` calls
- **Lockfile format changed** — Bun v1.2+ uses text `bun.lock` instead of binary `bun.lockb`; migrate with `bun install --save-text-lockfile`
- **Node.js compatibility incomplete** — Check [compatibility page](/runtime/nodejs-compat) before assuming Node.js APIs work
- **Test files must match patterns** — Only `*.test.ts`, `*_test.ts`, `*.spec.ts`, `*_spec.ts` are discovered
- **Shebang scripts run with node by default** — Use `bun run --bun <script>` to run with Bun instead
- **Environment variables not auto-injected in bundles** — Use `env: "inline"` or `env: "PUBLIC_*"` in `bun build` to inject them
- **Peer dependencies installed by default** — Use `--omit peer` to skip them
- **Minification doesn't downconvert syntax** — Use a transpiler if you need ES5 output

---

## Verification Checklist

Before submitting work with Bun:

- [ ] **Dependencies installed** — Run `bun install` and commit `bun.lock`
- [ ] **Scripts tested locally** — Run `bun run <script>` and verify output
- [ ] **Tests pass** — Run `bun test` with no failures
- [ ] **TypeScript compiles** — No type errors in IDE or from `bun check` (if available)
- [ ] **Bunfig valid** — If using `bunfig.toml`, syntax is correct TOML
- [ ] **Lockfile committed** — `bun.lock` is in version control
- [ ] **No trusted dependencies needed** — Or `trustedDependencies` is documented in `package.json`
- [ ] **Build succeeds** — If bundling, `bun build` completes without errors
- [ ] **Environment variables set** — For production, verify `.env` or CI/CD secrets are configured
- [ ] **Node.js APIs checked** — If using Node.js modules, verify they're supported by Bun

---

## Resources

**Comprehensive navigation:** https://bun.com/docs/llms.txt

**Critical pages:**
1. [Runtime](/runtime) — Execute files and scripts
2. [Package Manager](/pm/cli/install) — Install and manage dependencies
3. [Test Runner](/test) — Write and run tests
4. [Bundler](/bundler) — Bundle code for production
5. [HTTP Server](/runtime/http/server) — Build servers with `Bun.serve()`

---

> For additional documentation and navigation, see: https://bun.com/docs/llms.txt