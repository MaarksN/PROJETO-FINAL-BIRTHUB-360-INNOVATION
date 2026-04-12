# Workflows Core Hardening Report - Cycle 2

## Scope
- `packages/workflows-core`

## Actions Taken
- Removed all `@ts-nocheck` directives.
- Resolved massive syntax corruption caused by renaming files to kebab-case without updating TS imports properly.
- Enforced strict typings in `execute-step.ts` and DAG validator (`dag-validator.ts`).
- Fixed lint errors, retaining intentional `async` functions that lack `await` where required by synchronous step handlers that must conform to the async interface.
- Removed legacy `console.log` statements in favor of structured contextual `@birthub/logger`.

## Validation
- `pnpm --filter @birthub/workflows-core run typecheck`: **PASS**
- `pnpm --filter @birthub/workflows-core run lint`: **PASS** (with interface-mandated warnings for `require-await`).
- `pnpm --filter @birthub/workflows-core run test`: **PASS** (11/11 tests pass).

## Remaining Risks
1. Heavy reliance on in-memory queue execution. Crash during workflow execution requires manual restart or risks step duplication.
2. Idempotency guarantees for "Connector" and "Agent" steps rely entirely on the downstream agent logic rather than the workflow DAG state itself.
