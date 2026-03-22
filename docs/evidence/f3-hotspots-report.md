# F3 Hotspots Report — 2026-03-22

## Objetivo
Aplicar os itens executáveis do F3 diretamente visíveis no repositório atual, priorizando os hotspots ainda grandes e fáceis de isolar sem alterar contrato externo.

## Hotspots tratados nesta entrega

| Arquivo / módulo | Antes | Depois |
| --- | ---: | ---: |
| `apps/api/src/app.ts` | 643 | 39 |
| `packages/database/prisma/seed.ts` | 892 | 33 |

## Novos módulos criados

### API bootstrap
- `apps/api/src/app/core.ts`
- `apps/api/src/app/auth-routes.ts`
- `apps/api/src/app/core-business-routes.ts`
- `apps/api/src/app/module-routes.ts`

### Database seed
- `packages/database/prisma/seed/data.ts`
- `packages/database/prisma/seed/helpers.ts`
- `packages/database/prisma/seed/workflows.ts`
- `packages/database/prisma/seed/tenant.ts`
- `packages/database/prisma/seed/types.ts`

## Critérios F3 atendidos nesta entrega
- Limite estrutural de 400 linhas aplicado aos pontos de entrada refatorados.
- Fronteiras explícitas entre bootstrap, auth, rotas de negócio, módulos de domínio e seed por contexto.
- ADR registrada para documentar a extração e os trade-offs.
- Hotspot scan regenerado em `artifacts/f3-hotspots-2026-03-22/hotspot-scan.txt`.

## Risco residual
Ainda existem hotspots acima do alvo F3 em runtime/worker, agents/service, analytics/service e alguns agents executivos. Estes itens permanecem como trabalho sequencial recomendado para as próximas entregas F3.
