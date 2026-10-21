# Phase 3: Core API, caching and background jobs

```
Read CLAUDE.md, docs/PLAN.md and docs/SECURITY.md. Build Phase 3. Plan first.

API:
- Implement every MVP endpoint from docs/PLAN.md in apps/api.
- Zod schemas for every request and response live in packages/shared and are
  reused by the frontend.
- Every handler: authenticate, authorise (ownership/role), validate, then act.
- Cursor-based pagination on all list endpoints; sensible max page size.
- Use DB transactions for multi-step writes. No N+1 queries.
- Idempotency keys on create endpoints that could be retried (e.g. payments).
- Keep OpenAPI docs complete.

Cache (Redis):
- Cache-aside for the hottest read endpoints listed in the plan, with TTLs
  and invalidation on writes. Key format from CLAUDE.md.
- Rate limiting middleware (sliding window): stricter on auth and write routes,
  per IP and per user. Return 429 with Retry-After.

Background jobs (apps/worker, BullMQ):
- Implement the jobs from the plan (e.g. welcome email via Resend).
- Jobs are idempotent, have retries with exponential backoff, and a dead-letter
  approach for permanent failures. Log and report failures to Sentry.
- Graceful shutdown on SIGTERM for api and worker.

Tests: integration tests for each endpoint (happy path, validation error,
unauthorised, forbidden), plus cache and rate-limit tests.

Finish with all checks passing. Give me a plain-English summary and a list of
endpoints I can try at /docs. Update docs and commit.
```
