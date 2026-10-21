# Phase 6: Tests and automatic checks (CI)

```
Read CLAUDE.md. Build Phase 6.

1. Review test coverage. Add missing unit and integration tests for business logic,
   auth and authorisation, and every API endpoint, and Playwright e2e tests for
   every main user journey. Aim for meaningful coverage of critical paths,
   not a vanity percentage.
2. Create .github/workflows/ci.yml that runs on every pull request and push to
   main/staging:
   - pnpm install with caching, Turborepo caching
   - lint, typecheck, unit/integration tests (with Postgres and Redis service
     containers), build, then Playwright e2e
   - pnpm audit (fail on high/critical)
   - upload the Playwright report as an artifact on failure
3. Make sure CI finishes reasonably fast (parallel jobs, caching).
4. Add a PR template (.github/pull_request_template.md) with a short checklist.
5. Tell me how to turn on branch protection for `main` on GitHub
   (require PR + CI passing), step by step.

Push a branch, open a PR, and confirm CI passes.
```
