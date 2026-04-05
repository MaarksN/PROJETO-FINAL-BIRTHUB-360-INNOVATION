# Top 15 VDI Backlog

- Generated at: 2026-04-05T20:27:36.479Z
- Source report: `audit\auditor-prime-2026-04-05.json`

## Sprint 1 — Segurança + multi-tenancy

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-029 Superfície crítica sem teste relacionado por heurística de nome (`apps/web/app/(dashboard)/workflows/[id]/runs/page.tsx`) | @product-frontend | 1-3 dias | nenhuma | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-030 Superfície crítica sem teste relacionado por heurística de nome (`apps/api/src/modules/connectors/router.ts`) | @platform-api | 1-3 dias | TD-029 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-031 Chamada externa sem timeout ou abort path explícito (`apps/api/src/docs/openapi.ts`) | @platform-api | 0.5-2 dias | nenhuma | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-032 Chamada externa sem timeout ou abort path explícito (`apps/api/src/lib/database-availability.ts`) | @platform-api | 0.5-2 dias | TD-031 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-033 Chamada externa sem timeout ou abort path explícito (`apps/api/src/lib/external-url.ts`) | @platform-api | 0.5-2 dias | TD-031 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-034 Chamada externa sem timeout ou abort path explícito (`apps/api/src/lib/problem-details.ts`) | @platform-api | 0.5-2 dias | TD-031 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-035 Chamada externa sem timeout ou abort path explícito (`apps/api/src/lib/redis.ts`) | @platform-api | 0.5-2 dias | TD-031 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-036 Configuração sensível dispersa em módulo crítico (`apps/web/lib/auth-client.ts`) | @product-frontend | 0.5-2 dias | TD-016 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |

## Sprint 2 — Qualidade + observabilidade

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-042 Cobertura estrutural baixa em apps/api (`apps/api/src/app/auth-and-core-routes.ts`) | @platform-api | 1-3 dias | TD-026 | Evidência fresca anexada ao pipeline soberano, com referência versionada e consumo automático pelo `audit:prime`. |
| TD-043 Cobertura estrutural baixa em packages/database (`packages/database/src/client.ts`) | @platform-data | 1-3 dias | TD-042, TD-026 | Evidência fresca anexada ao pipeline soberano, com referência versionada e consumo automático pelo `audit:prime`. |

## Sprint 3 — Performance + UX técnica

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-001 Complexidade acima do limiar em registerAuthRoutes (`apps/api/src/app/auth-routes.ts`) | @platform-api | 2-5 dias | nenhuma | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-002 Arquivo grande demais para o boundary atual (473 linhas) (`apps/api/src/modules/billing/service.checkout.ts`) | @platform-api | 2-5 dias | TD-001 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-054 Consulta findMany sem paginação explícita (`apps/api/src/common/cache/prisma-cache-invalidation.ts`) | @platform-api | 0.5-2 dias | nenhuma | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-055 Consulta findMany sem paginação explícita (`apps/api/src/common/cache/prisma-cache-invalidation.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-056 Consulta findMany sem paginação explícita (`apps/api/src/common/cache/prisma-cache-invalidation.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |

## Sprint 4 — Inovação somente após estabilização do core

- Gate: Iniciar inovação apenas depois que os critérios de aceite dos sprints 1-3 estiverem fechados e os itens VDI 4.0+ tiverem sido eliminados ou rebaixados.

- Sem itens de dívida adicionais alocados neste sprint.

