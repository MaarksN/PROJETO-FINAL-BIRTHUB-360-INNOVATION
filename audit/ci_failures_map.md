<!-- [SOURCE] CI-MAP-001 -->
# CI Failures Map

Data de geração: 2026-03-20T12:35:00Z
Escopo: pacotes workspace com script `typecheck` (`corepack pnpm --filter <pkg> typecheck`).
Resultado agregado: **16 PASS / 1 FAIL** (detalhe bruto em `artifacts/typecheck_matrix.json`).

## Tabela de Falhas e Tratativas
| Pacote | Tipo de erro | Arquivo | Erro exato | Causa raiz | Status |
|---|---|---|---|---|---|
| `@birthub/queue` | TypeScript `exactOptionalPropertyTypes` + incompatibilidade de tipo Redis | `packages/queue/index.ts`, `packages/queue/src/index.ts`, `packages/queue/package.json` | `TS2375` em `priority`, `TS2322` em `ConnectionOptions` (`ioredis` duplicado 5.10 vs 5.9) | Propriedades opcionais passadas como `undefined` + versão de `ioredis` divergente da usada por `bullmq` | **RESOLVIDO (2026-03-20)** |
| `@birthub/agents-core` | Ausência de script padronizado para checagem isolada | `packages/agents-core/package.json` | `None of the selected packages has a "typecheck" script` (na execução por filtro) | Script `typecheck` inexistente no pacote | **RESOLVIDO (2026-03-20)** |
| `@birthub/db` | Module resolution | `packages/db/tsconfig.json`, `packages/db/src/index.ts`, `packages/db/package.json` | `TS2307: Cannot find module '@birthub/database'` | `baseUrl` local sobrescrevendo resolução herdada e impedindo path mapping do monorepo | **RESOLVIDO (2026-03-20)** |
| `@birthub/llm-client` | Export ausente + teste incompatível com API atual | `packages/llm-client/src/index.ts`, `packages/llm-client/test-llm.ts`, `packages/llm-client/package.json` | `TS2459` (`GeminiClient` não exportado), `TS2554` e `TS2339` no `test-llm.ts` | Barrel sem export explícito e script de teste usando assinatura/método antigos | **RESOLVIDO (2026-03-20)** |
| `@birthub/api` | Benchmark fora do contrato atual | `apps/api/test/benchmarks/pack-installer.benchmark.ts` | `TS2345` (falta `actorId` em `updatePackVersion`) | Assinatura do serviço evoluiu e benchmark não acompanhou | **RESOLVIDO (2026-03-20)** |
| `@birthub/worker` | Arquivo-fonte sobrescrito por testes + tipagem estrita em testes | `apps/worker/src/webhooks/outbound.ts`, `apps/worker/test/outbound.webhooks.test.ts` | Exportações ausentes de `outbound.ts`, `TS2532/TS7053` em testes | `src/webhooks/outbound.ts` continha testes em vez da implementação | **RESOLVIDO (2026-03-20)** |
| `@birthub/dashboard` | Falha estrutural de tipo/módulo (multi-arquivo) | `apps/dashboard/**` | Exemplos: `TS2307` (`@/lib/data`, `clsx`), `TS2305` (`@birthub/db` sem exports esperados), `TS7006`, `TS2532`, erro de `moduleResolution` no `tailwind.config.ts` | Divergência estrutural (imports, alias, dependências e contrato com DB) além de ajuste pontual | **PENDENTE — BLOQUEIO** (ver `audit/human_required/CI-TS-004_dashboard_logic_conflict.md`) |

## Cobertura dos Demais Pacotes com Typecheck
Pacotes em **PASS** no snapshot atual: `@birthub/agents-core`, `@birthub/agents-registry`, `@birthub/api`, `@birthub/api-gateway`, `@birthub/config`, `@birthub/database`, `@birthub/db`, `@birthub/llm-client`, `@birthub/logger`, `@birthub/queue`, `@birthub/testing`, `@birthub/voice-engine`, `@birthub/web`, `@birthub/worker`, `@birthub/workflows-core`, `orchestrator-worker`.

## Estado de Pipeline
- **CI local (typecheck por pacote): não verde** por pendência única em `@birthub/dashboard`.
- Próxima ação para verde total depende de decisão de escopo registrada em `audit/human_required/CI-TS-004_dashboard_logic_conflict.md`.
- **Observação complementar (GAP-DASH-003):** `apps/dashboard/package.json` agora expõe `test:e2e`, porém o typecheck estrutural do dashboard segue bloqueando verde global.
