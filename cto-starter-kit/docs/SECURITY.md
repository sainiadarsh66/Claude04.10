# Security checklist

Claude must follow this in all code. Run through it in Phase 5 and before every major release.
Based on the OWASP Top 10.

## Accounts and access
- [ ] 2-factor auth on GitHub, Vercel, Railway, Neon, Upstash, Clerk, Stripe, the domain registrar and email
- [ ] GitHub `main` branch protected: changes go through a Pull Request, and CI must pass
- [ ] Least privilege: each service gets only the keys and permissions it needs
- [ ] Separate keys for staging and production

## Secrets
- [ ] No secrets in code, docs, logs or chat. `.env` is in `.gitignore`.
- [ ] Env vars validated at startup with Zod (the app refuses to start if one is missing)
- [ ] GitHub secret scanning and push protection turned on
- [ ] Rotate any key that was ever exposed, immediately

## Authentication and authorization
- [ ] All auth handled by Clerk. Never store passwords yourself.
- [ ] API verifies the JWT signature, expiry and audience on every protected route
- [ ] **Authorization on every query:** a user can only read or change their own data (or their organisation's). Write tests for "user A cannot access user B's data".
- [ ] Admin routes require an admin role, checked server-side

## Input and output
- [ ] Every input validated with Zod (body, query, params, headers, webhooks)
- [ ] Only parameterised queries via Drizzle. No string-built SQL.
- [ ] React escapes output by default. Never use `dangerouslySetInnerHTML` with user content.
- [ ] File uploads: check type and size, store in R2/S3 (not on the server), use signed URLs, never execute uploaded files
- [ ] Webhooks (Stripe, Clerk) verified by signature

## HTTP hardening
- [ ] HTTPS everywhere (HSTS)
- [ ] Security headers: Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, frame-ancestors
- [ ] CORS allows only your own domains
- [ ] Cookies `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict`
- [ ] Rate limiting on auth, write endpoints and anything expensive (Redis-backed)
- [ ] Request body size limits

## Data protection
- [ ] Database encrypted at rest (Neon default) and in transit (TLS)
- [ ] Automated backups on, with a restore tested once
- [ ] Collect only the personal data you need. Have a way to export and delete a user's data (GDPR).
- [ ] Logs contain no passwords, tokens, card numbers or full personal data

## Dependencies and code
- [ ] Dependabot (or Renovate) on for dependency updates
- [ ] GitHub CodeQL code scanning on
- [ ] `pnpm audit` in CI. Lockfile committed.
- [ ] `/security-review` in Claude Code before merging significant changes

## Monitoring and response
- [ ] Sentry alerts on new errors
- [ ] Alerts on unusual spikes (signups, 5xx errors, costs)
- [ ] Spending limits or alerts on every cloud account
- [ ] Simple incident plan written down: who to contact, how to roll back (Vercel/Railway "redeploy previous")

## Before launch (human)
- [ ] Privacy policy and terms of service
- [ ] Cookie consent if you use non-essential cookies (EU/UK)
- [ ] External security review or pen test once you hold sensitive data or real revenue
