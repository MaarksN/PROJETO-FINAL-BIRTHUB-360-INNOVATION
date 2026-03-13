# CHECKLIST_MASTER.md

## Convenções

- `Vermelho`: item não criado ou sem fonte de verdade.
- `Azul`: executado pelo CODEX, aguardando validação independente.
- `Amarelo`: validado com melhorias.
- `Verde`: pronto para uso.

## Ciclo 1 — Itens CODEX (50)

| ID | Status | Executor | Evidência | touched_paths |
|---|---|---|---|---|
| 1.1.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-A1]` | Turborepo ajustado para `apps/web`, `apps/api` e `apps/worker`. | `package.json`, `turbo.json`, `apps/web`, `apps/api`, `apps/worker` |
| 1.1.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-A2]` | `tsconfig.base.json` em strict com paths para os novos packages. | `tsconfig.base.json`, `tsconfig.json` |
| 1.1.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-A3]` | ESLint central com TypeScript e `import/order`. | `eslint.config.mjs`, `package.json` |
| 1.1.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-A4]` | Prettier compartilhado em `packages/config/prettier`. | `prettier.config.cjs`, `packages/config/prettier/index.cjs` |
| 1.1.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-A5]` | Script raiz `dev` sobe `web`, `api` e `worker` em paralelo via Turbo. | `package.json`, `turbo.json` |
| 1.2.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-B1]` | Workflow CI com `lint`, `typecheck`, `test` e `build` paralelos. | `.github/workflows/ci.yml` |
| 1.2.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-B2]` | Cache `.turbo` configurado no CI. | `.github/workflows/ci.yml` |
| 1.2.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-B3]` | `gitleaks` adicionado como gate bloqueante. | `.github/workflows/ci.yml`, `.gitleaks.toml` |
| 1.2.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-B4]` | Branch protection declarativa criada para `main`. | `.github/settings.yml` |
| 1.2.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-B5]` | Workflow separado de security scan com Semgrep e Dependency Check. | `.github/workflows/security-scan.yml` |
| 1.3.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-C1]` | Logger estruturado com `requestId`, `tenantId`, `userId`, `level`. | `packages/logger/src/index.ts` |
| 1.3.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-C2]` | Sentry client-side e replay configurados no web. | `apps/web/instrumentation-client.ts`, `apps/web/app/global-error.tsx`, `apps/web/sentry.server.config.ts` |
| 1.3.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-C3]` | Sentry server-side configurado no API com captura de exceções e request context. | `apps/api/src/observability/sentry.ts`, `apps/api/src/server.ts` |
| 1.3.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-C4]` | OpenTelemetry SDK instalado com auto-instrumentação HTTP e Prisma. | `apps/api/src/observability/otel.ts`, `apps/api/package.json` |
| 1.3.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-C5]` | Propagação de `requestId` entre web, api e worker. | `apps/web/middleware.ts`, `apps/api/src/middleware/request-context.ts`, `apps/api/src/app.ts`, `apps/worker/src/worker.ts` |
| 1.4.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-D1]` | `api.config.ts` criado com validação Zod completa. | `packages/config/src/api.config.ts` |
| 1.4.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-D2]` | `web.config.ts` criado com validação Zod para Next.js. | `packages/config/src/web.config.ts` |
| 1.4.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-D3]` | `worker.config.ts` criado com validação Zod. | `packages/config/src/worker.config.ts` |
| 1.4.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-D4]` | `.env.example` expandido com comentário em cada variável. | `.env.example` |
| 1.4.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-D5]` | Startup validation integrada em API e worker. | `apps/api/src/server.ts`, `apps/worker/src/index.ts` |
| 1.5.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-E1]` | Security headers configurados no Next.js. | `apps/web/next.config.ts` |
| 1.5.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-E2]` | CORS com allowlist explícita por ambiente. | `apps/api/src/app.ts`, `packages/config/src/api.config.ts` |
| 1.5.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-E3]` | Rate limiting por IP com 429 e `Retry-After`. | `apps/api/src/middleware/rate-limit.ts` |
| 1.5.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-E4]` | Helmet e sanitização aplicados no API. | `apps/api/src/app.ts`, `apps/api/src/middleware/sanitize-input.ts` |
| 1.5.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-E5]` | Validação de `Content-Type` implementada. | `apps/api/src/middleware/content-type.ts` |
| 1.6.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-F1]` | Postgres via `docker-compose` com healthcheck e volume nomeado. | `docker-compose.yml` |
| 1.6.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-F2]` | Schema Prisma inicial com `User`, `Organization`, `Membership`, `Session`. | `packages/database/prisma/schema.prisma` |
| 1.6.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-F3]` | Primeira migration criada; validação prática pendente de execução local. | `packages/database/prisma/migrations/20260313000100_cycle1_foundation/migration.sql` |
| 1.6.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-F4]` | Seed com 2 orgs e 3 usuários por org criada. | `packages/database/prisma/seed.ts` |
| 1.6.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-F5]` | Prisma client singleton criado em `packages/database/src/client.ts`. | `packages/database/src/client.ts` |
| 1.7.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-G1]` | RFC 7807 aplicado ao tratamento de erro do API. | `apps/api/src/lib/problem-details.ts`, `apps/api/src/middleware/error-handler.ts` |
| 1.7.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-G2]` | DTOs Zod definidos para todos os endpoints de mutação do novo API. | `packages/config/src/contracts.ts`, `apps/api/src/middleware/validate-body.ts` |
| 1.7.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-G3]` | Request context middleware injeta `tenantId`, `userId`, `requestId`. | `apps/api/src/middleware/request-context.ts` |
| 1.7.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-G4]` | Swagger/OpenAPI em JSON e UI com exemplos automáticos. | `apps/api/src/docs/openapi.ts`, `apps/api/src/app.ts` |
| 1.7.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-G5]` | Endpoint de health check criado com DB, Redis e dependências externas. | `apps/api/src/lib/health.ts`, `apps/api/src/app.ts` |
| 1.8.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-H1]` | Smoke test do health endpoint criado. | `apps/api/tests/health.smoke.test.ts` |
| 1.8.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-H2]` | Smoke test de hidratação da tela de login criado. | `apps/web/tests/login.smoke.test.ts` |
| 1.8.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-H3]` | Banco de teste isolado provisionado por schema efêmero e seed automático. | `packages/testing/src/test-db.ts` |
| 1.8.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-H4]` | Factories para `User`, `Organization` e `Membership`. | `packages/testing/src/factories.ts` |
| 1.8.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-H5]` | Base preparada para paralelismo sem estado compartilhado via schema único. | `packages/testing/src/test-db.ts` |
| 1.9.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-I1]` | Swagger exposto em `/api/docs` no dev. | `apps/api/src/app.ts` |
| 1.9.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-I2]` | `setup-local.sh` criado para bootstrap em um comando. | `scripts/setup/setup-local.sh` |
| 1.9.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-I3]` | `docs/ARCHITECTURE.md` criado com diagrama e responsabilidades. | `docs/ARCHITECTURE.md` |
| 1.9.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-I4]` | README raiz atualizado com badges, docs e quick start. | `README.md` |
| 1.9.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-I5]` | `reset-local.sh` criado para reset + seed. | `scripts/seed/reset-local.sh` |
| 1.10.C1 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-J1]` | Checklist mestre recriado com estado real do ciclo. | `CHECKLIST_MASTER.md` |
| 1.10.C2 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-J2]` | Log de execução criado com datas e evidências. | `CHECKLIST_LOG.md` |
| 1.10.C3 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-J3]` | 10 ADRs do Jules referenciados no código novo. | `apps/api/src/middleware/request-context.ts`, `packages/database/src/client.ts`, `apps/api/src/observability/otel.ts`, `apps/api/src/app.ts`, `apps/worker/src/worker.ts`, `apps/api/src/docs/openapi.ts` |
| 1.10.C4 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-J4]` | Smoke tests preparados; execução local ainda depende de instalação/serviços. | `apps/api/tests/health.smoke.test.ts`, `apps/web/tests/login.smoke.test.ts`, `apps/worker/src/worker.test.ts` |
| 1.10.C5 | Azul | CODEX `[SIG: CODEX-C1-EXEC-20260313-J5]` | `setup-local.sh` criado, mas validação em máquina limpa permanece pendente. | `scripts/setup/setup-local.sh` |

## Ciclo 1 — Itens JULES (50)

Fonte oficial dos 50 itens `J*` do Ciclo 1 não foi localizada no workspace atual em 2026-03-13. Para não inventar backlog, os slots permanecem rastreados como pendência de governança.

| ID | Status | Observação |
|---|---|---|
| 1.1.J1 a 1.10.J5 | Vermelho | Backlog JULES do Ciclo 1 ausente no repositório local; requer fonte oficial para rastreabilidade correta. |

## Ciclo 2 — Checkboxes CODEX (50)

- [x] 2.1.C1
- [x] 2.1.C2
- [x] 2.1.C3
- [x] 2.1.C4
- [x] 2.1.C5
- [x] 2.2.C1
- [x] 2.2.C2
- [x] 2.2.C3
- [x] 2.2.C4
- [x] 2.2.C5
- [x] 2.3.C1
- [x] 2.3.C2
- [x] 2.3.C3
- [x] 2.3.C4
- [x] 2.3.C5
- [x] 2.4.C1
- [x] 2.4.C2
- [x] 2.4.C3
- [x] 2.4.C4
- [x] 2.4.C5
- [x] 2.5.C1
- [x] 2.5.C2
- [x] 2.5.C3
- [x] 2.5.C4
- [x] 2.5.C5
- [x] 2.6.C1
- [x] 2.6.C2
- [x] 2.6.C3
- [x] 2.6.C4
- [x] 2.6.C5
- [x] 2.7.C1
- [x] 2.7.C2
- [x] 2.7.C3
- [x] 2.7.C4
- [x] 2.7.C5
- [x] 2.8.C1
- [x] 2.8.C2
- [x] 2.8.C3
- [x] 2.8.C4
- [x] 2.8.C5
- [x] 2.9.C1
- [x] 2.9.C2
- [x] 2.9.C3
- [x] 2.9.C4
- [x] 2.9.C5
- [x] 2.10.C1
- [x] 2.10.C2
- [x] 2.10.C3
- [x] 2.10.C4
- [x] 2.10.C5
