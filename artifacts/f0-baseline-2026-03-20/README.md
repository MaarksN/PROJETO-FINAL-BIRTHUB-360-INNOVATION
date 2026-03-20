# F0 Baseline Artifacts (2026-03-20)

Este diretório arquiva os logs dos comandos obrigatórios da fase F0.

## Logs

- `logs/01-install-frozen-lockfile.log`
- `logs/02-monorepo-doctor.log`
- `logs/03-release-scorecard.log`
- `logs/04-lint-core.log` (**falhou**)
- `logs/05-typecheck-core.log`
- `logs/06-test-core.log`
- `logs/07-build-core.log`

## Resultado consolidado

- **Status geral F0:** bloqueado por `lint:core`.
- **Próximo passo:** corrigir lint no core e reexecutar bateria F0 completa.
