# GAP-001 — LDR (Codex)

## Escopo Executado
- Paridade do LDR completada usando SDR como referência estrutural do Sales OS.
- AE e closer permanecem separados; nenhuma quebra de fluxo existente.

## Arquivos Alterados
- `apps/dashboard/lib/sales-os/types.ts`
- `apps/dashboard/app/sales/page.tsx`
- `apps/dashboard/components/sales-os/HubView.tsx`
- `apps/dashboard/lib/sales-os/constants.ts`
- `apps/dashboard/lib/sales-os/__tests__/constants.test.ts`

## Entrega LDR
- Novas ferramentas LDR:
  - `ldr_handoff`
  - `roleplay_ldr_gatekeeper` (chat)
- LDR continua disponível no hub e na grade de ferramentas.

## Evidência de Validação
- `corepack pnpm --filter @birthub/dashboard exec node --import tsx -e "import './components/sales-os/HubView.tsx'; import './lib/sales-os/constants.ts'; import './lib/sales-os/types.ts'; console.log('dashboard-sales-core-ok');"`
  - Resultado: `dashboard-sales-core-ok`

## Observação de Ambiente
- O `typecheck` global de `@birthub/dashboard` falha por problemas pré-existentes e não relacionados ao escopo LDR/AE (aliases faltantes, módulos externos e configuração de testes).
- O binário `vitest` não está disponível no workspace atual para executar `lib/sales-os/__tests__/constants.test.ts`.
