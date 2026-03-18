# Production Readiness Pack - 2026-03-16

## Objetivo

Transformar o bloqueio de "deploy real" em um processo executavel para staging e producao.

## Nota operacional para o go-live de 2026-03-20

Este pacote continua valido como referencia de segredos e de preflight, mas o corte operacional de go-live foi reduzido para o **core canonico**:

- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/database`

## Fonte de verdade do monorepo

- Contrato executavel: [`scripts/ci/workspace-contract.json`](C:/Users/Marks/Documents/GitHub/BIRTHUB-360-INNOVATION/scripts/ci/workspace-contract.json)
- Auditoria automatizada: [`scripts/ci/workspace-audit.mjs`](C:/Users/Marks/Documents/GitHub/BIRTHUB-360-INNOVATION/scripts/ci/workspace-audit.mjs)
- Decisao arquitetural: [`ADR-031-monorepo-source-of-truth.md`](C:/Users/Marks/Documents/GitHub/BIRTHUB-360-INNOVATION/docs/adrs/ADR-031-monorepo-source-of-truth.md)
- Runbook de go-live: [`docs/release/2026-03-20-go-live-runbook.md`](C:/Users/Marks/Documents/GitHub/BIRTHUB-360-INNOVATION/docs/release/2026-03-20-go-live-runbook.md)

## Comandos obrigatorios antes de qualquer staging

1. `docker compose up -d postgres redis`
2. `pnpm workspace:audit`
3. `pnpm install --frozen-lockfile`
4. `pnpm monorepo:doctor`
5. `pnpm release:scorecard`
6. `pnpm lint:core`
7. `pnpm typecheck:core`
8. `pnpm test:core`
9. `pnpm test:isolation`
10. `pnpm build:core`
11. `pnpm release:preflight:staging -- --env-file=.env.staging`
12. `pnpm release:smoke -- --output=artifacts/release/staging-smoke-summary.json`
13. `pnpm test:e2e:release`

## Inventario minimo de segredos

### API

- `DATABASE_URL`
- `REDIS_URL`
- `SESSION_SECRET`
- `AUTH_MFA_ENCRYPTION_KEY`
- `JOB_HMAC_GLOBAL_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`
- `API_CORS_ORIGINS`
- `WEB_BASE_URL`

Nota:
Em `staging`, o Stripe pode usar chave de teste endurecida (`sk_test_`) sem placeholder.
Em `production`, o guardrail exige chave live (`sk_live_`).

### Web

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_CSP_REPORT_ONLY=false`
- `NEXT_PUBLIC_ENVIRONMENT=staging` em staging e `production` em producao

### Worker

- `DATABASE_URL`
- `REDIS_URL`
- `JOB_HMAC_GLOBAL_SECRET`
- `SENTRY_DSN`
- `WEB_BASE_URL`

## Staging Go/No-Go

- `workspace:audit` verde
- `install --frozen-lockfile` verde
- `monorepo:doctor` verde
- `release:scorecard` verde
- `lint:core`, `typecheck:core`, `test:core`, `test:isolation` e `build:core` verdes
- `release:preflight:staging` verde com segredos reais de staging
- smoke de release verde
- healthchecks de `web`, `api` e `worker` respondendo `200`
- Sentry e observabilidade recebendo eventos

## Beta Gate

- 1 fluxo critico validado: login -> criar organizacao -> billing -> executar agente/workflow -> visualizar saida
- 5 tenants beta com onboarding assistido
- erros P1/P2 zerados por 7 dias
- rollback testado com evidencia em staging
