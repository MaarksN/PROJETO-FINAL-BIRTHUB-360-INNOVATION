# Production Preflight Inventory (Staging + Production)

Este inventario cobre os bloqueadores de go-live levantados na auditoria:

1. `production-preflight` obrigatorio no CD.
2. gates obrigatorios de `release:smoke` + `test:e2e:release` + evidencias.
3. rehearsal verificavel de staging/production com segredos equivalentes.

## 1) Secrets e Variables obrigatorios por ambiente

Os itens abaixo sao a uniao do que o lane de release exige em `scripts/release/preflight-env.ts` e do que o deploy no `cd.yml` consome via GitHub Environments.

| Chave | Tipo | Staging | Production | Criticidade |
| --- | --- | --- | --- | --- |
| `AUTH_MFA_ENCRYPTION_KEY` | Secret | Obrigatorio | Obrigatorio | Critico |
| `CLOUD_RUN_API_SERVICE` | Variable | Obrigatorio | Obrigatorio | Critico |
| `CLOUD_RUN_REGION` | Variable | Obrigatorio | Obrigatorio | Critico |
| `CLOUD_RUN_WEB_SERVICE` | Variable | Obrigatorio | Obrigatorio | Critico |
| `CLOUD_RUN_WORKER_SERVICE` | Variable | Obrigatorio | Obrigatorio | Critico |
| `DATABASE_URL` | Secret | Obrigatorio | Obrigatorio | Critico |
| `GCP_ARTIFACT_REGISTRY_REGION` | Variable | Obrigatorio | Obrigatorio | Alto |
| `GCP_ARTIFACT_REGISTRY_REPOSITORY` | Variable | Obrigatorio | Obrigatorio | Alto |
| `GCP_PROJECT_ID` | Variable | Obrigatorio | Obrigatorio | Critico |
| `GCP_SERVICE_ACCOUNT_EMAIL` | Variable | Obrigatorio | Obrigatorio | Critico |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Variable | Obrigatorio | Obrigatorio | Critico |
| `JOB_HMAC_GLOBAL_SECRET` | Secret | Obrigatorio | Obrigatorio | Critico |
| `REDIS_URL` | Secret | Obrigatorio | Obrigatorio | Critico |
| `SENTRY_DSN` | Secret | Obrigatorio | Obrigatorio | Alto |
| `SESSION_SECRET` | Secret | Obrigatorio | Obrigatorio | Critico |
| `SESSION_IP_HASH_SALT` | Secret | Obrigatorio | Obrigatorio | Critico |
| `STRIPE_SECRET_KEY` | Secret | Obrigatorio | Obrigatorio | Critico |
| `STRIPE_WEBHOOK_SECRET` | Secret | Obrigatorio | Obrigatorio | Critico |
| `API_CORS_ORIGINS` | Variable | Obrigatorio | Obrigatorio | Alto |
| `NEXT_PUBLIC_API_URL` | Variable | Obrigatorio | Obrigatorio | Alto |
| `NEXT_PUBLIC_APP_URL` | Variable | Obrigatorio | Obrigatorio | Alto |
| `NEXT_PUBLIC_CSP_REPORT_ONLY` | Variable | Obrigatorio (`false`) | Obrigatorio (`false`) | Medio |
| `NEXT_PUBLIC_SENTRY_DSN` | Variable | Obrigatorio | Obrigatorio | Medio |
| `REQUIRE_SECURE_COOKIES` | Variable | Obrigatorio (`true`) | Obrigatorio (`true`) | Critico |
| `STRIPE_CANCEL_URL` | Variable | Obrigatorio | Obrigatorio | Alto |
| `STRIPE_SUCCESS_URL` | Variable | Obrigatorio | Obrigatorio | Alto |
| `WEB_BASE_URL` | Variable | Obrigatorio | Obrigatorio | Alto |

## 2) Ownership matrix por segredo critico

| Segredo/configuracao critica | Owner primario | Backup owner | Rotacao minima | Evidencia obrigatoria |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | `@platform-data` | `@platform-security` | 90 dias ou incidente | teste de conexao + preflight verde |
| `REDIS_URL` | `@platform-worker` | `@platform-api` | 90 dias ou incidente | healthcheck fila + preflight verde |
| `SESSION_SECRET` | `@platform-security` | `@platform-api` | 60 dias ou incidente | invalidacao controlada + preflight verde |
| `SESSION_IP_HASH_SALT` | `@platform-security` | `@platform-api` | 60 dias ou incidente | hashing estavel de sessao validado |
| `AUTH_MFA_ENCRYPTION_KEY` | `@platform-security` | `@platform-api` | 60 dias ou incidente | decrypt/encrypt check + preflight verde |
| `JOB_HMAC_GLOBAL_SECRET` | `@platform-security` | `@platform-worker` | 60 dias ou incidente | assinatura/validacao em job de smoke |
| `STRIPE_SECRET_KEY` | `@platform-api` | `@platform-security` | 90 dias ou incidente | smoke de billing verde |
| `STRIPE_WEBHOOK_SECRET` | `@platform-api` | `@platform-security` | 90 dias ou incidente | webhook signature check verde |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `@platform-devex` | `@platform-security` | em toda troca de infra | auth via OIDC validado em staging |
| `GCP_SERVICE_ACCOUNT_EMAIL` | `@platform-devex` | `@platform-architecture` | em toda troca de infra | deploy candidato validado |
| `CLOUD_RUN_REGION` | `@platform-devex` | `@platform-architecture` | em toda troca de infra | rollout manifest com regiao correta |
| `CLOUD_RUN_API_SERVICE` | `@platform-devex` | `@platform-api` | em toda troca de infra | smoke `health` e rollout manifest |
| `CLOUD_RUN_WEB_SERVICE` | `@platform-devex` | `@platform-web` | em toda troca de infra | smoke `/pricing` e rollout manifest |
| `CLOUD_RUN_WORKER_SERVICE` | `@platform-devex` | `@platform-worker` | em toda troca de infra | rollout manifest com revisao candidata |
| `SENTRY_DSN` | `@platform-api` | `@platform-devex` | N/A | N/A |

> Referencia de ownership: `.github/CODEOWNERS`.

## 3) Equivalentes selados de `.env.staging` e `.env.production`

Arquivos versionados com placeholders selados (sem segredo real):

- `ops/env/.env.staging.sealed.example`
- `ops/env/.env.production.sealed.example`

Uso operacional para rehearsal local:

```bash
pnpm release:preflight:staging -- --env-file=ops/env/.env.staging.sealed.example
pnpm release:preflight:production -- --env-file=ops/env/.env.production.sealed.example
```

## 4) Evidencias esperadas para liberar producao

Antes de executar `promote-production`, a pipeline deve ter:

- `production-preflight` verde.
- `release-smoke-gate` verde.
- `release-e2e-gate` verde.
- `rollback-rehearsal-evidence-gate` verde, com referencia rastreavel de rehearsal.

Sem essas quatro evidencias, deploy em producao permanece bloqueado.
