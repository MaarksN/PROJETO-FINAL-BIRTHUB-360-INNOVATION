<!-- [SOURCE] BirthHub360_Agentes_Parallel_Plan - CapitalAllocator -->
# Ciclo 1 - CapitalAllocator - Entrega Codex (F5)

## Arquivos criados

- `packages/agents/executivos/capitalallocator/agent.ts`
- `packages/agents/executivos/capitalallocator/schemas.ts`
- `packages/agents/executivos/capitalallocator/tools.ts`
- `packages/agents/executivos/capitalallocator/tests/test_unit.ts`
- `packages/agents/executivos/capitalallocator/tests/test_schema.ts`
- `packages/agents/executivos/capitalallocator/seeds/dev_seed.json`

## Testes executados

1. `node scripts/ci/run-pnpm.mjs --filter @birthub/agents typecheck`
2. `node scripts/ci/run-pnpm.mjs --filter @birthub/agents test`

## Evidencia objetiva

- Typecheck do pacote `@birthub/agents` concluiu sem erros.
- Suite de testes do pacote concluiu com `20/20` casos passando.
- Casos cobertos para `CapitalAllocator`:
  - happy path com output `status=success`
  - falha de ferramentas com `failureMode=hard_fail` resultando em `status=error`
  - rejeicao de input incompleto na fronteira de schema
  - rejeicao de campo extra no runtime
- Retry exponencial e fallback confirmados via metricas e eventos:
  - `capitalallocator.retry.scheduled`
  - `capitalallocator.fallback.applied`
- Resolucao de contrato aplicada em ordem:
  1. `audit/pending_review/ciclo1_capitalallocator/contract.yaml`
  2. `packages/agents/executives/CapitalAllocator/contract.yaml`
  3. `DEFAULT_CAPITALALLOCATOR_CONTRACT`

## Estado de contrato Jules

- Nao encontrado:
  - `audit/pending_review/ciclo1_capitalallocator/contract.yaml`
  - `packages/agents/executives/CapitalAllocator/contract.yaml`
- O agente executa com `DEFAULT_CAPITALALLOCATOR_CONTRACT` quando contrato do Jules nao esta disponivel.
