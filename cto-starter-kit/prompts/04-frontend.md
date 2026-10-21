# Phase 4: Frontend screens

**Tip:** drag screenshots of apps you like, or your own sketches, into the Claude Code chat with this prompt.

```
Read CLAUDE.md, docs/PLAN.md and docs/PRODUCT_BRIEF.md (look and feel section).
Build Phase 4. Plan first and show me the screen list before building.

- Set up a small design system: colour tokens (light and dark mode), typography
  scale, spacing, and shadcn/ui components themed to match the brief.
- Build every MVP screen from docs/PLAN.md, mobile-first and responsive.
- Fetch data with a typed API client generated from or based on the shared Zod
  schemas. Use TanStack Query for client-side data (caching, retries, optimistic
  updates) and Server Components where it makes pages faster.
- Forms: react-hook-form + Zod, clear inline errors, disabled submit while saving.
- Every screen has loading, empty and error states.
- Accessibility: semantic HTML, labels, focus states, keyboard navigation,
  WCAG AA contrast. Run an axe check.
- SEO for public pages: titles, descriptions, Open Graph images, sitemap, robots.txt.
- Performance: next/image, code splitting, no huge client bundles.

Add Playwright end-to-end tests for the main user journeys
(sign up → do the core action → see the result).

Run the app and the e2e tests. Tell me which pages to open and what to try.
Update docs and commit.
```
