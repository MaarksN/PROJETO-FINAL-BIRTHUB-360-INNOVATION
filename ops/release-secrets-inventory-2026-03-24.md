# Release secrets/variables inventory and ownership matrix (staging + production)

## 1) Inventario de configuracoes obrigatorias por ambiente

Fonte operacional: `.github/workflows/cd.yml` (jobs `staging-preflight` e `production-preflight`) + contrato de runtime em `scripts/release/preflight-env.ts`.

### Secrets obrigatorios (staging e production)

| Chave | Staging | Production | Critica | Owner primario | Owner backup | Canal |
|---|---|---|---|---|---|---|
| `RENDER_STAGING_DEPLOY_HOOK_URL` | Sim | Nao | Alta | `@platform-devex` | `@platform-architecture` | `#bh360-devops-ownership` |
| `RENDER_PRODUCTION_DEPLOY_HOOK_URL` | Nao | Sim | Alta | `@platform-devex` | `@platform-architecture` | `#bh360-devops-ownership` |
| `DATABASE_URL` | Sim | Sim | Critica | `@platform-data` | `@platform-security` | `#bh360-database-ownership` |
| `REDIS_URL` | Sim | Sim | Critica | `@platform-worker` | `@platform-api` | `#bh360-worker-ownership` |
| `SESSION_SECRET` | Sim | Sim | Critica | `@platform-security` | `@platform-architecture` | `#bh360-security-ownership` |
| `JOB_HMAC_GLOBAL_SECRET` | Sim | Sim | Critica | `@platform-security` | `@platform-worker` | `#bh360-security-ownership` |
| `AUTH_MFA_ENCRYPTION_KEY` | Sim | Sim | Critica | `@platform-security` | `@platform-api` | `#bh360-security-ownership` |
| `STRIPE_SECRET_KEY` | Sim | Sim | Critica | `@platform-api` | `@platform-security` | `#bh360-api-ownership` |
| `STRIPE_WEBHOOK_SECRET` | Sim | Sim | Critica | `@platform-api` | `@platform-security` | `#bh360-api-ownership` |
| `SENTRY_DSN` | Sim | Sim | Alta | `@platform-api` | `@platform-devex` | `#bh360-api-ownership` |

### Variables obrigatorias (staging e production)

| Chave | Staging | Production | Critica | Owner primario | Owner backup | Canal |
|---|---|---|---|---|---|---|
| `API_CORS_ORIGINS` | Sim | Sim | Alta | `@platform-api` | `@platform-security` | `#bh360-api-ownership` |
| `WEB_BASE_URL` | Sim | Sim | Alta | `@platform-web` | `@platform-devex` | `#bh360-web-ownership` |
| `NEXT_PUBLIC_API_URL` | Sim | Sim | Alta | `@platform-web` | `@platform-api` | `#bh360-web-ownership` |
| `NEXT_PUBLIC_APP_URL` | Sim | Sim | Alta | `@platform-web` | `@platform-api` | `#bh360-web-ownership` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sim | Sim | Media | `@platform-web` | `@platform-devex` | `#bh360-web-ownership` |
| `NEXT_PUBLIC_CSP_REPORT_ONLY` | Sim (`false`) | Sim (`false`) | Alta | `@platform-security` | `@platform-web` | `#bh360-security-ownership` |
| `REQUIRE_SECURE_COOKIES` | Sim (`true`) | Sim (`true`) | Critica | `@platform-security` | `@platform-api` | `#bh360-security-ownership` |
| `STRIPE_SUCCESS_URL` | Sim | Sim | Alta | `@platform-api` | `@platform-web` | `#bh360-api-ownership` |
| `STRIPE_CANCEL_URL` | Sim | Sim | Alta | `@platform-api` | `@platform-web` | `#bh360-api-ownership` |

## 2) Matriz de ownership por segredo critico

| Segredo critico | Dominio | Responsavel por rotacao | Janela recomendada |
|---|---|---|---|
| `DATABASE_URL` | Dados | `@platform-data` | trimestral ou sob incidente |
| `REDIS_URL` | Worker/Filas | `@platform-worker` | trimestral ou mudanca de cluster |
| `SESSION_SECRET` | Auth/API | `@platform-security` | trimestral |
| `JOB_HMAC_GLOBAL_SECRET` | Integridade de jobs | `@platform-security` | trimestral |
| `AUTH_MFA_ENCRYPTION_KEY` | Auth/MFA | `@platform-security` | semestral + rotação emergencial |
| `STRIPE_SECRET_KEY` | Billing | `@platform-api` | conforme politica Stripe + incidente |
| `STRIPE_WEBHOOK_SECRET` | Billing/Webhook | `@platform-api` | a cada reconfiguracao de endpoint |

## 3) Rehearsal verificavel

- Inputs selados versionados:
  - `ops/release/sealed/.env.staging.sealed`
  - `ops/release/sealed/.env.production.sealed`
- Artefatos de preflight esperados:
  - `artifacts/release/staging-preflight-summary.json`
  - `artifacts/release/production-preflight-summary.json`
