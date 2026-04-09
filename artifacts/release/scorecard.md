# Release Scorecard
Generated at: 2026-04-09T18:38:46.052Z
Minimum score threshold: 100
Score: 88

Canonical go-live scope: `apps/web`, `apps/api`, `apps/worker`, `packages/database`.
Legacy and satellite surfaces stay outside the 2026-03-20 launch gate unless promoted explicitly.

| Gate | Status | Detail | Evidence |
| --- | --- | --- | --- |
| Workspace audit | PASS | Workspace contract matches the canonical core lane | `scripts/ci/workspace-audit.mjs` |
| Monorepo doctor | PASS | No critical findings in the canonical go-live scope | `scripts/ci/monorepo-doctor.mjs` |
| Security baseline report | PASS | Report present | `docs/security/security-coverage-report.md` |
| Schema migration lock | PASS | Prisma lock present | `packages/database/prisma/migrations/migration_lock.toml` |
| SLO baseline | PASS | SLO documentation present | `docs/OBSERVABILIDADE_E_SLOS.md` |
| Mutation lane | PASS | Score 60.85% vs threshold 60 on 470 mutants | `artifacts/quality/mutation-summary.json`, `docs/evidence/mutation-report.md`, `artifacts/stryker/mutation.json` |
| Dead code regression | PASS | Current=0, regressions=0 | `artifacts/quality/dead-code/knip-report.json`, `docs/evidence/dead-code-report.md`, `artifacts/quality/knip-baseline.json` |
| Disaster recovery drill | FAIL | No disaster-recovery drill artifact is currently versioned in artifacts/backups/. | `artifacts/dr/latest-drill.json`, `docs/runbooks/disaster-recovery.md` |
| Score threshold | FAIL | Score 88 is below minimum 100 | - |