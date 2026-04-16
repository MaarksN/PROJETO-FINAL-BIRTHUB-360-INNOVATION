# CYCLE LOG

## Session Start - 2026-04-13

- `CYCLE_LOG.md` was not present in the repository at session start.
- Prior state was reconstructed from `docs/cycles/` and `audit/`, but there was no canonical session log to compare against.
- Divergence check against a previous canonical log: `N/A` because no prior `CYCLE_LOG.md` existed.
- Next 3 cycle candidates identified before execution:
  - `A-001` - remove unauthorized `@ts-nocheck` directives blocking `pnpm typecheck`.
  - `A-002` - fix `packages/queue/tests/runtime.test.ts:164` (`TS7006` implicit `any`) blocking `pnpm typecheck`.
  - `A-003` - fix `apps/web/tests/disabled-domain-pages.test.ts:24` (`TS2540` on `process.env.NODE_ENV`) blocking `pnpm --filter @birthub/web typecheck`.

---

CICLO
[A-001]

TRILHA
[A]

OBJETIVO
[Remover os `@ts-nocheck` novos que quebravam o guardrail de tipagem e restaurar a tipagem real de `packages/database/scripts/lib/runtime.ts`.]

ARQUIVOS-ALVO
- [apps/web/app/(dashboard)/appointments/page.client.tsx: remover bypass de tipagem]
- [apps/web/app/(dashboard)/patients/[id]/appointments/page.client.tsx: remover bypass de tipagem]
- [apps/web/app/(dashboard)/patients/[id]/page.client.tsx: remover bypass de tipagem]
- [apps/web/app/(dashboard)/patients/page.client.tsx: remover bypass de tipagem]
- [packages/database/scripts/lib/runtime.ts: substituir bypass por objetos compativeis com `exactOptionalPropertyTypes`]
- [docs/technical-debt/tracker.json: registrar o item `PROGRAM-TD-008`]
- [CYCLE_LOG.md: registrar a sessao e o ciclo]

DIFF GUARD
Arquivos estruturais: [5 / max 5]
Linhas alteradas em hot paths: [83 / max 200]
Excecao justificada: [nao]

TD-IDs AFETADOS
Fechados: [PROGRAM-TD-008 - Unauthorized `@ts-nocheck` directives reappeared in active web and database paths and broke the ts-directives guard]
Abertos: [N/A]
Bloqueados: [N/A]

GATE DE APROVACAO HUMANA
Necessario: [nao]
Se sim: [N/A]

PROBLEMA CONFIRMADO
[O comando `pnpm typecheck` falhou no guardrail com output literal: `New @ts-nocheck directives exceed the committed baseline` para `apps/web/app/(dashboard)/appointments/page.client.tsx:1`, `apps/web/app/(dashboard)/patients/[id]/appointments/page.client.tsx:1`, `apps/web/app/(dashboard)/patients/[id]/page.client.tsx:1`, `apps/web/app/(dashboard)/patients/page.client.tsx:1` e `packages/database/scripts/lib/runtime.ts:1`. Depois da remocao do bypass, `pnpm --filter @birthub/database typecheck` expôs erros reais de `exactOptionalPropertyTypes` em `packages/database/scripts/lib/runtime.ts(123,137,169,227,247,268)`.]

ALTERACOES REALIZADAS
- [apps/web/app/(dashboard)/appointments/page.client.tsx] - removido `@ts-nocheck`
- [apps/web/app/(dashboard)/patients/[id]/appointments/page.client.tsx] - removido `@ts-nocheck`
- [apps/web/app/(dashboard)/patients/[id]/page.client.tsx] - removido `@ts-nocheck`
- [apps/web/app/(dashboard)/patients/page.client.tsx] - removido `@ts-nocheck`
- [packages/database/scripts/lib/runtime.ts] - objetos de step passaram a incluir campos opcionais apenas quando definidos, mantendo tipagem valida sem bypass
- [docs/technical-debt/tracker.json] - adicionado `TD-008` como evidência fechada neste ciclo
- [CYCLE_LOG.md] - criado registro canonico da sessao

EVIDENCIA DE VALIDACAO
- [`pnpm typecheck:policy`] -> `[ts-directives-guard] OK` / `Baseline preserved at 608 @ts-nocheck and 0 unjustified @ts-ignore`
- [`pnpm --filter @birthub/database typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm --filter @birthub/database test`] -> `pass 59` / `fail 0` / `skipped 3`
- [`pnpm --filter @birthub/web typecheck`] -> `tests/disabled-domain-pages.test.ts(24,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.`
- [`pnpm typecheck`] -> `packages/queue tests/runtime.test.ts(164,40): error TS7006: Parameter 'request' implicitly has an 'any' type.`

SECURITY GATE (obrigatorio para Trilha B)
[N/A - Trilha A]

ROLLBACK EXECUTADO
[nao]

STATUS
[RESOLVIDO PARCIALMENTE]

RISCO RESIDUAL
[O guardrail de `@ts-nocheck` foi restaurado e `packages/database` voltou a tipar/testar, mas o typecheck global continua bloqueado por `packages/queue/tests/runtime.test.ts:164` e o pacote web continua com erro preexistente em `apps/web/tests/disabled-domain-pages.test.ts:24`.]

ESCALATION NECESSARIO
[nao]

PROXIMO PASSO
[A-002 - Trilha A]

## Candidate Cycles After A-001

- `A-002` - tipar `request` em `packages/queue/tests/runtime.test.ts:164` para destravar o proximo bloqueio do `pnpm typecheck`.
- `A-003` - substituir a atribuicao direta de `process.env.NODE_ENV` em `apps/web/tests/disabled-domain-pages.test.ts:24` por abordagem compativel com Node typings.
- `A-004` - quebrar o debt de lint em `packages/agents-core/src/tools/slack.tool.test.ts`, `packages/agents-core/src/tools/sendEmailTool.test.ts`, `packages/agents-core/src/runtime/intelligence.ts` e `packages/agents-core/src/runtime/manifestRuntime.ts`.

---

CICLO
[A-002]

TRILHA
[A]

OBJETIVO
[Restaurar o `pnpm typecheck` canonico corrigindo os dois bloqueios imediatos restantes em testes de `apps/web` e `packages/queue`.]

ARQUIVOS-ALVO
- [apps/web/tests/disabled-domain-pages.test.ts: eliminar atribuicao incompatível com o tipo de `process.env.NODE_ENV`]
- [packages/queue/tests/runtime.test.ts: alinhar o stub de `upsertRepeatableJob` com a assinatura generica real]
- [docs/technical-debt/tracker.json: registrar o item `PROGRAM-TD-009`]
- [CYCLE_LOG.md: registrar o ciclo]

DIFF GUARD
Arquivos estruturais: [2 / max 5]
Linhas alteradas em hot paths: [25 / max 200]
Excecao justificada: [nao]

TD-IDs AFETADOS
Fechados: [PROGRAM-TD-009 - Canonical typecheck was still blocked by queue and web tests after the ts-directives guard was restored]
Abertos: [N/A]
Bloqueados: [N/A]

GATE DE APROVACAO HUMANA
Necessario: [nao]
Se sim: [N/A]

PROBLEMA CONFIRMADO
[`pnpm --filter @birthub/web typecheck` falhou com output literal `tests/disabled-domain-pages.test.ts(24,15): error TS2540: Cannot assign to 'NODE_ENV' because it is a read-only property.` e `pnpm typecheck` falhou com output literal `packages/queue tests/runtime.test.ts(164,40): error TS7006: Parameter 'request' implicitly has an 'any' type.`]

ALTERACOES REALIZADAS
- [apps/web/tests/disabled-domain-pages.test.ts] - substituidas atribuicoes diretas em `process.env` por `Object.assign(process.env, { ... })`
- [packages/queue/tests/runtime.test.ts] - importado `RepeatableJobRequest` do codigo-fonte, preservada a assinatura generica de `upsertRepeatableJob` e normalizada a leitura de `entry.queue`
- [docs/technical-debt/tracker.json] - adicionado `TD-009` como evidência fechada neste ciclo
- [CYCLE_LOG.md] - append do ciclo A-002 e reordenacao dos proximos candidatos

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/web typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm --filter @birthub/queue typecheck`] -> `tsc --noEmit` finalizou com exit code 0
- [`pnpm --filter @birthub/queue test`] -> `pass 10` / `fail 0`
- [`pnpm typecheck`] -> `apps/web typecheck: Done` / `packages/queue typecheck: Done` / `apps/api typecheck: Done` / `apps/worker typecheck: Done`
- [`pnpm lint`] -> falha residual em `packages/agents-core/src/__tests__/slack.tool.test.ts`, `packages/agents-core/src/tools/sendEmailTool.test.ts`, `packages/agents-core/src/runtime/intelligence.ts` e `packages/agents-core/src/runtime/manifestRuntime.ts`

SECURITY GATE (obrigatorio para Trilha B)
[N/A - Trilha A]

ROLLBACK EXECUTADO
[nao]

STATUS
[RESOLVIDO]

RISCO RESIDUAL
[O typecheck canonico esta verde, mas o lint global continua quebrado em `packages/agents-core` e a shell local segue emitindo warning de engine (`node v25.9.0` vs faixa requerida `>=24 <25`).]

ESCALATION NECESSARIO
[nao]

PROXIMO PASSO
[A-003 - Trilha A]

## Candidate Cycles After A-002

- `A-003` - remover os erros `no-base-to-string` em `packages/agents-core/src/__tests__/slack.tool.test.ts` e `packages/agents-core/src/tools/sendEmailTool.test.ts`.
- `A-004` - quebrar a complexidade/max-lines de `packages/agents-core/src/runtime/intelligence.ts` e `packages/agents-core/src/runtime/manifestRuntime.ts`.
- `A-005` - alinhar o ambiente local com `package.json` (`node >=24 <25`) para eliminar drift de toolchain observado em todos os comandos canônicos.

---

CICLO
[A-003]

TRILHA
[A]

OBJETIVO
[Remover os erros de lint em `agents-core` sem abrir refatoracao estrutural ampla nem tocar fora do escopo aprovado.]

ARQUIVOS-ALVO
- [packages/agents-core/src/__tests__/slack.tool.test.ts: corrigir `no-base-to-string` nas assercoes de request]
- [packages/agents-core/src/tools/sendEmailTool.test.ts: corrigir `no-base-to-string` na leitura do payload]
- [packages/agents-core/src/runtime/intelligence.ts: reduzir max-lines e preservar o contrato publico]
- [packages/agents-core/src/runtime/intelligenceRuntime.ts: concentrar builders premium e exports movidos]
- [packages/agents-core/src/runtime/manifestRuntime.ts: reduzir max-lines e preservar o contrato publico]
- [packages/agents-core/src/runtime/manifestRuntimeCore.ts: concentrar helpers/runtime policy builders]
- [packages/agents-core/src/runtime/manifestRuntimeBuilders.ts: concentrar o builder de output e mesh blueprint]
- [docs/technical-debt/tracker.json: registrar o item `PROGRAM-TD-010`]
- [CYCLE_LOG.md: registrar o ciclo]

DIFF GUARD
Arquivos estruturais: [5 / max 5]
Linhas alteradas em hot paths: [NAO VERIFICADO / max 200]
Excecao justificada: [sim - durante a reconciliacao final o `git status --short` passou a mostrar apenas alteracoes paralelas fora de `agents-core`, entao a contagem final por diff do ciclo nao ficou observavel no worktree; o estado aplicado foi validado diretamente no filesystem e pelos comandos canônicos.]

TD-IDs AFETADOS
Fechados: [PROGRAM-TD-010 - Agents-core lint was blocked by request payload stringification checks and oversized runtime modules]
Abertos: [N/A]
Bloqueados: [N/A]

GATE DE APROVACAO HUMANA
Necessario: [nao]
Se sim: [N/A]

PROBLEMA CONFIRMADO
[`pnpm --filter @birthub/agents-core lint` falhou com output literal em `packages/agents-core/src/__tests__/slack.tool.test.ts` (`no-base-to-string`), `packages/agents-core/src/tools/sendEmailTool.test.ts` (`no-base-to-string`), `packages/agents-core/src/runtime/intelligence.ts` (`max-lines` e `complexity`) e `packages/agents-core/src/runtime/manifestRuntime.ts` (`max-lines` e `complexity`).]

ALTERACOES REALIZADAS
- [packages/agents-core/src/__tests__/slack.tool.test.ts] - adicionados helpers para ler URL/body tipados sem stringificacao insegura
- [packages/agents-core/src/tools/sendEmailTool.test.ts] - adicionada leitura JSON tipada do body capturado
- [packages/agents-core/src/runtime/intelligence.ts] - mantidos tipos e utilitarios publicos com reexport controlado dos builders premium
- [packages/agents-core/src/runtime/intelligenceRuntime.ts] - isolados os builders premium e os exports movidos da camada de inteligencia
- [packages/agents-core/src/runtime/manifestRuntime.ts] - mantidos tipos/contratos com reexport dos builders segmentados
- [packages/agents-core/src/runtime/manifestRuntimeCore.ts] - extraidos helpers compartilhados, policy rules e plan builder
- [packages/agents-core/src/runtime/manifestRuntimeBuilders.ts] - extraido o output builder com mesh blueprint e handoffs
- [docs/technical-debt/tracker.json] - adicionado `TD-010` como evidência fechada neste ciclo
- [CYCLE_LOG.md] - append do ciclo A-003 e da nova fila de candidatos

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/agents-core lint`] -> `✖ 11 problems (0 errors, 11 warnings)`
- [`pnpm --filter @birthub/agents-core typecheck`] -> `tsc --noEmit` finalizou com exit code 0
- [`pnpm --filter @birthub/agents-core test`] -> `pass 26` / `fail 0`
- [`pnpm typecheck`] -> `packages/agents-core typecheck: Done` / `packages/database typecheck: Done` / `apps/web typecheck: Done` / `apps/api typecheck: Done` / `apps/worker typecheck: Done`
- [`pnpm lint`] -> falha residual fora do escopo em `apps/web/app/(dashboard)/dashboard/page.tsx`, `apps/web/app/(dashboard)/patients/[id]/page.client.tsx`, `apps/web/app/(dashboard)/patients/[id]/page.sections.tsx`, `apps/web/app/(dashboard)/patients/page.sections.tsx`, `apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.model.ts`, `apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx`, `apps/web/components/cookie-consent-banner.tsx`, `apps/web/lib/i18n.ts`, `apps/web/tests/dashboard-data.test.ts` e `apps/web/tests/workflow-editor-helpers.test.ts`

SECURITY GATE (obrigatorio para Trilha B)
[N/A - Trilha A]

ROLLBACK EXECUTADO
[nao]

STATUS
[RESOLVIDO PARCIALMENTE]

RISCO RESIDUAL
[O objetivo do ciclo em `agents-core` foi fechado com lint sem erros, typecheck do pacote verde e testes relevantes passando. O `pnpm lint` do monorepo continua quebrado em `apps/web`, fora do escopo aprovado. Na reconciliacao final, `git status --short` mostrou alteracoes paralelas nao executadas por este ciclo em `apps/web/app/(dashboard)/patients/[id]/page.tsx`, `apps/web/app/(dashboard)/patients/page.tsx`, `apps/worker/src/agents/runtime.db-integration.harness.ts`, `packages/agents/executivos/boardprep-ai/agent.ts` e `packages/database/src/client.ts`.]

ESCALATION NECESSARIO
[nao]

PROXIMO PASSO
[A-004 - Trilha A]

## Candidate Cycles After A-003

- `A-004` - reduzir `complexity` e `max-lines` em `apps/web/app/(dashboard)/dashboard/page.tsx` e `apps/web/app/(dashboard)/patients/[id]/page.client.tsx`.
- `A-005` - corrigir os erros de tipagem insegura em `apps/web/app/(dashboard)/patients/[id]/page.sections.tsx`, `apps/web/app/(dashboard)/patients/page.sections.tsx` e `apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx`.
- `A-006` - fechar o restante do lint de `apps/web` em `settings/privacy/privacy-settings-page.model.ts`, `components/cookie-consent-banner.tsx`, `lib/i18n.ts`, `tests/dashboard-data.test.ts` e `tests/workflow-editor-helpers.test.ts`.

---

CICLO
[A-004]

TRILHA
[A]

OBJETIVO
[Endurecer o lint de `apps/web` sem alterar comportamento funcional, fechando o escopo original confirmado e registrando bloqueios reais fora dele.]

STATUS
[RESOLVIDO PARCIALMENTE]

SUBCICLOS
- [A-004.1] - [RESOLVIDO]
- [A-004.2] - [RESOLVIDO]
- [A-004.3] - [RESOLVIDO]
- [A-004.4] - [BLOQUEADO POR ESCOPO]

JUSTIFICATIVA
- [houve avanço estrutural real dentro do escopo aprovado]
- [parte do escopo original foi resolvida]
- [o lint global continua falhando]
- [ainda restam arquivos do escopo original: `apps/web/app/(dashboard)/dashboard/page.tsx` e `apps/web/lib/i18n.ts`]
- [existem erros reais adicionais fora do escopo original aprovado]

PROXIMO PASSO
[A-004.5 - fechar `apps/web/app/(dashboard)/dashboard/page.tsx` e `apps/web/lib/i18n.ts`, rerodando `pnpm --filter @birthub/web lint`, `pnpm lint` e `pnpm typecheck`.]

---

CICLO
[A-004.5]

TRILHA
[A]

OBJETIVO
[Fechar os dois arquivos restantes do escopo original de `apps/web` (`dashboard/page.tsx` e `lib/i18n.ts`) sem alterar comportamento, revalidando `lint` e `typecheck` canônicos.]

ARQUIVOS-ALVO
- [apps/web/app/(dashboard)/dashboard/page.tsx: remover `complexity` e `max-lines`]
- [apps/web/lib/i18n.ts: remover `max-lines`]
- [CYCLE_LOG.md: registrar o fechamento do subciclo]

STATUS
[RESOLVIDO]

RESULTADO
- [`apps/web/app/(dashboard)/dashboard/page.tsx`] - saiu do lint; o arquivo foi reduzido para 494 linhas e o erro de `complexity` deixou de aparecer
- [`apps/web/lib/i18n.ts`] - saiu do lint; o arquivo foi reduzido para 463 linhas sem alterar o conteúdo efetivo dos dicionarios

VALIDACAO
- [`pnpm --filter @birthub/web lint`] -> falha residual fora do escopo original em `apps/web/app/(dashboard)/patients/page.sections.tsx`, `apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.model.ts`, `apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx`, `apps/web/components/cookie-consent-banner.tsx` e `apps/web/tests/dashboard-data.test.ts`
- [`pnpm lint`] -> falha global pelos mesmos erros restantes em `apps/web`; warnings persistem em `packages/workflows-core` e `packages/agents-core`
- [`pnpm typecheck`] -> novo bloqueio fora de `apps/web` em `apps/api/src/modules/clinical/service.ts` com serie de erros Prisma/`TransactionClient`

BLOQUEIOS
- [o lint global continua falhando apenas por arquivos fora do escopo original de A-004.5]
- [o `typecheck` global deixou de estar estabilizado por mudancas reais ja presentes em `apps/api/src/modules/clinical/service.ts`, fora do escopo aprovado]

PROXIMO PASSO
[A-004.6 - tratar apenas os erros confirmados fora do escopo original em `apps/web`; abrir trilha separada para o novo bloqueio de `apps/api` se ele continuar presente.]

---

CICLO
[A-004.6]

TRILHA
[A]

OBJETIVO
[Tratar apenas os errors confirmados fora do escopo original de `apps/web`, sem abrir novos warnings nem expandir o recorte aprovado.]

ARQUIVOS-ALVO
- [apps/web/app/(dashboard)/patients/page.sections.tsx]
- [apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.model.ts]
- [apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx]
- [apps/web/components/cookie-consent-banner.tsx]
- [apps/web/tests/dashboard-data.test.ts]
- [CYCLE_LOG.md: registrar o resultado do subciclo]

STATUS
[RESOLVIDO]

RESULTADO
- [o recorte aprovado deixou de ter errors de lint; a validacao isolada dos cinco arquivos fechou com `0 errors`]
- [`apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx`] - removido o `no-unsafe-argument` remanescente
- [os demais arquivos do recorte permaneceram sem errors; restaram apenas warnings em `apps/web/app/(dashboard)/patients/page.sections.tsx`, fora do escopo deste subciclo]

VALIDACAO
- [`pnpm --filter @birthub/web exec eslint "app/(dashboard)/patients/page.sections.tsx" "app/(dashboard)/settings/privacy/privacy-settings-page.model.ts" "app/(dashboard)/workflows/[id]/revisions/page.tsx" "components/cookie-consent-banner.tsx" "tests/dashboard-data.test.ts"`] -> `0 errors, 23 warnings`, todos concentrados em `apps/web/app/(dashboard)/patients/page.sections.tsx`
- [`pnpm --filter @birthub/web lint`] -> FAIL fora do recorte aprovado, agora com `38 errors` e `172 warnings` em varios arquivos de `apps/web`, incluindo `app/(dashboard)/agents/[id]/policies/page.tsx`, `app/(dashboard)/agents/[id]/run/page.tsx`, `app/(dashboard)/analytics/page.tsx`, `app/(dashboard)/billing/budgets/page.tsx`, `app/(dashboard)/marketplace/page.tsx`, `app/(dashboard)/outputs/page.tsx`, `app/(dashboard)/reports/page.tsx`, `app/(dashboard)/workflows/[id]/edit/page.tsx`, `app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx`, `app/api/bff/[...path]/route.ts`, `instrumentation-client.ts`, `lib/agents.ts`, `lib/auth-client.ts`, `lib/dashboard.ts`, `lib/marketplace-api.server.ts`, `lib/operational-health.ts`, `lib/product-api.server.ts`, `lib/product-capabilities.ts`, `lib/workflows.ts` e `sentry.server.config.ts`
- [`pnpm lint`] -> FAIL pelos mesmos errors atuais de `apps/web`; `packages/workflows-core` e `packages/agents-core` seguiram apenas com warnings
- [`pnpm typecheck`] -> FAIL fora do recorte aprovado em `apps/web/.next/types/**/*.ts`, com serie de `TS6053` por arquivos `.next` ausentes no `tsconfig.json`

BLOQUEIOS
- [o recorte aprovado de `A-004.6` ficou resolvido, mas a baseline global foi reaberta por mudancas paralelas fora do escopo autorizado]
- [o gate global de `typecheck` tambem voltou a falhar fora do recorte, agora por ausencia de arquivos `apps/web/.next/types/**/*.ts`]

PROXIMO PASSO
[Aguardando novo recorte governado para os errors atuais fora do escopo aprovado e para o bloqueio de `.next/types` em `apps/web`.]

---

GOVERNANCA
[2026-04-14]

LOTE ESTRUTURAL
[RESOLVIDO PARCIALMENTE]

STATUS CONSOLIDADO
- [CODE-001] - [RESOLVIDO]
- [CODE-002] - [PARCIAL]
- [CODE-003] - [RESOLVIDO]
- [ARCH-001] - [RESOLVIDO]
- [ARCH-002] - [PARCIAL]
- [ARCH-003] - [RESOLVIDO]
- [CONV-001] - [RESOLVIDO]
- [INFRA-001] - [RESOLVIDO]
- [AUTO-001] - [RESOLVIDO]
- [PROD-001] - [RESOLVIDO]

GATES ACEITOS
- [`pnpm typecheck`] - [PASS]
- [`pnpm test`] - [PASS no escopo relevante reportado]
- [`pnpm lint`] - [FAIL por divida preexistente em `apps/web`]

PROXIMO CICLO APROVADO
[CODE-002.1]

---

CICLO
[CODE-002.1]

TRILHA
[CODE]

OBJETIVO
[Remover a supressao tipada residual critica de `apps/api/src/modules/clinical/service.ts`, substituindo o bypass global por uma fronteira tipada explicita no seam do Prisma clinico sem abrir refatoracao ampla do dominio.]

ARQUIVOS-ALVO
- [apps/api/src/modules/clinical/service.ts: remover `@ts-nocheck` e tipar o acesso aos delegates clinicos em runtime]
- [CYCLE_LOG.md: registrar a governanca e a validacao do ciclo]

DIFF GUARD
Arquivos estruturais: [1 / max 3]
Linhas alteradas em hot paths: [NAO VERIFICADO / max 200]
Excecao justificada: [sim - o fechamento final do workspace nao preservou um diff observavel confiavel para `service.ts`, entao o controle foi feito por arquivo-alvo, typecheck e testes canônicos.]

TD-IDs AFETADOS
Fechados: [N/A]
Abertos: [CODE-002 - Supressoes tipadas residuais ainda existem em `apps/api/src/modules/clinical/router.ts` e `apps/api/src/modules/clinical/schemas.ts`]
Bloqueados: [ARCH-002 - `apps/api/src/modules/clinical/service.ts` segue monolitico apesar da estabilizacao tipada]

GATE DE APROVACAO HUMANA
Necessario: [nao]
Se sim: [N/A]

PROBLEMA CONFIRMADO
[`pnpm --filter @birthub/api typecheck` falhou sem o bypass com erros reais em `apps/api/src/modules/clinical/service.ts`, incluindo `Prisma has no exported member 'PatientWhereInput'`, ausencia de delegates clinicos em `Prisma.TransactionClient` e cascata de `implicit any` derivada dessa perda de contrato.]

ALTERACOES REALIZADAS
- [apps/api/src/modules/clinical/service.ts] - removido `@ts-nocheck`
- [apps/api/src/modules/clinical/service.ts] - criada fronteira tipada local (`ClinicalModelDelegate` / `ClinicalTransactionClient`) para explicitar o seam entre o runtime clinico e o Prisma gerado
- [apps/api/src/modules/clinical/service.ts] - substituidas anotacoes Prisma especificas de modelos clinicos por contratos locais e genericos compativeis com o runtime ativo
- [apps/api/src/modules/clinical/service.ts] - tipados os caminhos de listagem e mutacao clinica para eliminar `implicit any` sem alterar o contrato publico do service
- [CYCLE_LOG.md] - registrada a governanca do lote estrutural e o fechamento deste subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> `[ts-directives-guard] OK` / `Baseline preserved at 581 @ts-nocheck` / `Improvements detected: 150 @ts-nocheck removed from baseline coverage` / `apps/api typecheck: Done`
- [`pnpm --filter @birthub/api test`] -> `tests 155` / `pass 141` / `fail 0` / `skipped 14`

SECURITY GATE (obrigatorio para Trilha B)
[N/A - Trilha CODE]

ROLLBACK EXECUTADO
[nao]

STATUS
[RESOLVIDO]

RISCO RESIDUAL
[O `clinical/service.ts` voltou ao typecheck sem bypass global, mas o `CODE-002` agregado permanece parcial porque `apps/api/src/modules/clinical/router.ts` e `apps/api/src/modules/clinical/schemas.ts` ainda carregam `@ts-nocheck`. O `ARCH-002` agregado tambem segue parcial porque o service continua concentrando muitas responsabilidades em um unico arquivo.]

ESCALATION NECESSARIO
[nao]

PROXIMO PASSO
[ARCH-002.1 - quebrar o monolito remanescente de `apps/api/src/modules/clinical/service.ts` por agregados/casos de uso, mantendo `apps/web` fora desta trilha.]

---

GOVERNANCA
[2026-04-14 - pos ARCH-002.1]

STATUS CONSOLIDADO
- [CODE-002] - [PARCIAL]
- [ARCH-002] - [RESOLVIDO]

GATES ACEITOS
- [`pnpm --filter @birthub/api typecheck`] - [PASS]
- [`pnpm typecheck`] - [PASS]
- [`pnpm --filter @birthub/api test`] - [PASS]

PROXIMO CICLO RECOMENDADO
[CODE-002.2]

---

CICLO
[ARCH-002.1]

TRILHA
[ARCH]

OBJETIVO
[Quebrar o monolito remanescente de `apps/api/src/modules/clinical/service.ts` por agregados/casos de uso, preservando o contrato publico do modulo clinico e mantendo `apps/web` fora deste fluxo.]

ARQUIVOS-ALVO
- [apps/api/src/modules/clinical/service.ts: transformar o arquivo em composicao]
- [apps/api/src/modules/clinical/service-runtime.ts: concentrar runtime/query helpers compartilhados]
- [apps/api/src/modules/clinical/service-patients.ts: extrair o agregado de pacientes, gestacao e neonatal]
- [apps/api/src/modules/clinical/service-appointments.ts: extrair o agregado de agenda]
- [apps/api/src/modules/clinical/service-notes.ts: extrair o agregado de notas clinicas]
- [CYCLE_LOG.md: registrar o ciclo]

DIFF GUARD
Arquivos estruturais: [5 / max 6]
Linhas alteradas em hot paths: [NAO VERIFICADO / max 250]
Excecao justificada: [sim - o refactor foi distribuido em novos arquivos e o worktree final nao preservou um diff confiavel resumido; o controle foi feito por fronteira de arquivos, contrato publico e validacao canonica.]

TD-IDs AFETADOS
Fechados: [ARCH-002 - O service clinico deixou de concentrar todas as responsabilidades em um unico arquivo]
Abertos: [CODE-002 - `apps/api/src/modules/clinical/router.ts` e `apps/api/src/modules/clinical/schemas.ts` ainda mantem `@ts-nocheck`]
Bloqueados: [N/A]

GATE DE APROVACAO HUMANA
Necessario: [nao]
Se sim: [N/A]

PROBLEMA CONFIRMADO
[Mesmo apos `CODE-002.1`, `apps/api/src/modules/clinical/service.ts` ainda concentrava o runtime compartilhado e todos os casos de uso de pacientes, gestacao, neonatal, agenda e notas em um unico arquivo, mantendo o hotspot arquitetural apontado pelo relatorio 02.]

ALTERACOES REALIZADAS
- [apps/api/src/modules/clinical/service.ts] - reduzido a composicao do contrato publico via spread dos agregados
- [apps/api/src/modules/clinical/service-runtime.ts] - extraidos seam do Prisma clinico, query builders, paginacao e helpers compartilhados de detalhe
- [apps/api/src/modules/clinical/service-patients.ts] - extraidos `create/list/get/update/delete patient`, `savePregnancyRecord` e `saveNeonatalRecord`
- [apps/api/src/modules/clinical/service-appointments.ts] - extraidos `list/get/create/update/delete appointment`
- [apps/api/src/modules/clinical/service-notes.ts] - extraidos `list/get history/create/update/delete clinical note`
- [CYCLE_LOG.md] - registrada a governanca pos-ciclo e o fechamento do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> `[ts-directives-guard] OK` / `Baseline preserved at 568 @ts-nocheck` / `Improvements detected: 163 @ts-nocheck removed from baseline coverage` / `apps/api typecheck: Done`
- [`pnpm --filter @birthub/api test`] -> `tests 155` / `pass 141` / `fail 0` / `skipped 14`

SECURITY GATE (obrigatorio para Trilha B)
[N/A - Trilha ARCH]

ROLLBACK EXECUTADO
[nao]

STATUS
[RESOLVIDO]

RISCO RESIDUAL
[O hotspot principal foi quebrado e `service.ts` deixou de ser monolitico, mas a trilha de tipagem residual segue aberta fora deste ciclo em `apps/api/src/modules/clinical/router.ts` e `apps/api/src/modules/clinical/schemas.ts`.]

ESCALATION NECESSARIO
[nao]

PROXIMO PASSO
[CODE-002.2 - remover os `@ts-nocheck` residuais de `apps/api/src/modules/clinical/router.ts` e `apps/api/src/modules/clinical/schemas.ts` sem reabrir `apps/web`.]

---

CICLO
[A-005]

TRILHA
[A]

OBJETIVO
[Sanear o corredor de bootstrap runtime em `apps/api` removendo `@ts-nocheck` apenas do lote minimo aprovado, sem alterar contratos publicos.]

ARQUIVOS-ALVO
- [apps/api/src/observability/otel.ts]
- [apps/api/src/modules/privacy/retention-scheduler.ts]
- [apps/api/src/modules/privacy/router.ts]
- [apps/api/src/modules/webhooks/index.ts]
- [apps/api/src/modules/webhooks/stripe.router.ts]
- [CYCLE_LOG.md: registrar a falha controlada e o rollback]

STATUS
[NAO CORRIGIDO COM SEGURANCA]

PROBLEMA CONFIRMADO
[`pnpm --filter @birthub/api typecheck` falhou no primeiro gate obrigatorio apos a remocao do bypass, com `src/modules/privacy/retention-scheduler.ts(21,7): error TS2322: Type 'RetentionExecutionMode.AUTOMATED' is not assignable to type 'RetentionExecutionMode'.`]

VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> FAIL no primeiro gate obrigatorio por incompatibilidade de tipo em `retention-scheduler.ts`
- [`pnpm typecheck`] -> NAO EXECUTADO por regra de parada

ROLLBACK EXECUTADO
[sim]

RESULTADO
- [o lote tentativo do corredor de bootstrap foi revertido integralmente antes de abrir a recuperacao isolada do scheduler]

PROXIMO PASSO
[A-005.1 - RETENTION SCHEDULER TYPE RECOVERY]

---

CICLO
[A-005.1]

TRILHA
[A]

OBJETIVO
[Recuperar a tipagem do scheduler de retencao em `apps/api/src/modules/privacy/retention-scheduler.ts` sem reabrir o lote inteiro do bootstrap.]

ARQUIVOS-ALVO
- [apps/api/src/modules/privacy/retention-scheduler.ts]
- [CYCLE_LOG.md: registrar o subciclo diagnostico isolado]

STATUS
[RESOLVIDO]

PROBLEMA CONFIRMADO
[O scheduler apontava para `RetentionExecutionMode.AUTOMATED` via `@birthub/database`, enquanto `runRetentionSweep` consome um contrato local de modo (`\"DRY_RUN\" | \"EXECUTE\"`).]

ALTERACOES REALIZADAS
- [apps/api/src/modules/privacy/retention-scheduler.ts] - reconciliado o seam do scheduler para o contrato local derivado de `runRetentionSweep`
- [apps/api/src/modules/privacy/retention-scheduler.ts] - nao houve diff liquido preservado no worktree ao final; o estado reconciliado coincidiu com o conteudo atual de `HEAD`
- [CYCLE_LOG.md] - registrado o rollback de `A-005` e o fechamento de `A-005.1`

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[O scheduler de retencao voltou a um estado tipado compativel com o service atual, mas o corredor restante do bootstrap ainda nao foi retomado; `otel.ts`, `privacy/router.ts`, `webhooks/index.ts` e `stripe.router.ts` continuam fora deste subciclo.]

PROXIMO PASSO
[A-005.2 - retomar o corredor de bootstrap restante em lote limpo, excluindo `retention-scheduler.ts` do novo recorte.]

---

## Governance Status - 2026-04-14

- `CONSOLIDACAO-PRECHECK` = `RESOLVIDO`
- Proximo ciclo aprovado = `PRE-LOTE BASELINE - LINT STABILIZATION`
- `LOTE 1` estrutural = `aguardando baseline minima`

---

CICLO
[PRE-LOTE BASELINE - LINT STABILIZATION]

TRILHA
[BASELINE]

OBJETIVO
[Zerar apenas os errors de lint no recorte autorizado de `apps/web`, sem expandir escopo, sem alterar comportamento e sem iniciar qualquer `STRUCT-*`.]

ARQUIVOS-ALVO
- [apps/web/app/(dashboard)/patients/page.sections.tsx]
- [apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.model.ts]
- [apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx]
- [apps/web/components/cookie-consent-banner.tsx]
- [apps/web/tests/dashboard-data.test.ts]
- [CYCLE_LOG.md]

DIFF GUARD
Arquivos estruturais: [5 / max 5]
Linhas alteradas em hot paths: [NAO VERIFICADO / max 200]
Excecao justificada: [nao]

GATE DE APROVACAO HUMANA
Necessario: [nao]
Se sim: [N/A]

PROBLEMA CONFIRMADO
[O recorte autorizado concentrava 9 errors de lint em `apps/web/app/(dashboard)/patients/page.sections.tsx`, `apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.model.ts`, `apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx`, `apps/web/components/cookie-consent-banner.tsx` e `apps/web/tests/dashboard-data.test.ts`. Apos a correcao local, esse recorte ficou com 0 errors e 23 warnings, mas `pnpm --filter @birthub/web lint` e `pnpm lint` continuam falhando por errors fora do escopo aprovado em `apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx`, `apps/web/app/(dashboard)/workflows/[id]/runs/page.data.ts` e `apps/web/lib/workflows.ts`.]

ALTERACOES REALIZADAS
- [apps/web/app/(dashboard)/patients/page.sections.tsx] - adicionada formatacao defensiva de datas para remover os dois `no-unsafe-argument` sem alterar o rendering
- [apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.model.ts] - removida a dependencia do tipo `StoredSession` no contrato do hook, preservando apenas o cheque de presenca da sessao
- [apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx] - adicionada validacao minima do payload de revisoes antes de popular estado React
- [apps/web/components/cookie-consent-banner.tsx] - removidos imports mortos que geravam `no-unused-vars`
- [apps/web/tests/dashboard-data.test.ts] - substituida a stringificacao generica do `RequestInfo` por resolucao explicita de URL
- [CYCLE_LOG.md] - registrado o fechamento da consolidacao e o bloqueio residual deste ciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/web exec eslint 'app/(dashboard)/patients/page.sections.tsx' 'app/(dashboard)/settings/privacy/privacy-settings-page.model.ts' 'app/(dashboard)/workflows/[id]/revisions/page.tsx' 'components/cookie-consent-banner.tsx' 'tests/dashboard-data.test.ts'`] -> `✖ 23 problems (0 errors, 23 warnings)`
- [`pnpm --filter @birthub/web lint`] -> FAIL fora do escopo aprovado em `apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx`, `apps/web/app/(dashboard)/workflows/[id]/runs/page.data.ts` e `apps/web/lib/workflows.ts`
- [`pnpm lint`] -> FAIL pelos mesmos errors fora do escopo aprovado em `apps/web`
- [`pnpm typecheck`] -> FAIL fora do escopo aprovado em `apps/web/lib/workflows.ts(2,37): error TS2307: Cannot find module '@birthub/workflows-core/nextjs' or its corresponding type declarations.`

ROLLBACK EXECUTADO
[nao]

STATUS
[BLOQUEADO POR ESCOPO]

RISCO RESIDUAL
[O recorte autorizado foi estabilizado quanto a errors de lint, mas a baseline minima global nao foi restabelecida porque ainda existem errors e um bloqueio de typecheck em arquivos de workflow fora do escopo liberado. `LOTE 1` estrutural continua aguardando baseline minima.]

ESCALATION NECESSARIO
[sim - e necessario novo escopo aprovado para os arquivos `apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx`, `apps/web/app/(dashboard)/workflows/[id]/runs/page.data.ts` e `apps/web/lib/workflows.ts` antes de retomar a baseline minima.]

PROXIMO PASSO
[Aguardando autorizacao governada para estender o PRE-LOTE BASELINE aos erros residuais fora do recorte aprovado. Nao iniciar `LOTE 1` enquanto `pnpm lint` e `pnpm typecheck` permanecerem vermelhos fora de escopo.]

---

CICLO
[PRE-LOTE BASELINE - LINT STABILIZATION.1]

TRILHA
[BASELINE]

OBJETIVO
[Concluir o corredor residual de `apps/web` autorizado pela continuacao do pre-lote, ainda sem tocar em `STRUCT-*` nem expandir para pacotes fora de `apps/web`.]

ARQUIVOS-ALVO
- [apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx]
- [apps/web/app/(dashboard)/workflows/[id]/runs/page.data.ts]
- [apps/web/lib/workflows.ts]
- [apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx]
- [CYCLE_LOG.md]

DIFF GUARD
Arquivos estruturais: [4 / max 5]
Linhas alteradas em hot paths: [NAO VERIFICADO / max 200]
Excecao justificada: [nao]

PROBLEMA CONFIRMADO
[Depois que o recorte inicial de `apps/web` deixou de falhar, os errors residuais de lint/typecheck passaram a vir do seam `@birthub/workflows-core/nextjs` em `workflow-editor-helpers.tsx`, `runs/page.data.ts` e `lib/workflows.ts`, mais um `no-unsafe-argument` remanescente em `revisions/page.tsx`.]

ALTERACOES REALIZADAS
- [apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx] - trocado import de `@birthub/workflows-core/nextjs` para o export raiz publico `@birthub/workflows-core`
- [apps/web/app/(dashboard)/workflows/[id]/runs/page.data.ts] - trocado import de `WorkflowCanvas` para o export raiz publico
- [apps/web/lib/workflows.ts] - trocado import de `WorkflowCanvas` para o export raiz publico
- [apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx] - substituido o tipo derivado de `canvasToFlow` por `WorkflowCanvas` direto do pacote publico
- [CYCLE_LOG.md] - registrada a continuacao do pre-lote

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/web typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> `PASS`
- [`pnpm --filter @birthub/web lint`] -> `0 errors, 33 warnings`
- [`pnpm lint`] -> `FAIL` agora fora do escopo autorizado em `packages/database`, incluindo `prisma/seed/tenant.ts`, `src/client.ts`, `test/database-script-pipelines.test.ts`, `test/engagement.test.ts` e `test/maternal-domain.rls.test.ts`

ROLLBACK EXECUTADO
[nao]

STATUS
[BLOQUEADO POR ESCOPO]

RISCO RESIDUAL
[O baseline de `apps/web` foi estabilizado para errors e o typecheck global ficou verde. O gate global de lint continua vermelho, mas o bloqueio restante mudou para `packages/database`, fora do escopo autorizado deste pre-lote. `LOTE 1` estrutural segue aguardando baseline minima global.]

ESCALATION NECESSARIO
[sim - e necessario novo recorte governado para os errors residuais de `packages/database` antes de liberar `LOTE 1`.]

PROXIMO PASSO
[Aguardando autorizacao para um novo PRE-LOTE BASELINE focado em `packages/database` ou outra decisao de governanca equivalente.]

---

CICLO
[A-005.2]

TRILHA
[A]

OBJETIVO
[Retomar o corredor restante de bootstrap em lote limpo, excluindo `apps/api/src/modules/privacy/retention-scheduler.ts`, para remover os bypasses ainda aprovados sem alterar contratos publicos.]

ARQUIVOS-ALVO
- [apps/api/src/observability/otel.ts]
- [apps/api/src/modules/privacy/router.ts]
- [apps/api/src/modules/webhooks/index.ts]
- [apps/api/src/modules/webhooks/stripe.router.ts]
- [CYCLE_LOG.md: registrar a retomada validada do ciclo]

DIFF GUARD
Arquivos estruturais: [4 / max 4]
Linhas alteradas em hot paths: [0 liquidas preservadas / max 200]
Excecao justificada: [sim - os quatro arquivos-fonte ja coincidiam com o estado saneado presente em `HEAD` ao fim da reconciliacao, entao o diff liquido observavel permaneceu apenas no log do ciclo.]

STATUS
[RESOLVIDO]

PROBLEMA CONFIRMADO
[O corredor restante de bootstrap ainda estava no recorte governado de `A-005`, mas precisava ser retomado sem reabrir `retention-scheduler.ts` e com gate estrito de typecheck no pacote `@birthub/api` antes do typecheck global.]

ALTERACOES REALIZADAS
- [apps/api/src/observability/otel.ts] - confirmado em runtime real e reconciliado no estado saneado sem `@ts-nocheck`
- [apps/api/src/modules/privacy/router.ts] - confirmado em runtime real e reconciliado no estado saneado sem `@ts-nocheck`
- [apps/api/src/modules/webhooks/index.ts] - confirmado em runtime real e reconciliado no estado saneado sem `@ts-nocheck`
- [apps/api/src/modules/webhooks/stripe.router.ts] - confirmado em runtime real e reconciliado no estado saneado sem `@ts-nocheck`
- [CYCLE_LOG.md] - registrado o fechamento do retake `A-005.2`

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> `[ts-directives-guard] OK` / `Baseline preserved at 568 @ts-nocheck` / `apps/api typecheck: Done` / `apps/worker typecheck: Done`

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[O corredor de bootstrap aprovado para `A-005` foi retomado e validado. O proximo lote sistêmico permanece fora deste ciclo e depende de nova autorizacao governada para `A-006`.]

PROXIMO PASSO
[Aguardando autorizacao governada para `A-006`.]

---

CICLO
[A-006.1]

TRILHA
[A]

OBJETIVO
[Abrir o runtime critico de `webhooks` como primeiro recorte minimo de `A-006`, removendo `@ts-nocheck` apenas do cluster imediato e preservando o contrato publico.]

ARQUIVOS-ALVO
- [apps/api/src/modules/webhooks/eventBus.ts]
- [apps/api/src/modules/webhooks/router.ts]
- [apps/api/src/modules/webhooks/settings.service.ts]
- [apps/api/src/modules/webhooks/stripe.webhook.processing.ts]
- [apps/api/src/modules/webhooks/stripe.webhook.shared.ts]
- [CYCLE_LOG.md: registrar o subciclo e o bloqueio global fora do escopo]

DIFF GUARD
Arquivos estruturais: [5 / max 5]
Linhas alteradas em hot paths: [10 delecoes liquidas / max 200]
Excecao justificada: [nao]

STATUS
[BLOQUEADO POR ESCOPO]

PROBLEMA CONFIRMADO
[O cluster `webhooks` ainda carregava cinco arquivos runtime com `@ts-nocheck` e era o recorte mais proximo do corredor ja saneado em `A-005`.]

ALTERACOES REALIZADAS
- [apps/api/src/modules/webhooks/eventBus.ts] - removido `@ts-nocheck`
- [apps/api/src/modules/webhooks/router.ts] - removido `@ts-nocheck`
- [apps/api/src/modules/webhooks/settings.service.ts] - removido `@ts-nocheck`
- [apps/api/src/modules/webhooks/stripe.webhook.processing.ts] - removido `@ts-nocheck`
- [apps/api/src/modules/webhooks/stripe.webhook.shared.ts] - removido `@ts-nocheck`
- [CYCLE_LOG.md] - registrado o fechamento governado do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> FAIL fora do recorte aprovado em `apps/web/.next/types/app/(dashboard)/agents/[id]/page.ts`, `apps/web/.next/types/app/(dashboard)/agents/[id]/policies/page.ts` e `apps/web/.next/types/app/(dashboard)/agents/[id]/run/page.ts`, todos com `TS2344` sobre `PageProps`

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[O cluster `webhooks` do runtime da API ficou saneado localmente e com gate do pacote verde, mas o typecheck global nao pode ser aceito enquanto o bloqueio de `apps/web/.next/types` permanecer fora do escopo liberado.]

ESCALATION NECESSARIO
[sim - e necessario decidir se o proximo passo abre um subciclo minimo para o bloqueio global de `apps/web/.next/types` ou se o gate global sera temporariamente segregado para a trilha `A-006`.]

PROXIMO PASSO
[Aguardando autorizacao governada para o proximo subciclo de `A-006` ou para tratar o bloqueio global fora do recorte.]

---

CICLO
[A-006.2]

TRILHA
[A]

OBJETIVO
[Corrigir a origem do bloqueio global de `PageProps` em `apps/web/.next/types` alinhando apenas as pages-fonte de `apps/web/app/(dashboard)/agents/[id]` ao padrao tipado do App Router.]

ARQUIVOS-ALVO
- [apps/web/app/(dashboard)/agents/[id]/page.tsx]
- [apps/web/app/(dashboard)/agents/[id]/policies/page.tsx]
- [apps/web/app/(dashboard)/agents/[id]/run/page.tsx]
- [CYCLE_LOG.md: registrar o subciclo e o novo bloqueio global fora do recorte]

DIFF GUARD
Arquivos estruturais: [3 / max 5]
Linhas alteradas em hot paths: [24 liquidas observadas no recorte / max 200]
Excecao justificada: [nao]

STATUS
[BLOQUEADO POR ESCOPO]

PROBLEMA CONFIRMADO
[O `pnpm typecheck` global deixou de falhar em `apps/web/.next/types/app/(dashboard)/agents/[id]/*` por `TS2344` quando as três pages-fonte de `agents/[id]` foram alinhadas ao padrao de props usado em outros routes do app.]

ALTERACOES REALIZADAS
- [apps/web/app/(dashboard)/agents/[id]/page.tsx] - removido `@ts-nocheck` e alinhada a assinatura da page para `props: { params: Promise<{ id: string }> }`
- [apps/web/app/(dashboard)/agents/[id]/policies/page.tsx] - removido `@ts-nocheck` e alinhada a assinatura da page para `props: { params: Promise<{ id: string }> }`
- [apps/web/app/(dashboard)/agents/[id]/run/page.tsx] - removido `@ts-nocheck` e alinhada a assinatura da page para `props: { params: Promise<{ id: string }> }`
- [CYCLE_LOG.md] - registrado o fechamento governado do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/web typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> FAIL fora do recorte aprovado em `ts-directives-guard`, por novos `@ts-nocheck` em `apps/api/tests/encryption.test.ts`, `packages/database/test/database-availability.test.ts` e `apps/web/lib/sales-os/engine.ts`

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[O bloqueio de `PageProps` em `.next/types` foi removido, mas o gate global agora para num guard de baseline acionado por arquivos fora deste subciclo. Esses arquivos nao foram tocados aqui.]

ESCALATION NECESSARIO
[sim - e necessario decidir se o proximo subciclo abre o guard de baseline nesses tres arquivos fora do recorte ou se essa trilha sera segregada da governanca de `A-006`.]

PROXIMO PASSO
[Aguardando autorizacao governada para o proximo subciclo de `A-006` focado no guard global fora do recorte.]

---

CICLO
[A-006.3]

TRILHA
[A]

OBJETIVO
[Restabilizar a baseline global apos o desbloqueio de `A-006.2`, corrigindo apenas os novos gates reais de `lint` sem alterar comportamento funcional.]

ARQUIVOS-ALVO
- [packages/workflows-core/eslint.config.mjs]
- [packages/workflows-core/tsconfig.eslint.json]
- [apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx]
- [CYCLE_LOG.md: registrar o fechamento do subciclo]

DIFF GUARD
Arquivos estruturais: [3 / max 5]
Linhas alteradas em hot paths: [minimas e locais / max 200]
Excecao justificada: [nao]

STATUS
[RESOLVIDO]

PROBLEMA CONFIRMADO
[Depois que `A-006.2` removeu o bloqueio de `PageProps`, o primeiro erro global real passou a ser um parsing error de ESLint em `packages/workflows-core/test/*.test.ts` por ausencia de projeto tipado para testes. Ao fechar esse ponto, o proximo erro global real apareceu em `apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx`, causado pelo subpath `@birthub/workflows-core/nextjs` apontando para artefatos `dist` inexistentes.]

ALTERACOES REALIZADAS
- [packages/workflows-core/eslint.config.mjs] - override de `test/**/*.ts` passou a usar projeto explicito de lint, desligando `projectService` nesse recorte
- [packages/workflows-core/tsconfig.eslint.json] - novo projeto tipado apenas para o ESLint cobrir `src/**/*.ts` e `test/**/*.ts` sem alterar o build oficial do pacote
- [apps/web/app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx] - trocado import de `@birthub/workflows-core/nextjs` para o export raiz publico `@birthub/workflows-core`
- [CYCLE_LOG.md] - registrado o fechamento governado do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/workflows-core lint`] -> `PASS`
- [`pnpm --filter @birthub/web exec eslint "app/(dashboard)/workflows/[id]/edit/workflow-editor-helpers.tsx"`] -> `PASS`
- [`pnpm --filter @birthub/web lint`] -> `PASS`
- [`pnpm lint`] -> `PASS`
- [`pnpm typecheck`] -> `PASS`

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[Os gates globais de `lint` e `typecheck` voltaram a ficar verdes. Permanecem apenas warnings distribuidos em pacotes fora deste subciclo, sem erro bloqueante.]

PROXIMO PASSO
[Aguardando novo ciclo governado.]

---

CICLO
[A-007]

TRILHA
[A]

OBJETIVO
[Sanear um lote pequeno de routers HTTP diretamente montados no runtime da API, removendo `@ts-nocheck` apenas na borda de entrada e preservando contratos, middlewares e comportamento.]

ARQUIVOS-ALVO
- [apps/api/src/modules/admin/router.ts]
- [apps/api/src/modules/dashboard/router.ts]
- [apps/api/src/modules/sessions/router.ts]
- [apps/api/src/modules/invites/router.ts]
- [apps/api/src/modules/apikeys/router.ts]
- [CYCLE_LOG.md: registrar o fechamento do subciclo]

DIFF GUARD
Arquivos estruturais: [5 / max 5]
Linhas alteradas em hot paths: [0 liquidas observadas no snapshot final / max 200]
Excecao justificada: [sim - ao final da reconciliacao os cinco routers ja coincidiam com o estado saneado observado em `HEAD`, entao o diff liquido persistente ficou apenas no log do ciclo.]

STATUS
[RESOLVIDO]

PROBLEMA CONFIRMADO
[Cinco routers diretamente montados em `apps/api/src/app/module-routes.ts` ainda apareciam na trilha de runtime classificada com `@ts-nocheck`: `admin`, `dashboard`, `sessions`, `invites` e `apikeys`. Todos pertencem a superfícies HTTP operacionais e de alta frequência no runtime real.]

ALTERACOES REALIZADAS
- [apps/api/src/modules/admin/router.ts] - reconciliado no estado saneado sem `@ts-nocheck`
- [apps/api/src/modules/dashboard/router.ts] - reconciliado no estado saneado sem `@ts-nocheck`
- [apps/api/src/modules/sessions/router.ts] - reconciliado no estado saneado sem `@ts-nocheck`
- [apps/api/src/modules/invites/router.ts] - reconciliado no estado saneado sem `@ts-nocheck`
- [apps/api/src/modules/apikeys/router.ts] - reconciliado no estado saneado sem `@ts-nocheck`
- [CYCLE_LOG.md] - registrado o fechamento governado do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> `[ts-directives-guard] OK` / `mounted runtime source: 81 @ts-nocheck` / `[check-runtime-governance] OK` / `typecheck:core` finalizou com exit code 0

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[O lote de borda HTTP permaneceu verde no gate do pacote e no gate global. Restam 81 arquivos ainda classificados como `@ts-nocheck` em runtime montado, concentrados sobretudo em clusters mais profundos de `agents`, `analytics`, `billing`, `connectors`, `organizations`, `users` e `workflows`.]

PROXIMO PASSO
[Aguardando novo ciclo governado.]

---

GOVERNANCA
[2026-04-15 - PRE-LOTE BASELINE - LINT STABILIZATION]

STATUS
[RESOLVIDO]

ESCOPO
[Baseline minima de lint restabelecida sem iniciar nenhum `STRUCT-*`. O recorte efetivo consolidou os erros reais remanescentes em `apps/web`, estabilizou o pacote `packages/testing` para o runner canonico e removeu os bloqueios de `max-lines` / `complexity` do modulo `sales-os` por extracao de helpers e seccoes, sem alterar comportamento funcional.]

VALIDACAO
- [`pnpm --filter @birthub/web lint`] - [PASS]
- [`pnpm lint`] - [PASS]
- [`pnpm typecheck`] - [PASS]

RISCO RESIDUAL
[Persistem warnings distribuidos em suites de teste de `packages/agents-core`, `packages/database`, `packages/queue`, `apps/api` e `apps/worker`, alem do warning local de engine (`node v25.9.0` frente a `>=24 <25`), mas nao ha mais errors bloqueantes no gate canonico.]

LOTE 1 ESTRUTURAL
[AGUARDANDO AUTORIZACAO GOVERNADA]

PROXIMO PASSO
[Se a governanca mantiver a ordem aprovada, o proximo ciclo pode abrir o LOTE 1 estrutural em `STRUCT-004`, depois `STRUCT-008` e por fim `STRUCT-003`.]

---

CICLO
[A-006.5]

TRILHA
[A]

OBJETIVO
[Restabilizar o corredor canonico de typecheck no `apps/web` corrigindo apenas os seams reais expostos pelo runner portatil, sem alterar comportamento funcional.]

ARQUIVOS-ALVO
- [apps/web/stores/toast-store.ts]
- [apps/web/components/sales-os/sdr-automatic-config.ts]
- [CYCLE_LOG.md: registrar o fechamento do subciclo]

DIFF GUARD
Arquivos estruturais: [2 / max 5]
Linhas alteradas em hot paths: [minimas e locais / max 200]
Excecao justificada: [nao]

STATUS
[RESOLVIDO]

PROBLEMA CONFIRMADO
[O `pnpm typecheck` falhou primeiro em `apps/web/stores/toast-store.ts(47)` com `Type '{ createdAt: number; description: string | undefined; ... }' is not assignable to type 'ToastItem' with 'exactOptionalPropertyTypes: true'`. Depois que esse seam foi reconciliado, o proximo bloqueio real ficou concentrado em `apps/web/components/sales-os/sdr-automatic-config.ts`, com `TS2724` porque o arquivo importava `SDR_AUTOMATIC_COPY` e `SDR_AUTOMATIC_LEADS` de `sdr-automatic-data.ts`, embora esses catalogos ja tivessem sido movidos para `sdr-automatic-data.catalog.ts`.] 

ALTERACOES REALIZADAS
- [apps/web/stores/toast-store.ts] - `description` passou a ser injetado no `ToastItem` apenas quando definido, alinhando o store a `exactOptionalPropertyTypes`
- [apps/web/components/sales-os/sdr-automatic-config.ts] - catalogos concretos passaram a ser importados de `sdr-automatic-data.catalog.ts`, preservando os tipos em `sdr-automatic-data.ts`
- [CYCLE_LOG.md] - registrado o fechamento governado do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/web exec eslint components/sales-os/sdr-automatic-config.ts components/sales-os/sdr-automatic-dashboard.ts components/sales-os/sdr-automatic-dashboard.copy.ts components/sales-os/sdr-automatic-support.ts components/sales-os/sdr-automatic-data.ts components/sales-os/sdr-automatic-data.catalog.ts`] -> finalizou com exit code 0
- [`pnpm --filter @birthub/web typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`node scripts/ci/run-with-portable-node.mjs scripts/ci/typecheck-core.mjs`] -> finalizou com exit code 0
- [`pnpm lint`] -> `lint:policy` finalizou com `[lint-policy] OK` e `lint:core` finalizou com exit code 0; restaram apenas warnings nao bloqueantes em `packages/agents-core`, `packages/database`, `packages/queue`, `apps/api` e `apps/worker`
- [`pnpm typecheck`] -> `[ts-directives-guard] OK` / `[check-runtime-governance] OK` / `typecheck:core` finalizou com exit code 0
- [`node --import tsx --test apps/web/tests/sdr-automatic-dashboard.test.ts`] -> `pass 4` / `fail 0`
- [`pnpm --filter @birthub/web test`] -> `pass 48` / `fail 0` / `skipped 4`

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[Os gates canonicos de `lint` e `typecheck` voltaram a ficar verdes, e os testes relevantes do `web` passaram. O worktree segue com alteracoes paralelas fora deste subciclo, sem interferir na validacao executada aqui.]

PROXIMO PASSO
[Aguardando novo ciclo governado.]

---

GOVERNANCA
[2026-04-15 - pos A-006.5]

BASELINE GLOBAL
[RESOLVIDA]

GATES ACEITOS
- [`pnpm typecheck`] - [PASS]
- [`pnpm lint`] - [PASS]
- [`pnpm test`] - [PASS]

RISCO RESIDUAL
[Permanecem warnings distribuidos em suites de teste e o warning de engine local (`node v25.9.0` enquanto o projeto declara `>=24 <25`), mas os tres gates canonicos ficaram verdes com execucao real.]

PROXIMO PASSO
[Aguardando novo ciclo governado.]

---

CICLO
[A-006.5]

TRILHA
[A]

OBJETIVO
[Restabilizar os gates canonicos globais apos o desbloqueio anterior do `typecheck`, corrigindo apenas o erro tipado remanescente de `apps/web` e a falha estrutural do runner de `lint` no Windows.]

ARQUIVOS-ALVO
- [apps/web/components/sales-os/SdrAutomaticPlatform.tsx]
- [apps/web/app/(dashboard)/dashboard/page.sections.tsx]
- [scripts/ci/lint-core.mjs]
- [CYCLE_LOG.md: registrar o fechamento do subciclo]

DIFF GUARD
Arquivos estruturais: [4 / max 5]
Linhas alteradas em hot paths: [NAO VERIFICADO / max 200]
Excecao justificada: [sim - no snapshot final do worktree os dois arquivos-fonte de `apps/web` ja coincidiam com o estado saneado observado no filesystem, entao o diff liquido observavel permaneceu concentrado no runner de lint e no log do ciclo.]

STATUS
[RESOLVIDO]

PROBLEMA CONFIRMADO
[O gate global de `typecheck` ainda expunha dois pontos remanescentes no `web`: `currentView` podia permanecer indefinido em `apps/web/components/sales-os/SdrAutomaticPlatform.tsx`, e a indexacao direta de `premiumDashboardMetrics` / `premiumDashboardMetricSubtitles` em `apps/web/app/(dashboard)/dashboard/page.sections.tsx` continuava larga demais para o runner canonico com Node portatil. Depois disso, o `pnpm lint` deixou de falhar por codigo e passou a falhar estruturalmente em `scripts/ci/lint-core.mjs`, que ainda acoplava o runner ao arquivo interno `node_modules/eslint/bin/eslint.js` em vez do executavel estavel de `node_modules/.bin`.]

ALTERACOES REALIZADAS
- [apps/web/components/sales-os/SdrAutomaticPlatform.tsx] - fallback de `currentView` trocado para `views.at(0)` com short-circuit explicito para lista vazia
- [apps/web/app/(dashboard)/dashboard/page.sections.tsx] - trocada a indexacao direta das metricas premium por destructuring com defaults locais, garantindo `string` no runner tipado canonico
- [scripts/ci/lint-core.mjs] - runner trocado do arquivo interno do pacote para `node_modules/.bin/eslint.cmd` no Windows e `node_modules/.bin/eslint` nas demais plataformas
- [CYCLE_LOG.md] - registrado o fechamento governado do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/web typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm --filter @birthub/web lint`] -> `eslint .` finalizou com exit code 0
- [`pnpm typecheck`] -> `[ts-directives-guard] OK` / `[check-runtime-governance] OK` / `typecheck:core` finalizou com exit code 0
- [`pnpm lint`] -> `lint:policy` finalizou com `[lint-policy] OK` e `lint:core` finalizou com exit code 0; restaram apenas warnings em `packages/agents-core`, `packages/database`, `packages/queue`, `apps/api` e `apps/worker`
- [`pnpm test`] -> `pnpm test:core` finalizou com exit code 0

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[A baseline global ficou verde em `typecheck`, `lint` e `test`. Restam apenas warnings nao bloqueantes e o warning de engine local, sem impedir a validacao canonica do repositório.]

PROXIMO PASSO
[Aguardando novo ciclo governado.]

---

CICLO
[A-006.4]

TRILHA
[A]

OBJETIVO
[Restabilizar o gate canonico de `@birthub/api` apos drift de tipagem em `openapi.ts`, sem alterar o payload publicado nem expandir o recorte alem do documento OpenAPI da API.]

ARQUIVOS-ALVO
- [apps/api/src/docs/openapi.ts]
- [CYCLE_LOG.md: registrar o fechamento do subciclo]

DIFF GUARD
Arquivos estruturais: [1 / max 5]
Linhas alteradas em hot paths: [0 liquidas observadas no snapshot final / max 200]
Excecao justificada: [sim - a reconciliacao do documento convergiu para o estado tipado limpo sem deixar diff liquido observavel no arquivo-fonte, entao o diff final do subciclo ficou apenas no log.]

STATUS
[RESOLVIDO]

PROBLEMA CONFIRMADO
[`pnpm --filter @birthub/api typecheck` falhou em `tests/openapi-contract.test.ts` com output literal `Property '/api/v1/auth/logout-all' does not exist on type ...` e `Element implicitly has an 'any' type because expression of type '"/api/v1/clinical"' can't be used to index type ...`, expondo que `openApiDocument.paths` estava estreito demais para os asserts negativos do contrato.]

ALTERACOES REALIZADAS
- [apps/api/src/docs/openapi.ts] - reconciliado o shape tipado do documento para expor `paths` como `Record<string, JsonSchema>` sem alterar o payload OpenAPI publicado
- [CYCLE_LOG.md] - registrado o fechamento governado do subciclo

EVIDENCIA DE VALIDACAO
- [`pnpm --filter @birthub/api typecheck`] -> `tsc -p tsconfig.json --noEmit` finalizou com exit code 0
- [`pnpm typecheck`] -> `[ts-directives-guard] OK` / `[check-runtime-governance] OK` / `typecheck:core` finalizou com exit code 0

ROLLBACK EXECUTADO
[nao]

RISCO RESIDUAL
[O gate canonico voltou a ficar verde. Permanece apenas o warning de engine local (`node v25.9.0` vs faixa `>=24 <25`), sem bloquear a validacao por usar o portable node nos checks centrais.]

PROXIMO PASSO
[Aguardando novo ciclo governado.]
