# F0 - Matriz de Ownership Operacional (Core Canônico)

Fonte operacional única de fronteiras: `docs/service-catalog.md`.

## Matriz por domínio

| Domínio | Escopo principal | Owner primário | Backup | Canal oficial (Slack) | Confirmado | Data |
| --- | --- | --- | --- | --- | --- | --- |
| Web (core) | `apps/web` | `@platform-web` | `@product-frontend` | `#bh360-web-ownership` | Sim | 2026-03-24 |
| API (core) | `apps/api` | `@platform-api` | `@platform-security` | `#bh360-api-ownership` | Sim | 2026-03-24 |
| Worker (core) | `apps/worker` | `@platform-worker` | `@platform-api` | `#bh360-worker-ownership` | Sim | 2026-03-24 |
| Database (core) | `packages/database` | `@platform-data` | `@platform-security` | `#bh360-database-ownership` | Sim | 2026-03-24 |
| Agent packs (satélite) | `packages/agent-packs` | `@platform-automation` | `@growth-sdr` | `#bh360-agents-ownership` | Sim | 2026-03-24 |
| Integrations edge (satélite) | `apps/webhook-receiver`, `apps/voice-engine`, `packages/integrations` | `@platform-integrations` | `@platform-api` | `#bh360-integrations-ownership` | Sim | 2026-03-24 |
| DevOps/Security | `.github/workflows`, `infra/`, `ops/`, `scripts/ci`, `scripts/security` | `@platform-devex` | `@platform-security` | `#bh360-devops-ownership` | Sim | 2026-03-24 |

## Componentes críticos (P0) cobertos

Referência de criticidade: `docs/service-criticality.md`.

| Componente crítico | Criticidade | Owner primário | Backup | Coberto no `.github/CODEOWNERS` |
| --- | --- | --- | --- | --- |
| `apps/api` | P0 | `@platform-api` | `@platform-security` | Sim |
| `apps/web` | P0 | `@platform-web` | `@product-frontend` | Sim |
| `apps/worker` | P0 | `@platform-worker` | `@platform-api` | Sim |
| `packages/database` | P0 | `@platform-data` | `@platform-security` | Sim |

## Legacy / quarentena

Superfícies legadas **não-P0** e fora do caminho crítico de go-live:

- `apps/dashboard`
- `apps/api-gateway`
- `apps/agent-orchestrator`
- `packages/db`

Tratamento operacional: `P3`, janela de manutenção, sem acionamento P0 por padrão.

## Matriz de ownership por segredo crítico

Referência detalhada: `docs/release/production-preflight-inventory.md`.

| Segredo crítico | Owner primário | Backup | Rotação mínima |
| --- | --- | --- | --- |
| `DATABASE_URL` | `@platform-data` | `@platform-security` | 90 dias ou incidente |
| `REDIS_URL` | `@platform-worker` | `@platform-api` | 90 dias ou incidente |
| `SESSION_SECRET` | `@platform-security` | `@platform-api` | 60 dias ou incidente |
| `AUTH_MFA_ENCRYPTION_KEY` | `@platform-security` | `@platform-api` | 60 dias ou incidente |
| `JOB_HMAC_GLOBAL_SECRET` | `@platform-security` | `@platform-worker` | 60 dias ou incidente |
| `STRIPE_SECRET_KEY` | `@platform-api` | `@platform-security` | 90 dias ou incidente |
| `STRIPE_WEBHOOK_SECRET` | `@platform-api` | `@platform-security` | 90 dias ou incidente |
| `RENDER_PRODUCTION_DEPLOY_HOOK_URL` | `@platform-devex` | `@platform-architecture` | troca de infra |
| `RENDER_STAGING_DEPLOY_HOOK_URL` | `@platform-devex` | `@platform-architecture` | N/A |
| `SENTRY_DSN` | `@platform-api` | `@platform-devex` | N/A |

## Regras obrigatórias

1. Apenas o core canônico pode sustentar classificação P0.
2. Legado/quarentena não entra como default de operação, onboarding ou incident response.
3. Toda troca de owner exige handoff formal com runbook, acessos e aceite registrado.
4. `.github/CODEOWNERS` segue como fonte operacional de revisão obrigatória por ownership.
