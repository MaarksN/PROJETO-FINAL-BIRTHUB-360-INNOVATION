# F11 Evidence Index - 2026-03-22

Base commit audited: `8c81889`
Workspace under review date: `2026-03-22`

## Automated Gates

| Gate | Status | Evidence | SHA256 | Note |
| --- | --- | --- | --- | --- |
| `corepack pnpm install --frozen-lockfile` | PASS | `artifacts/f11-closure-2026-03-22/logs/01-install-rerun.log` | `A0925758DBB443BBAA6E0116F37447FAB27D07F7218ACB387BCF192FA0B17FCD` | First attempt hit transient Prisma `EPERM`; rerun passed. |
| `corepack pnpm monorepo:doctor` | PASS | `artifacts/f11-closure-2026-03-22/logs/02-monorepo-doctor.log` | `EE55442F51FA06037FB02CE67A8EC34B0162984CED9A78B7C933912D836B94FE` | Canonical scope clean; no critical findings. |
| `corepack pnpm release:scorecard` | PASS | `artifacts/f11-closure-2026-03-22/logs/03-release-scorecard.log` | `46A24B6F9D34F849FAD204E53E4E36B7BB116498A265571D6B0C19AEBB62087E` | Scorecard updated on 2026-03-22. |
| `corepack pnpm lint:core` | FAIL | `artifacts/f11-closure-2026-03-22/logs/04-lint-core-rerun.log` | `DB6A7D2E7358AE35C177D1C67CD6BF73D2C19553EB156970A0F85006BC2054A8` | Current blocker: 8 errors and 145 warnings. |
| `corepack pnpm typecheck:core` | PASS | `artifacts/f11-closure-2026-03-22/logs/05-typecheck-core-rerun.log` | `20BE3AD1A1ECE7253BDD76AF623631B0DA0D0A0CCCC2999AB67188D22F0CABCF` | Green on current checkout. |
| `corepack pnpm test:core` | PASS | `artifacts/f11-closure-2026-03-22/logs/06-test-core-rerun.log` | `66FA1F4DC1745988CD7494CB7E7023302633B744B6464845B028A90F8E8B26D8` | Green on current checkout. |
| `corepack pnpm test:isolation` | PASS | `artifacts/f11-closure-2026-03-22/logs/07-test-isolation.log` | `422DAD02E0DC1B20CD3235A1EA634C55932CB08C49E3B2AB2500C8835441C1F3` | Zero cross-tenant failure in local suite. |
| `corepack pnpm build:core` | PASS | `artifacts/f11-closure-2026-03-22/logs/08-build-core-rerun.log` | `18571655F90D1208F7D59175CAF823778D65AE73EFD5BBA91984D38E225AD7FB` | Green on current checkout. |
| `corepack pnpm test:e2e:release` | PASS | `artifacts/f11-closure-2026-03-22/logs/09-test-e2e-release.log` | `8C5B9D0D4800C4B5F019ADD4CFDF735481354C9523C1EEF6293C019BA7A529C8` | Release flow approved in Playwright. |
| `corepack pnpm release:preflight:staging -- --env-file=artifacts/release/staging-preflight.env` | PASS | `artifacts/f11-closure-2026-03-22/logs/10-preflight-staging-rerun.log` | `409BE4CCCFC509619FC216A3B6CD33F40501C80FE5E657D01A51BB63F32B1202` | Green when run in the mode prescribed by the go-live runbook. |
| `corepack pnpm release:preflight:production -- --env-file=artifacts/release/production-preflight.env` | PASS | `artifacts/f11-closure-2026-03-22/logs/11-preflight-production-rerun.log` | `16CAC457B041103F1025E5495E90641B72081AB70BA83F069A618EBFE3E39FB2` | Production fixture created to validate structure and required keys. |

## Supplemental Checks

| Check | Status | Evidence | SHA256 | Note |
| --- | --- | --- | --- | --- |
| `corepack pnpm workspace:audit` | FAIL | `artifacts/f11-closure-2026-03-22/logs/12-workspace-audit.log` | `B392CB9F74D9EA5627B148EE6FAEFBEEC0F740ABAF2F895B5504CADBADCA0D4D` | Non-core script references missing files under `scripts/coverage` and `scripts/testing`. |
| `corepack pnpm security:report` | PASS | `artifacts/f11-closure-2026-03-22/logs/13-security-report.log` | `E4DC88B811A59313BFCBB09DD518BEC1F4EC3EFB71530AF61F5D6FBDFEC14C9C` | Regenerated `docs/security/security-coverage-report.md`. |
| `corepack pnpm privacy:verify` | FAIL | `artifacts/f11-closure-2026-03-22/logs/14-privacy-verify.log` | `EE076696D769199E8233AA2817DF96F770C418F9E01B226FA516EF275F32275D` | Broken import in `packages/database/src/client.ts` (`../f8.config.js`). |
| `corepack pnpm ci:security-guardrails` | FAIL | `artifacts/f11-closure-2026-03-22/logs/15-security-guardrails.log` | `FEA09BB17973454A5485CF16157EBD9A57FE22B2082DA196FDEC620626583280` | Script still shells out to bare `pnpm`, unavailable in this environment. |
| `rg -n @birthub/db apps packages` | PASS (scoped) | `artifacts/f11-closure-2026-03-22/logs/16-grep-legacy-db.log` | `AFBA3685AD78FA7F9A2BB02AA67D4F0EE14FB8FB4A9C7D48F05297BB2E2833F1` | Matches limited to the deprecated package declaration and README; no runtime imports found in current app/package surfaces. |

## Historical Reference Evidence Reused in F11

- `artifacts/release/smoke-summary.json` -> `ok: true` on `2026-03-17`, including `lint-core`, `typecheck-core`, `test-core`, `test:isolation`, migration dry-run, privacy anonymization and Playwright release.
- `artifacts/release/staging-preflight-summary.json` -> `ok: true` on `2026-03-20` using `artifacts/release/staging-preflight.env`.
- `docs/release/final_security_review.md` -> final security gate approved.
- `docs/release/final_lgpd_compliance_review.md` -> LGPD gate approved.
- `docs/release/final_slo_review.md` -> SLO and performance gate approved.
- `docs/release/final_readiness_report_v1.md` -> production readiness declaration.
- `docs/release/gate_signatures_audit.md` -> cycles F1-F10 signed and audited.
- `docs/runbooks/critical-incidents.md` and `docs/runbooks/db-backup-restore.md` -> incident and DR operational runbooks.

## Archived Preflight Fixtures

- rtifacts/f11-closure-2026-03-22/preflight/staging-preflight.env`n- rtifacts/f11-closure-2026-03-22/preflight/production-preflight.env

