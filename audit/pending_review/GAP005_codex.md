# GAP-005 — Credenciais Inline em Prompts (Codex)

## Escopo Executado
- Varredura de templates/prompts em:
  - `packages/agent-packs/**`
  - `agents/**`
- Padrões buscados:
  - `your API key`
  - `insert key`
  - `API_KEY`
  - `Bearer {token}`
  - `sk-...`

## Resultado
- Não foram encontradas credenciais inline em templates/prompts consumidos por LLM.
- Não houve necessidade de substituição de conteúdo neste item.

## Observação
- Referências a variáveis de ambiente em código de integração (não-prompt) não foram alteradas, pois o item restringe a remoção em templates/prompts.
