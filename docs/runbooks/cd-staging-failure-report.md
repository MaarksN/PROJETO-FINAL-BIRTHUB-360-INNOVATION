# CD Staging Failure Report

## Context

- Repository: `MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Workflow: `CD`
- Scope analyzed: run series `#1` to `#46` and rerun evidence on `#22`

## Failure-by-failure summary

| Failure type | Workflow / Job / Step | Error message | Root cause | Fix applied | Validation evidence |
| --- | --- | --- | --- | --- | --- |
| Account billing lock | `CD` / `Deploy staging (automatic)` / job start | `The job was not started because your account is locked due to a billing issue.` | GitHub Actions account billing lock prevented runner execution. | Added runbook diagnostics and explicit operational action in CD checklist. | Sampled run annotations: `#1`, `#2`, `#21`, `#46` with same message. |
| Staging deploy step exits 1 | `CD` / `Deploy staging (automatic)` / `Trigger Render deploy hook (staging)` | `Process completed with exit code 1.` | Missing or invalid `RENDER_STAGING_DEPLOY_HOOK_URL` in staging environment was not diagnosable enough. | Recreated `cd.yml` with strict secret/variable validation plus URL format checks and actionable errors. | Rerun `#22` shows failing step; new workflow now fails early with explicit missing/invalid key diagnostics before deploy. |

## Pipeline corrections implemented

- Recreated `.github/workflows/cd.yml`.
- Trigger changed to `workflow_run` from `CI` with `conclusion == success` on `main`.
- Added `staging-preflight` gate before deploy.
- Added explicit required key validation for staging secrets/variables.
- Added robust deploy hook checks (`set -euo pipefail`, HTTPS validation, `curl --retry`).
- Kept production deployment manual and guarded by `production` environment.

## Required staging keys (exact names)

### Environment `staging` secrets

- `RENDER_STAGING_DEPLOY_HOOK_URL`
- `DATABASE_URL`
- `REDIS_URL`
- `SESSION_SECRET`
- `JOB_HMAC_GLOBAL_SECRET`
- `AUTH_MFA_ENCRYPTION_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

### Environment `staging` variables

- `API_CORS_ORIGINS`
- `WEB_BASE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_CSP_REPORT_ONLY`
- `REQUIRE_SECURE_COOKIES`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
