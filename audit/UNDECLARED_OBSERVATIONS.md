# Undeclared Observations

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
Tipo: TypeScript exactOptionalPropertyTypes
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

Pacote: packages/agents-core
Tipo: TypeScript typechecking (`no overload matches this call` / `type mismatch` em `ZodDefault`)
Impacto: falha em `pnpm typecheck:core` / `pnpm build:core`
Arquivo(s):
- `src/manifest/schema.ts(53,12)`: os valores do objeto `canonicalFallbackBehavior` para `notify_human` (boolean) não batem com o tipo literal estrito `true` esperado pelo schema Zod.
- `src/schemas/manifest.schema.ts(80,12)`: erro idêntico de atribuição em Zod.
- `src/runtime/manifestRuntime.ts(135,7)`: incompatibilidade de tipos entre `output: unknown` e `output: JsonValue` em `tool_results`.
Pré-existente: sim (observado antes / fora do escopo de `agents/sdr`)
Recomendação: endereçar em ciclo de correção técnica separado, coordenado pelo time responsável por `agents-core`.

Pacote: apps/worker
Tipo: ESLint (`@typescript-eslint/no-explicit-any`, `no-unsafe-call`, `no-floating-promises`, `no-unsafe-argument`)
Impacto: falha em `pnpm lint:core`
Arquivo(s):
- `src/webhooks/outbound.ts`: múltiplas ocorrências de `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unsafe-call` e `@typescript-eslint/no-floating-promises`.
- `src/worker.ts`: múltiplas ocorrências de `@typescript-eslint/no-unsafe-argument` e `@typescript-eslint/no-unsafe-call`.
Pré-existente: sim (observado antes / fora do escopo de `agents/sdr`)
Recomendação: refatorar os pontos sinalizados pelo ESLint em um ciclo de correção técnica separado.

Pacote: apps/api
Tipo: falhas de teste (isolamento / performance, Prisma)
Impacto: falha nos testes de integração/performance
Arquivo(s):
- `test/performance.test.ts`: erro Prisma `The table public.organizations does not exist in the current database.`
- `test/rls.test.ts`: erro Prisma semelhante (`public.organizations does not exist`).
Pré-existente: sim (observado antes / fora do escopo de `agents/sdr`)
Recomendação: revisar migrações e setup de banco usado nos testes de API em ciclo de correção técnica separado.

Pacote: packages/database
Tipo: falhas de teste de migração (Prisma)
Impacto: falha na suíte de testes de migração
Arquivo(s):
- `test/migration.test.ts`: erro Prisma `The table public.organizations does not exist in the current database.`
Pré-existente: sim (observado antes / fora do escopo de `agents/sdr`)
Recomendação: alinhar migrações e ambiente de teste de banco, em conjunto com o time de banco de dados, em ciclo separado.

Pacote: agents/sales_ops, agents/bdr, agents/copywriter
Tipo: falha de resolução de dependências Python
Impacto: falha nos checks da python workflow-suite
Arquivo(s):
- Workflow Python: `ERROR: ../shared is not a valid editable requirement.`
Pré-existente: sim (observado antes / fora do escopo de `agents/sdr`)
Recomendação: ajustar a referência ao diretório `../shared` ou publicar o pacote correspondente de forma adequada, em ciclo de correção separado.

The task scope has been kept strictly isolated to `agents/sdr/tests/test_sdr_tools.py` in accordance with the protocol.

Nenhum script/pipeline explícito de geração do artifacts/audit/forensic_report.html
foi encontrado no checkout atual após busca em scripts, workflows e arquivos de build.
No estado atual do repositório, o relatório deve ser tratado como artefato
atualizado manualmente.

S-003 — `syncLegacyBilling.ts` sem artefato de origem confirmado.
