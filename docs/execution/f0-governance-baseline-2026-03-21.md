# F0 — Governança, ownership e baseline (2026-03-21)

## Status da fase

- **Fase:** F0
- **Estado:** **CONCLUÍDA (execução técnica local)**
- **Data de execução:** 2026-03-21
- **Bloqueios ativos:** nenhum no baseline técnico
- **Observação de auditoria:** fechamento definitivo depende de PR com link público e aprovação dos owners.

## 1) Matriz de ownership técnico por domínio

| Domínio | Escopo principal | Owner técnico | Backup | Observação |
|---|---|---|---|---|
| Web | `apps/web`, BFF web, DX frontend | `@product-frontend` | `@platform-architecture` | Core canônico |
| API | `apps/api`, contratos HTTP, RBAC/sessão | `@platform-api` | `@platform-architecture` | Core canônico |
| Worker | `apps/worker`, filas e execução assíncrona | `@platform-automation` | `@platform-api` | Core canônico |
| Database | `packages/database`, Prisma, migrações | `@platform-data` | `@platform-architecture` | Core canônico |
| Agents | `agents/*`, `packages/agents-*`, runtime de agentes | `@platform-automation` | `@growth-sdr` | Inclui superfícies legadas de agentes |
| Security | hardening, scans, guardrails, compliance | `@platform-architecture` | `@platform-api` | Dono obrigatório de exceções |
| DevOps | CI/CD, gates, proteção de branch e releases | `@platform-architecture` | `@platform-automation` | Dono de incidentes de pipeline |

## 2) Política de SLA por severidade

| Severidade | Definição | TTA (ack) | Mitigação inicial | Prazo de correção alvo | Escalonamento |
|---|---|---:|---:|---:|---|
| **P0** | indisponibilidade crítica, risco de receita/compliance, quebra de segurança crítica | 5 min | 30 min | 24 h (ou workaround aprovado) | on-call imediato + atualização a cada 30 min |
| **P1** | degradação relevante de funcionalidade crítica sem parada total | 15 min | 4 h | 3 dias corridos | update diário até fechamento |
| **P2** | dívida técnica de médio impacto, sem risco operacional imediato | 1 dia útil | 3 dias úteis | 2 sprints | revisão semanal de backlog |

### Regras obrigatórias de exceção

1. Exceção de segurança/compliance **sempre** exige owner nominal + prazo de expiração.
2. Exceção sem prazo é inválida e bloqueia merge/release.
3. Toda exceção deve ter risco residual explícito (`baixo`, `médio`, `alto`) e plano de rollback quando aplicável.

## 3) Evidências de baseline F0

### Comandos obrigatórios

| Ordem | Comando | Resultado | Evidência |
|---:|---|---|---|
| 00 | `corepack pnpm install` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/00-lockfile-refresh.log` |
| 01 | `corepack pnpm install --frozen-lockfile` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/01-install.log` |
| 02 | `corepack pnpm monorepo:doctor` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/02-monorepo-doctor.log` |
| 03 | `corepack pnpm release:scorecard` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/03-release-scorecard.log` |
| 04 | `corepack pnpm lint:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/04-lint-core.log` |
| 05 | `corepack pnpm typecheck:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/05-typecheck-core.log` |
| 06 | `corepack pnpm test:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/06-test-core.log` |
| 07 | `corepack pnpm build:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-21/logs/07-build-core.log` |

### Correção de causa raiz aplicada durante F0

- `pnpm-lock.yaml` desatualizado com `apps/dashboard/package.json` bloqueava `--frozen-lockfile`.
- Erro único de lint em `apps/api/src/modules/billing/service.checkout.ts` por import não utilizado (`ensurePlanByCode`) foi removido.

## 4) Template de fechamento (Anexo B)

- [x] ITEM-ID: F0-OWNERSHIP-MATRIX
  - Owner: Platform Architecture
  - Severidade: P0
  - Prazo: 2026-03-21
  - Evidência: `docs/execution/f0-governance-baseline-2026-03-21.md`
  - Risco residual: baixo
  - Rollback: N/A

- [x] ITEM-ID: F0-SLA-POLICY
  - Owner: Platform Architecture
  - Severidade: P0
  - Prazo: 2026-03-21
  - Evidência: `docs/execution/f0-governance-baseline-2026-03-21.md`
  - Risco residual: baixo
  - Rollback: N/A

- [x] ITEM-ID: F0-BASELINE-GREEN
  - Owner: Platform DevOps + Platform API
  - Severidade: P0
  - Prazo: 2026-03-21
  - Evidência: `artifacts/f0-baseline-2026-03-21/logs/*`
  - Risco residual: baixo
  - Rollback: N/A

## 5) Risco residual da fase

- **Baixo** para baseline técnico local (gates verdes).
- **Médio** para auditoria formal até abertura/merge de PR com links e aprovação de owners.
