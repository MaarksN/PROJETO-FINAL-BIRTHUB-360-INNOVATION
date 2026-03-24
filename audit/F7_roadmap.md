# F7 — ROADMAP DE FINALIZACAO DA PLATAFORMA

## Escopo executado

- Fase executada: `F7 — Roadmap de Finalizacao da Plataforma`
- Repositorio-alvo: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Branch canonica: `main`
- Commit de referencia: `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`
- Fonte de verdade desta fase:
  - `audit/F0_baseline.md`
  - `audit/F1_inventory.md`
  - `audit/F2_traceability.md`
  - `audit/F3_cleanup.md`
  - `audit/F4_restructure.md`
  - `audit/F5_tech_debt.md`
  - `audit/F6_production_gaps.md`
  - `docs/release/2026-03-20-go-live-runbook.md`
  - `.github/workflows/cd.yml`
  - `.github/workflows/ci.yml`
  - `docs/f10/architecture.md`
- Observacao de nomenclatura:
  - as fases `F0` a `F4` deste roadmap macro nao correspondem as fases `F0` a `F11` da auditoria;
  - o roadmap abaixo organiza a remediacao da plataforma a partir dos achados da auditoria ja concluida.

## Premissas de execucao

- O objetivo do roadmap e levar o core canonico (`apps/web`, `apps/api`, `apps/worker`, `packages/database`) a um estado de operacao SaaS real antes de investir em expansao do legado.
- Os principais drivers de priorizacao vieram de tres grupos de evidencia:
  - bloqueadores de go-live do `audit/F6_production_gaps.md`;
  - dividas tecnicas criticas do `audit/F5_tech_debt.md`;
  - conflitos estruturais e taxonomicos do `audit/F4_restructure.md`.
- A estimativa abaixo assume uma squad principal full-stack com apoio compartilhado de DevOps, DBA e responsaveis de operacao/governanca.

## Roadmap macro

| Fase | Objetivo | Entregaveis | Dependencias | Criterio de aceite | Janela estimada |
| --- | --- | --- | --- | --- | --- |
| `F0 — Governanca e baseline` | Fechar a ambiguidade entre core canonico, legado e superficies satelite antes das mudancas de runtime | Atualizacao de `docs/service-catalog.md`, `docs/service-criticality.md`, `docs/observability-alerts.md`, consolidacao da taxonomia core/legacy/satellites, congelamento explicito de evolucao em entrypoints legados | Achados fechados de F0-F6 | Catalogo, criticidade, observabilidade e release scope apontam para a mesma arquitetura canonica; legados permanecem em quarentena documentada | `1–2 semanas` |
| `F1 — Correcoes criticas` | Remover os bloqueadores objetivos de go-live do core | `production-preflight` no CD, gate de `release:preflight:production`, gates de smoke/E2E/rollback, inputs seguros para rehearsal de staging/producao, health/readiness coerentes em web e worker | Fase `F0` macro concluida; acesso aos ambientes e secrets de deploy | `release:preflight:staging` e `release:preflight:production` reproduziveis; deploy de producao bloqueia sem gates obrigatorios; health/readiness do core obedecem ao contrato operacional | `2–4 semanas` |
| `F2 — Estabilizacao` | Cortar dependencias residuais do legado no caminho critico e consolidar a fonte de verdade do core | Plano de cutover de fluxos ainda apoiados em `apps/api-gateway` e `apps/agent-orchestrator`, migracao residual de `packages/db` para `packages/database`, evidencia canonica de webhooks/integracoes prioritarias, arquivamento/redirecionamento de documentos superseded | Fase `F1` macro concluida; mapeamento de consumidores residuais; cobertura minima de testes | Core opera sem dependencia operacional obrigatoria de superficies legadas; banco e docs tem fonte de verdade unica; excecoes residuais ficam formalmente registradas | `3–4 semanas` |
| `F3 — Escalabilidade` | Endurecer capacidade, observabilidade e operacao do core para carga e crescimento | Alertas/SLOs centrados em `apps/api`, `apps/web`, `apps/worker`; revisao da matriz de criticidade; backlog/DLQ/worker capacity controls; baseline de performance e dreno de artefatos gerados para fora do fluxo principal do repo | Fase `F2` macro concluida; instrumentacao/monitoramento disponiveis | Observabilidade cobre o core certo; fila/worker recebem prioridade operacional adequada; a operacao consegue detectar e responder a incidentes sem depender do legado | `3–4 semanas` |
| `F4 — Go-to-market ready` | Consolidar prontidao de lancamento, rollback e pacote executivo de release | War room playbook, pacote de aceite tecnico-operacional, rehearsal final documentado, plano de sunset do legado remanescente, checklist de lancamento e comunicacao de escopo | Fases `F0` a `F3` macro concluidas; sinais verdes dos ambientes reais | Core pronto para lancamento com gates verdes, rollback exercitado, escopo comunicado sem ambiguidade e backlog pos-launch explicitamente separado | `2–3 semanas` |

## Detalhamento por fase

### F0 — Governanca e baseline

- Objetivo:
  - alinhar fonte de verdade de arquitetura, criticidade, catalogo e observabilidade antes de qualquer hardening tecnico adicional.
- Entregaveis reais:
  - revisao convergente de `docs/service-catalog.md`, `docs/service-criticality.md` e `docs/observability-alerts.md`;
  - classificacao formal de `apps/dashboard`, `apps/api-gateway`, `apps/agent-orchestrator`, `packages/db`, `apps/voice-engine` e `apps/webhook-receiver`;
  - politica explicita de `no new features` para entrypoints legados ainda em sunset.
- Dependencias:
  - nenhuma alem da auditoria concluida;
  - definicao de ownership para servicos satelite e residuais.
- Criterios de aceite:
  - os documentos de governanca convergem para a mesma taxonomia do `README.md` e da `docs/f10/architecture.md`;
  - o runbook de go-live nao conflita mais com catalogo e criticidade.
- Riscos:
  - atraso por decisao organizacional e disputa de ownership;
  - manutencao de excecoes informais fora da documentacao.
- Areas impactadas:
  - `docs/`
  - `ops/`
  - `infra/monitoring`
  - governanca de release e observabilidade.

### F1 — Correcoes criticas

- Objetivo:
  - eliminar os tres bloqueadores objetivos de go-live encontrados na F6 e corrigir o contrato minimo de prontidao do core.
- Entregaveis reais:
  - job `production-preflight` em `.github/workflows/cd.yml`;
  - gates obrigatorios de `release:preflight:production`, `release:smoke`, `test:e2e:release` e rollback rehearsal;
  - rehearsal de staging/producao com configuracao segura e evidencias publicadas;
  - readiness/health em `apps/web` e `apps/worker` alinhados ao contrato ja usado pela API.
- Dependencias:
  - alinhamento de governanca da fase `F0` macro;
  - acesso controlado a secrets, ambientes e ownership de deploy.
- Criterios de aceite:
  - nenhum deploy de producao dispara sem preflight e gates finais;
  - os preflights de staging/producao ficam reproduziveis;
  - web e worker deixam de reportar `ok` estatico quando dependencias criticas estiverem indisponiveis.
- Riscos:
  - bloqueio por secrets/infra fora do repositorio;
  - necessidade de ajustar testes e pipelines acoplados ao fluxo atual.
- Areas impactadas:
  - `.github/workflows/`
  - `scripts/release/`
  - `apps/web/`
  - `apps/worker/`
  - operacao de deploy.

### F2 — Estabilizacao

- Objetivo:
  - retirar o legado do caminho critico real e consolidar a fonte de verdade tecnica do core.
- Entregaveis reais:
  - plano de migracao/corte dos fluxos ainda apoiados em `apps/api-gateway` e `apps/agent-orchestrator`;
  - consolidacao residual de consumidores em `packages/database`;
  - cobertura canonica dos conectores e webhooks prioritarios que hoje aparecem parciais ou herdados do legado;
  - redirecionamento/arquivamento de documentacao superseded e cleanup estrutural minimo.
- Dependencias:
  - Fase `F1` macro verde;
  - inventario de consumidores residuais e impacto de compatibilidade.
- Criterios de aceite:
  - o core nao depende operacionalmente de superficies legadas para login, billing, workflows ou dados;
  - `packages/db` deixa de ser superficie ativa de runtime;
  - docs superseded passam a ser historico, nao fonte concorrente.
- Riscos:
  - migracoes de consumidores podem revelar acoplamentos nao mapeados;
  - integracoes externas podem exigir janelas de compatibilidade.
- Areas impactadas:
  - `apps/api`
  - `apps/worker`
  - `apps/api-gateway`
  - `apps/agent-orchestrator`
  - `packages/database`
  - `packages/db`
  - `docs/`.

### F3 — Escalabilidade

- Objetivo:
  - preparar o core para carga, incidentes e crescimento sem depender de monitoramento centrado no legado.
- Entregaveis reais:
  - reescrita da malha de alertas e SLOs para `apps/api`, `apps/web`, `apps/worker`, `packages/queue` e `packages/database`;
  - revisao da matriz de criticidade operacional;
  - controles de backlog, DLQ, capacidade de worker e sinais de saturacao do banco/fila;
  - baseline de performance e externalizacao de artefatos gerados/logs que hoje pesam no repositorio.
- Dependencias:
  - Fase `F2` macro concluida;
  - dados de observabilidade e instrumentacao habilitados.
- Criterios de aceite:
  - operacao monitora o lane canonico correto;
  - fila/worker deixam de ser subpriorizados;
  - incidentes P0/P1 podem ser detectados e triados a partir dos servicos efetivamente criticos.
- Riscos:
  - tuning de observabilidade pode gerar ruido inicial;
  - hardening de performance pode abrir backlog tecnico adicional.
- Areas impactadas:
  - `infra/monitoring`
  - `docs/observability-*`
  - `docs/service-criticality.md`
  - `apps/worker`
  - `packages/queue`
  - `packages/database`.

### F4 — Go-to-market ready

- Objetivo:
  - transformar os ganhos das fases anteriores em um pacote de lancamento confiavel e comunicavel.
- Entregaveis reais:
  - runbook final de war room e checklist de go-live;
  - pacote de aceite com gates verdes, rollback exercitado e escopo oficial de release;
  - plano formal de sunset para legados ainda remanescentes apos o go-live do core;
  - backlog pos-launch explicitamente separado do criterio de pronto.
- Dependencias:
  - fases `F0` a `F3` macro concluídas;
  - sinais verdes de ambientes reais e aceite tecnico-operacional.
- Criterios de aceite:
  - a pergunta “pode ir para producao?” deixa de depender de interpretacao manual difusa;
  - o escopo de lancamento fica claro para operacao, engenharia e negocio;
  - o legado restante fica tratado como excecao controlada, nao como stack paralela ativa.
- Riscos:
  - pressao de calendario pode tentar puxar itens de backlog para dentro do criterio de pronto;
  - falhas em ensaio final podem empurrar parte do cronograma.
- Areas impactadas:
  - `docs/release/`
  - `.github/workflows/`
  - operacao/on-call
  - stakeholders de produto, receita e suporte.

## Priorizacao executiva

| Iniciativa | Impacto no negocio | Complexidade | Prioridade | Justificativa |
| --- | --- | --- | --- | --- |
| Fechar `production-preflight` e gates finais do CD | Evita deploy inseguro e reduz risco direto sobre receita, auth e billing | Media | `P0` | E o bloqueador mais objetivo e mais barato de corrigir em relacao ao risco evitado |
| Alinhar taxonomia core vs legado em catalogo, criticidade e observabilidade | Remove ambiguidade de governanca e reduz erro de decisao executiva/operacional | Baixa-Media | `P0` | Sem isso, a equipe continua medindo e priorizando servicos errados |
| Corrigir health/readiness de web e worker | Reduz falso positivo de prontidao e melhora resposta a incidente | Media | `P0` | O contrato de seguranca ja exige esse comportamento; hoje o core esta inconsistente |
| Consolidar `packages/database` como unica superficie de dados | Reduz risco de drift, rollback errado e ownership difuso em dados transacionais | Alta | `P1` | O dominio de dados e estruturalmente critico e ainda carrega duplicidade legada |
| Cortar fluxos residuais do legado no caminho critico | Diminui dependencia de `api-gateway` e `agent-orchestrator` para capacidades centrais | Alta | `P1` | Sem isso, o go-live do core continua vulneravel a excecoes silenciosas |
| Recentrar observabilidade e criticidade em `api/web/worker` | Melhora deteccao, triagem e capacity planning do lane realmente produtivo | Media | `P1` | O monitoramento atual ainda olha em parte para a superficie errada |
| Externalizar artefatos gerados e reduzir ruído estrutural | Melhora manutencao, onboarding e higiene do monorepo | Media | `P2` | Importante para sustentabilidade, mas nao bloqueia sozinho o go-live do core |
| Formalizar cobertura canonica de webhooks/integracoes prioritarias | Reduz risco juridico e operacional em conectores fora de Stripe | Alta | `P2` | E relevante, mas depende antes da consolidacao do lane principal |

## Complexidade total e tempo estimado

- Complexidade total observada: `Alta`
- Evidencias que sustentam essa classificacao:
  - `2467` arquivos rastreados no `HEAD`;
  - hotspots materiais em `packages/` (`646` arquivos), `apps/` (`579`), `.github/` (`409`), `docs/` (`339`) e `agents/` (`268`);
  - coexistencia prolongada de superficies canonicas e legadas em API, frontend, worker e banco;
  - bloqueadores de producao ainda presentes no lane de deploy.
- Janela total estimada para o roadmap macro:
  - `12–16 semanas` em execucao predominantemente sequencial com uma squad principal;
  - `8–10 semanas` se `F0/F1` e parte de `F2/F3` correrem em trilhas paralelas com ownership claro de DevOps, banco e plataforma.
- Principal fator que pode alongar o cronograma:
  - descoberta tardia de consumidores criticos ainda dependentes de `apps/api-gateway`, `apps/agent-orchestrator` ou `packages/db`.

## Sintese da fase

- O caminho mais seguro nao e “reescrever tudo”; e fechar governanca, depois remover bloqueadores de deploy, depois estabilizar o core e so entao escalar/go-to-market.
- O roadmap ficou ancorado em achados verificaveis da auditoria, nao em etapas abstratas.
- A ordem de execucao privilegia primeiro aquilo que muda o veredito de prontidao do core com o menor risco de regressao.

## RELATORIO F7 — MODIFICACOES REAIS

- Arquivos criados:
  - `/audit/F7_roadmap.md`
- Arquivos alterados:
  - `/audit/master_checklist.md`
- Arquivos removidos:
  - nenhum
- Roadmap produzido:
  - roadmap macro em `5` fases (`F0` a `F4`) com objetivos, entregaveis, dependencias, criterios de aceite, riscos e areas impactadas
  - tabela de priorizacao executiva com iniciativas ordenadas por impacto e urgencia
- Principais decisoes de priorizacao:
  - governanca e taxonomia do core devem ser corrigidas antes do hardening tecnico maior
  - os bloqueadores de deploy/producao entram antes da estabilizacao estrutural mais longa
  - o legado so entra como frente principal quando houver evidencia de dependencia do caminho critico
- Dependencias criticas identificadas:
  - acesso a secrets/ambientes para rehearsal de staging e producao
  - ownership explicito de servicos legados e satelite
  - reconciliacao de consumidores residuais de `packages/db`, `apps/api-gateway` e `apps/agent-orchestrator`
- Riscos remanescentes:
  - descoberta tardia de acoplamentos legados pode alongar `F2` e `F3`
  - pressao de calendario pode tentar colapsar fases e reintroduzir ambiguidade no criterio de pronto
  - parte das melhorias depende de mudancas fora do codigo, especialmente segredos, ambientes e operacao
- Observacao obrigatoria:
  - `Nenhum arquivo funcional do produto foi modificado nesta fase; apenas artefatos de auditoria foram produzidos.`
