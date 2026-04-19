# Release Scorecard
Generated at: 2026-04-19T03:45:28.569Z
Minimum score threshold: 100
Score: 100

Canonical go-live scope: `apps/web`, `apps/api`, `apps/worker`, `packages/database`.
Legacy and satellite surfaces stay outside the 2026-03-20 launch gate unless promoted explicitly.

| Gate | Status | Detail | Evidence |
| --- | --- | --- | --- |
| Workspace audit | PASS | Workspace contract matches the canonical core lane | `scripts/ci/workspace-audit.mjs` |
| Monorepo doctor | PASS | No critical findings in the canonical go-live scope | `scripts/ci/monorepo-doctor.mjs` |
| Security baseline report | PASS | Report present | `docs/security/security-coverage-report.md` |
| Schema migration lock | PASS | Prisma lock present | `packages/database/prisma/migrations/migration_lock.toml` |
| SLO baseline | PASS | SLO documentation present | `docs/OBSERVABILIDADE_E_SLOS.md` |
| Mutation lane | PASS | Score 60.85% vs threshold 60 on 470 mutants | `artifacts/quality/mutation-summary.json`, `docs/evidence/mutation-report.md` |
| Dead code regression | PASS | Current=41, regressions=0 | `artifacts/quality/dead-code/knip-report.json`, `docs/evidence/dead-code-report.md`, `artifacts/quality/knip-baseline.json` |
| Rollback evidence | PASS | Rollback rehearsal evidence derived from preflight, smoke, source manifest and release bundle artifacts. | `artifacts/release/production-rollback-evidence.json` |
| Score threshold | PASS | Score 100 meets minimum 100 | - |