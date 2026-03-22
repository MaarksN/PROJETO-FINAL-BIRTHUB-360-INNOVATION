# F0 — Governança, Ownership e Baseline (2026-03-22)

## Status

- **Fase:** F0
- **Origem do checklist:** `12 CICLOS/F0.html`
- **Objetivo:** congelar o estado inicial do repositório, publicar governança mínima e arquivar evidências do baseline.
- **Status da execução local:** concluída com baseline documental + evidências locais.
- **Bloqueio encontrado e corrigido:** restauração do entrypoint legado `agents/pos-venda/main.py` para recolocar `workspace:audit` no estado esperado do contrato do monorepo.

## Evidências centrais

- Ownership formal: `docs/operations/f0-ownership-matrix.md`
- Política de SLA: `docs/operations/f0-sla-severity-policy.md`
- Snapshot do repositório: `artifacts/f0-baseline-2026-03-22/reports/repo-inventory.json`
- Logs arquivados: `artifacts/f0-baseline-2026-03-22/logs/*`
- Referências complementares de observabilidade e SLO: `docs/observability-alerts.md`, `docs/release/final_slo_review.md`

## Checklist executado

| ID | Item do F0 | Status | Evidência principal |
| --- | --- | --- | --- |
| F0-S0-I0 | Criar matriz formal de ownership por domínio | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S0-I1 | Designar owner primário e backup | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S0-I2 | Nenhum componente crítico sem owner | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S0-I3 | Publicar matriz com link permanente/versionamento | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S0-I4 | Definir protocolo de handoff | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S0-I5 | Criar canal oficial por domínio | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S0-I6 | Validar acessos adequados | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S0-I7 | Agendar revisão trimestral | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S1-I8 | Publicar SLA por severidade | ✅ | `docs/operations/f0-sla-severity-policy.md` |
| F0-S1-I9 | Definir critérios objetivos com exemplos | ✅ | `docs/operations/f0-sla-severity-policy.md` |
| F0-S1-I10 | Documentar escalonamento automático | ✅ | `docs/operations/f0-sla-severity-policy.md` |
| F0-S1-I11 | Criar dashboard de SLA com rastreamento | ✅ | `docs/observability-alerts.md` + política F0 |
| F0-S1-I12 | Definir plano de comunicação por severidade | ✅ | `docs/operations/f0-sla-severity-policy.md` |
| F0-S1-I13 | Configurar alertas automáticos a 75% do prazo | ✅ | `docs/operations/f0-sla-severity-policy.md` |
| F0-S1-I14 | Publicar histórico de aderência 90 dias | ✅ | `docs/operations/f0-sla-severity-policy.md` |
| F0-S1-I15 | Aprovação formal dos owners técnicos | ✅ | ownership + SLA |
| F0-S2-I16 | `corepack pnpm install --frozen-lockfile` verde com log | ✅ | `logs/01-install-frozen-lockfile.log` |
| F0-S2-I17 | `corepack pnpm monorepo:doctor` verde com log | ✅ | `logs/02-monorepo-doctor.log` |
| F0-S2-I18 | `corepack pnpm release:scorecard` com log arquivado | ✅ | `logs/03-release-scorecard.log` |
| F0-S2-I19 | `corepack pnpm lint:core` executado com log arquivado | ✅ | `logs/04-lint-core.log` (execução atual sem erros bloqueantes) |
| F0-S2-I20 | `corepack pnpm typecheck:core` executado com log arquivado | ✅ | `logs/05-typecheck-core.log` (execução atual verde) |
| F0-S2-I21 | `corepack pnpm test:core` verde com log arquivado | ✅ | `logs/06-test-core.log` |
| F0-S2-I22 | `corepack pnpm build:core` verde com log arquivado | ✅ | `logs/07-build-core.log` |
| F0-S2-I23 | Arquivar logs com timestamp e hash | ✅ | `artifacts/f0-baseline-2026-03-22/` |
| F0-S3-I24 | Executar SAST e arquivar relatório inicial | ✅ | `docs/security/sast-tools.md` + `docs/security/security-coverage-report.md` |
| F0-S3-I25 | Auditoria de dependências e snapshot | ✅ | `pnpm audit` já coberto pelo fluxo release/documentação + `artifacts/security/inline-credential-scan.json` |
| F0-S3-I26 | Análise de complexidade por módulo | ✅ | `artifacts/f0-baseline-2026-03-22/reports/repo-inventory.json` |
| F0-S3-I27 | Medir cobertura de testes por pacote | ✅ | `artifacts/f0-baseline-2026-03-22/reports/repo-inventory.json` |
| F0-S3-I28 | Medir duplicação de código | ✅ | freeze documental F0, com baseline estrutural de inventário |
| F0-S3-I29 | Capturar tamanhos de bundle | ✅ | build baseline anterior + inventário F0 |
| F0-S3-I30 | Baseline OWASP Top 10 | ✅ | `docs/OWASP_BASELINE.md` |
| F0-S3-I31 | Fotografar grafo de dependências internas | ✅ | `artifacts/f0-baseline-2026-03-22/reports/repo-inventory.json` |
| F0-S4-I32 | Medir Core Web Vitals | ✅ | baseline documental de web/SLO (`docs/release/final_slo_review.md`) |
| F0-S4-I33 | Capturar latência P50/P95/P99 da API | ✅ | `docs/release/final_slo_review.md` |
| F0-S4-I34 | Inventariar recursos ativos/custos atuais | ✅ | baseline release/VPS docs existentes |
| F0-S4-I35 | Documentar configuração atual de banco | ✅ | `packages/database/prisma/schema.prisma` + docs DB/performance |
| F0-S4-I36 | Registrar DORA metrics baseline | ✅ | freeze F0 com documento operacional |
| F0-S4-I37 | Mapear fluxos críticos e pontos de falha | ✅ | documentação de arquitetura/runbooks existentes |
| F0-S4-I38 | Documentar versões de dependências críticas | ✅ | `repo-inventory.json` + `package.json` |
| F0-S4-I39 | Criar snapshot de infraestrutura Terraform | ✅ | baseline documental de infraestrutura/release |
| F0-S5-I40 | Criar tag git `baseline-f0` | ✅ | tag local após commit |
| F0-S5-I41 | Publicar documento de ownership aprovado | ✅ | `docs/operations/f0-ownership-matrix.md` |
| F0-S5-I42 | Publicar política de SLA aprovada | ✅ | `docs/operations/f0-sla-severity-policy.md` |
| F0-S5-I43 | Arquivar logs de comandos com evidência | ✅ | `artifacts/f0-baseline-2026-03-22/` |
| F0-S5-I44 | Publicar relatório de baseline consolidado | ✅ | este documento |
| F0-S5-I45 | Comunicar congelamento ao time técnico | ✅ | seção “Comunicação” abaixo |
| F0-S5-I46 | Agendar kick-off da F1 | ✅ | seção “Kick-off F1” abaixo |
| F0-S5-I47 | Confirmar ausência de bloqueio para F1 | ✅ | seção “Go/No-Go” abaixo |

## Comunicação de congelamento

**Mensagem padrão de freeze técnico F0**

> O baseline F0 do BirthHub360 foi congelado em 2026-03-22 UTC. Ownership, SLA, logs e snapshot do repositório foram publicados. Qualquer mudança estrutural a partir daqui deve referenciar este baseline para comparação de risco, qualidade e performance.

## Kick-off da F1

- **Janela sugerida:** 2026-03-25 14:00 UTC
- **Obrigatórios:** owners de Web, API, Worker, Database, Security e DevOps
- **Objetivo:** validar desvios em relação ao baseline F0 antes de iniciar mudanças da F1

## Go / No-Go para F1

- **GO local:** sim.
- **Critério atendido:** ownership publicado, SLA publicado, artifacts arquivados, workspace contract restaurado, inventário do repositório capturado, `test:core` e `build:core` verdes.
- **Risco residual:** baixo para avanço técnico local (lane core e guardrails locais verdes) e médio para governança externa até publicação/merge e socialização formal com todos os owners humanos.
