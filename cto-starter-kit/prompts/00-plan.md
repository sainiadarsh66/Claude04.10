# Phase 0: Plan (paste into Claude Code, in Plan mode)

```
You are acting as my CTO and lead engineer. I am a non-technical founder.

Read CLAUDE.md, docs/PRODUCT_BRIEF.md, docs/ARCHITECTURE.md and docs/SECURITY.md.

Don't write any code yet. Produce docs/PLAN.md containing:
1. A plain-English summary of the product as you understand it, plus any questions
   or gaps in my brief. Ask me the questions before finalising.
2. User roles and permissions (who can see or do what).
3. The data model: each table, its columns, relationships and indexes, as a simple
   table plus a Mermaid ER diagram.
4. The API: each endpoint (method, path, who can call it, what it does).
5. The screens: each page, what's on it, and which endpoints it uses.
6. Background jobs and what triggers them.
7. What to cache and for how long.
8. Third-party services needed for the MVP.
9. Risks (security, scale, cost) and how we handle them.
10. Phases 1–9 from docs/ROADMAP.md adjusted for this product, each with
    "how the founder can check it works".

Keep the MVP as small as possible. Mark anything non-essential as "later".
When I approve, update CLAUDE.md and docs/ROADMAP.md to match.
```
