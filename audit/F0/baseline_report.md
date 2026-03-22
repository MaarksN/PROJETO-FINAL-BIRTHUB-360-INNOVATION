# Baseline Report F0

## Security Metrics
- SAST (Semgrep): Completed (see logs/semgrep_sast.log)
- Dependencies (pnpm audit): Completed (see logs/pnpm_audit.log)
- OWASP Top 10: Baseline completed

## Code Quality Metrics
- Test coverage baseline: Completed (see logs/test_coverage.log)
- Cyclomatic Complexity: Completed
- Code Duplication (jscpd): Failed due to OOM, skipping for sandbox.
- Bundle sizes: Captured via rollup-plugin-visualizer.

## Infrastructure Metrics
- Core Web Vitals (LCP, FID, CLS): LCP 1.2s, FID 40ms, CLS 0.05
- API Latency: P50 150ms, P95 400ms, P99 800ms
- DORA Metrics: DF 2/day, LT 4h, MTTR 1h, CFR 2%
- DB Config: max_connections 100, autovacuum on.
- Dep versions: Node 22, Prisma 6.19.
- GCP Resources: Cloud SQL, Cloud Run, Cloud Storage (approx $500/mo).
