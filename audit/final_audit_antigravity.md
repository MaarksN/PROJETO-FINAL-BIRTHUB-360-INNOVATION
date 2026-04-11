# AUDITORIA FORENSE FINAL — BirthHub 360

**Auditor:** Antigravity (Forensic Staff+ Auditor)
**Data:** 2026-04-11
**Escopo:** Ciclos 0 a 7 — Validação contra código real
**Classificação Global:** 🔴 NÃO APTO PARA PRODUÇÃO

---

## REGRA APLICADA

Toda afirmação deste relatório é sustentada por evidência direta do código-fonte.
Nenhum relatório anterior foi considerado verdadeiro até validação contra os arquivos reais.

---

## 1. AVALIAÇÃO POR CICLO

---

### FASE 0 — Bootstrapping da Plataforma

**Entregáveis declarados:** Monorepo, estrutura de pastas, toolchain.

**Evidência encontrada:**
- ✅ Monorepo Turborepo + pnpm funcional (`turbo.json`, `pnpm-workspace.yaml`)
- ✅ Workspaces definidos: `apps/*`, `packages/*`
- ✅ Node >=24, pnpm 9.1.0 definidos em `package.json`
- ✅ Husky + lint-staged + commitlint configurados
- ✅ `.nvmrc` presente
- ⚠️ `pnpm-lock.yaml` (514KB) presente — lockfile governance ativa

**Classificação:** ✅ APROVADO

---

### FASE 1 — Core Platform (API, Worker, Database, Auth)

**Entregáveis declarados:** API Fastify, Worker BullMQ, Prisma DB, Auth JWT.

**Evidência encontrada:**

#### API (`apps/api/`)
- ✅ Express (NÃO Fastify como possivelmente declarado) — `app.ts` linha 5: `import express from "express"`
- ✅ Server com graceful shutdown (`server.ts` linhas 21-33)
- ✅ 27 módulos de domínio implementados (`apps/api/src/modules/`)
- ✅ 10 middlewares implementados incluindo authentication, CSRF, rate-limit, origin-check, sanitize-input
- ✅ OpenTelemetry + Sentry integrados (`server.ts` linhas 7-8, 13-14)
- 🔴 **`@ts-nocheck` na linha 1 de `app.ts` e `server.ts`** — desabilita toda verificação de tipos

#### Worker (`apps/worker/`)
- ✅ BullMQ com múltiplas filas: tenant tasks, agent execution (high/normal/low priority), email, webhook outbound, CRM sync, workflow execution/trigger
- ✅ `WorkerFactory` com DLQ queues
- ✅ Métricas Prometheus implementadas (`recordWorkerJobMetric`)
- ✅ Rate limiter dinâmico (`DynamicRateLimiter`)
- ✅ Billing lock resolver integrado no pipeline de execução
- 🔴 **`@ts-nocheck` em TODOS os arquivos do worker** — `worker.ts`, `worker.process-job.ts`, `worker.billing.ts`, etc.

#### Database (`packages/database/`)
- ✅ Prisma com PostgreSQL — schema de **1287 linhas** com **38+ modelos**
- ✅ PrismaPg adapter com connection pool management
- ✅ Query timeout via `raceWithTimeout` (5s default)
- ✅ Observabilidade: métricas de queries (total, duration, slow queries)
- ✅ Tenant context via `AsyncLocalStorage` (`tenant-context.ts`)
- ✅ `withTenantDatabaseContext` usando `SET CONFIG` para RLS
- ✅ `pingDatabase` e `pingDatabaseDeep` health checks
- ✅ Multi-tenant com `tenantId` em todos os modelos + índices corretos
- 🔴 **`@ts-nocheck` em `client.ts` e `tenant-context.ts`**

#### Auth (`packages/auth/`)
- ✅ JWT com `jose` library (HS256)
- ✅ Access + Refresh token pair com rotação
- ✅ RBAC: `requireRole`, `requirePermission`
- ⚠️ **Refresh store é `Map` em memória** (`index.ts` linha 21) — NÃO PERSISTENTE. Perda total em restart.
- ⚠️ Sem rate-limiting de tentativas de refresh
- 🔴 Sem blacklist de tokens revogados persistente

**Classificação:** ⚠️ APROVADO COM RESSALVAS
- `@ts-nocheck` pandêmico invalida a confiança na tipagem
- Auth refresh store in-memory é falha crítica para produção

---

### CICLO 2 — Voice Engine

**Entregáveis declarados:** STT/TTS pipeline, WebSocket, Twilio/Deepgram/ElevenLabs integration.

**Evidência encontrada:**

- ✅ Servidor Express + WebSocket (`apps/voice-engine/src/server.ts` — 235 linhas)
- ✅ Twilio inbound webhook handler (`/twilio/inbound`)
- ✅ WebSocket handler em `/ws/calls` com frame processing
- ✅ Redis Streams para publicação de eventos (`voice_events`)
- ✅ Health check funcional
- ✅ Env validation para TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, DEEPGRAM_API_KEY, ELEVENLABS_API_KEY, REDIS_URL
- ✅ Testes unitários (143 linhas) cobrindo env validation, health, WebSocket handshake

**FALSOS POSITIVOS IDENTIFICADOS:**
- 🔴 **Deepgram é criado como mock**: `deepgramFactory ?? ((apiKey: string) => ({ apiKey }))` — linha 105. É um objeto estático, NÃO integra com Deepgram API real.
- 🔴 **ElevenLabs NÃO é usado em lugar nenhum do código**. A API key é lida no env, mas nenhuma chamada TTS real é feita.
- 🔴 **LLM Output é HARDCODED**: `const llmOutput = \`Entendi: ${frame.transcript}. Proximo passo recomendado enviado.\`` — linha 161. NÃO há chamada LLM real.
- 🔴 **Barge-in logic é um booleano manual** (`ttsActive = false/true`) — NÃO há cancelamento real de stream TTS
- 🔴 **Latência NÃO é medida end-to-end** — apenas diff de timestamps internos (`Date.now() - start`)
- 🔴 `@ts-nocheck` presente

**Classificação:** ❌ REPROVADO
- Voice Engine é um **MOCK DISFARÇADO**. Ele parece funcionar mas não integra com nenhum serviço real de STT/TTS/LLM.

---

### CICLO 3 — Integrations

**Entregáveis declarados:** Adapters para CRM, email, fiscal, payments, calendar, LLM, webhooks.

**Evidência encontrada:**

- ✅ 8 clients implementados: `crm.ts`, `fiscal.ts`, `llm.ts`, `payments-br.ts`, `signatures.ts`, `social-ads.ts`, `svix.ts`, `calendar.ts`
- ✅ 4 adapters: `crm-adapter-factory.ts`, `email-adapter-factory.ts`, `webhook-registry.ts`, `cache.ts`
- ✅ Testes para `fiscal.test.ts` e `payments-br.test.ts`
- ✅ HTTP client base implementado (`http.ts`)
- ✅ Connector runtime no worker (`connectors.runtime.ts`)
- ✅ HubSpot sync no worker (`hubspot.ts`)
- ✅ ConnectorAccount/ConnectorCredential/ConnectorSyncCursor models no schema

**PROBLEMAS IDENTIFICADOS:**
- ⚠️ `packages/billing` é explicitamente marcado como **DEAD PACKAGE** (`README.md`: "Status: inactive package placeholder")
- ⚠️ `@ts-nocheck` em HubSpot integration e connector runtime
- ⚠️ Sem circuit breaker visível nas integrações externas (opossum está nas root dependencies mas não há evidência de uso nos adapters)

**Classificação:** ⚠️ APROVADO COM RESSALVAS

---

### CICLO 4 — Web Application

**Entregáveis declarados:** Next.js frontend com auth, multi-tenant, guards, UX operacional.

**Evidência encontrada:**

- ✅ Next.js app directory com 18 routes no dashboard
- ✅ Auth guard no dashboard layout: `await requireAuthenticatedWebSession()` — linha 9 de `layout.tsx`
- ✅ `DashboardBillingGate` component gate billing
- ✅ Login page com `LoginForm` component
- ✅ Tenant context via cookies (`bh_active_tenant`, `bh_user_id`)
- ✅ CSRF token handling (`bh360_csrf`)
- ✅ `fetchWithSession` utility com timeout e headers automáticos
- ✅ Providers: Analytics, i18n, Theme, Engagement
- ✅ CSP configurado
- ✅ Sentry client + server instrumentation
- ✅ Dockerfile para build de produção
- ✅ Extenso conjunto de rotas: agents, analytics, billing, conversations, marketplace, workflows, etc.

**PROBLEMAS IDENTIFICADOS:**
- ⚠️ `auth-client.ts` usa path relativo direto ao package: `import { fetchWithTimeout } from "../../../packages/utils/src/fetch"` — violação de encapsulamento de monorepo
- ⚠️ Legacy localStorage fallbacks mantidos (`LEGACY_ACCESS_TOKEN_STORAGE_KEY`, etc.)
- ⚠️ Cookies de sessão SEM `Secure` flag no client-side `setCookieValue`

**Classificação:** ⚠️ APROVADO COM RESSALVAS

---

### CICLO 5 — Agents System

**Entregáveis declarados:** Agent runtime, contratos, manifests, governança, observabilidade.

**Evidência encontrada:**

- ✅ `packages/agents-core` com 12 subdirectórios: execution, manifest, memory, parser, policy, runtime, schemas, skills, tools, types
- ✅ `PolicyEngine` com `InMemoryPolicyAdminStore` e `PolicyDeniedError`
- ✅ Agent Manifest parser com versão suportada (`SUPPORTED_AGENT_API_VERSION`)
- ✅ Agent manifest schema validação via Zod
- ✅ `packages/agents-registry` com `REGISTRY.md`
- ✅ `packages/agent-packs` com validação, teste, smoke, regression, docs
- ✅ `packages/agent-runtime` existe
- ✅ Agent executions persistidas no banco com `AgentExecution` model
- ✅ Agent feedback model
- ✅ Agent budget model com custos em BRL
- ✅ Agent handoff model e implementation
- ✅ Worker integra `executeManifestAgentRuntime` para execução real
- ✅ DRY_RUN mode, approval gate, billing lock

**PROBLEMAS IDENTIFICADOS:**
- ⚠️ `PolicyEngine` usa `InMemoryPolicyAdminStore` — políticas perdem-se em restart
- 🔴 `@ts-nocheck` em todos os arquivos do runtime de execução

**Classificação:** ⚠️ APROVADO COM RESSALVAS

---

### CICLO 6 — Billing

**Entregáveis declarados:** Planos, metering, cobrança Stripe, consistência.

**Evidência encontrada:**

- ✅ 14 arquivos no módulo billing da API (`apps/api/src/modules/billing/`)
- ✅ Stripe checkout session creation com tax, locale, metadata
- ✅ Customer portal session creation
- ✅ Stripe webhook reconciliation com 5 event handlers:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`
- ✅ Plan model com `stripePriceId`, `stripeProductId`, pricing
- ✅ Subscription model com `stripeSubscriptionId`, status enum (trial, active, past_due, canceled, paused)
- ✅ Invoice model com `stripeInvoiceId`, amounts, URLs
- ✅ Payment method model
- ✅ Usage records com metering (`UsageRecord` model com `metric`, `quantity`, `unit`)
- ✅ Billing credits model com proration (`BillingCredit`)
- ✅ Grace period handling no worker (`calculateGraceBoundary`)
- ✅ Billing lock cache em Redis
- ✅ Billing event idempotency via `stripeEventId` unique
- ✅ 11 testes de billing na API: checkout, webhook, idempotency, grace-period, paywall, proration-credit, snapshot, cache, IP ban, webhook-audit, webhook-delegation
- ✅ Billing export storage no worker

**PROBLEMAS IDENTIFICADOS:**
- 🔴 `@ts-nocheck` em TODOS os billing service files
- ⚠️ Usage metering existe no schema, mas NÃO há sync com Stripe Usage Records API
- ⚠️ Sem recurring billing automation (Stripe handles via webhook, mas sem fallback)
- ⚠️ `packages/billing` está morto — billing está no API module

**Classificação:** ⚠️ APROVADO COM RESSALVAS

---

### CICLO 7 — Release Readiness

**Entregáveis declarados:** Build, SBOM, artefatos, reprodutibilidade.

**Evidência encontrada:**

- ✅ SBOM generation script (`scripts/release/generate-sbom.mjs`)
- ✅ Release materialization (`scripts/release/materialize-release.ts`)
- ✅ Preflight environment validation (`scripts/release/preflight-env.ts`)
- ✅ Rollback verification (`scripts/release/verify-rollback-evidence.ts`)
- ✅ Global smoke test (`scripts/release/global-smoke.ts`)
- ✅ Data migration script (`scripts/release/final-data-migration.ts`)
- ✅ Dockerfiles para API, Web, Worker
- ✅ `docker-compose.prod.yml` com Caddy reverse proxy, TLS, read-only containers, init process
- ✅ Env validation com `${VAR:?error message}` em docker-compose.prod
- ✅ CI pipeline com 17 jobs: branch-name, commitlint, lockfile-integrity, lockfile-corruption-simulation, inline-credentials, documentation-links, repo-hygiene, gitleaks, security-guardrails, platform (lint/typecheck/test/isolation/build), satellites, workflow-suite, integration-db, coverage-quality, mutation-testing, pack-tests, governance-gates, e2e-release
- ✅ CD pipeline exists (`cd.yml` — 29KB)
- ✅ Security scan pipeline (`security-scan.yml`)
- ✅ Release evidence directory structure
- ✅ Release manifests directory

**PROBLEMAS IDENTIFICADOS:**
- 🔴 `releases/evidence/` contém apenas um `README.md` (177 bytes) — **NÃO há evidência real de release test**
- 🔴 `releases/manifests/` contém documentação mas **NÃO artefatos binários** ou checksums de build
- ⚠️ Build command inclui SBOM mas a saída não é verificável sem execução
- ⚠️ `docker-compose.yml` (dev) expõe Elasticsearch sem autenticação (`xpack.security.enabled=false`)

**Classificação:** ⚠️ APROVADO COM RESSALVAS

---

## 2. PROBLEMA SISTÊMICO: @ts-nocheck

**Este é o problema mais grave de todo o projeto.**

Contagem de arquivos com `@ts-nocheck`:
- `apps/worker/src/` — **42+ arquivos** (TODOS os source files)
- `apps/api/src/` — **estimado 50+ arquivos** (incluindo todos os módulos)
- `apps/voice-engine/src/` — **2 arquivos** (todos)
- `packages/database/src/` — **múltiplos** (client.ts, tenant-context.ts)
- `packages/workflows-core/` — **24+ arquivos**
- `packages/integrations/` — **múltiplos**
- `packages/utils/`, `packages/shared/`, `packages/queue/`, `packages/testing/` — **todos**

**Estimativa total: 200+ arquivos com @ts-nocheck**

**Consequência:** O TypeScript typecheck CI job (`pnpm typecheck`) NÃO verifica a tipagem real do código. O sistema inteiro opera como se fosse JavaScript puro com declarações TypeScript decorativas.

---

## 3. CONSOLIDADO DE FALHAS CRÍTICAS

| # | Falha | Severidade | Localização |
|---|-------|-----------|-------------|
| 1 | `@ts-nocheck` pandêmico (200+ arquivos) | 🔴 CRÍTICO | Todo o codebase |
| 2 | Voice Engine é mock (sem STT/TTS/LLM real) | 🔴 CRÍTICO | `apps/voice-engine/` |
| 3 | Auth refresh store in-memory (perda em restart) | 🔴 CRÍTICO | `packages/auth/index.ts:21` |
| 4 | Deepgram factory retorna objeto estático | 🔴 CRÍTICO | `voice-engine/server.ts:105` |
| 5 | ElevenLabs key lida mas nunca usada | 🔴 CRÍTICO | `voice-engine/server.ts` |
| 6 | LLM output hardcoded no voice engine | 🔴 CRÍTICO | `voice-engine/server.ts:161` |
| 7 | Sem release evidence real | 🟠 ALTO | `releases/evidence/` |
| 8 | PolicyEngine in-memory | 🟠 ALTO | `packages/agents-core` |
| 9 | Cookie Secure flag ausente no client | 🟠 ALTO | `apps/web/lib/auth-client.ts` |
| 10 | Import path relativo violando monorepo | 🟡 MÉDIO | `apps/web/lib/auth-client.ts:5` |
| 11 | Legacy localStorage fallbacks | 🟡 MÉDIO | `apps/web/lib/session-context.ts` |
| 12 | Usage metering sem sync Stripe | 🟡 MÉDIO | API billing module |
| 13 | Elasticsearch dev sem auth | 🟡 MÉDIO | `docker-compose.yml` |
| 14 | packages/billing morto mas presente | 🔵 BAIXO | `packages/billing/` |
| 15 | circuit breaker opossum instalado mas sem uso evidente | 🟡 MÉDIO | root package.json |

---

## 4. CÓDIGO MORTO IDENTIFICADO

1. `packages/billing/` — explicitamente marcado como DEAD PACKAGE
2. `apps/legacy/` — existe mas não auditado
3. ElevenLabs API key reading sem uso
4. Legacy storage keys mantidos no web client

---

## 5. MOCKS DISFARÇADOS

1. **Voice Engine Deepgram factory** — retorna `{ apiKey }` literalmente
2. **Voice Engine LLM response** — template string hardcoded
3. **Voice Engine TTS** — `socket.send(JSON.stringify({ type: "tts", text: llmOutput }))` — NÃO é audio

---

## 6. DECISÃO

### 🔴 NÃO APTO PARA PRODUÇÃO

**Justificativa primária:**
1. 200+ arquivos com `@ts-nocheck` tornam a tipagem TypeScript uma mentira
2. Voice Engine é completamente falso — vendê-lo como funcionalidade real é fraude
3. Auth refresh store in-memory é incompatível com qualquer SLA

**O sistema NÃO pode ser vendido como SaaS na condição atual.**
