# Template de Execucao por Ciclo

## Objetivo do ciclo
Executar a Fase 3 do BirthHub 360, fechando gaps criticos de seguranca, privacidade, LGPD e interoperabilidade minima com implementacoes reais, auditaveis e validaveis.

## Itens do relatorio atacados
- [x] `packages/security` completo
- [x] CSP enforcement, SRI, `Permissions-Policy` e headers de seguranca
- [x] Fluxo de consentimento LGPD com revogacao
- [x] Politica de retencao e anonimizacao com execucao auditavel
- [x] FHIR R4 no escopo minimo necessario
- [x] Break-glass auditado
- [x] Argon2id, hash de IP em sessoes e bloqueio pos-falhas MFA
- [x] `security.txt`, rotacao de segredos, scan de segredos e endurecimento de webhooks

## Leitura do estado atual
- O repositorio ja possuia base multi-tenant, auditoria, autenticacao com sessoes e um monorepo organizado em `apps/*` e `packages/*`.
- Havia estrutura parcial para privacidade, auth e webhooks, mas varios pontos do relatorio ainda estavam cosmeticos ou incompletos: `packages/security` estava superficial, consentimento LGPD nao fechava o ciclo ponta a ponta e nao existia baseline FHIR R4.
- A camada web ainda precisava aplicar CSP enforced e headers defensivos compartilhados; o endurecimento de segredos e webhook tambem nao estava consolidado com fallback/rotacao.
- O principal bloqueio de execucao foi costurar mudancas cross-cutting entre schema, API, worker, web e testes sem quebrar a suite existente.

## Decisoes arquiteturais
- Centralizar headers, CSP, politicas de navegador, scan de segredos e utilitarios de IP em `@birthub/security`, para evitar drift entre `api`, `web` e `worker`.
- Persistir consentimento LGPD, revogacao e historico em modelos dedicados com trilha de auditoria, em vez de tratar banner/preferencias apenas como estado de UI.
- Implementar retencao/anonymizacao como politica configuravel por tenant com servico, scheduler e execucoes auditaveis, em vez de scripts avulsos.
- Endurecer autenticacao com Argon2id, hash de IP e lockout MFA sem quebrar compatibilidade de hashes legados, usando migracao progressiva via rehash no login.
- Expor FHIR R4 apenas no escopo minimo defendivel (`metadata`, `Patient` e `Appointment`) sobre o dominio existente, em vez de tentar cobrir o padrao inteiro de uma vez.
- Alternativas descartadas:
  - Manter CSP apenas em report-only: descartado por nao reduzir risco real imediato.
  - Implementar consentimento apenas em `user_preferences`: descartado por nao atender LGPD nem auditoria.
  - Criar um modulo FHIR separado do contexto autenticado atual: descartado por aumentar superficie sem ganho no ciclo.

## Plano executavel
- Passo 1: completar `packages/security`, ativar CSP enforced e aplicar headers reais no `web`.
- Passo 2: persistir consentimento LGPD, retencao/anonymizacao, scheduler e trilha de auditoria na API.
- Passo 3: endurecer hashing, sessoes, MFA, segredos e validacao de webhooks na API e no worker.
- Passo 4: adicionar break-glass auditado, baseline FHIR R4 e UI de privacidade com loading/error/empty states.
- Passo 5: validar com typecheck e suites de testes de `config`, `security`, `api` e `web`.

## Arquivos impactados
- Criar:
  - `apps/api/src/modules/break-glass/router.ts`
  - `apps/api/src/modules/fhir/router.ts`
  - `apps/api/src/modules/fhir/service.ts`
  - `apps/api/src/modules/privacy/consent.service.ts`
  - `apps/api/src/modules/privacy/retention-scheduler.ts`
  - `apps/api/src/modules/privacy/retention.service.ts`
  - `apps/api/tests/fhir-router.test.ts`
  - `apps/web/public/.well-known/security.txt`
  - `apps/web/public/security.txt`
  - `packages/database/prisma/migrations/20260407000200_phase3_security_compliance/migration.sql`
  - `packages/security/index.js`
- Alterar:
  - `apps/api/package.json`
  - `apps/api/src/app/core.ts`
  - `apps/api/src/app/module-routes.ts`
  - `apps/api/src/middleware/break-glass-audit.ts`
  - `apps/api/src/modules/auth/auth.service.credentials.ts`
  - `apps/api/src/modules/auth/auth.service.sessions.ts`
  - `apps/api/src/modules/auth/crypto.ts`
  - `apps/api/src/modules/privacy/router.ts`
  - `apps/api/src/modules/privacy/service.ts`
  - `apps/api/src/modules/webhooks/stripe.webhook.shared.ts`
  - `apps/api/tests/billing.webhook.test.ts`
  - `apps/api/tests/module-routes.test.ts`
  - `apps/api/tests/test-config.ts`
  - `apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.tsx`
  - `apps/web/components/cookie-consent-banner.tsx`
  - `apps/web/next.config.mjs`
  - `apps/web/package.json`
  - `apps/worker/package.json`
  - `apps/worker/src/worker.job-validation.ts`
  - `apps/worker/src/worker.process-job.ts`
  - `packages/config/src/api.config.test.ts`
  - `packages/config/src/api.config.ts`
  - `packages/config/src/worker.config.test.ts`
  - `packages/config/src/worker.config.ts`
  - `packages/database/prisma/schema.prisma`
  - `packages/security/index.ts`
- Remover:
  - nenhum

## Checklist de implementacao
- [x] migrations
- [x] rotas
- [x] servicos
- [x] validacoes
- [x] UI
- [x] loading/error/empty
- [x] testes
- [x] docs

## Implementacao
- `@birthub/security` passou a fornecer saneamento HTML, rate limit helper, varredura de segredos, CSP, `Permissions-Policy`, headers compartilhados, SRI e hash/masking de IP.
- O `web` passou a publicar `security.txt`, aplicar CSP enforced, SRI e headers defensivos via `next.config.mjs`, alem de ligar o banner de cookies ao fluxo real de consentimento LGPD.
- A API ganhou persistencia de consentimentos, historico, politicas de retencao/anonymizacao, execucao manual/agendada e baseline FHIR R4 autenticado com auditoria.
- Auth e sessoes foram endurecidos com Argon2id, fallback controlado de segredos, hash de IP, lockout MFA, sessao break-glass auditada e tratamento seguro para rotacao/refresh.
- Worker e webhooks passaram a aceitar rotacao segura de segredos por fallback, sem abrir mao da validacao criptografica.

## Validacao
### Local
- [x] validacao local concluida

Resultados locais executados:
- `pnpm --filter @birthub/config test` passou.
- `pnpm --filter @birthub/security build` passou.
- `pnpm --filter @birthub/security test` passou.
- `pnpm --filter @birthub/api typecheck` passou.
- `node --import tsx --test apps/api/tests/fhir-router.test.ts apps/api/tests/module-routes.test.ts apps/api/tests/security.test.ts apps/api/tests/webhooks.security.test.ts apps/api/tests/billing.webhook.test.ts` passou.
- `pnpm --filter @birthub/web typecheck` passou.
- `pnpm --filter @birthub/web test` passou.
- `pnpm --filter @birthub/api test` passou com `93` testes verdes e `1` skipped.

### CI
- [ ] validacao em CI concluida

### Staging
- [ ] validacao em staging concluida

## Status
- [ ] RED
- [ ] BLUE
- [x] YELLOW
- [ ] GREEN

Justificativa do status:
- O escopo da Fase 3 foi implementado e a validacao local ficou verde no recorte completo de `config`, `security`, `api` e `web`.
- O status permanece `YELLOW` porque ainda nao houve validacao em CI nem passagem em staging para confirmar rollout e postura operacional fora do ambiente local.

## Prompt
Voce esta executando um ciclo arquitetural do plano BirthHub 360.
Ataque apenas os itens listados neste ciclo.
Entregue:
A. Leitura do estado atual
B. Decisoes arquiteturais
C. Plano executavel do ciclo atual
D. Implementacao
E. Validacao
F. Status
