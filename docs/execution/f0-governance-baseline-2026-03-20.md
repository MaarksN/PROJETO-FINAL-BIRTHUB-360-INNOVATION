# F0 — Governança, ownership e baseline (2026-03-20)

## Status da fase

- **Fase:** F0
- **Estado:** **CONCLUÍDA**
- **Data de execução:** 2026-03-20
- **Bloqueio ativo:** nenhum (resolvido em 2026-03-20).
- **Regra aplicada:** F1 liberada após bateria F0 com todos os comandos em verde.

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

> Fonte base: convenções já versionadas no `CODEOWNERS` e documentação de criticidade.

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
| 01 | `corepack pnpm install --frozen-lockfile` | ✅ PASS | `artifacts/f0-baseline-2026-03-20/logs/01-install-frozen-lockfile.log` |
| 02 | `corepack pnpm monorepo:doctor` | ✅ PASS | `artifacts/f0-baseline-2026-03-20/logs/02-monorepo-doctor.log` |
| 03 | `corepack pnpm release:scorecard` | ✅ PASS | `artifacts/f0-baseline-2026-03-20/logs/03-release-scorecard.log` |
| 04 | `corepack pnpm lint:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-20/logs/04-lint-core.log` |
| 05 | `corepack pnpm typecheck:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-20/logs/05-typecheck-core.log` |
| 06 | `corepack pnpm test:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-20/logs/06-test-core.log` |
| 07 | `corepack pnpm build:core` | ✅ PASS | `artifacts/f0-baseline-2026-03-20/logs/07-build-core.log` |

### Resumo de desbloqueio

- O bloqueio de `lint:core` foi resolvido no arquivo `apps/worker/test/outbound.webhooks.test.ts`.
- Impacto esperado: gate de qualidade voltou a ficar verde para o core canônico.
- Risco residual: **baixo** (apenas warnings não bloqueantes no lint).
- Próxima ação obrigatória: iniciar F1 (estabilização de pipeline e gates obrigatórios).

## 4) Template de fechamento (Anexo B) aplicado aos itens de F0

- [x] ITEM-ID: F0-OWNERSHIP-MATRIX
  - Owner: Platform Architecture
  - Severidade: P0
  - Prazo: 2026-03-20
  - Evidência: `docs/execution/f0-governance-baseline-2026-03-20.md`
  - Risco residual: baixo
  - Rollback: N/A

- [x] ITEM-ID: F0-SLA-POLICY
  - Owner: Platform Architecture
  - Severidade: P0
  - Prazo: 2026-03-20
  - Evidência: `docs/execution/f0-governance-baseline-2026-03-20.md`
  - Risco residual: baixo
  - Rollback: N/A

- [x] ITEM-ID: F0-BASELINE-GREEN
  - Owner: Platform DevOps
  - Severidade: P0
  - Prazo: 2026-03-20
  - Evidência: `artifacts/f0-baseline-2026-03-20/logs/*`
  - Risco residual: baixo
  - Rollback: N/A
