# Critical Flows and Failure Points Baseline

Generated at: 2026-03-22 (America/Sao_Paulo)
Scope: canonical stack (`apps/web`, `apps/api`, `apps/worker`, `packages/database`)

## 1) Authentication and Session Lifecycle

Primary path:
`apps/web` -> `POST /api/v1/auth/*` -> `authenticateRequest/loginWithPassword` -> Prisma session write

Failure points (5):
1. Web-to-API network/API gateway reachability.
2. Auth router validation/guard failure (credentials/session token).
3. Prisma read for user/session lookup.
4. Password/hash or token validation path.
5. Prisma write for session update/create/revoke.

## 2) Workflow Trigger and Async Execution

Primary path:
`/api/v1/workflows*` -> workflow service -> Redis dedupe -> BullMQ enqueue (`runnerQueue.ts`) -> worker execution -> DB persistence.

Failure points (8):
1. Web/API request admission and authorization.
2. Workflow metadata read/write in Postgres.
3. Redis connection for trigger dedupe.
4. BullMQ queue publish (`workflow-trigger` / `workflow-execution`).
5. Worker queue consumption and job lock/ack.
6. External action execution (LLM/connector side effects).
7. Step/result persistence in Postgres.
8. Retry/backoff exhaustion leading to terminal failure.

## 3) Stripe Billing Webhook Processing

Primary path:
Stripe webhook -> signature verification -> idempotency cache -> `billingEvent` transaction -> post-commit invalidation/CRM enqueue.

Failure points (7):
1. External delivery from Stripe to webhook endpoint.
2. Signature validation and request parsing.
3. Idempotency cache read/write operations.
4. Billing event upsert/update in Postgres.
5. Transactional domain processing for subscription/invoice changes.
6. Cache invalidation and billing snapshot refresh.
7. CRM sync enqueue as post-commit side effect.

## 4) Connector OAuth and Sync

Primary path:
`/api/v1/connectors/:provider/*` -> OAuth callback/connect -> credential/cursor persistence -> provider sync.

Failure points (6):
1. Provider OAuth callback reachability.
2. State/token exchange validation.
3. Credential persistence in Postgres.
4. Provider API availability/rate limits.
5. Sync cursor update/write consistency.
6. Tenant-bound authorization and policy checks.

## 5) Output Artifact Generation and Retrieval

Primary path:
workflow/agent execution -> output artifact persistence -> `/api/v1/outputs` retrieval.

Failure points (5):
1. Upstream execution completion dependency.
2. Artifact write path (DB/object persistence).
3. Retention/status transitions.
4. Tenant isolation checks at read time.
5. API response serialization/transport.

## Summary

- Total mapped critical flows: 5
- Aggregate failure points mapped: 31
- Highest concentration: workflow async path (8) and billing webhook path (7)
