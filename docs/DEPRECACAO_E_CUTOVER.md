# Deprecacao e cutover

## Servicos em sunset

- `apps/dashboard`
- `packages/db`
- rotas/auth naming `nextauth` (renomeado para `session`)

## Regra de go-live em 2026-03-20

- o lancamento oficial considera apenas `apps/web`, `apps/api`, `apps/worker` e `packages/database`
- `apps/dashboard`, `packages/db`, `apps/api-gateway`, `apps/agent-orchestrator`, `apps/voice-engine` e `apps/webhook-receiver` nao entram no criterio de pronto do go-live
- qualquer dependencia comercial real de uma dessas superficies promove o componente imediatamente para P0 e para o mesmo gate do core

## Politica

- manter por janela de transicao
- bloquear novos usos via CI (doctor)
- remover apos zero consumers
