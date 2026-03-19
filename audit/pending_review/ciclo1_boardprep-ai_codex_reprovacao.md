<!-- [SOURCE] Validação técnica CODEX — Ciclo 1 BoardPrep AI -->
# Ciclo 1 - BoardPrep AI - Reprovação Codex

## Veredito
- Resultado: `REPROVADO`
- Motivo: risco estrutural não declarado com contrato fora do runtime padrão e fonte de verdade ambígua.

## Checklist de Correção para Jules
- Consolidar BoardPrep AI apenas em `packages/agents/executivos/boardprep-ai` (path canônico decidido).
- Eliminar modo dual de paths para BoardPrep (`executives/BoardPrepAI` não pode permanecer como segunda fonte de verdade).
- Tornar `contract.yaml` dentro do path canônico a única fonte de verdade de contrato.
- Ajustar resolução padrão de contrato no agente para apontar para o `contract.yaml` canônico do pacote.
- Garantir que execução padrão carregue contrato em `source=file` quando o arquivo existir.
- Incluir rastreabilidade `[SOURCE]` em `contract.yaml` e `system_prompt.md`.
- Atualizar testes para cobrir explicitamente o carregamento de contrato via caminho padrão canônico.

## Evidência da Reprovação (Codex)
- `corepack pnpm --filter @birthub/agents typecheck` passou.
- `corepack pnpm --filter @birthub/agents test` passou.
- Probe de runtime padrão:
  - saída observada: `CONTRACT_SOURCE=default`
  - esperado para aprovação: `CONTRACT_SOURCE=file` (com contrato presente no pacote canônico).
- Duplicidade presente no repositório:
  - `packages/agents/executivos/boardprep-ai`
  - `packages/agents/executives/BoardPrepAI`
- Falta de rastreabilidade:
  - `packages/agents/executives/BoardPrepAI/contract.yaml` sem `[SOURCE]`
  - `packages/agents/executives/BoardPrepAI/system_prompt.md` sem `[SOURCE]`

## Revalidação Codex (após correção Jules)
1. `corepack pnpm --filter @birthub/agents typecheck`
2. `corepack pnpm --filter @birthub/agents test`
3. Probe de runtime com instância padrão de `BoardPrepAIAgent` e validação de `boardprep.contract.loaded.details.source === "file"`
4. Varredura de árvore para confirmar ausência de duplicidade BoardPrep entre `executivos` e `executives`
5. Verificação de `[SOURCE]` presente em `contract.yaml` e `system_prompt.md`
