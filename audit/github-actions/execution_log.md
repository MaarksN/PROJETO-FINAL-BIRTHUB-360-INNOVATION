# Consolidated Execution Log

Generated at: 2026-04-18T05:31:17.159392+00:00

| timestamp_utc | command | exit_code | observation |
| --- | --- | ---: | --- |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm install --frozen-lockfile` | 0 | Base dependency install OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm branch:check` | 1 | Branch naming policy failed on branch copilot/validate-github-actions |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:commitlint` | 0 | Commitlint gate OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:default-e2e-surface-freeze` | 1 | Failed before fix: missing playwright.config.ts |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm security:inline-credentials` | 1 | Failed before fix: 7 findings (test fixture false positives) |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm hygiene:check` | 1 | Failed on changed-file hygiene/complexity/line-count constraints |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:lockfile` | 0 | Lockfile governance OK |
| 2026-04-18T05:31:17.159392+00:00 | `lockfile corruption simulation` | 0 | Frozen install failed as expected on corrupted lockfile |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm db:bootstrap:ci` | 1 | Failed before fix: migration 20260410000100 relation workflow_revisions missing |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm db:bootstrap:ci` | 0 | Passed after migration fix |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:security-guardrails` | 1 | Failed before fix: auth guard policy + migration governance issues |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:security-guardrails` | 0 | Passed after fixes |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:task lint` | 0 | Platform lint OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm typecheck` | 0 | Typecheck passed after fixes |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:task test` | 0 | Platform tests passed after fixes |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:task test:isolation` | 0 | Isolation lane OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:task build` | 1 | Build blocked by fonts.googleapis.com DNS/network restriction |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:task satellites` | 0 | Satellites lane OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:task workflow-suite` | 0 | Workflow suite lane OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm test:integration` | 0 | Integration DB lane OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm coverage:check` | 1 | Missing artifacts/coverage/summary.json in local run context |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm test:python:coverage` | 4 | pytest-xdist flags unsupported in current python env (missing plugin) |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm quality:dead-code` | 1 | 45 dead-code regressions vs baseline |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm test:mutation` | 1 | @stryker-mutator/core not installed (module not found) |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ci:task pack-tests` | 0 | Pack tests lane OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm monorepo:doctor && RELEASE_SCORECARD_MIN_SCORE=100 pnpm release:scorecard && pnpm audit:ownership` | 1 | Release scorecard below threshold due dead-code/backup/DR/rollback evidence |
| 2026-04-18T05:31:17.159392+00:00 | `corepack pnpm --filter @birthub/agent-packs validate && corepack pnpm --filter @birthub/agent-packs test` | 0 | Agents conformity commands OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm workspace:audit` | 0 | F4 workspace audit OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm audit:materialize:all` | 0 | Materialize doc-only controls OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm artifacts:clean -- --apply` | 0 | Repository-health cleanup step OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm audit --audit-level=high` | 1 | npm audit endpoint returned HTTP 400 (external registry/network) |
| 2026-04-18T05:31:17.159392+00:00 | `python scripts/ci/check-python-workflow-hard-fail.py` | 0 | Python workflow hard-fail policy OK |
| 2026-04-18T05:31:17.159392+00:00 | `python -m bandit -q -r agents apps/webhook-receiver -x '*/tests/*' -lll` | 0 | Bandit OK |
| 2026-04-18T05:31:17.159392+00:00 | `python -m pip_audit -r requirements-test.txt --ignore-vuln CVE-2026-4539` | 0 | pip-audit OK |
| 2026-04-18T05:31:17.159392+00:00 | `python -m safety check --full-report -r requirements-test.txt` | 68 | Safety failed due unreachable backend/network |
| 2026-04-18T05:31:17.159392+00:00 | `DATABASE_URL=...birthub_cycle3 pnpm db:generate && pnpm test:rbac` | 0 | RBAC suite OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm --filter @birthub/web build (ZAP pre-step)` | 1 | Blocked by fonts.googleapis.com DNS/network restriction |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm security:guards` | 0 | Security guard scan OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm security:report` | 0 | Security report generation OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm release:verify:cycle0` | 1 | Failed because build step failed (external font DNS restriction) |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ops:backup:health` | 1 | No backup files found locally |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ops:dr:record:auto -- --environment=production --owner=platform-ops --scenario='scheduled release rehearsal'` | 0 | DR auto record generated |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm ops:dr:report` | 1 | DR readiness report indicates unmet readiness conditions |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm release:preflight:staging` | 0 | Preflight staging command executed |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm release:preflight:production` | 0 | Preflight production command executed |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm release:sbom` | 0 | SBOM generation OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm release:materialize -- --tag=v1.0.0 --source-event=workflow_dispatch --source-ref=<sha> --source-sha=<sha> --workflow=CD --run-id=local` | 0 | Release materialization OK |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm release:smoke` | 1 | Failed on test:isolation and playwright-release sub-gates |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm exec playwright install --with-deps chromium && pnpm test:e2e:release` | 1 | E2E failed: invalid relative URL navigation due missing Playwright baseURL config |
| 2026-04-18T05:31:17.159392+00:00 | `pnpm release:rollback:evidence:auto -- --target=production` | 1 | Rollback evidence incomplete because smoke artifact reported ok=false |
