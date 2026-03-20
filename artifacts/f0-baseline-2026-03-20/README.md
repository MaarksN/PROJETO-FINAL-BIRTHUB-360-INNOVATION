# F0 Baseline Artifacts (2026-03-20)

Este diretório arquiva os logs dos comandos obrigatórios da fase F0.

## Logs

- `logs/01-install.log`
- `logs/02-monorepo-doctor.log`
- `logs/03-release-scorecard.log`
- `logs/04-lint-core.log` (**falhou**)
- `logs/05-typecheck-core.log` (**falhou**)
- `logs/06-test-core.log` (**falhou**)
- `logs/07-build-core.log` (**falhou**)

## Resultado consolidado

- **Status geral F0:** bloqueado.
- **Bloqueios ativos:** `lint:core`, `typecheck:core`, `test:core` e `build:core`.
- **Próximo passo obrigatório:** corrigir os erros no core (principalmente `apps/api`) e reexecutar a bateria completa F0 antes de iniciar F1.
