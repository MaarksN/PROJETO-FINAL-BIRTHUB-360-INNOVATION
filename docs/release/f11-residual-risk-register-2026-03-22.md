# F11 Residual Risk Register - 2026-03-22

| ID | Residual risk | Severity | Owner | Target date | Current evidence |
| --- | --- | --- | --- | --- | --- |
| F11-R1 | `lint:core` still red with 8 errors and 145 warnings. | High | Platform Engineering | 2026-03-29 | `artifacts/f11-closure-2026-03-22/logs/04-lint-core-rerun.log` |
| F11-R2 | `workspace:audit` references missing scripts under `scripts/coverage` and `scripts/testing`. | High | Developer Experience | 2026-03-29 | `artifacts/f11-closure-2026-03-22/logs/12-workspace-audit.log` |
| F11-R3 | `privacy:verify` cannot execute because `packages/database/src/client.ts` imports missing `../f8.config.js`. | Medium | Data Platform | 2026-03-29 | `artifacts/f11-closure-2026-03-22/logs/14-privacy-verify.log` |
| F11-R4 | `ci:security-guardrails` depends on bare `pnpm`, which is not portable in this environment. | Medium | Platform Engineering | 2026-03-29 | `artifacts/f11-closure-2026-03-22/logs/15-security-guardrails.log` |
| F11-R5 | PRR, on-call, monitoring, status page and incident drill remain documented but not revalidated live in this session. | High | SRE / Security | 2026-03-31 | `docs/release/2026-03-20-go-live-runbook.md`, `docs/runbooks/critical-incidents.md` |
| F11-R6 | Final signatures from Security Owner, domain owners and leadership are still absent from this workspace. | High | Engineering Leadership | 2026-03-31 | `docs/release/gate_signatures_audit.md` |
