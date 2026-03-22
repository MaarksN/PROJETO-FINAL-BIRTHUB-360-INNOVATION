# Artifacts Policy

A pasta `artifacts/` guarda apenas evidências formais, relatórios estruturais e snapshots auditáveis.

## Categorias versionadas

- `doctor/`: relatórios de saúde estrutural do monorepo
- `release/`: saídas formais de preflight, smoke, scorecard e migração
- `security/`: evidências de segurança e scans
- `privacy/`: relatórios de verificação de privacidade
- `workflows/`: evidências aprovadas de workflow
- `f*-*/`: baselines e evidências congeladas por fase
- `untracked_agents_snapshot/`: snapshots históricos necessários para auditoria

## Não versionar

- logs transitórios
- dumps de banco
- `.env`
- arquivos temporários (`.tmp`, `.bak`, `.swp`)
- saídas locais de runtime

## Retenção

- arquivos não rastreados com mais de 90 dias podem ser removidos por `pnpm artifacts:clean -- --apply`
- snapshots históricos mantidos em Git devem continuar acompanhados por contexto de auditoria ou release
