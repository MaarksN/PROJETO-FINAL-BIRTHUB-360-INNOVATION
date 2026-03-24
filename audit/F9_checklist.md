# F9 — CHECKLIST GLOBAL DETALHADO

## Instruções de Uso
Este checklist é o rastreador binário (✅ ou ❌) de que a plataforma atingiu a prontidão prometida. Cada item preenchido deve apontar para a evidência física (commit, PR ou arquivo) sob a coluna **"Artefato / Prova"**.

> Atenção: A marcação só é permitida se a evidência sustentar a afirmação. Remoções de legado só recebem o ✅ se o runbook respectivo de cutover for entregue.

## 1. Release / Environment / Deploy

| Item | Status | Artefato / Prova | Condição para Bloqueio |
| --- | --- | --- | --- |
| Job `production-preflight` criado e inserido na cadeia bloqueante de produção. | ⬜ | | Sim (Go-live bloqueado se `false`) |
| Variáveis sensíveis e mockadas provisionadas (`.env.*.mock`). | ⬜ | | Sim |
| Teste de falha de preflight sem mock documentado e provado. | ⬜ | | Não |
| Script `rollback-rehearsal.ts` inserido como step em Staging/Prod. | ⬜ | | Sim |
| Pipelines no GitHub Actions exigem chaves verificadas via step explícito. | ⬜ | | Sim |
| Trivy/Security scan rodando limpo (sem block falso positivo de fs/image). | ⬜ | | Não |
| O tempo máximo de workflow respeita os limites (timeouts inseridos). | ⬜ | | Não |

## 2. Governança / Taxonomia / Docs

| Item | Status | Artefato / Prova | Condição para Bloqueio |
| --- | --- | --- | --- |
| `service-catalog.md` lista apenas 4 serviços no core. | ⬜ | | Não (Apenas risco) |
| Legados (API Gateway, Orchestrator) marcados como "Quarentena/Sunset". | ⬜ | | Não |
| `service-criticality.md` foi atualizado rebaixando o SLA do legado. | ⬜ | | Sim |
| Arquitetura `f10/architecture.md` atualizada separando `.legacy` e `.satellites`. | ⬜ | | Não |
| Diretório `docs/.archive/` criado e documentos supersededs migrados. | ⬜ | | Não |
| O War Room Playbook ou Release Runbook de lançamento está fechado. | ⬜ | | Sim |
| Sem palavras draft (TODO, TBD, etc) remanescentes em novos relatórios audit. | ⬜ | | Não (Pode quebrar pipelines de anti-drift) |

## 3. Health / Readiness / Observabilidade

| Item | Status | Artefato / Prova | Condição para Bloqueio |
| --- | --- | --- | --- |
| Liveness probe criado isoladamente em `apps/web`. | ⬜ | | Não |
| Readiness probe criado em `apps/web` (pingando o banco). | ⬜ | | Sim |
| Readiness probe criado em `apps/worker` (pingando DB e/ou Fila). | ⬜ | | Sim |
| Respostas de payload das sondas padronizadas em todas aplicações. | ⬜ | | Não |
| Logs Winston/Consoles das falhas de health estão sendo emitidos. | ⬜ | | Não |
| Regras do Prometheus (`alert.rules.yml`) apontam para `apps/api` e `apps/worker`. | ⬜ | | Sim |
| Thresholds documentados na base de conhecimento On-Call. | ⬜ | | Não |
| Alertas configurados para fila presa (RabbitMQ/Redis) no Worker. | ⬜ | | Sim |

## 4. Dados / Migrations / Integrações

| Item | Status | Artefato / Prova | Condição para Bloqueio |
| --- | --- | --- | --- |
| Nenhum import aponta estaticamente para `packages/db`. | ⬜ | | Sim |
| `packages/db` foi fisicamente deletado da árvore de arquivos. | ⬜ | | Sim |
| `pnpm dedupe` foi rodado e o lockfile não tem duplicatas órfãs do banco legado. | ⬜ | | Sim |
| Seeds em `packages/database` injetam `tenantId` e operam com upserts (idempotência). | ⬜ | | Não |
| Regras de RLS testadas validando separação de tenant nos inserts. | ⬜ | | Não |
| Testes E2E e unitários de backend passam contra o `packages/database`. | ⬜ | | Sim |

## 5. Legado / Cutover

| Item | Status | Artefato / Prova | Condição para Bloqueio |
| --- | --- | --- | --- |
| Prova de Cutover do API Gateway registrada (`audit/cutover_api_gateway.md`). | ⬜ | | Sim |
| `apps/web` consumindo diretamente do `apps/api` configurado nas envs. | ⬜ | | Sim |
| Middlewares transferidos do Gateway para a API principal (CORS, Rate Limit). | ⬜ | | Sim |
| Testes frontend E2E no Playwright executados passando com gateway by-pass. | ⬜ | | Sim |
| Configurações de redirecionamento (Ingress/Terraform) tratadas/documentadas. | ⬜ | | Não |

## 6. Higiene / Estrutura

| Item | Status | Artefato / Prova | Condição para Bloqueio |
| --- | --- | --- | --- |
| Pastas `.legacy` e `.satellites` criadas e populadas em `apps/`. | ⬜ | | Não (Mas bloqueia a clareza da governança de código) |
| Lixos transitórios (`prompt_soberano`, `.ps1` local, `fix_pkg.py`) apagados da raiz. | ⬜ | | Não |
| `pnpm audit` rodado e versões de alto risco sanadas (overrides se necessário). | ⬜ | | Não |
| `corepack pnpm monorepo:doctor` passa sem warnings severos. | ⬜ | | Não |
| Linter (`max-lines: 500`, `complexity: 20`) resolvido ou mitigado via disables documentados. | ⬜ | | Não |
| Cache de builds (`/dist`) expurgados do tracking do git e no `.gitignore`. | ⬜ | | Não |
| Lockfile sync feito e testado via `pnpm install --lockfile-only`. | ⬜ | | Sim |

## 7. Agentes / Runtime / Contratos

| Item | Status | Artefato / Prova | Condição para Bloqueio |
| --- | --- | --- | --- |
| Manifestos de `.github/agents` que não possuíam runtime foram removidos/arquivados. | ⬜ | | Não |
| Manifestos ativos movidos exclusivamente para `packages/agent-packs/`. | ⬜ | | Sim (Se o produto IA for ser ativado no core) |
| Loader/Marketplace no backend consegue parsear e inicializar os agentes canônicos sem erros. | ⬜ | | Sim |
| Os agentes possuem contratos claros de input/output via Zod/Pydantic no código base. | ⬜ | | Sim |
| Convenção kebab-case para pacotes typescript e snake_case para pastas python aplicada. | ⬜ | | Não |

---

## RELATÓRIO F9

- **Total de Itens Auditáveis:** 42 itens de verificação binária.
- **Distribuição por Categoria:** Release/CD (7), Governança (7), Health (8), Dados (6), Legado/Cutover (5), Higiene (7), Agentes (5).
- **Itens Críticos (Bloqueadores Simples):** 17 itens foram marcados com a tag "Sim" sob a coluna "Condição para Bloqueio". Se qualquer um desses 17 itens não possuir evidência preenchida, o sistema **não estará liberado** tecnicamente para go-live.
- **Itens Condicionais:** Itens marcados com "Não" são débitos técnicos que podem ser empurrados para as Sprints subsequentes ao lançamento, sem quebrar o core do usuário.
- **Gates Mínimos para considerar o sistema Apto:** Todos os testes de PR security e E2E release passando junto aos 17 bloqueadores sanados. A tabela atua como o checklist formal de aceite da war-room do F8.
