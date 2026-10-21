# Phase 9: Scale (when you have real traffic)

Use this when pages slow down, bills climb, or you expect a big launch.

```
Act as a principal engineer focused on scalability and cost. Read CLAUDE.md
and docs/ARCHITECTURE.md (Growth path section).

1. Add k6 load tests for the main API journeys. Run them against staging at
   10x and 100x our current traffic and report response times (p50/p95/p99),
   error rate, and where it breaks.
2. Find the bottlenecks: slow queries (EXPLAIN ANALYZE, missing indexes),
   N+1 queries, cache hit rate, connection pool limits, large payloads,
   slow external calls, frontend bundle size.
3. Fix them in order of impact. Re-run the load tests to prove each improvement.
4. Configure autoscaling for api and worker, and DB connection pooling sized to match.
5. Add dashboards and alerts: latency, error rate, queue depth, DB CPU and
   connections, Redis memory, monthly cost.
6. Tell me in plain English whether we need to move to AWS/GCP yet. If yes,
   write Terraform (or Pulumi) for ECS Fargate or Cloud Run + RDS/Cloud SQL +
   ElastiCache/Memorystore, and a step-by-step migration plan with zero downtime.

Don't add complexity (Kubernetes, microservices, multi-region) unless the
numbers prove we need it. Explain why if you recommend it.
```
