# F6 — GAPS DE PRODUCAO REAL

## Escopo executado

- Fase executada: `F6 — Gaps de Producao Real`
- Repositorio-alvo: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Branch canonica: `main`
- Commit de referencia: `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`
- Core em foco nesta fase:
  - `apps/web`
  - `apps/api`
  - `apps/worker`
  - `packages/database`
- Regra de classificacao aplicada:
  - legados so sao elevados a bloqueador quando ha evidencia objetiva de dependencia do core no caminho critico;
  - conflitos documentais e residuos de legado sem prova de dependencia direta entram como gap/risk, nao como bloqueador automatico.

## Evidencias-base consultadas

- `docs/release/2026-03-20-go-live-runbook.md`
- `.env.example`
- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`
- `infra/monitoring/alert.rules.yml`
- `infra/terraform/main.tf`
- `scripts/release/preflight-env.ts`
- `scripts/ci/full.mjs`
- `docs/observability-alerts.md`
- `docs/security-pr-acceptance.md`
- `docs/service-criticality.md`
- `docs/service-catalog.md`
- `packages/database/docs/BACKUP_RECOVERY.md`
- `packages/database/docs/MIGRATIONS.md`
- `packages/database/docs/F8_IMPLEMENTATION.md`
- `apps/api/src/lib/health.ts`
- `apps/web/app/health/route.ts`
- `apps/worker/src/index.ts`

## Controles de producao ja presentes no core

- Existe lane de CI do core com `preflight:core`, `workspace:audit`, `lint:core`, `typecheck:core`, `test:core`, `test:isolation` e `build:core` em `scripts/ci/full.mjs`.
- A pipeline de CI em `.github/workflows/ci.yml` ja executa lockfile governance, gitleaks, guardrails de seguranca, plataforma, workflow-suite, governance gates e um lane separado para satelites/legados.
- O lane de CD em `.github/workflows/cd.yml` ja possui `staging-preflight`, geracao de SBOM e hooks de deploy para staging/producao.
- O core de dados tem runbooks e scripts versionados para migracao segura, drift check, backup, restore e disaster recovery em `packages/database/docs/*` e `scripts/ops/*`.
- A API canonica possui health/deep health com checagem de banco, Redis e dependencias externas em `apps/api/src/lib/health.ts`.

## Gaps de producao

| Gap | Evidencia da ausencia ou fragilidade | Impacto tecnico | Impacto de negocio | Severidade | Acao recomendada |
| --- | --- | --- | --- | --- | --- |
| Rehearsal de staging/producao ainda nao esta reproduzivel no workspace auditado | `docs/release/2026-03-20-go-live-runbook.md` registra `pnpm release:preflight:staging` e `pnpm release:preflight:production` como bloqueados por ausencia de `.env.staging` e `.env.production`; `scripts/release/preflight-env.ts` exige chaves criticas por escopo; `git ls-tree -r --name-only HEAD .env.staging .env.production` nao retorna esses arquivos | O time nao consegue reproduzir o preflight final do core com segredos/URLs reais no workspace auditado | O go-live fica sem rehearsal final verificavel, elevando risco de falha em auth, billing, webhooks ou worker no dia da liberacao | 🔴 Critico | Provisionar inputs selados equivalentes para staging/producao, gerar preflight verde para os dois alvos e anexar os artefatos resultantes ao pacote de release |
| O lane de deploy de producao nao valida environment nem executa `release:preflight:production` antes do hook | `.github/workflows/cd.yml` possui `staging-preflight`, mas `deploy-production` apenas valida branch e dispara `RENDER_PRODUCTION_DEPLOY_HOOK_URL`; nao ha job de preflight/config validation para producao | Um deploy de producao pode seguir mesmo com ambiente inconsistente, segredos ausentes ou contrato de runtime quebrado | Aumenta drasticamente a chance de incidente no momento do deploy, com impacto direto em receita, login, faturamento e reputacao | 🔴 Critico | Criar `production-preflight` simetrico ao staging, com validacao de secrets/vars obrigatorios e execucao bloqueante de `pnpm release:preflight:production` |
| O lane de deploy de producao tambem nao executa smoke, E2E de release nem gate de rollback | O runbook de `2026-03-20` exige `pnpm release:smoke`, `pnpm test:e2e:release` e rollback testado; `.github/workflows/cd.yml` nao materializa esses gates no fluxo de deploy manual de producao | Regressao funcional, quebra de fluxo critico ou rollout sem reversao pronta pode passar despercebido ate depois do deploy | Pode derrubar conversao, onboarding, billing ou operacao interna sem alarme preventivo no proprio lane de liberacao | 🔴 Critico | Encadear smoke/E2E/rollback rehearsal como gates obrigatorios do deploy de producao e publicar seus artefatos no processo de release |
| Observabilidade minima ainda esta parcialmente apontada para superficies legadas | `docs/observability-alerts.md` fala em `API Gateway / Frontend` e `Agentes de IA e Orchestrator`; `infra/monitoring/alert.rules.yml` ancora varios alertas em `job="api-gateway"`; o core oficial do runbook e `apps/web`, `apps/api`, `apps/worker`, `packages/database` | O go-live do core pode ficar com cobertura de alerta desalinhada, especialmente em web e worker | Incidentes reais podem demorar a ser percebidos ou escalados corretamente, aumentando MTTR e impacto no cliente | 🟠 Alto | Reescrever a malha de alertas e o runbook de observabilidade com jobs/SLOs nomeados pelo core canonico e manter legado apenas como compatibilidade residual |
| Health/readiness do core nao e homogeneo entre servicos | `apps/api/src/lib/health.ts` faz ping de banco/Redis/external deps; `apps/web/app/health/route.ts` e `apps/worker/src/index.ts` retornam `status: ok` sem verificar dependencias mandatorias; `docs/security-pr-acceptance.md` exige falha de health/readiness quando dependencias obrigatorias caem | Pode haver falso positivo de prontidao em web e worker, mascarando falha real de API, Redis, filas ou integracoes | Load balancer, on-call e war room podem tratar como saudavel um servico que nao esta pronto para operar | 🟠 Alto | Implementar readiness minima por servico e alinhar o contrato de health do core com a politica de seguranca/operacao |
| Criticidade e catalogo de servicos ainda contradizem o escopo oficial do go-live | `docs/service-criticality.md` ainda marca `apps/api-gateway`, `apps/agent-orchestrator` e `packages/db` como P0; `docs/service-catalog.md` os trata como verdes; `docs/release/2026-03-20-go-live-runbook.md` limita o pronto ao core canonico | A operacao pode escalar, monitorar e priorizar o servico errado na war room de lancamento | A resposta a incidente, o capacity planning e a comunicacao executiva ficam desalinhados com o produto realmente lancado | 🟠 Alto | Atualizar catalogo, criticidade e runbooks para o escopo canonico e manter o legado explicitamente fora do pronto, salvo excecao aprovada |
| Capacidades fora do core continuam visiveis no legado e nao podem ser implicitamente prometidas como prontas no go-live do core | O runbook exclui `apps/dashboard`, `apps/api-gateway`, `apps/agent-orchestrator`, `apps/voice-engine` e `apps/webhook-receiver`; `audit/F2_traceability.md` mostrou funcionalidades de negocio ainda ancoradas em superficies legadas | Escopo de release pode ser inflado por leitura otimista da plataforma inteira, nao apenas do core | Pode gerar promessa comercial/operacional superior ao que o lane canonico realmente sustenta no dia do go-live | 🟡 Medio | Congelar a comunicacao de release ao escopo oficial do core e tratar qualquer dependencia residual do legado como excecao formal com plano de corte |

## Bloqueadores de go-live

| Bloqueador | Motivo | Nivel de criticidade | Dependencia para resolucao |
| --- | --- | --- | --- |
| Preflights de staging e producao ainda sem rehearsal verificavel no workspace auditado | O proprio runbook marca `release:preflight:staging` e `release:preflight:production` como bloqueados pela falta de segredos/arquivos equivalentes; sem isso nao ha prova final de configuracao valida do core | 🔴 Bloqueador | Provisionar secrets/vars equivalentes, rodar ambos os preflights e publicar artefatos verdes |
| `deploy-production` nao possui gate automatico de `release:preflight:production` | O lane manual de producao em `.github/workflows/cd.yml` dispara deploy sem validar ambiente de producao com o mesmo rigor do staging | 🔴 Bloqueador | Adicionar job `production-preflight` bloqueante e dependencia explicita antes do hook de producao |
| `deploy-production` nao exige smoke/E2E/rollback rehearsal no proprio fluxo de liberacao | O runbook exige esses passos para o go-live, mas o workflow nao os materializa como gate operacional de producao | 🔴 Bloqueador | Encadear smoke, E2E de release e artefato de rollback aprovado antes de liberar o hook final |

## Leitura sobre legados nesta fase

- `apps/dashboard`, `apps/api-gateway`, `apps/agent-orchestrator`, `packages/db`, `apps/voice-engine` e `apps/webhook-receiver` permanecem fora do criterio oficial de pronto do runbook canonico.
- Nesta fase nenhum deles foi elevado a bloqueador automatico por simples existencia; so foram tratados como gap quando a documentacao operacional ainda os coloca no centro da governanca.
- A prova de dependencia direta do core em legado continua insuficiente nesta amostra para reclassificar o go-live do core como bloqueado por esses servicos especificos.

## Sintese da fase

- O core canonico ja tem uma base seria de CI, configuracao, banco e deploy, mas o lane de producao ainda nao reproduz o rigor que o proprio runbook exige.
- Os bloqueadores objetivos desta fase se concentram em validacao final de ambiente e gates de liberacao, nao em falta completa de infraestrutura.
- O maior gap operacional residual fora dos bloqueadores e a observabilidade/governanca ainda parcialmente ancorada no legado.

## RELATORIO F6 — MODIFICACOES REAIS

- Arquivos criados:
  - `/audit/F6_production_gaps.md`
- Arquivos alterados:
  - `/audit/master_checklist.md`
- Arquivos removidos:
  - nenhum
- Gaps de producao consolidados:
  - tabela de gaps focada no core canonico
  - tabela de bloqueadores reais de go-live
  - delimitacao explicita entre core pronto e legados em quarentena
- Riscos remanescentes:
  - observabilidade e governanca ainda precisam ser realinhadas ao core antes de um go-live sem ressalvas
  - o workspace auditado continua sem rehearsal final de preflight para staging/producao
  - o lane de deploy de producao segue menos rigoroso do que o runbook oficial determina
- Observacao obrigatoria:
  - `Nenhum arquivo funcional do produto foi modificado nesta fase; apenas artefatos de auditoria foram produzidos.`
