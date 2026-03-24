# Catálogo de Serviços e Repositórios (Taxonomia Canônica)

> Legenda de status: 🟢 **ativo em produção** · 🟡 **satélite/apoio** · 🔴 **legado/sunset ou órfão**

## Core canônico (P0)

| Status | Superfície | Tipo | Dono sugerido | Evidência de runtime | Observação |
|---|---|---|---|---|---|
| 🟢 | `apps/api` | API | Platform/API | `apps/api/src/server.ts` | API principal em execução com bootstrap de observabilidade e Sentry. |
| 🟢 | `apps/web` | Front-end | Product Frontend | `apps/web/package.json` | Aplicação Next.js principal (`dev`, `build`, `start`). |
| 🟢 | `apps/worker` | Worker | Platform/Automation | `apps/worker/src/index.ts` | Worker principal com healthcheck, jobs e shutdown controlado. |
| 🟢 | `packages/database` | Data layer | Platform/Data | `packages/database/package.json` | Pacote oficial de persistência Prisma/migrações (`@birthub/database`). |
| 🟢 | `packages/agent-packs` | Catálogo de agentes | AI Platform | `apps/api/src/modules/marketplace/marketplace-service.ts`, `apps/worker/src/agents/runtime.shared.ts` | Único diretório carregado em runtime para catálogo de agentes. |

## Legado em sunset (não-P0)

| Status | Superfície | Tipo | Situação atual | Observação |
|---|---|---|---|---|
| 🔴 | `apps/api-gateway` | API legado | Não presente no diretório `apps/` no HEAD atual | Removido/descontinuado; não tratar como ativo. |
| 🔴 | `apps/agent-orchestrator` | Worker legado | Não presente no diretório `apps/` no HEAD atual | Removido/descontinuado; não tratar como ativo. |
| 🔴 | `apps/dashboard` | Front-end legado | Presente no monorepo, fora do core canônico | Mantido como legado/suporte; não classificar como P0. |
| 🔴 | `packages/db` | Data package legado | Não presente no diretório `packages/` no HEAD atual | Substituído por `packages/database`. |

## Satélites (apoio)

| Status | Superfície | Tipo | Situação atual | Observação |
|---|---|---|---|---|
| 🟡 | `apps/voice-engine` | Serviço satélite | Presente em `apps/` | Fora do core canônico; impacto indireto no negócio. |
| 🟡 | `apps/webhook-receiver` | Ingestão satélite | Presente em `apps/` | Mantido como borda de integração, fora do núcleo P0. |

## Órfãos

| Status | Superfície | Tipo | Situação atual | Observação |
|---|---|---|---|---|
| 🔴 | `google/genai/__init__.py` | Código órfão | Arquivo Python isolado no repo | Sem evidência de integração no runtime canônico atual. |
