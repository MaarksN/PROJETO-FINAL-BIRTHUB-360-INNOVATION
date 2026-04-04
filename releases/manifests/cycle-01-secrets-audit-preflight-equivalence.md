# CYCLE-01 · BirthHub 360 · Secrets Audit & Preflight Equivalence

## Mandatory Preconditions

- ✅ `scripts/release/preflight-env.ts` exists.
- ✅ `.github/workflows/cd.yml` exists.
- ⚠️ `.env.staging` is absent, but equivalent templates/examples exist at:
  - `ops/env/.env.staging.sealed.example`
  - `ops/release/sealed/.env.staging.sealed`
- ⚠️ `.env.production` is absent, but equivalent templates/examples exist at:
  - `ops/env/.env.production.sealed.example`
  - `ops/release/sealed/.env.production.sealed`
- ✅ Additional env templates/examples discovered:
  - `.env.example`
  - `.env.vps.example`

No precondition blocker prevented continuation because staging/production equivalents are present.

## Step 1 — Inventory (`scripts/release/preflight-env.ts`)

`preflight-env.ts` validates three scopes (`api`, `web`, `worker`) by invoking `getApiConfig`, `getWebConfig`, and `getWorkerConfig` with a runtime environment assembled from process env + optional `--env-file` overrides. Failure semantics:

- **Hard failure**: any scope throws while parsing/validating env → report `ok=false` and process exit code `1`.
- **Soft signal only**: required-key report is informational and does not itself fail process.

### Keys directly enumerated in `preflight-env.ts`

| Key name | Usage | Failure mode |
|---|---|---|
| API_CORS_ORIGINS | Included in required key report for `api` scope | Soft in script, hard transitively via `getApiConfig` when invalid in production |
| AUTH_MFA_ENCRYPTION_KEY | Included in required key report for `api`; consumed by API config validation | Soft in script, hard transitively in production checks |
| DATABASE_URL | Required key report for `api` and `worker`; parsed as URL in configs | Soft in script, hard transitively |
| JOB_HMAC_GLOBAL_SECRET | Required key report for `api` and `worker`; production secret guard | Soft in script, hard transitively |
| REDIS_URL | Required key report for `api` and `worker`; URL + TLS expectations in production | Soft in script, hard transitively |
| SENTRY_DSN | Required key report for `api` and `worker`; production requirement | Soft in script, hard transitively |
| SESSION_SECRET | Required key report for `api`; production placeholder/default guard | Soft in script, hard transitively |
| STRIPE_SECRET_KEY | Required key report for `api`; production live-key requirement | Soft in script, hard transitively |
| STRIPE_WEBHOOK_SECRET | Required key report for `api`; production placeholder guard | Soft in script, hard transitively |
| WEB_BASE_URL | Required key report for `api` and `worker`; secure URL check in production | Soft in script, hard transitively |
| NEXT_PUBLIC_API_URL | Required key report for `web`; secure URL check for staging/production | Soft in script, hard transitively |
| NEXT_PUBLIC_APP_URL | Required key report for `web`; secure URL check for staging/production | Soft in script, hard transitively |
| NEXT_PUBLIC_SENTRY_DSN | Required key report for `web`; mandatory for staging/production | Soft in script, hard transitively |
| NODE_ENV | Force-set to `production` by script | Hard (drives strict prod validations) |
| DEPLOYMENT_ENVIRONMENT | Force-set from `--target` | Hard for API prod/staging policy branch |
| NEXT_PUBLIC_ENVIRONMENT | Force-set from `--target` | Hard for web prod/staging policy branch |

### Additional transitive keys (from config validators invoked by preflight)

| Key name | Usage | Failure mode |
|---|---|---|
| NEXT_PUBLIC_CSP_REPORT_ONLY | Must be false in staging/production web validation | Hard transitively |
| REQUIRE_SECURE_COOKIES | Must be true in production API validation | Hard transitively |
| AUTH_BCRYPT_SALT_ROUNDS | Must be >= 12 in production API validation | Hard transitively |
| BILLING_EXPORT_STORAGE_MODE | Worker production branch; if `s3`, bucket required | Hard transitively when `s3` + no bucket |
| BILLING_EXPORT_S3_BUCKET | Conditional requirement under worker production validation | Hard transitively (conditional) |

## Step 2 — Inventory (`.github/workflows/cd.yml`)

`cd.yml` defines explicit environment mappings for staging and production preflight jobs plus deploy jobs. It references GitHub **secrets** and **vars** and performs shell-level required-key checks.

### `secrets.*` used

- `AUTH_MFA_ENCRYPTION_KEY`
- `DATABASE_URL`
- `JOB_HMAC_GLOBAL_SECRET`
- `REDIS_URL`
- `RENDER_STAGING_DEPLOY_HOOK_URL`
- `RENDER_PRODUCTION_DEPLOY_HOOK_URL`
- `SENTRY_DSN`
- `SESSION_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### `vars.*` used

- `API_CORS_ORIGINS`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CSP_REPORT_ONLY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `REQUIRE_SECURE_COOKIES`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `WEB_BASE_URL`

### Cross-reference highlights (Step 1 vs Step 2)

- **Overlap:** all Step 1 required keys are also surfaced in `cd.yml` env blocks and shell required lists.
- **Divergence:** deploy hook secrets (`RENDER_STAGING_DEPLOY_HOOK_URL`, `RENDER_PRODUCTION_DEPLOY_HOOK_URL`) are CD-only (not required by `preflight-env.ts` internals).
- **Behavioral mismatch risk:** staging preflight command does **not** pass `--env-file`, while production preflight explicitly passes `ops/release/sealed/.env.production.sealed`.

## Step 3 — Consolidated Secrets Matrix

| Secret Name | Staging | Production | Criticality | Owner | Provisioning Source | Current Status |
|---|---|---|---|---|---|---|
| API_CORS_ORIGINS | required | required | CRITICAL | Platform Engineering | GitHub Environment Variables (`vars`) | unverified |
| AUTH_MFA_ENCRYPTION_KEY | required | required | CRITICAL | Security Engineering | GitHub Environment Secrets (`secrets`) | unverified |
| DATABASE_URL | required | required | CRITICAL | Data Platform DBA | GitHub Environment Secrets (`secrets`) | unverified |
| JOB_HMAC_GLOBAL_SECRET | required | required | CRITICAL | Backend Platform Lead | GitHub Environment Secrets (`secrets`) | unverified |
| NEXT_PUBLIC_API_URL | required | required | CRITICAL | Web Platform Team | GitHub Environment Variables (`vars`) | unverified |
| NEXT_PUBLIC_APP_URL | required | required | CRITICAL | Web Platform Team | GitHub Environment Variables (`vars`) | unverified |
| NEXT_PUBLIC_CSP_REPORT_ONLY | required (`false`) | required (`false`) | HIGH | AppSec Engineer | GitHub Environment Variables (`vars`) | unverified |
| NEXT_PUBLIC_SENTRY_DSN | required | required | HIGH | Observability Team | GitHub Environment Variables (`vars`) | unverified |
| REDIS_URL | required | required | CRITICAL | Platform SRE | GitHub Environment Secrets (`secrets`) | unverified |
| RENDER_STAGING_DEPLOY_HOOK_URL | required | n/a | CRITICAL | Release Engineering | GitHub Environment Secrets (`secrets`) | unverified |
| RENDER_PRODUCTION_DEPLOY_HOOK_URL | n/a | required | CRITICAL | Release Engineering | GitHub Environment Secrets (`secrets`) | unverified |
| REQUIRE_SECURE_COOKIES | required (`true`) | required (`true`) | HIGH | Security Engineering | GitHub Environment Variables (`vars`) | unverified |
| SENTRY_DSN | required | required | HIGH | Observability Team | GitHub Environment Secrets (`secrets`) | unverified |
| SESSION_SECRET | required | required | CRITICAL | Security Engineering | GitHub Environment Secrets (`secrets`) | unverified |
| STRIPE_CANCEL_URL | required | required | HIGH | Billing Integrations | GitHub Environment Variables (`vars`) | unverified |
| STRIPE_SECRET_KEY | required | required | CRITICAL | Billing Integrations | GitHub Environment Secrets (`secrets`) | unverified |
| STRIPE_SUCCESS_URL | required | required | HIGH | Billing Integrations | GitHub Environment Variables (`vars`) | unverified |
| STRIPE_WEBHOOK_SECRET | required | required | CRITICAL | Billing Integrations | GitHub Environment Secrets (`secrets`) | unverified |
| WEB_BASE_URL | required | required | CRITICAL | Web Platform Team | GitHub Environment Variables (`vars`) | unverified |
| BILLING_EXPORT_STORAGE_MODE | not explicitly mapped in CD env | not explicitly mapped in CD env | HIGH | Worker Platform Team | manual `.env` / CI env block | inconsistent |
| BILLING_EXPORT_S3_BUCKET | not explicitly mapped in CD env | not explicitly mapped in CD env | HIGH | Worker Platform Team | manual `.env` / CI env block | inconsistent |

## Step 4 — Gap Analysis (status != present)

### 1) Global verification gap (`unverified` rows)
- **Gap:** all staging/production keys are declared in workflow, but no repository-visible proof of their concrete values in GitHub Environments.
- **Root cause hypothesis:** runtime values live in GitHub Environment settings, which are intentionally external to repo.
- **Impact before Cycle 02:** deployment can fail at preflight or deploy-hook phases; failures will be discovered late in CD.
- **Recommended remediation:** export and archive a redacted environment configuration evidence artifact per environment (key names + last rotated date + owner), attached to release evidence.

### 2) Worker hidden runtime dependency (`BILLING_EXPORT_STORAGE_MODE` / `BILLING_EXPORT_S3_BUCKET`)
- **Gap:** worker production validator enforces conditional bucket presence, but these keys are absent from CD env contract checks.
- **Root cause hypothesis:** `preflight-env.ts` relies on ambient process env while `cd.yml` validates only a narrower key list.
- **Impact before Cycle 02:** production preflight may fail unexpectedly if storage mode is set to `s3` without matching bucket.
- **Recommended remediation:** add both keys to production `env:` map and required-variable logic (conditional check for bucket when mode is `s3`), or explicitly pin storage mode for release jobs.

### 3) Preflight source asymmetry (staging vs production)
- **Gap:** production preflight uses explicit sealed env file; staging preflight does not pass `--env-file`.
- **Root cause hypothesis:** staging job assumes GitHub environment injection only; production mixes injection + sealed file overlay.
- **Impact before Cycle 02:** inconsistent provenance and reproducibility between environments.
- **Recommended remediation:** standardize both jobs to one source strategy (either explicit sealed file overlays for both or pure environment injection for both) and document precedence.

### 4) Naming divergence / duplicates / hidden deps flags
- **Naming divergence:** none detected for overlapping keys (consistent naming across preflight, CD env blocks, and sealed examples).
- **Duplicate conflicting keys:** none detected in inspected files.
- **Hidden runtime dependency flagged:** `BILLING_EXPORT_STORAGE_MODE` and `BILLING_EXPORT_S3_BUCKET` are consumed by worker config but not declared in CD required checks.
