# Phase 1: Scaffold the project

```
Read CLAUDE.md and docs/PLAN.md. Build Phase 1 (scaffold). Plan first, then build.

Create a pnpm + Turborepo monorepo exactly as described in CLAUDE.md:
- apps/web: Next.js (latest stable, App Router, TypeScript strict, Tailwind CSS,
  shadcn/ui initialised), with a simple home page that calls the API health check.
- apps/api: Hono on Node.js with:
  - GET /health returning { status: "ok" } and DB + Redis connectivity
  - a Zod-validated env module (crashes on startup if config is missing)
  - pino JSON logging with a request ID on every log line
  - consistent JSON error handler, CORS restricted to APP_URL, secure headers
  - OpenAPI docs served at /docs
  - a Dockerfile (multi-stage, non-root user, small image)
- apps/worker: BullMQ worker connected to Redis with one example "hello" job,
  plus its own Dockerfile.
- packages/db: Drizzle ORM + drizzle-kit config, an empty schema ready for tables.
- packages/shared: shared Zod schemas and types.
- packages/config: shared tsconfig, eslint (flat config) and prettier.
- docker-compose.yml with Postgres and Redis (with healthchecks and volumes).
- Root scripts: dev, build, lint, typecheck, test, test:e2e, db:generate, db:migrate, db:seed.
- Vitest set up in api and shared with one passing test each.
- .env.example kept up to date; .gitignore correct.
- Husky + lint-staged to run lint and format before each commit.

Use the latest stable versions of everything and pin them in the lockfile.

When finished:
1. Run `docker compose up -d`, `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
   and report the results.
2. Tell me exactly how to start it and what I should see in the browser.
3. Update CLAUDE.md (commands section) and tick Phase 1 in docs/ROADMAP.md.
4. Commit.
```
