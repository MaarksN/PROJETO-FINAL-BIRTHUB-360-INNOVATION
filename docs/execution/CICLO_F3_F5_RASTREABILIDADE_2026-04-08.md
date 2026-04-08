# Ciclo F3-F5 - Rastreabilidade, Gates e Backlog Residual

## Objetivo do ciclo
Consolidar a rastreabilidade das Fases 3, 4 e 5 no estado real do repositorio, classificando o que foi resolvido, o que ficou mitigado e o que segue aberto com risco operacional.

## Itens do relatorio atacados
- [x] Fase 3 revalidada com evidencia de seguranca, privacidade e interoperabilidade minima
- [x] Fase 4 revalidada com evidencia de UX central, busca, conversations e dark mode
- [x] Fase 5 revalidada com evidencia de deploy canonico, SBOM, coverage gate e governanca
- [x] Checklist mestre de avancao reclassificado com base em codigo, testes e artefatos reais
- [x] Backlog residual priorizado materializado para o proximo ciclo logico

## Rastreabilidade
| Item | Fase | Evidencia no codigo | Status | Risco residual |
| --- | --- | --- | --- | --- |
| CSP enforcement, SRI, headers e `Permissions-Policy` | Fase 3 | `packages/security/index.ts`, `apps/web/next.config.mjs`, `apps/web/public/.well-known/security.txt` | resolvido | Endurecimento adicional de inline script/style ainda depende de rollout gradual e validacao em CI/staging |
| LGPD real, retencao/anonymizacao e consentimento auditavel | Fase 3 | `apps/api/src/modules/privacy/router.ts`, `apps/api/src/modules/privacy/consent.service.ts`, `apps/api/src/modules/privacy/retention.service.ts`, `apps/web/app/(dashboard)/settings/privacy/privacy-settings-page.tsx` | resolvido | Dry-run e evidencia operacional de retencao em staging ainda nao foram executados |
| Argon2id, hash de IP, lockout MFA, rotacao de segredos e endurecimento de webhooks | Fase 3 | `apps/api/src/modules/auth/crypto.ts`, `apps/api/src/modules/auth/auth.service.sessions.ts`, `apps/api/src/modules/webhooks/stripe.webhook.shared.ts`, `apps/worker/src/worker.job-validation.ts` | resolvido | Rehearsal de rotacao e verificacao fora do ambiente local ainda pendentes |
| Break-glass auditado e FHIR R4 minimo | Fase 3 | `apps/api/src/modules/break-glass/router.ts`, `apps/api/src/middleware/break-glass-audit.ts`, `apps/api/src/modules/fhir/router.ts`, `apps/api/src/modules/fhir/service.ts` | resolvido | Escopo FHIR segue minimo e o processo de uso excepcional ainda precisa evidencia operacional em staging |
| Dashboard home, workflow list, notifications, onboarding, analytics, conversations, reports e busca global | Fase 4 | `apps/web/app/(dashboard)/dashboard/page.tsx`, `apps/web/app/(dashboard)/workflows/page.tsx`, `apps/web/app/(dashboard)/notifications/page.tsx`, `apps/web/app/(dashboard)/conversations/page.tsx`, `apps/web/app/(dashboard)/reports/page.tsx`, `apps/web/components/layout/GlobalSearch.tsx`, `apps/api/src/modules/search/router.ts`, `apps/api/src/modules/conversations/router.ts` | resolvido | Validacao de usabilidade fora do ambiente local e smoke end-to-end autenticado ainda nao foram repetidos apos a consolidacao |
| Dark mode persistido e cliente de produto coberto por testes | Fase 4 | `apps/web/providers/ThemeProvider.tsx`, `apps/web/tests/theme-provider.test.ts`, `apps/web/tests/product-api.test.ts` | resolvido | Persistencia foi validada localmente; falta revalidar em navegadores reais na trilha de release |
| Deploy canonico em Cloud Run com preflight, smoke, E2E e rollback gate | Fase 5 | `.github/workflows/cd.yml`, `infra/cloudrun/service.yaml`, `docs/runbooks/deploy-canonical-stack.md`, `docs/runbooks/rollback-canonical-stack.md` | mitigado | A trilha esta definida, mas staging e producao ainda nao foram revalidados neste ciclo com evidencia nova |
| SBOM, security scan e Renovate | Fase 5 | `.github/workflows/security-scan.yml`, `scripts/release/generate-sbom.mjs`, `renovate.json`, `.github/workflows/renovate.yml` | resolvido | Parte do valor real continua dependente da execucao recorrente em CI e das credenciais do ambiente |
| Coverage gate e baseline de qualidade | Fase 5 | `scripts/coverage/baseline.json`, `scripts/coverage/check.mjs`, `artifacts/coverage/summary.json`, `docs/evidence/test-coverage-dashboard.md` | mitigado | O gate agora executa ate o fim, mas falha por threshold em `@birthub/api`, `@birthub/web`, `@birthub/worker`, `@birthub/database` e `@birthub/agents-core` |
| Dead code e governanca de monorepo | Fase 5 | `knip.json`, `package.json`, `.github/workflows/quality-governance.yml` | aberto | `pnpm quality:dead-code` ainda retorna muito ruido e achados reais, sem segmentacao suficiente por workspace |

## Checklist mestre atual
### Gate para sair de RED
- [x] TD-001 a TD-008 tratados com evidencia real
- [x] dominio minimo definido
- [x] dashboard funcional existe
- [x] workflow list existe
- [x] CI de integracao real existe
- [x] CSP real existe
- [x] LGPD real existe

### Gate para sair de BLUE
- [x] dominio implementado ponta a ponta
- [x] seguranca/compliance endurecidos
- [x] UX central funcional
- [x] deploy canonico definido
- [x] docs minimas publicadas

### Gate para sair de YELLOW
- [ ] observabilidade e rollback
- [ ] backups e restores
- [ ] E2E critico
- [ ] baseline de performance
- [ ] qualidade de codigo endurecida

## Leitura do estado atual
- O projeto ja saiu dos bloqueadores estruturais de dominio, UX central e seguranca basica.
- O estado atual do monorepo mostra um produto funcional e um lane canonico de deploy definido, com evidencias materiais em codigo, workflows e docs.
- O que ainda segura o projeto em `YELLOW` nao e mais ausencia de implementacao principal, e sim maturidade operacional e governanca: coverage abaixo do baseline, `knip` com ruido e pendencias reais, validacao de staging/rollback/backups ainda sem evidencia nova.
- O proximo plano logico deixou de ser "construir features" e passou a ser "fechar residual operacional com priorizacao e rastreabilidade".

## Decisoes arquiteturais
- Consolidar a rastreabilidade das Fases 3 a 5 em um documento unico de execucao, em vez de espalhar o estado atual entre multiplos ciclos sem visao residual.
- Classificar os itens como `resolvido`, `mitigado` ou `aberto`, para separar lacunas de implementacao de lacunas de rollout/governanca.
- Tratar `coverage:check` como gate valido agora que a falha estrutural de limpeza no Windows foi removida; o problema restante passa a ser de threshold, nao de ferramenta.
- Manter `quality:dead-code` como gate vermelho util, mas registrar explicitamente que o proximo ciclo deve reduzir ruido de configuracao do `knip` antes de converter todo achado em backlog de codigo.

## Plano executavel
- passo 1: estabilizar a governanca de qualidade, refinando `knip` por workspace e convertendo os maiores achados em backlog rastreavel
- passo 2: elevar coverage nos cinco alvos reprovados, priorizando `@birthub/web`, `@birthub/api` e `@birthub/agents-core`
- passo 3: reexecutar a trilha canonica em staging com evidencia de preflight, smoke, E2E, rollback e backup/restore
- passo 4: reclassificar o gate mestre de `YELLOW` para `GREEN` somente apos coverage, dead code e validacao operacional convergirem

## Backlog residual priorizado
### P0
- Refinar `knip.json` para reduzir falso positivo estrutural e separar melhor os workspaces do monorepo.
- Subir o coverage de `@birthub/web` acima de `55%` em linhas, statements e functions.
- Subir o coverage de `@birthub/api` acima de `70%` em linhas, statements e functions.
- Corrigir a folga de `@birthub/database`, hoje em `79.31%`, para ultrapassar o baseline de `80%`.

### P1
- Subir o coverage de `@birthub/worker` e `@birthub/agents-core`, hoje abaixo do baseline definido.
- Materializar evidencia nova de staging para preflight, smoke, E2E critico e rollback rehearsal.
- Executar e registrar backup/restore com evidencia operacional vinculada ao lane canonico.

### P2
- Endurecer o CSP alem do baseline atual, reduzindo dependencias de inline style/script onde o frontend ainda exigir excecoes.
- Ampliar o escopo de interoperabilidade e compliance apenas apos os gates operacionais de Fase 5 ficarem verdes.

## Arquivos impactados
- criar:
  - `docs/execution/CICLO_F3_F5_RASTREABILIDADE_2026-04-08.md`
- alterar:
  - nenhum
- remover:
  - nenhum

## Checklist de implementacao
- [ ] migrations
- [ ] rotas
- [ ] servicos
- [ ] validacoes de dominio novas
- [x] docs
- [x] rastreabilidade
- [x] backlog priorizado

## Validacao
### Local
- [x] validacao local concluida

Resultados locais considerados nesta consolidacao:
- `pnpm release:sbom` passou.
- `pnpm coverage:check` executou ate o fim e gerou `artifacts/coverage/summary.json`.
- `pnpm quality:dead-code` falhou com achados reais e ruido configuracional, servindo como entrada do backlog residual.

### CI
- [ ] validacao em CI concluida

### Staging
- [ ] validacao em staging concluida

## Status
- [ ] RED
- [ ] BLUE
- [x] YELLOW
- [ ] GREEN

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
