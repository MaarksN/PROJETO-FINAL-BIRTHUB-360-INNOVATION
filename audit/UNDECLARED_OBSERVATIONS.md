# Undeclared Observations

During the task to add test coverage for `generate_email_sequence` in `agents/sdr/tools.py`, several CI checks failed on pre-existing errors outside the target agent's specific package (`agents/sdr`).

According to the Cross-Governance Protocol, these are documented below and left unfixed:

## `security-guardrails` Check
- `@birthub/api` typecheck failed (`tsc -p tsconfig.json --noEmit` exit status 2).
- Errors in `packages/agents-core/src/manifest/schema.ts` (Line 53) and `packages/agents-core/src/schemas/manifest.schema.ts` (Line 80) due to `exhausted.notify_human` type mismatch (boolean vs true).
- Error in `packages/agents-core/src/runtime/manifestRuntime.ts` (Line 135) due to `output: unknown` not assignable to `JsonValue` in `tool_results`.

## `test:isolation` Check
- `@birthub/api` test `performance.test.ts` failed because `The table public.organizations does not exist`.
- `@birthub/database` test `migration.test.ts` and `rls.test.ts` failed for the same reason (`public.organizations does not exist`).

## `test` Check
- Same `@birthub/database` and `@birthub/api` database table errors (`public.organizations does not exist`).

## `lint` Check
- `@birthub/worker` failed linting (`eslint .` exit status 1) with 34 problems.
- Errors included `@typescript-eslint/no-floating-promises`, `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unsafe-call`, and `@typescript-eslint/no-unsafe-argument` in `apps/worker/src/webhooks/outbound.ts` and `apps/worker/src/worker.ts`.

## `typecheck` Check
- Same `@birthub/api` and `packages/agents-core` typecheck errors as seen in `security-guardrails` check.

## `build` Check
- Same `packages/agents-core` typecheck/build errors.

## `workflow-suite` Check
- Error during setup or execution involving Node and Python workflows.

## `gitleaks` Check
- Error running `gitleaks detect` with `fatal: ambiguous argument... unknown revision or path not in the working tree`.
