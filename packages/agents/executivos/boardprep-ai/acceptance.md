# [SOURCE] BirthHub360_Agentes_Parallel_Plan — BoardPrep AI
# Acceptance - BoardPrep AI

## Criterios tecnicos minimos
- O caminho canonico do agente e `packages/agents/executivos/boardprep-ai`.
- `contract.yaml`, `system_prompt.md` e `acceptance.md` existem no caminho canonico.
- O contrato define `runtime_enforcement: false` e `runtime_cycle: 16`.
- O contrato lista as ferramentas obrigatorias e politica de fallback.
- O runtime emite `boardprep.contract.loaded` durante a execucao.
- O pacote `@birthub/agents` passa em `typecheck` e `test`.

## Evidencias esperadas
- Snapshot do tree do diretorio canonico.
- Resultado de `corepack pnpm --filter @birthub/agents run typecheck`.
- Resultado de `corepack pnpm --filter @birthub/agents run test`.
