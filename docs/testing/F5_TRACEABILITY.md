# F5 Traceability Matrix

- Generated at: 2026-04-09T14:40:00-03:00
- Source: F5.html plus local revalidation of the quality-governance lane

## Billing and Stripe webhooks

- Threshold target: 90%
- Critical modules: 3

| Critical flow | Test suites |
| --- | --- |
| checkout creation, locale and tax handling | apps/api/tests/billing.checkout.test.ts |
| webhook validation and audit trail | apps/api/tests/billing.webhook.test.ts<br>apps/api/tests/billing.webhook-audit.test.ts<br>apps/api/tests/billing.webhook-delegation.test.ts |
| grace period, cache and idempotency guards | apps/api/tests/billing.cache.test.ts<br>apps/api/tests/billing.grace-period.test.ts<br>apps/api/tests/billing.idempotency.test.ts |
| proration credit, paywall and refund-sensitive states | apps/api/tests/billing.proration-credit.test.ts<br>apps/api/tests/billing.paywall.test.ts<br>apps/api/tests/billing.snapshot.test.ts |
| temporary IP lock and export processing | apps/api/tests/billing.ip-ban.test.ts<br>apps/worker/src/jobs/billingExport.test.ts |

Functional gaps:
- The workspace now has an automated mutation lane, but billing and webhook modules are not yet inside the mutated scope.
- Release-candidate performance evidence still depends on environment-backed executors.

## Auth, MFA and session lifecycle

- Threshold target: 90%
- Critical modules: 5

| Critical flow | Test suites |
| --- | --- |
| login and session creation | apps/api/tests/auth.test.ts<br>packages/auth/src/__tests__/auth.test.ts |
| MFA enrollment, challenge verification and replay prevention | apps/api/tests/auth.test.ts |
| logout, expired sessions and idle timeout enforcement | apps/api/tests/auth.test.ts<br>apps/web/tests/auth-session-route.test.ts |
| tenant hardening and security edge cases | apps/api/tests/tenant-auth-hardening.test.ts<br>apps/api/tests/security.test.ts |

Functional gaps:
- A focused mutation lane now covers `packages/auth`; the slower API auth expansion is available via `MUTATION_INCLUDE_API_AUTH=1`, but it is not part of the default lane yet.
- Lockout counters and broader API auth modules still need expanded mutation scope.
- Tagged slow/e2e auth flows remain separated from the critical coverage lane.

## Agents runtime and policy execution

- Threshold target: 80%
- Critical modules: 4

| Critical flow | Test suites |
| --- | --- |
| manifest parsing and runtime contracts | packages/agents-core/src/__tests__/manifest-parser.test.ts<br>packages/agents-core/src/__tests__/agent-api-manifest-parser.test.ts<br>packages/agent-runtime/src/__tests__/runtime.test.ts |
| policy and approval evaluation | packages/agents-core/test/policy.test.ts<br>packages/agents-core/test/policyEngine.test.ts |
| agent execution, retries and runtime smoke path | apps/worker/src/engine/runner.agent.smoke.test.ts<br>apps/worker/src/engine/runner.cancel.test.ts<br>apps/worker/src/engine/runner.transitions.test.ts |

Functional gaps:
- A focused mutation lane now covers manifest parsing, catalog lookup and Slack tool paths in `packages/agents-core`.
- Dead-letter-path assertions still depend on broader orchestrator/python suites.

## Worker boot, processing and overload behavior

- Threshold target: 85%
- Critical modules: 1

| Critical flow | Test suites |
| --- | --- |
| boot contract and request correlation | apps/worker/src/worker.test.ts<br>apps/worker/src/job-security.test.ts |
| normal processing and workflow execution chain | apps/worker/src/planExecutor.test.ts<br>apps/worker/src/engine/runner.workflow-chain.test.ts<br>apps/worker/src/engine/runner.http.msw.test.ts |
| queue isolation, cleanup and graceful failure paths | apps/worker/test/queue.isolation.test.ts<br>apps/worker/test/userCleanup.test.ts<br>apps/worker/test/outbound.webhooks.test.ts |
| overload and load-sensitive processing | apps/worker/src/load/parallelLoad.test.ts |

Functional gaps:
- Soak and chaos execution require provisioned Redis/API dependencies.
- Worker modularization evidence is still script-driven, not a single node:test lane.

## Critical Regressions

| Regression | Guard test |
| --- | --- |
| billing-proration-credit-idempotency | apps/api/tests/billing.proration-credit.test.ts |
| billing-ip-ban-regression | apps/api/tests/billing.ip-ban.test.ts |
| auth-mfa-challenge-reuse | apps/api/tests/auth.test.ts |
| auth-idle-session-expiry | apps/api/tests/auth.test.ts |
| worker-request-correlation-contract | apps/worker/src/worker.test.ts |

## Functional vs Code Coverage Gaps

- The workspace now has a mutation lane for `packages/auth` and the critical `packages/agents-core` parsing/tooling slice, but billing/webhooks, worker runtime and broader API auth remain outside the default mutated scope.
- Chaos, resilience and soak executions are modeled by scripts and environment gates, not by every default CI run.
- Python orchestration runtime remains partially outside the TS/JS coverage dashboard and is tracked separately by pytest coverage.
