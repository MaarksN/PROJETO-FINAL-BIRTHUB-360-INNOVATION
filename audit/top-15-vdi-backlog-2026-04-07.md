# Top 15 VDI Backlog

- Generated at: 2026-04-07T17:26:35.706Z
- Source report: `audit\auditor-prime-2026-04-07.json`

## Sprint 1 — Segurança + multi-tenancy

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-089 Prova runtime de RLS por tenant ainda não fecha no runner soberano (`artifacts/tenancy/rls-proof-head.json`) | @platform-architecture | 1-3 dias | TD-029 | Prova de isolamento atualizada em `artifacts/tenancy/rls-proof-head.json`, controles de tenancy verificados e item rebaixado/removido na próxima auditoria. |
| TD-029 Uso de raw query insegura no acesso a dados (`apps/worker/src/agents/runtime.tools.ts`) | @platform-automation | 1-3 dias | nenhuma | Nenhum uso inseguro remanescente no escopo do item; validação direcionada executada; auditor-prime rerodado sem reincidência do achado. |
| TD-030 Chamada externa sem timeout ou abort path explícito (`apps/web/app/(dashboard)/workflows/[id]/edit/page.tsx`) | @product-frontend | 0.5-2 dias | nenhuma | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-090 Ausência de superfícies explícitas de interoperabilidade clínica padrão (`packages/integrations/src/clients/http.ts`) | @platform-architecture | 1-2 semanas | nenhuma | Capacidade operacional/multi-tenant materializada com evidência versionada, critério técnico validado e item rebaixado/removido na próxima auditoria. |
| TD-091 Drill de disaster recovery não registrado no ciclo atual (`artifacts/dr/latest-drill.json`) | @platform-architecture | 0.5-2 dias | nenhuma | Capacidade operacional/multi-tenant materializada com evidência versionada, critério técnico validado e item rebaixado/removido na próxima auditoria. |
| TD-031 Semgrep WARNING em cd.yml (`.github/workflows/cd.yml`) | @platform-security | 0.5-2 dias | TD-030 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |

## Sprint 2 — Qualidade + observabilidade

- Sem itens de dívida adicionais alocados neste sprint.

## Sprint 3 — Performance + UX técnica

| Item | Owner | Esforço | Dependências | Critério de aceite |
| --- | --- | --- | --- | --- |
| TD-054 Consulta findMany sem paginação explícita (`apps/api/src/modules/workflows/service.ts`) | @platform-api | 0.5-2 dias | nenhuma | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-055 Consulta findMany sem paginação explícita (`apps/api/src/modules/workflows/service.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-056 Consulta findMany sem paginação explícita (`apps/api/src/modules/workflows/service.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-057 Consulta findMany sem paginação explícita (`apps/api/src/modules/workflows/service.ts`) | @platform-api | 0.5-2 dias | TD-054 | Hotspot segmentado sem regressão funcional, com baseline atualizada e critério de experiência/performance validado. |
| TD-001 Complexidade acima do limiar em createWorkflowsRouter (`apps/api/src/modules/workflows/router.ts`) | @platform-api | 2-5 dias | nenhuma | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-002 Complexidade acima do limiar em main (`packages/database/scripts/check-migration-governance.ts`) | @platform-data | 2-5 dias | TD-001 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-003 Complexidade acima do limiar em WorkflowEditPage (`apps/web/app/(dashboard)/workflows/[id]/edit/page.tsx`) | @product-frontend | 2-5 dias | TD-001 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-004 Complexidade acima do limiar em WorkflowRevisionsPage (`apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx`) | @product-frontend | 2-5 dias | TD-001 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |
| TD-005 Complexidade acima do limiar em WorkflowRunsPage (`apps/web/app/(dashboard)/workflows/[id]/runs/page.tsx`) | @product-frontend | 2-5 dias | TD-001 | Correção aplicada, dependências fechadas, evidência regenerada e item reavaliado pelo auditor-prime no próximo ciclo. |

## Sprint 4 — Inovação somente após estabilização do core

- Gate: Iniciar inovação apenas depois que os critérios de aceite dos sprints 1-3 estiverem fechados e os itens VDI 4.0+ tiverem sido eliminados ou rebaixados.

- Sem itens de dívida adicionais alocados neste sprint.

