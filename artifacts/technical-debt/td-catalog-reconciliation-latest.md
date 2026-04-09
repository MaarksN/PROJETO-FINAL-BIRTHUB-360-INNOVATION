# TD Catalog Reconciliation

- Generated at: 2026-04-09T01:03:38.071Z
- Latest auditor-prime support: `audit/.auditor-prime/2026-04-07/03-scored-report.json`
- Report date used from auditor-prime support: 2026-04-07

## Namespace Policy

- IDs sem namespace ficam proibidos em novos docs, PRs, issues, runbooks e baselines.
- Fontes historicas sao preservadas sem renomear o conteudo legado.
- Referencia oficial a partir deste ciclo:
  - `PROGRAM-TD-xxx` para o programa em `docs/technical-debt/tracker.json`
  - `MASTER-TD-xxx` para o relatorio master em `audit/divida_tecnica.json`
  - `APR-TD-xxx` para o auditor-prime em `audit/.auditor-prime/2026-04-07/03-scored-report.json`

## Source Inventory

| Source | Namespace | File | Items | First ID | Last ID |
| --- | --- | --- | ---: | --- | --- |
| Technical Debt Program | `PROGRAM-TD-xxx` | `docs/technical-debt/tracker.json` | 7 | TD-001 | TD-007 |
| Relatorio Master | `MASTER-TD-xxx` | `audit/divida_tecnica.json` | 10 | TD-001 | TD-010 |
| Auditor Prime | `APR-TD-xxx` | `audit/.auditor-prime/2026-04-07/03-scored-report.json` | 100 | TD-001 | TD-100 |

## Bare ID Collisions

| Bare ID | Sources | Canonical aliases | Handling |
| --- | ---: | --- | --- |
| `TD-001` | 3 | `PROGRAM-TD-001` — Root documentation entrypoints drifted from the real repo structure<br>`MASTER-TD-001` — Sessão de refresh token em memória (perde em restart)<br>`APR-TD-001` — Complexidade acima do limiar em AppointmentsBoard | Usar somente IDs qualificados por namespace (PROGRAM-TD-001, MASTER-TD-001, APR-TD-001). O bare ID TD-001 fica proibido em novos docs, PRs e runbooks. |
| `TD-002` | 3 | `PROGRAM-TD-002` — Operational runbooks were fragmented and missing rollback and disaster recovery playbooks<br>`MASTER-TD-002` — Teste de RLS falhando com banco real<br>`APR-TD-002` — Complexidade acima do limiar em ConversationsPage | Usar somente IDs qualificados por namespace (PROGRAM-TD-002, MASTER-TD-002, APR-TD-002). O bare ID TD-002 fica proibido em novos docs, PRs e runbooks. |
| `TD-003` | 3 | `PROGRAM-TD-003` — Documentation governance lacked automated link validation and reproducible dependency graph generation<br>`MASTER-TD-003` — Drift de schema detectado após migrate deploy<br>`APR-TD-003` — Complexidade acima do limiar em createWorkflowsRouter | Usar somente IDs qualificados por namespace (PROGRAM-TD-003, MASTER-TD-003, APR-TD-003). O bare ID TD-003 fica proibido em novos docs, PRs e runbooks. |
| `TD-004` | 3 | `PROGRAM-TD-004` — Technical debt reporting had no single tracker, dashboard, or executive summary<br>`MASTER-TD-004` — Dependência de banco torna suíte core instável em ambiente sem serviços<br>`APR-TD-004` — Complexidade acima do limiar em deriveClinicalAlerts | Usar somente IDs qualificados por namespace (PROGRAM-TD-004, MASTER-TD-004, APR-TD-004). O bare ID TD-004 fica proibido em novos docs, PRs e runbooks. |
| `TD-005` | 3 | `PROGRAM-TD-005` — OpenAPI coverage is still partial for the full apps/api surface<br>`MASTER-TD-005` — Threshold de DLQ diverge entre documento e regra operacional<br>`APR-TD-005` — Complexidade acima do limiar em PatientDetailPage | Usar somente IDs qualificados por namespace (PROGRAM-TD-005, MASTER-TD-005, APR-TD-005). O bare ID TD-005 fica proibido em novos docs, PRs e runbooks. |
| `TD-006` | 3 | `PROGRAM-TD-006` — Legacy compatibility surfaces remain operational and increase documentation drift risk<br>`MASTER-TD-006` — Setup local não verifica readiness antes de migrar/seed<br>`APR-TD-006` — Complexidade acima do limiar em PatientsPage | Usar somente IDs qualificados por namespace (PROGRAM-TD-006, MASTER-TD-006, APR-TD-006). O bare ID TD-006 fica proibido em novos docs, PRs e runbooks. |
| `TD-007` | 3 | `PROGRAM-TD-007` — Knowledge transfer recordings and owner sign-off still depend on scheduled human sessions<br>`MASTER-TD-007` — Infra Terraform ainda no nível baseline<br>`APR-TD-007` — Complexidade acima do limiar em WorkflowRevisionsPage | Usar somente IDs qualificados por namespace (PROGRAM-TD-007, MASTER-TD-007, APR-TD-007). O bare ID TD-007 fica proibido em novos docs, PRs e runbooks. |
| `TD-008` | 2 | `MASTER-TD-008` — Fluxo de deploy depende de evidência manual de rollback<br>`APR-TD-008` — Complexidade acima do limiar em WorkflowRunsPage | Usar somente IDs qualificados por namespace (MASTER-TD-008, APR-TD-008). O bare ID TD-008 fica proibido em novos docs, PRs e runbooks. |
| `TD-009` | 2 | `MASTER-TD-009` — Contradição operacional em isolamento RLS<br>`APR-TD-009` — Superfície legacy ainda versionada ao lado do core canônico | Usar somente IDs qualificados por namespace (MASTER-TD-009, APR-TD-009). O bare ID TD-009 fica proibido em novos docs, PRs e runbooks. |
| `TD-010` | 2 | `MASTER-TD-010` — Documentação de alerta indica limite diferente do alerta efetivo<br>`APR-TD-010` — Arquivo grande demais para o boundary atual (1731 linhas) | Usar somente IDs qualificados por namespace (MASTER-TD-010, APR-TD-010). O bare ID TD-010 fica proibido em novos docs, PRs e runbooks. |

## Canonical Reference Examples

- `MASTER-TD-001` = sessao refresh em memoria no relatorio master.
- `PROGRAM-TD-001` = debt program sobre drift dos entrypoints de documentacao.
- `APR-TD-001` = hotspot de complexidade em AppointmentsBoard no auditor-prime.

## Operational Guidance

- Quando for citar um item historico, use o ID namespaced e, se necessario, mencione o alias original uma unica vez.
- Quando um documento novo depender de mais de um catalogo, declare a fonte explicitamente na primeira tabela do ciclo.
- Se surgir um quarto catalogo, ele deve entrar com novo namespace antes de receber IDs `TD-*` reutilizados em texto livre.

