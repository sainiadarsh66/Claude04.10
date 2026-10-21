# CTO Starter Kit: build a scalable app with Claude Code

This kit is for a founder who isn't technical. It gives you:

1. **A step-by-step plan** (this file): what to install, which accounts to open, and the order to build things in.
2. **Files to give Claude Code**: a `CLAUDE.md` "project brain", architecture and security docs, and ready-made prompts for each phase.
3. **Guidance on who builds what**: the parts Claude can build for you, and the parts where you need a human expert.

> **How to use it:** make a new empty project folder, copy everything inside `cto-starter-kit/` into it, fill in `docs/PRODUCT_BRIEF.md`, then work through the prompts in `prompts/` one at a time.

---

## 0. The tech stack in plain English

Everything is written in **TypeScript**, so the whole product uses one language. It's the most widely used choice for modern web products, and Claude writes it very well.

| Layer | What it is | Our choice | Why |
|---|---|---|---|
| Language | What the code is written in | **TypeScript** | One language for frontend and backend. It catches many mistakes before they reach users. |
| Frontend | The screens people see | **Next.js + React + Tailwind CSS + shadcn/ui** | The industry standard. It's fast, good for SEO, and has nice-looking components ready to use. |
| Mobile (later) | iPhone/Android app | **Expo (React Native)** | Reuses the same TypeScript and logic as the web app. |
| Backend API | The "brain" that handles data and rules | **Hono on Node.js**, in its own service | Small and fast. It can scale separately from the website. |
| Database | Where data lives permanently | **PostgreSQL** (hosted on **Neon**) | The most trusted database. Neon scales automatically and has a free tier. |
| ORM | How code talks to the database | **Drizzle ORM** | Type-safe, so mistakes show up before they cause problems. |
| Cache | Short-term memory that makes things fast | **Redis** (hosted on **Upstash**) | Speeds things up, enforces rate limits and stores sessions. |
| Background jobs | Slow work done "later" (emails, reports) | **BullMQ** on Redis | Keeps the app responsive while slow work runs in the background. |
| Login / Auth | Sign-up, login, passwords, Google login | **Clerk** (or **Better Auth** if you want to own it) | Security is handled by specialists, and it takes minutes to set up. |
| Payments | Taking money | **Stripe** | The standard choice. Card details never touch your servers. |
| Email | Sending emails | **Resend** | Simple and developer-friendly. |
| File storage | Images and uploads | **Cloudflare R2** (or AWS S3) | Cheap, fast and scalable. |
| Hosting (web) | Where the website runs | **Vercel** | Made by the Next.js team. You deploy by pushing code. |
| Hosting (API + jobs) | Where the backend runs | **Railway** to start, **AWS/GCP containers** later | Railway is easy now. Docker means you can move to AWS later without rewriting anything. |
| Monitoring | Knowing when things break | **Sentry** (errors) + **PostHog** (analytics) | You hear about bugs before your users complain. |
| Code home | Where code is stored and reviewed | **GitHub** + **GitHub Actions** | Version history, automatic tests and automatic deploys. |
| Editor | Where you see and edit code | **VS Code** + the **Claude Code** extension | Free, and Claude works directly inside it. |

**How it scales:** the website (Vercel) and the database (Neon) scale automatically. The API is *stateless*: it keeps no memory between requests, so you can run 1 copy or 50 copies behind a load balancer. Redis absorbs repeated reads, and background jobs absorb slow work. That design takes you from your first user to millions without starting over.

See `docs/ARCHITECTURE.md` for the full picture.

---

## 1. Install these tools (day 1, about 1 hour)

Install them in this order. Use the official websites only.

| # | Tool | Where to get it | Check it works (type in Terminal) |
|---|---|---|---|
| 1 | **VS Code** | code.visualstudio.com | open it |
| 2 | **Git** | git-scm.com (Mac: it's installed when you run `git --version`) | `git --version` |
| 3 | **Node.js (LTS version)** | nodejs.org, pick the "LTS" button | `node --version` |
| 4 | **pnpm** (package manager) | run `corepack enable` and then `corepack prepare pnpm@latest --activate` | `pnpm --version` |
| 5 | **Docker Desktop** | docker.com/products/docker-desktop | `docker --version` |
| 6 | **Claude Code** | claude.com/claude-code, follow the install command for your OS | `claude --version` |
| 7 | **GitHub CLI** (optional, handy) | cli.github.com | `gh --version` |

**On Windows:** install **WSL2** (Ubuntu) first, then do everything inside it. Claude Code and Docker work best that way.

**VS Code extensions:** when you open the project, VS Code will offer to install the recommended extensions listed in `.vscode/extensions.json`. Click **Install All**.

---

## 2. Open these accounts (day 1, about 1 hour)

Use one business email, for example `you@yourcompany.com`, and turn on **2-factor authentication on every account**.

| Account | Needed when | Free tier? |
|---|---|---|
| GitHub | Now | Yes |
| Claude (Pro or Max plan) | Now | Paid. Max is worth it if you build daily. |
| Vercel | Phase 5 (deploy) | Yes |
| Neon (Postgres) | Phase 2 | Yes |
| Upstash (Redis) | Phase 3 | Yes |
| Clerk (auth) | Phase 2 | Yes, up to a generous user count |
| Railway | Phase 5 | Small monthly cost |
| Sentry | Phase 5 | Yes |
| PostHog | Phase 5 | Yes |
| Stripe | When you charge money | Pay per transaction |
| Resend | When you send email | Yes |
| Cloudflare (domain + R2) | When you buy a domain | Mostly free |

**Rough monthly cost:** about £0–40 while building, and about £50–300 with your first few thousand users. Costs grow with usage, never ahead of it.

> **Never paste passwords or API keys into chat, docs or code.** They go only in a `.env` file on your computer (which is never uploaded) and in each hosting provider's "Environment Variables" settings page.

---

## 3. Set up the project (day 2, about 30 minutes)

```bash
# 1. Make a folder and go into it
mkdir my-product && cd my-product

# 2. Copy everything from this kit into it (README, CLAUDE.md, docs/, prompts/, .vscode/, .claude/, .gitignore, .env.example)

# 3. Start version control
git init
git add .
git commit -m "Project kit"

# 4. Create a private GitHub repo and push (easiest with the GitHub CLI)
gh repo create my-product --private --source=. --push

# 5. Open in VS Code
code .
```

Then:

1. **Fill in `docs/PRODUCT_BRIEF.md`.** This is the most important step. Write in plain English: who it's for, what problem it solves, and the 3–5 must-have features. Claude can help: open Claude Code and say *"Interview me to fill in docs/PRODUCT_BRIEF.md, one question at a time."*
2. Open the Claude Code panel in VS Code (or type `claude` in the VS Code terminal).
3. Start Phase 0 below.

---

## 4. Build in phases (copy each prompt into Claude Code)

Do **one phase at a time**. At the end of each phase, check the result yourself, then commit. Each prompt file in `prompts/` is ready to paste.

| Phase | Prompt file | What you get | Time with Claude |
|---|---|---|---|
| 0 | `prompts/00-plan.md` | Claude reads your brief and writes a build plan and data model for you to approve | 1 hour |
| 1 | `prompts/01-scaffold.md` | The project skeleton: web app, API, shared code, local database and Redis in Docker, code-quality tools | half a day |
| 2 | `prompts/02-auth-and-database.md` | Sign-up/login, user accounts, database tables, migrations | 1 day |
| 3 | `prompts/03-api-cache-jobs.md` | Your core API endpoints, Redis caching, rate limits, background jobs | 1–2 days |
| 4 | `prompts/04-frontend.md` | The real screens, design system, mobile-friendly layout, accessibility | 2–4 days |
| 5 | `prompts/05-security.md` | A security hardening pass (see `docs/SECURITY.md`) | half a day |
| 6 | `prompts/06-testing-ci.md` | Automatic tests and GitHub Actions that run on every change | half a day |
| 7 | `prompts/07-deploy.md` | Live on the internet: staging plus production, your domain, monitoring | 1 day |
| 8 | `prompts/08-payments.md` | Stripe subscriptions or one-off payments (if needed) | 1 day |
| 9 | `prompts/09-scale.md` | Load testing, performance tuning, and moving to AWS/GCP when needed | when you have traction |

**Your routine for every phase:**

1. Start a **fresh Claude Code session** (`/clear`) so it focuses on one job.
2. Paste the phase prompt. For big phases, press `Shift+Tab` to switch Claude into **Plan mode** first, read its plan, then approve it.
3. Let Claude work. When it asks for permission to run commands, read them and approve the ones that make sense.
4. **Test it yourself:** run `pnpm dev`, open `http://localhost:3000` and click around.
5. Ask Claude: *"Run all tests, lint and typecheck. Fix anything failing."*
6. Ask Claude: *"Review your own changes with /code-review and /security-review."*
7. Commit: *"Commit this phase with a clear message and push to GitHub."*

---

## 5. Who builds what

### Claude Code can build these, so ask it to:
- The whole codebase: screens, API, database tables, caching, background jobs
- Tests (unit, API and end-to-end browser tests)
- Docker files, GitHub Actions pipelines, deploy configuration
- Security basics: input validation, rate limiting, security headers, permission checks
- Documentation, and explanations of anything you don't understand. Just ask *"explain this like I'm not technical"*
- Debugging: paste the error message and say *"fix this"*
- Code reviews of its own work (`/code-review`, `/security-review`)

### Get a human for these:
| Area | Who | When |
|---|---|---|
| Brand, logo, UX research with real users | Designer (freelance is fine) | Before the public launch |
| **Security review / penetration test** | A security firm or an experienced freelancer | Before you store sensitive data or take payments at scale |
| Legal: terms, privacy policy, GDPR, data processing agreements | A lawyer (templates from Termly or iubenda are OK at first) | Before launch |
| Architecture sanity check | A senior engineer on a 2–4 hour paid call | After Phase 3 and before Phase 9 |
| Accounting, tax, company setup | Accountant | Before taking money |
| Compliance (SOC 2, HIPAA, ISO 27001) | Only if your customers require it; Vanta or Drata help | When enterprise customers ask |

### Decisions only you can make:
- What the product does, who it's for, and what *not* to build
- Pricing
- What "good enough to launch" means

---

## 6. Golden rules for a non-technical founder

1. **Small steps.** Ask for one feature at a time. Big vague asks give big messy results.
2. **Plan before code.** Use Plan mode (`Shift+Tab`) for anything bigger than a small fix.
3. **Commit after every working step.** Git is your undo button. If something goes wrong, say *"revert to the last commit"*.
4. **Never put secrets in code.** Keys go in `.env` (local) and in the hosting dashboard (live).
5. **Keep `CLAUDE.md` up to date.** When you make a decision, ask Claude to *"add this decision to CLAUDE.md"*. It reads that file at the start of every session.
6. **Ask "why?"** For example: *"Why did you choose this? What are the trade-offs? What could go wrong?"*
7. **Staging first.** Every change goes to a test website before the real one.
8. **Back up the database.** Neon does this automatically. Check that it's on.
9. **Watch your bills.** Set spending alerts on every cloud account.
10. **Don't over-engineer early.** This stack already scales a long way. Don't add Kubernetes or microservices until real traffic calls for them.

---

## 7. Useful things to say to Claude Code

- *"Read CLAUDE.md and docs/, then tell me in plain English what this project does and what's left to build."*
- *"I want users to be able to ___. Plan it first, then build it with tests."*
- *"This error appeared: [paste]. Find the root cause and fix it."*
- *"Explain what you just changed, as if I'm not technical."*
- *"Is there anything insecure or not scalable in this code?"*
- *"Run the app and take me through how to test this feature manually."*
- *"Update CLAUDE.md and docs/ROADMAP.md with what we just finished."*
- `/init`: refresh CLAUDE.md from the actual code
- `/clear`: start a fresh conversation (do this between features)
- `/code-review` and `/security-review`: get a second look before committing

---

## Files in this kit

```
cto-starter-kit/
├── README.md                  ← this guide
├── CLAUDE.md                  ← Claude's project memory (rules, stack, commands)
├── .env.example               ← list of secrets needed (no real values)
├── .gitignore                 ← keeps secrets and junk out of GitHub
├── .vscode/
│   ├── extensions.json        ← recommended VS Code extensions
│   └── settings.json          ← format-on-save and other editor settings
├── .claude/
│   └── settings.json          ← safe default permissions for Claude Code
├── docs/
│   ├── PRODUCT_BRIEF.md       ← YOU fill this in first
│   ├── ARCHITECTURE.md        ← how the system is designed and why
│   ├── SECURITY.md            ← security checklist
│   └── ROADMAP.md             ← phase checklist to tick off
└── prompts/
    ├── 00-plan.md … 09-scale.md  ← paste these into Claude Code, in order
```
