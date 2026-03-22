# Internal Packages Changelog

Use este arquivo quando qualquer `apps/*/package.json`, `packages/*/package.json` ou `agents/*/package.json` for alterado.

## 2026-03-22

### Repository hygiene baseline (F9)

- adicionados guardrails de branch, commit, naming, links e artifacts no CI
- documentadas políticas de naming, source of truth de documentação e aprovação de dependências
- consolidado o relatório de saúde estrutural do monorepo em `artifacts/doctor/`

### Runtime overlay script compliance (F4)

- adicionados `lint`, `typecheck`, `test` e `build` visíveis com `N/A` formal para `ae-agent-worker`, `analista-agent-worker`, `financeiro-agent-worker`, `juridico-agent-worker`, `ldr-agent-worker`, `marketing-agent-worker`, `pos_venda-agent-worker` e `sdr-agent-worker`
- alinhada `scripts/ci/script-compliance-policy.json` com o estado real de `@birthub/shared` e `@birthub/shared-types`
