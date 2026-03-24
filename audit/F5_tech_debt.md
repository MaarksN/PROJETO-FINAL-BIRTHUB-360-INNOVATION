# F5 — DIVIDA TECNICA PROFUNDA

## Escopo executado

- Fase executada: `F5 — Divida Tecnica Profunda`
- Repositorio-alvo: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Branch canonica: `main`
- Commit de referencia: `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`
- Fonte de verdade desta fase:
  - `README.md`
  - `docs/f10/architecture.md`
  - `docs/release/2026-03-20-go-live-runbook.md`
  - `docs/migration/legacy-api-gateway-strangler.md`
  - `docs/observability-alerts.md`
  - `docs/security-pr-acceptance.md`
  - `docs/service-criticality.md`
  - `docs/service-catalog.md`
  - `.github/workflows/ci.yml`
  - `.github/workflows/cd.yml`
  - `.env.example`
  - `scripts/release/preflight-env.ts`
  - `scripts/ci/full.mjs`
  - `artifacts/quality/jscpd/jscpd-report.json`
  - `apps/web/app/health/route.ts`
  - `apps/worker/src/index.ts`
  - `apps/api/src/lib/health.ts`
  - `packages/database/docs/*`
- Contexto adicional nao-canonico:
  - o staged cutover atual reforca a urgencia de varios itens abaixo, mas foi tratado apenas como contexto de convergencia; as notas de divida se apoiam na arvore canonica do `HEAD`.

## Cobertura do scan obrigatorio

| Categoria | Cobertura | Nota de auditoria |
| --- | --- | --- |
| Arquitetura | Com evidencia material | Conflito entre taxonomia canonica publicada e governanca que ainda aponta legados como superficies ativas |
| Codigo | Com evidencia material | Duplicacao medida por JSCpd e fragmentacao de convencoes em dominios de agentes/documentos |
| Seguranca | Com evidencia material | Contrato de health/readiness e congelamento de entrypoints legados nao estao refletidos de forma homogenea no core |
| Performance | Sem evidencia suficiente para item autonomo | Existem controles documentados em `packages/database/docs/F8_IMPLEMENTATION.md`, mas a amostra canonica nao trouxe artefato de degradacao que justifique um item separado nesta fase |
| Escalabilidade | Com evidencia material | Matriz de criticidade e prioridade operacional ainda privilegia superficies legadas em detrimento da fila/worker canonicos |
| Observabilidade | Com evidencia material | Alertas e documento minimo de observabilidade ainda estao parcialmente orientados a `api-gateway` e `agent-orchestrator` |
| DevOps | Com evidencia material | O lane de producao no CD nao reproduz integralmente os gates exigidos no runbook de go-live |
| Dados | Com evidencia material | Coexistencia de `packages/database` e `packages/db` mantem risco de drift de schema e cliente |
| Integracoes | Com evidencia material | A evidencia forte de idempotencia ficou concentrada em Stripe; a cobertura prometida para outros provedores segue incompleta na amostra |
| Frontend | Com evidencia material | `apps/web` e `apps/dashboard` continuam competindo como superficie de operacao interna |
| Estrutural/Organizacao | Com evidencia material | Raiz do repositorio mistura produto, logs, artefatos gerados e programas internos |

## Divida tecnica consolidada

| ID | Categoria | Item | Evidencia | Impacto no negocio | Severidade | Score | Acao corretiva sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TD-001` | DevOps | Deploy de producao nao executa `release:preflight:production`, `release:smoke` nem `test:e2e:release` dentro do lane de deploy | `docs/release/2026-03-20-go-live-runbook.md` exige preflight, smoke, E2E e rollback; `.github/workflows/cd.yml` possui `staging-preflight`, mas `deploy-production` apenas valida branch e dispara o hook do Render | Aumenta a chance de subir codigo com segredos ausentes, regressao funcional ou rollout sem validacao final, afetando receita, autenticacao e billing | 🔴 Critico | 94 | Criar `production-preflight` com validacao de environment, exigir `pnpm release:preflight:production`, `pnpm release:smoke` e `pnpm test:e2e:release` antes do hook de producao |
| `TD-002` | Arquitetura | Taxonomia canonica e governanca operacional ainda divergem sobre o que e core e o que e legado | `README.md` e `docs/f10/architecture.md` publicam `apps/web`, `apps/api`, `apps/worker` e `packages/database` como core; `docs/service-catalog.md` e `docs/service-criticality.md` ainda tratam `apps/api-gateway`, `apps/agent-orchestrator` e `packages/db` como verdes/P0; `docs/migration/legacy-api-gateway-strangler.md` diz que o gateway esta `frozen` | Mantem backlog e ownership em trilhas conflitantes, prolonga o sunset do legado e aumenta risco de investimento tecnico no lugar errado | 🔴 Critico | 95 | Reconciliar catalogo, criticidade e source of truth em uma unica taxonomia operacional e remover ambiguidade sobre superficies autorizadas para evolucao |
| `TD-003` | Observabilidade | Alertas e runbook minimo de observabilidade ainda miram fortemente o legado em vez do core canonico | `docs/observability-alerts.md` fala em `API Gateway / Frontend` e `Agentes de IA e Orchestrator`; `infra/monitoring/alert.rules.yml` concentra varios alertas em `job="api-gateway"`, enquanto `docs/f10/architecture.md` e o runbook de go-live definem `apps/api`, `apps/web` e `apps/worker` como caminho critico | Gera pontos cegos operacionais no go-live do core, alonga tempo de deteccao de incidentes e piora resposta a falhas de fila, worker ou web | 🟠 Alto | 89 | Reescrever a matriz de alertas e o documento minimo de observabilidade usando `apps/api`, `apps/web` e `apps/worker` como superficies primarias de SLO/SLA |
| `TD-004` | Dados | Dupla superficie de banco (`packages/database` e `packages/db`) ainda permanece versionada | `README.md` e `docs/f10/architecture.md` definem `packages/database` como banco canonico; `docs/migration/legacy-api-gateway-strangler.md` ainda fala em migrar consumidores de `@birthub/db` para `@birthub/database`; `docs/service-criticality.md` continua marcando `packages/db` como P0 | Amplia risco de drift de schema, import equivocado, migration em fonte errada e rollback confuso em um dominio que impacta dados transacionais | 🔴 Critico | 90 | Completar a migracao de consumidores para `packages/database`, rebaixar `packages/db` para legado isolado e remover a superficie quando a cobertura residual chegar a zero |
| `TD-005` | Seguranca | Contrato de health/readiness nao e homogeneo no core, apesar da exigencia explicita de falha quando dependencias mandatorias caem | `docs/security-pr-acceptance.md` exige que health/readiness falhem quando dependencias obrigatorias estiverem indisponiveis; `apps/api/src/lib/health.ts` verifica banco/Redis/external deps; `apps/web/app/health/route.ts` e `apps/worker/src/index.ts` respondem `ok` de forma estatica | Pode mascarar incidente real, atrasar rollback ou autohealing e gerar falsa confianca em ambientes de deploy e operacao | 🟠 Alto | 86 | Implementar readiness/health reais para web e worker, com semantica minima de dependencia obrigatoria e comportamento coerente com o contrato de seguranca |
| `TD-006` | Escalabilidade | Prioridade operacional ainda favorece legado enquanto fila/worker canonicos ficam subrepresentados na criticidade | `docs/service-criticality.md` marca `apps/api-gateway`, `apps/agent-orchestrator` e `packages/db` como P0; o core do runbook prioriza `apps/api`, `apps/web`, `apps/worker` e `packages/database`; `packages/queue` aparece apenas como P1 | On-call, capacidade e investimento podem ser alocados no lugar errado, fragilizando a execucao assincrona que sustenta workflows, billing export e jobs do core | 🟠 Alto | 84 | Reescrever a criticidade por servico com base no escopo real de go-live e elevar explicitamente fila/worker/core data plane ao nivel operacional correto |
| `TD-007` | Frontend | `apps/web` oficial e `apps/dashboard` legado continuam coexistindo como superficies de operacao interna | `README.md` define `apps/web` como frontend oficial; `docs/f10/architecture.md` classifica `apps/dashboard` como superficie legada; `docs/service-catalog.md` ainda o apresenta como verde e operacional | Duplica caminho de onboarding, suporte interno, auth boundary e manutencao de UX, aumentando custo de evolucao e suporte | 🟠 Alto | 80 | Fixar `apps/web` como unica superficie oficial, mover `apps/dashboard` para quarentena estrutural e remover qualquer narrativa operacional que o trate como front-end principal |
| `TD-008` | Integracoes | A prova de idempotencia e resiliencia de webhook ficou mais forte em Stripe do que em provedores prometidos no roadmap | `apps/api/src/modules/webhooks/stripe.webhook.processing.ts` mostra processamento canonico de Stripe; a trilha auditada de idempotencia fora de Stripe apareceu sobretudo em `apps/api-gateway`; `audit/F2_traceability.md` registrou evidencia insuficiente para Clicksign/DocuSign na amostra | Mantem risco juridico e operacional em provedores sensiveis de assinatura/integracao e dificulta prometer o mesmo nivel de confiabilidade entre conectores | 🟠 Alto | 78 | Mapear provedor por provedor, registrar testes/rotas canonicas equivalentes e retirar a dependencia documental de implementacoes apenas legadas |
| `TD-009` | Estrutural/Organizacao | A raiz do repositorio continua misturando codigo, programa interno, operacao, logs e artefatos gerados | `git ls-tree -d --name-only HEAD` expoe `12 CICLOS`, `artifacts`, `logs`, `ops`, `audit` e codigo-fonte no mesmo nivel; `audit/F3_cleanup.md` quantificou `7.837.239` bytes de peso morto obvio | Aumenta ruido cognitivo, dificulta navegacao, amplia risco de versionar lixo tecnico e piora manutencao do monorepo | 🟠 Alto | 82 | Reorganizar a topologia de raiz e externalizar logs/bundles/artefatos regeneraveis para storage de CI ou trilha documental dedicada |
| `TD-010` | Codigo | Ha duplicacao mensuravel e fragmentacao de convencoes de nomes | `artifacts/quality/jscpd/jscpd-report.json` aponta `40` clones, `691` linhas duplicadas e `4,02%` de duplicacao; `audit/F3_cleanup.md` registrou pares como `agents/parcerias` vs `agents/partners` e `agents/pos-venda` vs `agents/pos_venda` | Mantem custo de manutencao elevado, dificulta automacao/tooling e aumenta risco de corrigir um caminho sem alinhar o seu duplicado | 🟡 Medio | 68 | Priorizar consolidacao de dominios duplicados e atacar clones mais conectados ao core antes de expandir novas features na mesma area |

## Top riscos criticos

| Item | Impacto no produto | Impacto no negocio | Urgencia |
| --- | --- | --- | --- |
| `TD-001` + `TD-002` | O lane oficial de deploy/governanca nao coincide totalmente com a documentacao operacional antiga | A organizacao pode continuar financiando, monitorando e respondendo incidentes em trilhas erradas | Imediata, antes de qualquer declaracao de go-live do core |
| `TD-003` | Observabilidade e alerting podem olhar para a superficie errada | Incidentes no core podem demorar mais para serem detectados e tratados, elevando indisponibilidade e churn | Imediata, pre-launch |
| `TD-004` | Banco e migrations seguem com duas superficies publicadas | Erros de schema, rollback ou ownership podem afetar dados transacionais e faturamento | Imediata, pre-launch |
| `TD-005` | Health/readiness inconsistentes podem sinalizar verde quando o servico nao esta operacionalmente pronto | Rollout, autoscaling e resposta a incidentes ficam menos confiaveis | Alta, pre-launch |
| `TD-006` | Fila e worker canonicos podem continuar subpriorizados em incidentes e capacity planning | Jobs de billing, workflows e automacao podem degradar sem a urgencia operacional correta | Alta, ainda antes da estabilizacao pos-launch |

## Sintese da fase

- A divida mais perigosa nao esta em um unico modulo isolado; ela nasce do atrito entre canon publicado, legado remanescente e governanca operacional ainda desatualizada.
- O repositorio ja contem controles fortes de CI, banco, seguranca e observabilidade, mas esses controles ainda nao convergiram integralmente para o lane oficial do core.
- O maior risco estrutural desta fase e permitir que a narrativa de go-live avance mais rapido do que a consolidacao real da fonte de verdade.

## RELATORIO F5 — MODIFICACOES REAIS

- Arquivos criados:
  - `/audit/F5_tech_debt.md`
- Arquivos alterados:
  - `/audit/master_checklist.md`
- Arquivos removidos:
  - nenhum
- Tabelas e consolidados gerados:
  - cobertura do scan obrigatorio por categoria
  - consolidado de divida tecnica com IDs `TD-001` a `TD-010`
  - tabela de top riscos criticos
- Riscos remanescentes:
  - a reconciliacao da taxonomia canonica com catalogo/criticidade legados ainda depende de decisao e execucao posteriores
  - parte da divida aumenta de urgencia porque o staged cutover atual indica um sunset em andamento ainda nao oficializado no baseline
  - categorias com baixa evidencia empirica nesta amostra, como performance, exigem medicao adicional antes de virarem item autonomo
- Observacao obrigatoria:
  - `Nenhum arquivo funcional do produto foi modificado nesta fase; apenas artefatos de auditoria foram produzidos.`
