# CD Staging Checklist

## Objective

Provide a consistent CD path for staging after `CI` succeeds on `main`, with clear diagnostics for missing configuration and deployment hook failures.

## Trigger and flow

1. Workflow `CD` starts from `workflow_run` when workflow `CI` completes with `success` on branch `main`.
2. Job `staging-preflight` runs in environment `staging`.
3. Job `deploy-staging` calls Render deploy hook only after preflight passes.
4. Production remains manual by `workflow_dispatch` and environment `production` approval rules.

## Required staging configuration

Configure these keys in **GitHub Environment `staging`**.

### Secrets (required)

- `RENDER_STAGING_DEPLOY_HOOK_URL`
- `DATABASE_URL`
- `REDIS_URL`
- `SESSION_SECRET`
- `JOB_HMAC_GLOBAL_SECRET`
- `AUTH_MFA_ENCRYPTION_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

### Variables (required)

- `API_CORS_ORIGINS`
- `WEB_BASE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_CSP_REPORT_ONLY=false`
- `REQUIRE_SECURE_COOKIES=true`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`

## Environment rules

- `staging`: no required reviewers; branch `main` allowed.
- `production`: required reviewers enabled.

## Failure diagnostics

### CD job did not start

Symptom:
- Annotation contains: `The job was not started because your account is locked due to a billing issue.`

Action:
- Resolve GitHub Actions billing at account/organization level before rerunning `CD`.

### Missing staging configuration

Symptom:
- `staging-preflight` fails with `Missing required staging configuration`.

Action:
- Add missing keys in environment `staging` (Secrets or Variables as listed above).

### Invalid strict vars

Symptom:
- `staging-preflight` fails with:
  - `NEXT_PUBLIC_CSP_REPORT_ONLY must be set to false`
  - `REQUIRE_SECURE_COOKIES must be set to true`

Action:
- Fix `staging` variables to expected values and rerun.

### Deploy hook failure

Symptom:
- `deploy-staging` fails on `Trigger Render deploy hook (staging)` with exit code 1 or HTTP error.

Action:
- Verify `RENDER_STAGING_DEPLOY_HOOK_URL` exists and is a valid HTTPS hook URL.
- Check Render service status and webhook validity.

## Validation commands (local)

```bash
corepack pnpm release:preflight:staging
corepack pnpm release:preflight:staging -- --env-file=.env.example
```

Expected:
- first command fails with missing environment variables.
- second command fails with production-hardening checks against local example values.

## Regression prevention

- Keep `CD` coupled to successful `CI` (`workflow_run` on `CI` + `conclusion == success`).
- Keep explicit required key validation before preflight and deploy hook.
- Keep preflight mandatory (`deploy-staging` depends on `staging-preflight`).
- Keep hook invocation retriable (`curl --retry 3`) and silent for secrets.
