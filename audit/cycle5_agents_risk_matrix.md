# Cycle 5 - Agents Risk Matrix

- Data da revisao: 2026-04-11
- Escopo: 15 agentes executivos
- Metodo: evidencia de codigo + `artifacts/agent-governance/executive-agents-governance.json` + validacoes executadas no ciclo

## Top 10 riscos

| Rank | Risco | Severidade | Escopo | Evidencia principal | Impacto |
| --- | --- | --- | --- | --- | --- |
| 1 | Superficie critica ainda protegida por `@ts-nocheck` | Alta | 15/15 agentes em `schemas.ts`; 15/15 em `tools.ts`; 14/15 em `agent.ts` | snapshot de governanca; busca por `// @ts-nocheck` | Reduz a confianca estatica sobre contratos, runtime e tools. |
| 2 | `requestId` obrigatorio no contrato, mas ausente da trilha de runtime | Alta | 15/15 agentes | snapshot de governanca; `requestId` em todos os `schemas.ts` | Quebra correlacao operacional entre request, tool, fallback e resposta. |
| 3 | Governanca declarada em YAML nao e executada | Alta | 14/15 agentes | `runtime_enforcement` e `runtime_cycle` em `contract.yaml`; ausencia de uso correspondente no `agent.ts`; snapshot | Cria "governanca de papel": existe no contrato, nao na execucao. |
| 4 | Observabilidade depende de `console.*` local | Media | 15/15 agentes | `boardprep-ai/agent.ts:431-435`, `brand-guardian/agent.ts:517-521`, padrao repetido em todos os agentes | Eventos existem, mas nao chegam a um sistema central auditavel. |
| 5 | Suite de testes executivos tambem esta sob `@ts-nocheck` | Media | 29/29 arquivos de teste dos agentes executivos | busca por `// @ts-nocheck` em `packages/agents/executivos/*/tests/*.ts` | Os testes defendem comportamento, mas nao defendem tipagem real do contrato. |
| 6 | `boardprep-ai` nao possui teste dedicado de schema | Media | 1 agente | ausencia de `packages/agents/executivos/boardprep-ai/tests/test_schema.ts`; snapshot | O contrato publico do agente fica mais exposto a regressao silenciosa. |
| 7 | Residuos semanticos de copy-paste permanecem em tipos internos | Media | Pelo menos `churn-deflector`, `culture-pulse`, `crisis-navigator`, `pricing-optimizer` | `BrandMetrics` em `churn-deflector` e `culture-pulse`; `CompetitorEvent` em `crisis-navigator` e `pricing-optimizer` | Aumenta risco de manutencao incorreta e reduz auditabilidade semantica. |
| 8 | Gate global de validacao nao e reproduzivel no workspace atual | Media | Workspace de agentes | `pnpm typecheck` e `pnpm lint` falham por `corepack` ausente e Node fora da faixa `>=24 <25` | A plataforma nao consegue provar endurecimento completo via gate padrao do repositorio. |
| 9 | Base documental pedida para o ciclo nao existe no workspace | Media | Governanca documental do ciclo | `Test-Path` falso para os 8 arquivos obrigatorios do prompt; `audit/README.md` lista outro conjunto canonico | A trilha de auditoria cross-cycle fica dependente de reconciliacao manual. |
| 10 | Modelo de governanca nao e uniforme na familia executiva | Media | `boardprep-ai` vs outros 14 agentes | `boardprep-ai/contract.yaml` sem `runtime_enforcement` e `runtime_cycle`; 14 pares com esses campos declarados | A comparabilidade e a governanca de portfolio dos agentes ficam inconsistentes. |

## Leitura consolidada dos riscos

- Riscos 1, 2 e 3 sao os bloqueadores reais de maturidade operacional.
- Riscos 4 e 5 degradam capacidade de observacao e confianca de regressao.
- Riscos 6, 7, 9 e 10 nao derrubam execucao local imediatamente, mas enfraquecem auditabilidade, manutencao e governanca.
- Risco 8 impede concluir "pronto" com base em gates padrao do proprio repositorio.

## Matriz por dimensao

| Dimensao | Estado | Leitura |
| --- | --- | --- |
| Contratos | Parcialmente endurecidos | Shapes estao definidos, mas correlacao e enforcement continuam frouxos. |
| Execucao | Funcional, nao governada | Retry/fallback existem, porem sem politica runtime comum. |
| Observabilidade | Estrutural | Eventos existem, mas sem sink e sem correlacao operacional. |
| Tipagem | Fragil para auditoria | `@ts-nocheck` ainda cobre o grosso da familia executiva. |
| Validacao | Parcial | Testes direcionados passam; gate global padrao nao fecha no ambiente atual. |

## Conclusao honesta

O risco dominante nao e "agente nao roda". O risco dominante e "agente roda sem governanca suficiente para ser operado com confianca". Por isso, a classificacao consolidada do portfolio executivo permanece `estrutural`.
