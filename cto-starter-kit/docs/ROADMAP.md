# Roadmap

Tick items as they are done. Ask Claude to update this file at the end of each phase.

## Phase 0: Plan
- [ ] Product brief complete
- [ ] Build plan, data model and API list approved (`docs/PLAN.md`)

## Phase 1: Scaffold
- [ ] Monorepo (pnpm + Turborepo) with web, api, worker, db, shared
- [ ] Docker Compose with Postgres + Redis
- [ ] Lint, format, typecheck, test commands working
- [ ] `pnpm dev` runs everything; health check at `/health`

## Phase 2: Auth + database
- [ ] Clerk sign-up/login on web
- [ ] API verifies the JWT; users table synced via webhook
- [ ] Core tables + migrations + seed data

## Phase 3: API, cache, jobs
- [ ] Core CRUD endpoints with validation and authorization
- [ ] OpenAPI docs
- [ ] Redis cache + rate limiting
- [ ] BullMQ worker + first job (e.g. welcome email)

## Phase 4: Frontend
- [ ] Design system (colours, typography, components)
- [ ] All MVP screens, responsive, accessible
- [ ] Loading, empty and error states

## Phase 5: Security hardening
- [ ] `docs/SECURITY.md` checklist items in code done
- [ ] `/security-review` clean

## Phase 6: Testing + CI
- [ ] Unit + integration + e2e tests for the main user journeys
- [ ] GitHub Actions: lint, typecheck, test, build on every PR

## Phase 7: Deploy
- [ ] Staging + production live
- [ ] Custom domain + HTTPS
- [ ] Sentry + PostHog connected
- [ ] Backups confirmed

## Phase 8: Payments (if needed)
- [ ] Stripe checkout + customer portal + webhooks

## Phase 9: Scale (when needed)
- [ ] Load test results and fixes
- [ ] Autoscaling configured
