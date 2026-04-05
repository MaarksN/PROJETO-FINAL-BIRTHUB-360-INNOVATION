# Top 15 VDI Backlog

- Generated at: 2026-04-05T21:32:15.519Z
- Source report: `audit\auditor-prime-2026-04-05.json`

## Sprint 1 — Segurança + multi-tenancy

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-029 Chamada externa sem timeout ou abort path explícito (`apps/dashboard/lib/dashboard-data.ts`) | @platform-security | 0.5-2 dias | nenhuma | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-030 Chamada externa sem timeout ou abort path explícito (`apps/web/app/api/bff/[...path]/route.ts`) | @product-frontend | 0.5-2 dias | TD-029 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-031 Chamada externa sem timeout ou abort path explícito (`apps/web/app/invites/accept/page.tsx`) | @product-frontend | 0.5-2 dias | TD-029 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-032 Chamada externa sem timeout ou abort path explícito (`apps/web/app/pricing/page.tsx`) | @product-frontend | 0.5-2 dias | TD-029 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-033 Chamada externa sem timeout ou abort path explícito (`apps/web/components/agents/PolicyManager.tsx`) | @product-frontend | 0.5-2 dias | TD-029 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |

## Sprint 2 — Qualidade + observabilidade

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-042 Cobertura estrutural baixa em apps/api (`apps/api/src/app/module-routes.ts`) | @platform-api | 1-3 dias | TD-026 | Evidência fresca anexada ao pipeline soberano, com referência versionada e consumo automático pelo `audit:prime`. |
| TD-043 Cobertura estrutural baixa em packages/database (`packages/database/src/repositories/access-control.ts`) | @platform-data | 1-3 dias | TD-042, TD-026 | Evidência fresca anexada ao pipeline soberano, com referência versionada e consumo automático pelo `audit:prime`. |

## Sprint 3 — Performance + UX técnica

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-001 Complexidade acima do limiar em registerAuthRoutes (`apps/api/src/app/auth-routes.ts`) | @platform-api | 2-5 dias | nenhuma | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-054 Consulta findMany sem paginação explícita (`apps/api/src/common/cache/prisma-cache-invalidation.ts`) | @platform-api | 0.5-2 dias | nenhuma | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-055 Consulta findMany sem paginação explícita (`apps/api/src/common/cache/prisma-cache-invalidation.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-056 Consulta findMany sem paginação explícita (`apps/api/src/common/cache/prisma-cache-invalidation.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-057 Consulta findMany sem paginação explícita (`apps/api/src/modules/agents/metrics.service.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-058 Consulta findMany sem paginação explícita (`apps/api/src/modules/agents/service.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-002 Complexidade acima do limiar em <anonymous> (`apps/worker/src/worker.process-job.ts`) | @platform-automation | 2-5 dias | TD-001 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-003 Complexidade acima do limiar em createConnectorsRouter (`apps/api/src/modules/connectors/router.ts`) | @platform-api | 2-5 dias | TD-001 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |

## Sprint 4 — Inovação somente após estabilização do core

- Gate: Iniciar inovação apenas depois que os critérios de aceite dos sprints 1-3 estiverem fechados e os itens VDI 4.0+ tiverem sido eliminados ou rebaixados.

- Sem itens de dívida adicionais alocados neste sprint.

