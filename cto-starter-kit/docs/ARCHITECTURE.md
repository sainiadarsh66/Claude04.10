# Architecture

## Big picture

```
                 ┌──────────────┐
  Users ───────▶ │  Cloudflare  │  DNS, CDN, DDoS protection
                 └──────┬───────┘
                        │
          ┌─────────────┴──────────────┐
          ▼                            ▼
 ┌─────────────────┐          ┌──────────────────┐
 │  apps/web        │  HTTPS   │  apps/api         │  ← N stateless copies
 │  Next.js/Vercel  │ ───────▶ │  Hono/Railway     │     behind a load balancer
 └────────┬────────┘          └───┬─────┬──────┬──┘
          │ auth                  │     │      │ enqueue jobs
          ▼                       │     │      ▼
     ┌─────────┐                  │     │   ┌──────────────┐
     │  Clerk  │ ◀── verify JWT ──┘     │   │ apps/worker  │ ← BullMQ, N copies
     └─────────┘                        │   └──────┬───────┘
                                        ▼          │
                              ┌──────────────────┐ │   ┌──────────────┐
                              │ Redis (Upstash)  │◀┴──▶│ Email/Stripe │
                              │ cache, queue,    │     │ R2, 3rd party│
                              │ rate limits      │     └──────────────┘
                              └──────────────────┘
                                        │
                              ┌──────────────────┐
                              │ Postgres (Neon)  │  primary + read replicas,
                              │ via Drizzle      │  point-in-time backups
                              └──────────────────┘

  Sentry (errors) · PostHog (analytics) · GitHub Actions (CI/CD)
```

## Why it is built this way

| Concern | Decision | Effect on scale |
|---|---|---|
| One language | TypeScript front to back, with shared Zod types in `packages/shared` | One person or one AI can work across the whole system. Fewer bugs at the boundaries. |
| Separate API service | Hono API, not only Next.js route handlers | The API scales on its own. A mobile app can use the same API later. |
| Stateless API | No in-memory state. Sessions come from the JWT, and shared state lives in Redis. | Add more copies to handle more traffic (horizontal scaling). |
| Postgres | One relational database to start | Handles millions of rows easily. Add read replicas and connection pooling (Neon has them built in) as traffic grows. |
| Redis cache | Cache-aside for hot reads, with explicit TTLs | Cuts database load and response times dramatically. |
| Queues | BullMQ worker for slow tasks | Web requests stay fast. Workers scale on their own. |
| Rate limiting | Redis sliding window per IP and per user | Protects against abuse and runaway costs. |
| Containers | API and worker ship as Docker images | Railway → AWS ECS / GCP Cloud Run → Kubernetes without rewriting code. |
| CDN | Vercel edge + Cloudflare | Static files are served close to users worldwide. |
| Managed services | Neon, Upstash, Clerk, Vercel | No servers to patch. One person can run it. |

## Folder layout

```
apps/
  web/        Next.js frontend
  api/        Hono REST API (OpenAPI docs at /docs)
  worker/     BullMQ job processors
packages/
  db/         Drizzle schema, migrations, seed
  shared/     Zod schemas, types, constants
  ui/         Shared components (optional)
  config/     eslint, tsconfig, prettier presets
docker-compose.yml   Local postgres + redis
.github/workflows/   CI (lint, typecheck, test, build) and deploy
```

## Environments

| Env | Web | API / worker | DB | Deploys when |
|---|---|---|---|---|
| Local | localhost:3000 | localhost:4000 | Docker Postgres | `pnpm dev` |
| Preview | Vercel preview URL | (uses staging API) | Neon branch | every Pull Request |
| Staging | staging.yourdomain.com | Railway staging | Neon `staging` branch | merge to `staging` |
| Production | yourdomain.com | Railway production | Neon `main` | merge to `main` |

## Growth path (only do these when the numbers call for it)

1. **~0–10k users:** the setup above, 1–2 API instances.
2. **~10k–100k:** autoscale API/worker, Neon read replica, cache more, add a CDN for user uploads, set up database query monitoring.
3. **~100k–1M+:** move API/worker to AWS ECS Fargate or GCP Cloud Run with autoscaling. Use Infrastructure as Code (Terraform or Pulumi), consider partitioning the busiest tables, add a search engine (Meilisearch / OpenSearch) if search is core, and an event bus if services multiply.
4. **Only if genuinely needed:** Kubernetes, microservices, multi-region. Most companies never need these.
