# GAP-003 — Output Schema Strict (Codex)

## Escopo Executado
- Aplicação de schema strict na fronteira de output do runtime ativo (`agents-core`), sem incluir `dist/.next`.
- Rejeição explícita de payload malformado na fronteira de validação.

## Arquivos Alterados
- `packages/agents-core/src/runtime/manifestRuntime.ts`
- `packages/agents-core/src/__tests__/manifest-runtime-output-schema.test.ts`

## Implementação
- Adicionado schema Zod strict para `AgentRuntimeOutput` e estruturas aninhadas.
- Adicionada função `parseAgentRuntimeOutput(input)` para validação de fronteira.
- `buildAgentRuntimeOutput` passa a validar o payload final com schema strict antes de retornar.

## Testes Executados
- `corepack pnpm --filter @birthub/agents-core exec node --import tsx --test "src/__tests__/manifest-runtime-output-schema.test.ts"`
  - Resultado: passando
- Cenário coberto:
  - payload válido aceito
  - payload malformado com campo extra (`rogue`) rejeitado
