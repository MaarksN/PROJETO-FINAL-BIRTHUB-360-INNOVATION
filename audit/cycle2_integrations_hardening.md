# Integrations Hardening Report - Cycle 2

## Scope
- `packages/integrations`

## Actions Taken
- Removed all `@ts-nocheck` directives across clients and adapters.
- Replaced ambiguous `Promise<any>` return types with `Promise<unknown>` or strict DTOs (e.g., `PaymentResponse` in `payments-br.ts`, `SignatureDocument` in `signatures.ts`).
- Fixed `exactOptionalPropertyTypes` TS strict mode violations in `payments-br.ts` and `fiscal.ts` by checking `!== undefined` before spreading optional properties into DTOs.
- Replaced missing/broken `async *stream` generators in `llm.ts` to properly enforce interface contracts (`ILLMClient`).
- Implemented `idempotencyKey` and `providerName` propagation in the underlying `http.ts` client.

## Validation
- `pnpm --filter @birthub/integrations run typecheck`: **PASS**
- `pnpm --filter @birthub/integrations run lint`: **PASS**

## Remaining Risks
1. Many APIs (e.g. `getStatus` in `signatures.ts`, `confirmPayment` in `payments-br.ts`) throw "Method not implemented" and need actual integration contracts.
2. Error handling relies too much on catching `unknown` and generic wrappers instead of mapping provider-specific HTTP error codes to BirthHub domains.
3. Rate limits from third parties (e.g., Anthropic, Gemini, ClickSign) are not caught explicitly to trigger automated exponential backoff or Queue retries.
