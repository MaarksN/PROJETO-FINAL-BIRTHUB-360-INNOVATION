# Processo de Regressão de Isolamento

**Quando Rodar:**
- A suíte completa e profunda E2E/Integração de isolamento roda em TODOS os PRs e em nightly builds no GitHub Actions (via `pnpm test`).
- Todo commit adicionado ao repositório aciona no CI:
  - Verificação de políticas RLS em todos os schemas.
  - Testes que invocam controllers de diferentes domínios e contextos cruzados garantindo o resultado 403 / 404 em invasões de perímetro lógico.
