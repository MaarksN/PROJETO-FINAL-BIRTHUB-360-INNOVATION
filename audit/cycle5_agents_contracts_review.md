# Cycle 5 - Agents Contracts Review

- Data da revisao: 2026-04-11
- Escopo: 15 agentes executivos em `packages/agents/executivos/*`
- Snapshot base: `artifacts/agent-governance/executive-agents-governance.json`
- Fontes canonicas realmente presentes no workspace: `audit/README.md`, `audit/forensic_inventory.md`, `audit/traceability_matrix.md`, `audit/validation_log.md`, `audit/final_governance_report.md`, `audit/auditor-prime-latest.backlog.md`

## Nota de reconciliacao documental

Os arquivos exigidos no prompt original nao existem com esses nomes no workspace em 2026-04-11:

- `audit/source_of_truth.md`
- `audit/master_backlog_revalidated.md`
- `audit/readiness_matrix.md`
- `audit/reconciliation_report.md`
- `audit/phase1_execution_summary.md`
- `audit/cycle2_execution_summary.md`
- `audit/cycle3_execution_summary.md`
- `audit/cycle4_execution_summary.md`

Por isso, o Ciclo 5 foi reconciliado contra as fontes canonicas locais listadas acima e contra evidencia direta de codigo, testes e snapshot de governanca. Nao houve invencao de "source of truth" adicional.

## Resumo executivo

- Todos os 15 agentes possuem `input_schema` e `output_schema` materializados em Zod e associados a `contract.yaml`.
- O endurecimento de coerencia entre contrato e implementacao melhorou: o snapshot atual aponta `contractAliasMismatch: 0` e `toolConstMismatch: 0`.
- O endurecimento continua parcial: `requestId` e obrigatorio em 15/15 contratos, mas nao e propagado pelo runtime; 14/15 agentes declaram `runtime_enforcement` e `runtime_cycle`, mas 0/14 aplicam esses campos no `agent.ts`.
- A superficie continua frouxa para auditoria: 14/15 `agent.ts`, 15/15 `schemas.ts` e 15/15 `tools.ts` ainda usam `// @ts-nocheck`.
- `any` literal nao foi reduzido de forma material e comprovavel dentro dos agentes executivos. A reducao concreta desta rodada foi de supressoes `@ts-nocheck` em `packages/agent-runtime`, em seu teste e em exports de `packages/agents-core`.

## Hardening materializado nesta rodada

- `packages/agent-runtime/index.ts`
  - Tipagem explicita de `RuntimeEventType`, `RuntimeEventMetadata` e `RuntimeEvent`.
  - Rejeicao de `duplicate_step:<id>` e `self_dependency:<id>` em `RuntimeGraph.addStep`.
- `packages/agent-runtime/src/__tests__/runtime.test.ts`
  - Cobertura de duplicidade de step e auto-dependencia.
- `packages/agents-core/src/index.ts`
- `packages/agents-core/src/execution/index.ts`
- `packages/agents-core/src/manifest/index.ts`
- `packages/agents-core/src/runtime/index.ts`
- `packages/agents-core/src/skills/index.ts`
- `packages/agents-core/src/tools/index.ts`
- `packages/agents-core/src/types/index.ts`
  - Remocao de `@ts-nocheck` nas superficies de export e runtime.
- `scripts/audit/executive-agents-governance.mjs`
  - Nova auditoria automatizada de contratos, fallback, observabilidade e maturidade dos agentes executivos.
- `package.json`
  - Novo script `audit:agents:governance`.
- Contrato/default/tool identity normalizados nos agentes:
  - `capital-allocator`
  - `churn-deflector`
  - `crisis-navigator`
  - `culture-pulse`
  - `expansion-mapper`
  - `market-sentinel`
  - `pipeline-oracle`
  - `pricing-optimizer`

## Revisao de contratos I/O

| Controle | Resultado | Evidencia | Leitura |
| --- | --- | --- | --- |
| Presenca de `input_schema` | 15/15 ok | `contract.yaml` + `*InputSchema` | A camada publica de entrada existe em todos os agentes. |
| Presenca de `output_schema` | 15/15 ok | `contract.yaml` + `*OutputSchema` | A resposta publica esta formalizada em todos os agentes. |
| Coerencia de default contract importado | 15/15 ok | snapshot de governanca | Os aliases frouxos de contrato foram eliminados no estado atual. |
| Coerencia de tool ids importados | 15/15 ok | snapshot de governanca | O risco de copy-paste entre `*_TOOL_IDS` caiu para zero no snapshot atual. |
| `requestId` declarado e usado | 0/15 ok | `requestId` em schema; ausencia no runtime; snapshot | O contrato exige rastreabilidade, mas a execucao nao a materializa. |
| `runtime_enforcement` / `runtime_cycle` declarados e aplicados | 0/14 ok | `contract.yaml` vs `agent.ts`; snapshot | A governanca existe como metadado morto, nao como regra operacional. |
| Teste dedicado de schema | 14/15 ok | ausencia de `boardprep-ai/tests/test_schema.ts` | O contrato publico de `boardprep-ai` esta menos defendido contra regressao. |
| Superficie tipada sem supressao | 0/15 ok | `// @ts-nocheck` em `agent.ts`/`schemas.ts`/`tools.ts` | A auditoria estatica do contrato ainda depende de supressao generalizada. |

## Coerencia F1-F5

Nao ha marcacao explicita de fases F1-F5 nos contratos dos agentes executivos. A validacao "F1-F5 quando aplicavel" ficou limitada ao fluxo inferivel no codigo:

- F1: validacao de input via Zod.
- F2: carga do contrato e classificacao da origem.
- F3: execucao de ferramentas com retry local.
- F4: normalizacao de fallback e resposta.
- F5: emissao de eventos de observabilidade no output.

Essa sequencia e observavel, mas nao e auditavel por fase de forma soberana porque:

- nao existe marcador F1-F5 nos YAMLs;
- nao existe telemetria por fase com `requestId`;
- nao existe policy runtime comum que valide a transicao entre fases.

Conclusao: a coerencia F1-F5 e apenas parcial e nao suporta declaracao de prontidao operacional.

## Contratos ainda frouxos ou incompletos

- `requestId` e tratado como requisito de contrato, mas nao como correlacao real de runtime.
- `runtime_enforcement` e `runtime_cycle` aparecem em 14 contratos e nao dirigem comportamento executavel.
- `human_handoff` existe como modo de falha, mas nao sustenta governanca centralizada de execucao por si so.
- As superficies principais continuam sob `@ts-nocheck`, o que reduz a confianca na aderencia entre contrato e implementacao.

## Conclusao honesta

O sistema de contratos dos agentes executivos esta melhor do que no ciclo anterior em coerencia nominal e em guardrails do runtime compartilhado, mas ainda nao esta duro o suficiente para auditoria operacional. O estado atual e de contrato estruturalmente definido, porem nao plenamente rastreavel, nao plenamente tipado e nao plenamente governado em execucao.
