# Phase 2: Login and database

**Before you start:** create a Clerk application at clerk.com, then copy the keys into your local `.env` yourself. Don't paste keys into the chat.

```
Read CLAUDE.md, docs/PLAN.md and docs/SECURITY.md. Build Phase 2. Plan first.

Auth:
- Add Clerk to apps/web: sign-up, sign-in, sign-out, user menu, protected routes
  via middleware. Public pages stay public.
- In apps/api, add auth middleware that verifies the Clerk session JWT
  (signature, expiry, authorised parties) and puts { userId, role } on the request context.
  Unauthenticated requests get 401; forbidden ones get 403.
- Add a Clerk webhook endpoint (signature verified) that creates or updates or
  soft-deletes our own `users` row.
- Add a role system (user, admin) stored in our DB and checked server-side.

Database:
- Implement every table from docs/PLAN.md in packages/db with Drizzle: ids,
  created_at/updated_at, foreign keys, indexes, unique constraints.
- Generate and apply the migration. Add a seed script with realistic sample data.
- Add a reusable helper so every query is scoped to the current user or org
  (to prevent data leaks between users).

Tests:
- User A cannot read or modify user B's data.
- Requests without a token get 401; non-admins can't reach admin routes.

Finish with lint, typecheck and tests passing. Explain how I can test login myself,
update docs, and commit.
```
