# Migração canônica de banco

## Origem e destino
- Origem: `@birthub/db` (legado).
- Destino: `@birthub/database` (canônico).

## Mudanças realizadas
- Imports migrados em `apps/api-gateway`, `apps/agent-orchestrator` e `apps/dashboard`.
- `packages/db` mantido como shim (`export * from '@birthub/database'`).

## Validação
- `pnpm db:generate`
- `pnpm monorepo:doctor`
- `git grep "@birthub/db" -- apps packages agents`

## Cutover
1. Proibir novos imports `@birthub/db` (doctor/CI).
2. Migrar remanescentes do dashboard e demais satelites.
3. Restringir `@birthub/db` ao pacote de compatibilidade `packages/db`.
4. Remover `packages/db` quando nao houver mais consumidores runtime.
