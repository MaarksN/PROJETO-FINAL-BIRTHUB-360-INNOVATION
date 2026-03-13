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

## Ciclo 7 — Billing, Assinaturas, Monetizacao

| ID | Status | Executor | Evidencia | touched_paths |
|---|---|---|---|---|
| 7.1.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-71C1]` | Prisma expandido com `Plan`, `Subscription`, `Invoice`, `PaymentMethod`, `UsageRecord`, `BillingEvent`. | `packages/database/prisma/schema.prisma`, `packages/database/prisma/migrations/20260313000300_cycle7_billing_foundation/migration.sql` |
| 7.1.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-71C2]` | Enum `SubscriptionStatus` alinhado para `trial`, `active`, `past_due`, `canceled`, `paused` com migration de conversao. | `packages/database/prisma/schema.prisma`, `packages/database/prisma/migrations/20260313000300_cycle7_billing_foundation/migration.sql` |
| 7.1.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-71C3]` | `Organization` recebeu `stripe_customer_id` e `plan_id` com indices e FK. | `packages/database/prisma/schema.prisma`, `packages/database/prisma/migrations/20260313000300_cycle7_billing_foundation/migration.sql` |
| 7.1.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-71C4]` | `UsageRecord` criado para metered billing por consumo. | `packages/database/prisma/schema.prisma`, `packages/database/prisma/seed.ts` |
| 7.1.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-71C5]` | Seed com planos `Starter`, `Professional`, `Enterprise` e limites JSON. | `packages/database/prisma/seed.ts` |
| 7.2.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-72C1]` | Cliente Stripe com chave validada por Zod e `apiVersion` fixa. | `apps/api/src/modules/billing/stripe.client.ts`, `packages/config/src/api.config.ts`, `.env.example` |
| 7.2.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-72C2]` | Criacao de org agora sincroniza `Customer` Stripe e persiste ID no DB dentro de transacao. | `apps/api/src/modules/organizations/service.ts`, `apps/api/src/modules/billing/service.ts`, `apps/api/src/app.ts` |
| 7.2.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-72C3]` | Endpoint checkout implementado em `/api/v1/billing/checkout` retornando URL Stripe Hosted Checkout. | `apps/api/src/modules/billing/router.ts`, `apps/api/src/modules/billing/service.ts` |
| 7.2.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-72C4]` | Endpoint `/api/v1/billing/portal` implementado para Customer Portal. | `apps/api/src/modules/billing/router.ts`, `apps/api/src/modules/billing/service.ts` |
| 7.2.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-72C5]` | Script `billing:sync` para sincronizar Products/Prices Stripe -> Plan local. | `apps/api/src/modules/billing/sync-plans.ts`, `apps/api/package.json`, `package.json` |
| 7.3.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-73C1]` | Rota publica `/api/webhooks/stripe` com `express.raw` e `constructEvent` estrito. | `apps/api/src/modules/webhooks/stripe.router.ts`, `apps/api/src/app.ts` |
| 7.3.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-73C2]` | `checkout.session.completed` ativa assinatura e atualiza plano/tenant. | `apps/api/src/modules/webhooks/stripe.router.ts` |
| 7.3.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-73C3]` | `invoice.payment_succeeded` persiste invoice paga e renova periodo da assinatura. | `apps/api/src/modules/webhooks/stripe.router.ts` |
| 7.3.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-73C4]` | `invoice.payment_failed` move para `past_due` e publica evento de dunning. | `apps/api/src/modules/webhooks/stripe.router.ts`, `apps/api/src/modules/billing/event-bus.ts` |
| 7.3.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-73C5]` | `customer.subscription.deleted` retorna para plano base/cancelado sem delecao de dados. | `apps/api/src/modules/webhooks/stripe.router.ts` |
| 7.4.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-74C1]` | Guard `RequireFeature('agents')` implementado com retorno 402. | `apps/api/src/common/guards/feature.guard.ts`, `apps/api/src/common/guards/index.ts` |
| 7.4.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-74C2]` | Limitacao de criacao de agentes no pack installer com `LimitExceededError`. | `apps/api/src/modules/packs/pack-installer.service.ts`, `apps/api/src/modules/billing/limit-exceeded.error.ts`, `apps/api/src/modules/packs/pack-installer-routes.ts` |
| 7.4.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-74C3]` | Worker bloqueia execucao quando tenant `past_due` fora do grace period (cache 1 min). | `apps/worker/src/worker.ts`, `packages/config/src/worker.config.ts`, `.env.example` |
| 7.4.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-74C4]` | QuotaService passa a derivar limites dinamicamente do plano/assinatura ativa. | `apps/api/src/services/QuotaService.ts` |
| 7.4.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-74C5]` | `/api/v1/me` entrega contexto limpo de plano para UI gating. | `apps/api/src/app.ts` |
| 7.5.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-75C1]` | Pricing page publica com tiers backend e toggle mensal/anual. | `apps/web/app/pricing/page.tsx`, `apps/web/app/pricing/pricing.css` |
| 7.5.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-75C2]` | Billing Settings in-app com plano atual, barras de uso e renewal date. | `apps/web/app/(dashboard)/settings/billing/page.tsx` |
| 7.5.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-75C3]` | Tabela de invoices no front com links PDF/hosted invoice. | `apps/web/app/(dashboard)/settings/billing/page.tsx` |
| 7.5.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-75C4]` | Interceptacao global de `402` com modal de upgrade. | `apps/web/components/paywall-provider.tsx`, `apps/web/app/layout.tsx`, `apps/web/app/globals.css` |
| 7.5.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-75C5]` | Pags `/billing/success` e `/billing/cancel` implementadas (confetti no sucesso). | `apps/web/app/billing/success/page.tsx`, `apps/web/app/billing/cancel/page.tsx` |
| 7.6.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-76C1]` | Endpoints agregadores de usage metrics criados para resposta rapida. | `apps/api/src/modules/analytics/service.ts`, `apps/api/src/modules/analytics/router.ts`, `apps/api/src/app.ts` |
| 7.6.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-76C2]` | Dashboard interno de MRR/ARR/churn/conversao/trend no web admin. | `apps/web/app/admin/analytics/page.tsx`, `apps/web/app/admin/analytics/analytics.css` |
| 7.6.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-76C3]` | Relatorio de coorte via SQL (M+1/M+2/M+3) implementado. | `apps/api/src/modules/analytics/service.ts` |
| 7.6.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-76C4]` | Export CSV de faturamento em `/api/v1/analytics/billing/export`. | `apps/api/src/modules/analytics/router.ts`, `apps/api/src/modules/analytics/service.ts` |
| 7.6.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-76C5]` | Monitor de DAU/MAU por uso real (workflow/agent usage) implementado. | `apps/api/src/modules/analytics/service.ts` |
| 7.7.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-77C1]` | Grace period de 3 dias aplicado no snapshot/guard/worker. | `apps/api/src/modules/billing/service.ts`, `apps/worker/src/worker.ts` |
| 7.7.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-77C2]` | Banner global nao dispensavel quando falta <24h para suspensao. | `apps/web/components/dashboard-billing-gate.tsx`, `apps/web/app/(dashboard)/dashboard.css` |
| 7.7.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-77C3]` | Evento de dunning publicado no webhook para iniciar serie de emails/queue. | `apps/api/src/modules/billing/event-bus.ts`, `apps/api/src/modules/webhooks/stripe.router.ts` |
| 7.7.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-77C4]` | Reativacao por invoice success com evento de `subscription.reactivated`. | `apps/api/src/modules/webhooks/stripe.router.ts`, `apps/api/src/modules/billing/event-bus.ts` |
| 7.7.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-77C5]` | Front redireciona contas hard-locked para `/settings/billing`. | `apps/web/components/dashboard-billing-gate.tsx` |
| 7.8.C1 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-78C1]` | Mock offline da Stripe API criado para testes. | `apps/api/test/__mocks__/stripe.ts` |
| 7.8.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-78C2]` | Testes de webhook com assinatura valida/invalida implementados. | `apps/api/tests/billing.webhook.test.ts` |
| 7.8.C3 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-78C3]` | Teste de idempotencia (mesmo evento 3x -> 1 mudanca de estado). | `apps/api/tests/billing.idempotency.test.ts` |
| 7.8.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-78C4]` | Teste de paywall garante 402 em recurso bloqueado por plano. | `apps/api/tests/billing.paywall.test.ts` |
| 7.8.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-78C5]` | Teste de grace period (+1 dia passa, +4 dias bloqueia). | `apps/api/tests/billing.grace-period.test.ts` |
| 7.9.C1 a 7.9.C4 | Vermelho | CODEX | Nao implementado neste lote (consolidacao fiscal noturna, tax geo, proration avancado, anti-fraude IP). | `-` |
| 7.9.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-79C5]` | Protecao de concorrencia baseada em idempotencia por `stripe_event_id` + estado imutavel por upsert. | `apps/api/src/modules/webhooks/stripe.router.ts`, `packages/database/prisma/schema.prisma` |
| 7.10.C1 | Vermelho | CODEX | Coverage global de billing gatekeeping ainda nao consolidado em relatorio unico. | `-` |
| 7.10.C2 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-710C2]` | Ajustes de seguranca: assinatura webhook obrigatoria, chave Stripe via env validada por Zod. | `apps/api/src/modules/webhooks/stripe.router.ts`, `packages/config/src/api.config.ts` |
| 7.10.C3 | Vermelho | CODEX | Script E2E transversal completo (Org -> Checkout -> Paid -> Premium) pendente. | `-` |
| 7.10.C4 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-710C4]` | Router Stripe auditado para segredo por env (`STRIPE_WEBHOOK_SECRET`) sem hardcode. | `apps/api/src/modules/webhooks/stripe.router.ts`, `.env.example` |
| 7.10.C5 | Azul | CODEX `[SIG: CODEX-C7-EXEC-20260313-710C5]` | Checklist master atualizado com status formal do Ciclo 7. | `CHECKLIST_MASTER.md` |
