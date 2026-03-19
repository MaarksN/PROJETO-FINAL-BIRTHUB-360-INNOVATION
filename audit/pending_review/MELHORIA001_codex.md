# MELHORIA001 — Fallback Canônico (Codex)

## Escopo Executado
- Fallback canônico aplicado no runtime compartilhado dos agentes Python:
  - `tool unavailable` => retry 3x com backoff exponencial
  - `HTTP 429` => wait declarado no fallback + retry 1x
  - esgotado => notificação humana obrigatória
- `fallback_behavior` aplicado em todos os `manifest.json` da coleção corporativa (43 arquivos).

## Compatibilidade Retroativa (OBS-01)
- Decisão documentada:
  - `required_tools` ausente => `[]`
  - `fallback_behavior` ausente => política canônica acima

## Arquivos Alterados
- `agents/shared/tool_runtime.py`
- `agents/shared/tests/test_tool_runtime.py`
- `packages/agent-packs/corporate-v1/**/manifest.json` (43 arquivos)
- `packages/agents-core/src/manifest/schema.ts`
- `packages/agents-core/src/schemas/manifest.schema.ts`

## Testes Executados
- `python -m pytest agents/shared/tests/test_tool_runtime.py -q`
  - Resultado: passando
- Parse de manifests atualizado com schema:
  - resultado: `parsed 43`

## Rastreabilidade [SOURCE]
- Código: comentários `[SOURCE]` adicionados nos arquivos de código alterados.
- JSON: rastreabilidade documentada neste artefato, sem comentário inline no manifest.
