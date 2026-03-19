# GAP-002 — AE (Codex)

## Escopo Executado
- Módulo `AE` adicionado explicitamente no dashboard.
- Compatibilidade preservada: `closer` mantido (sem rename global).

## Arquivos Alterados
- `apps/dashboard/lib/sales-os/types.ts`
- `apps/dashboard/app/sales/page.tsx`
- `apps/dashboard/components/sales-os/HubView.tsx`
- `apps/dashboard/lib/sales-os/constants.ts`
- `apps/dashboard/lib/sales-os/__tests__/constants.test.ts`

## Entrega AE
- Novo módulo `ae` no tipo `ModuleType`.
- Novo card AE no Hub.
- Novas ferramentas AE:
  - `ae_proposal_generator`
  - `ae_roi_calculator`
- Ferramentas de fechamento compartilhadas com AE sem remover `closer`:
  - `closer_warroom`
  - `roleplay_cfo`
  - `close_email`

## Evidência de Validação
- `corepack pnpm --filter @birthub/dashboard exec node --import tsx -e "import './components/sales-os/HubView.tsx'; import './lib/sales-os/constants.ts'; import './lib/sales-os/types.ts'; console.log('dashboard-sales-core-ok');"`
  - Resultado: `dashboard-sales-core-ok`

## Observação de Ambiente
- `@birthub/dashboard` apresenta falhas de `typecheck` pré-existentes e fora do escopo desta entrega.
- `vitest` indisponível no workspace para execução do teste de constantes.
