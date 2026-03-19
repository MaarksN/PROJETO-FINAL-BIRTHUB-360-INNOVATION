<!-- [SOURCE] BirthHub360_Agentes_Parallel_Plan — BoardPrep AI -->
# Ciclo 1 - BoardPrep AI - Correcao Jules

Tag: `[AGUARDA VALIDACAO CODEX]`

## Correcao aplicada
- Consolidado caminho canônico em `packages/agents/executivos/boardprep-ai`.
- `contract.yaml` e `system_prompt.md` adicionados no caminho canônico com rastreabilidade `[SOURCE]`.
- Contrato canônico atualizado com:
  - `runtime_enforcement: false`
  - `runtime_cycle: 16`
  - `toolIds`, `retry`, `failureMode`, `fallback_behavior` e `observability`.
- Teste adicionado para validar que o runtime padrão carrega contrato com `boardprep.contract.loaded.details.source === "file"`.

## Evidencias
- `corepack pnpm --filter @birthub/agents typecheck` -> PASS.
- `corepack pnpm --filter @birthub/agents test` -> PASS.
- Probe runtime padrão:
  - Comando: `corepack pnpm --filter @birthub/agents exec node --import tsx -e "...BoardPrepAIAgent..."`
  - Saída: `CONTRACT_SOURCE=file`.
- Varredura de arquivos não encontrou `executives/BoardPrepAI` para BoardPrep.
- `contract.yaml` e `system_prompt.md` no caminho canônico contêm `[SOURCE]`.
