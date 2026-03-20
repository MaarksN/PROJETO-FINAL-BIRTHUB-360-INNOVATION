# Mapa de Falhas de CI

Pacote | Tipo de erro | Arquivo | Erro exato | Causa raiz | Status
--- | --- | --- | --- | --- | ---
@birthub/agent-runtime | TypeScript module resolution (.js vs .ts) | `src/__tests__/runtime.test.ts` | Cannot find module '/app/packages/agent-runtime/index.js' | `exactOptionalPropertyTypes` config + module resolution | PENDENTE
@birthub/auth | TypeScript module resolution (.js vs .ts) | `src/__tests__/auth.test.ts` | Cannot find module | `exactOptionalPropertyTypes` config + module resolution | PENDENTE
@birthub/conversation-core | TypeScript module resolution (.js vs .ts) | `src/__tests__/service.test.ts` | Cannot find module | `exactOptionalPropertyTypes` config + module resolution | PENDENTE
@birthub/queue | TypeScript exactOptionalPropertyTypes | `src/index.ts`, `src/definitions.ts` | Invalid property | `exactOptionalPropertyTypes` config | PENDENTE
@birthub/security | TypeScript module resolution (.js vs .ts) | `src/__tests__/security.test.ts` | Cannot find module '/app/packages/security/index.js' | `exactOptionalPropertyTypes` config + module resolution | PENDENTE
@birthub/utils | TypeScript module resolution (.js vs .ts) | `src/__tests__/sleep.test.ts` | Cannot find module | `exactOptionalPropertyTypes` config + module resolution | PENDENTE
@birthub/llm-client | TypeScript compilation / export issue | `test-llm.ts` | Export missing | `GeminiClient` not exported correctly | PENDENTE
@birthub/db | Module resolution | - | Cannot find module '@birthub/database/index.js' | `exports` missing in packages/database/package.json | PENDENTE
