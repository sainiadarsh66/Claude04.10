# Phase 7: Go live (staging + production)

**You will click through some dashboards yourself. Claude will guide you.** Keep keys out of the chat. Paste them only into the dashboards.

```
Read CLAUDE.md and docs/ARCHITECTURE.md (Environments section). Build Phase 7.
I am not technical, so give me numbered click-by-click instructions for every
dashboard step, and do all the code/config steps yourself.

Set up two environments, staging and production:
1. Neon: production DB + a staging branch; pooled connection strings;
   confirm point-in-time restore is on. Choose the region closest to my users.
2. Upstash Redis: one database per environment, same region.
3. Railway: api and worker services from the Dockerfiles, one environment each
   for staging and production; health check on /health; run DB migrations
   automatically on deploy (as a release step, not on every instance start);
   at least 2 api replicas in production.
4. Vercel: apps/web connected to GitHub; preview deploys on PRs; staging and
   production env vars.
5. Clerk: production instance; webhook URLs for each environment.
6. Domain via Cloudflare: yourdomain.com → Vercel, api.yourdomain.com → Railway,
   HTTPS everywhere.
7. Sentry for web, api and worker (with release tracking and source maps);
   PostHog for product analytics (respect cookie consent).
8. GitHub Actions: deploy staging when `staging` changes, production when
   `main` changes, only after CI passes.
9. Write docs/RUNBOOK.md: how to deploy, roll back, restore the database,
   rotate a key, and what to do if the site is down.

Then walk me through a full smoke test on staging, and only then on production.
```
