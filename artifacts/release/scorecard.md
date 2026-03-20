# Release Scorecard
Generated at: 2026-03-20T22:38:24.169Z

Canonical go-live scope: `apps/web`, `apps/api`, `apps/worker`, `packages/database`.
Legacy and satellite surfaces stay outside the 2026-03-20 launch gate unless promoted explicitly.

| Gate | Status | Detail |
| --- | --- | --- |
| Workspace audit | PASS | Workspace contract matches the canonical core lane |
| Monorepo doctor | PASS | No critical findings in the canonical go-live scope |
| Security baseline report | PASS | Report present |
| Schema migration lock | PASS | Prisma lock present |
| SLO baseline | PASS | SLO documentation present |