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
| Coverage gate e baseline de qualidade | Fase 5 | `scripts/coverage/baseline.json`, `scripts/coverage/check.mjs`, `artifacts/coverage/summary.json`, `docs/evidence/test-coverage-dashboard.md` | mitigado | O dashboard local voltou a `PASS`, mas `scripts/coverage/check.mjs` ainda sinaliza `module coverage sufficiency: WARN` em modo `static-coverage-proxy`, exigindo revalidacao antes do proximo gate de release |
| Dead code e governanca de monorepo | Fase 5 | `knip.json`, `knip.satellites.json`, `package.json`, `apps/api/package.json`, `packages/agents-core/package.json`, `packages/emails/package.json`, `.github/workflows/quality-governance.yml` | mitigado | O lane core de `pnpm quality:dead-code` agora ficou concentrado em `34` arquivos nao referenciados, `68` exports nao usados, `1` duplicate export e apenas `4` hints de configuracao; o lane satelite foi separado e ainda mostra backlog proprio com `29` arquivos nao usados e inconsistencias de dependencias/exportacoes |

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
- O que ainda segura o projeto em `YELLOW` nao e mais ausencia de implementacao principal, e sim maturidade operacional e governanca: o lane de coverage local passou a baseline numerica, mas ainda precisa revalidacao confiavel fora do modo `static-coverage-proxy`; o `knip` do core foi limpo, porem restam arquivos/exportacoes realmente orfaos; staging/rollback/backups seguem sem evidencia nova.
- O proximo plano logico deixou de ser "construir features" e passou a ser "fechar residual operacional com priorizacao e rastreabilidade".

## Decisoes arquiteturais
- Consolidar a rastreabilidade das Fases 3 a 5 em um documento unico de execucao, em vez de espalhar o estado atual entre multiplos ciclos sem visao residual.
- Classificar os itens como `resolvido`, `mitigado` ou `aberto`, para separar lacunas de implementacao de lacunas de rollout/governanca.
- Tratar `coverage:check` como gate local aceitavel para baseline, mas registrar explicitamente o risco residual do modo `static-coverage-proxy` antes de usar o resultado como criterio final de release.
- Separar a governanca de dead code entre lane core e lane satelite, para que o go-live do nucleo nao continue contaminado por sinais de dominos paralelos e artefatos de authoring.
- Manter `quality:dead-code` como gate vermelho util, reduzindo primeiro o ruido configuracional do `knip` para que o backlog residual passe a refletir majoritariamente achados reais.

## Plano executavel
- passo 1: converter os `34` arquivos nao usados, os `68` exports nao usados e o `1` duplicate export restantes do lane core em backlog rastreavel de remocao ou reintegracao
- passo 2: revalidar coverage fora do modo `static-coverage-proxy`, preservando o baseline numerico atual
- passo 3: reexecutar a trilha canonica em staging com evidencia de preflight, smoke, E2E, rollback e backup/restore
- passo 4: reclassificar o gate mestre de `YELLOW` para `GREEN` somente apos coverage, dead code e validacao operacional convergirem

## Backlog residual priorizado
### P0
- Atacar os `34` arquivos nao usados, os `68` exports nao usados e o `1` duplicate export que restaram no lane core apos o ajuste por workspace do `knip`.
- Revalidar `coverage:check` em modo confiavel fora do `static-coverage-proxy`, preservando o dashboard local hoje em `PASS`.

### P1
- Reduzir o backlog do lane satelite (`29` arquivos nao usados, `5` dependencias nao usadas, `4` devDependencies nao usadas, `32` unlisted dependencies e `86` exports nao usados).
- Materializar evidencia nova de staging para preflight, smoke, E2E critico e rollback rehearsal.
- Executar e registrar backup/restore com evidencia operacional vinculada ao lane canonico.

### P2
- Endurecer o CSP alem do baseline atual, reduzindo dependencias de inline style/script onde o frontend ainda exigir excecoes.
- Ampliar o escopo de interoperabilidade e compliance apenas apos os gates operacionais de Fase 5 ficarem verdes.

## Arquivos impactados
- criar:
  - `docs/execution/CICLO_F3_F5_RASTREABILIDADE_2026-04-08.md`
- alterar:
  - `knip.json`
  - `knip.satellites.json`
  - `package.json`
  - `apps/api/package.json`
  - `packages/agents-core/package.json`
  - `packages/emails/package.json`
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
- `node scripts/coverage/check.mjs` executou ate o fim; `docs/evidence/test-coverage-dashboard.md` ficou em `PASS`, mas o runner ainda reportou `module coverage sufficiency: WARN`.
- `pnpm quality:dead-code` continua falhando, mas o sinal do lane core melhorou para `34` arquivos nao usados, `68` exports nao usados, `1` duplicate export e apenas `4` hints de configuracao.
- `pnpm quality:dead-code:satellites` passou a existir em configuracao separada e revelou backlog proprio com `29` arquivos nao usados, `5` dependencias nao usadas, `4` devDependencies nao usadas, `32` unlisted dependencies, `86` exports nao usados e `8` duplicate exports.
- As `3` unlisted dependencies restantes do pacote de emails foram eliminadas ao declarar `react` em `packages/emails/package.json`.

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
