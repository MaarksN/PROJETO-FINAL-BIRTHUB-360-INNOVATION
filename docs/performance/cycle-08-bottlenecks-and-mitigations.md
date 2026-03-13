# Ciclo 08 - Gargalos e Mitigacoes

## Gargalo 1: Consulta repetida de tenant no middleware

Sintoma:

- Requests com o mesmo tenant repetiam leitura no banco.

Mitigacao aplicada:

- Cache Redis/InMemory de `tenant:{id}` com TTL de 5 minutos.
- Reuso por `id`, `tenantId` e `slug`.

Arquivos:

- `apps/api/src/common/cache/tenant-cache.ts`
- `apps/api/src/middlewares/tenantContext.ts`

## Gargalo 2: Dados obsoletos no cache apos mutacoes

Sintoma:

- Atualizacao/delecao de `Organization`/`User` poderia deixar cache desatualizado.

Mitigacao aplicada:

- Invalidation em mutacoes de `Organization` e `User`.
- Fallback para wrapping de delegates quando `prisma.$use` nao esta disponivel no runtime.

Arquivos:

- `apps/api/src/common/cache/prisma-cache-invalidation.ts`
- `apps/api/src/app.ts`

## Gargalo 3: Respostas estaticas sem cache HTTP

Sintoma:

- Rotas de catalogo retornavam payload completo em toda chamada.

Mitigacao aplicada:

- ETag por hash do body.
- `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
- Resposta `304 Not Modified` quando `If-None-Match` bate.

Arquivos:

- `apps/api/src/common/cache/http-cache.ts`
- `apps/api/src/modules/marketplace/marketplace-routes.ts`

## Gargalo 4: Ingestao sem backpressure

Sintoma:

- API enfileirava jobs sem limite de backlog.

Mitigacao aplicada:

- Bloqueio de enqueue quando pending jobs >= `QUEUE_BACKPRESSURE_THRESHOLD` (default `10000`).
- Retorno HTTP `503` no endpoint de tasks.

Arquivos:

- `apps/api/src/lib/queue.ts`
- `apps/api/src/app.ts`
- `packages/config/src/api.config.ts`
- `.env.example`

## Gargalo 5: Frontend sem SWR efetivo

Sintoma:

- Uso extensivo de `cache: "no-store"` na dashboard.

Mitigacao aplicada:

- SWR com `revalidateIfStale`, `keepPreviousData`, `dedupingInterval`.
- Fetch server-side com `revalidate` para comportamento stale-while-revalidate.

Arquivos:

- `apps/dashboard/lib/dashboard-data.ts`
- `apps/dashboard/lib/api.ts`

## Gargalo 6: Carga nao executada por dependencia de ambiente

Sintoma:

- `k6` ausente.
- Redis local indisponivel para teste de overload.

Mitigacao aplicada:

- Scripts criados e versionados para execucao em ambiente com infraestrutura ativa:
  - `scripts/load-tests/stress.js`
  - `scripts/load-tests/worker-overload.ts`

Recomendacao:

1. Subir `redis` e `postgres` via `docker-compose`.
2. Executar `pnpm test:worker:overload`.
3. Instalar `k6` e executar `pnpm test:load:k6`.
