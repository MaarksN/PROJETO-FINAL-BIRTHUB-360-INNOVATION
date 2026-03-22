# F9-433 — Naming duplicado `agents/pos_venda` vs `agents/pos-venda`

## Status
Parcial (materialização técnica aplicada)

## Evidência técnica materializada
- Controle automatizado: `scripts/diagnostics/materialize-doc-only-controls.mjs`
- Check implementado: `agent-naming-conflict-pos-venda`
- Regra objetiva aplicada:
  - Falha se coexistirem diretórios sem shim explícito de compatibilidade
  - Falha se `agents/pos-venda` contiver arquivos além de `main.py`
  - Passa somente quando o legado é estritamente shim de ponte
- Resultado atual do check:
  - `PASS` com `legacyAliasFiles=["agents/pos-venda/main.py"]`

## Evidência de execução
- Comando: `corepack pnpm audit:materialize:all`
- Relatório consolidado: `artifacts/materialization/doc-only-controls-report.md`
- Payload técnico: `artifacts/materialization/doc-only-controls-report.json`

## Observação de fechamento
A convergência para convenção única ainda requer migração coordenada dos contratos legados que referenciam `agents/pos-venda/main.py` (ex.: `scripts/ci/workspace-contract.json`). Nesta onda, o risco foi controlado por enforcement técnico bloqueante.