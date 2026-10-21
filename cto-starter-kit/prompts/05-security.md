# Phase 5: Security hardening

```
Act as a senior application security engineer. Read docs/SECURITY.md and audit
the whole codebase against it, plus the OWASP Top 10 and the OWASP API Security Top 10.

1. List every finding with severity (critical/high/medium/low), file and line,
   how it could be exploited, and the fix, in plain English.
2. Fix all critical, high and medium findings. Add a test for each fix where possible.
3. Confirm: security headers and CSP, CORS, rate limits, cookie flags, webhook
   signature checks, input validation on every route, authorisation on every
   query, no secrets in code or logs, file upload limits, error responses that
   don't leak internals.
4. Add .github/dependabot.yml and a CodeQL workflow.
5. Run `pnpm audit` and fix vulnerable dependencies.
6. Tick off the items in docs/SECURITY.md that are done in code, and list the
   ones I must do myself in dashboards (2FA, branch protection, secret
   scanning, spending alerts).

Then run /security-review. Commit when everything is clean.
```
