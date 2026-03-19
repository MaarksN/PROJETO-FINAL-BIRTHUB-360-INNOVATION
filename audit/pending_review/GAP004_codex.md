# GAP-004 — required_tools em Manifests (Codex)

## Escopo Executado
- `required_tools` aplicado em todos os manifests de `packages/agent-packs/corporate-v1/**/manifest.json`.
- Schema/parser de manifests atualizado para suportar:
  - `required_tools: string[]`
  - `fallback_behavior` (também necessário por contrato compartilhado com M-002)

## Compatibilidade Retroativa (OBS-01)
- Decisão documentada:
  - `required_tools` ausente => default `[]`
  - `fallback_behavior` ausente => default política canônica M-001

## Rastreabilidade [SOURCE] para JSON
- JSON não aceita comentário `// [SOURCE]`.
- Rastreabilidade aplicada neste artefato (`GAP004_codex.md`) por decisão de governança aprovada.

## Evidência Técnica
- Manifests atualizados: `43`
- Validação por parser:
  - comando executado para parse em lote dos 43 manifests
  - resultado: `parsed 43`

## Arquivos de Código Alterados
- `packages/agents-core/src/manifest/schema.ts`
- `packages/agents-core/src/schemas/manifest.schema.ts`
- `packages/agents-core/src/__tests__/manifest-parser.test.ts`
- `packages/agents-core/src/__tests__/agent-api-manifest-parser.test.ts`

## Testes Executados
- `corepack pnpm --filter @birthub/agents-core exec node --import tsx --test "src/__tests__/manifest-parser.test.ts" "src/__tests__/agent-api-manifest-parser.test.ts"`
  - Resultado: passando
