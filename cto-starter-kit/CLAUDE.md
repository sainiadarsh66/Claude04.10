# CLAUDE.md: project memory

Claude reads this file at the start of every session. Keep it short, accurate and up to date.

## The owner
- The founder is **not a software engineer**. Explain decisions in plain English, briefly.
- Before big or irreversible changes (new dependencies, database schema changes, deleting files, anything touching production), explain the plan and wait for approval.
- After each task, give a short summary: what changed, how to test it manually, and anything the founder must do (for example, add a key in a dashboard).

## Product
See `docs/PRODUCT_BRIEF.md`. Build only what is in the brief or the current phase in `docs/ROADMAP.md`. Suggest extras, but don't build them unasked.

## Stack (do not change without approval)
- **Language:** TypeScript everywhere, `strict: true`. No `any` unless it is justified in a comment.
- **Monorepo:** pnpm workspaces + Turborepo.
  - `apps/web`: Next.js (App Router, React Server Components), Tailwind CSS, shadcn/ui
  - `apps/api`: Hono on Node.js (LTS), REST + OpenAPI, stateless
  - `apps/worker`: BullMQ background job processor
  - `packages/db`: Drizzle ORM schema, migrations, seed
  - `packages/shared`: Zod schemas and types shared by web and api
  - `packages/ui`: shared React components (if needed)
  - `packages/config`: shared eslint/tsconfig
- **Database:** PostgreSQL (Neon in the cloud, Docker locally). Migrations via `drizzle-kit`. Never edit a migration that has already been applied.
- **Cache / queues / rate limiting:** Redis (Upstash in the cloud, Docker locally).
- **Auth:** Clerk. The API verifies the Clerk JWT on every protected route.
- **Validation:** Zod at every boundary (HTTP input, env vars, job payloads, third-party webhooks).
- **Testing:** Vitest (unit/integration), Playwright (end-to-end).
- **Observability:** Sentry (errors), PostHog (product analytics), structured JSON logs (pino).
- **Hosting:** Vercel (web), Railway (api + worker, Docker), Neon, Upstash.

## Commands
```bash
pnpm install          # install dependencies
pnpm dev              # start everything locally (needs `docker compose up -d` first)
pnpm build            # build all apps
pnpm lint             # eslint
pnpm typecheck        # tsc
pnpm test             # vitest
pnpm test:e2e         # playwright
pnpm db:generate      # create a migration from schema changes
pnpm db:migrate       # apply migrations
pnpm db:seed          # load sample data
docker compose up -d  # start local postgres + redis
```
(Update this list if the scripts change.)

## Rules for writing code
1. **Security first.** Follow `docs/SECURITY.md`. Every API route checks authentication *and* authorization (does this user own this resource?).
2. **No secrets in code.** Read config only through a validated env module (`env.ts` using Zod). Add new variables to `.env.example` with a comment.
3. **Stateless API.** No in-memory sessions or caches that would break with multiple instances. Use Redis.
4. **Database:** every table has `id` (uuid or ULID), `created_at` and `updated_at`. Add indexes for columns you filter or join on. Use transactions for multi-step writes. Avoid N+1 queries. Paginate lists (cursor-based).
5. **Caching:** cache-aside with explicit TTLs, and invalidate on write. Key format: `app:{entity}:{id}:v1`.
6. **Slow work** (email, image processing, third-party calls over about 500ms) goes into a BullMQ job. Jobs must be idempotent and retry-safe.
7. **Errors:** return consistent JSON errors `{ error: { code, message } }`. Never leak stack traces to users. Report to Sentry.
8. **Tests:** every new feature gets tests. Bug fixes get a test that would have caught the bug.
9. **Accessibility:** semantic HTML, labels on inputs, keyboard navigable, colour contrast WCAG AA.
10. **Keep it simple.** Prefer boring, well-known solutions. No new dependency without saying why.
11. Before saying a task is done, run `pnpm lint && pnpm typecheck && pnpm test` and report the result honestly.

## Git
- Work on a feature branch, with small commits and clear messages.
- `main` is always deployable. It deploys to production. `staging` deploys to staging.

## Decisions log
Add one line per important decision: date, decision, why.
- YYYY-MM-DD: Chose the stack above. Reason: one language, scales horizontally, managed services keep ops small.
