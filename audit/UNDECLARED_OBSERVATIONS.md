Pacote: agent-runtime
Tipo: TypeScript module resolution (.js vs .ts)
Impacto: falha no build do pacote
Arquivo(s): src/__tests__/runtime.test.ts
Pré-existente: sim (confirmado antes do meu trabalho)
Recomendação: ciclo de correção técnica separado

Pacote: conversation-core
Tipo: TypeScript module resolution (.js vs .ts)
Impacto: falha no build do pacote
Arquivo(s): src/__tests__/service.test.ts
Pré-existente: sim (confirmado antes do meu trabalho)
Recomendação: ciclo de correção técnica separado

Pacote: auth
Tipo: TypeScript module resolution (.js vs .ts)
Impacto: falha no build do pacote
Arquivo(s): src/__tests__/auth.test.ts
Pré-existente: sim (confirmado antes do meu trabalho)
Recomendação: ciclo de correção técnica separado

Pacote: security
Tipo: TypeScript module resolution (.js vs .ts)
Impacto: falha no build do pacote
Arquivo(s): src/__tests__/security.test.ts
Pré-existente: sim (confirmado antes do meu trabalho)
Recomendação: ciclo de correção técnica separado

Pacote: utils
Tipo: TypeScript module resolution (.js vs .ts)
Impacto: falha no build do pacote
Arquivo(s): src/__tests__/sleep.test.ts
Pré-existente: sim (confirmado antes do meu trabalho)
Recomendação: ciclo de correção técnica separado

Pacote: queue
Tipo: TypeScript exatcOptionalPropertyTypes
Impacto: falha no build do pacote
Arquivo(s): src/index.ts, src/definitions.ts
Pré-existente: sim (confirmado antes do meu trabalho)
Recomendação: ciclo de correção técnica separado

Pacote: llm-client
Tipo: TypeScript compilation / export issue
Impacto: falha no build do pacote
Arquivo(s): test-llm.ts
Pré-existente: sim (confirmado antes do meu trabalho)
Recomendação: ciclo de correção técnica separado

---

## Observações de CI (agente `sdr`)

While working on adding unit tests for `agents/sdr`, several pre-existing CI errors were observed in unrelated monorepo packages. As per the Cross-Governance Protocol, these are documented below and left unfixed:

### 1. packages/agents-core
TypeScript `no overload matches this call` / `type mismatch` errors on `ZodDefault` assignment during typechecking (`pnpm typecheck:core` / `pnpm build:core`):
- `src/manifest/schema.ts(53,12)`: The canonicalFallbackBehavior object values for `notify_human` (boolean) don't match the strict literal type `true` expected by the Zod schema.
- `src/schemas/manifest.schema.ts(80,12)`: Identical Zod assignment error.
- `src/runtime/manifestRuntime.ts(135,7)`: Type mismatch for `output: unknown` vs `output: JsonValue` on `tool_results`.

### 2. apps/worker
ESLint errors (`pnpm lint:core`):
- `src/webhooks/outbound.ts`: Multiple `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unsafe-call`, and `@typescript-eslint/no-floating-promises` errors.
- `src/worker.ts`: Multiple `@typescript-eslint/no-unsafe-argument` and `@typescript-eslint/no-unsafe-call` errors.

### 3. apps/api
Test isolation and performance failures:
- `test/performance.test.ts`: Prisma error `The table public.organizations does not exist in the current database.`
- `test/rls.test.ts`: Similar Prisma `public.organizations does not exist` error.

### 4. packages/database
Migration test failures:
- `test/migration.test.ts`: Prisma error `The table public.organizations does not exist in the current database.`

### 5. agents/sales_ops, agents/bdr, agents/copywriter
Python requirement resolution failure:
- `ERROR: ../shared is not a valid editable requirement.` in the python workflow-suite checks.

The task scope has been kept strictly isolated to `agents/sdr/tests/test_sdr_tools.py` in accordance with the protocol.
