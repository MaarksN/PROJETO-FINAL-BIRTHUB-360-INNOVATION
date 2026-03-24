# F2 — RASTREABILIDADE INSTRUCIONAL

## Objetivo
Cruzar o que foi prometido nos artefatos instrucionais (README, docs, workflows) com o que realmente existe no código e repositório.

## Matriz "Promessa vs Realidade"

| Promessa Documental / Operacional | Onde Prometido | Realidade Encontrada | Status | Observação |
| --- | --- | --- | --- | --- |
<<<<<<< HEAD
| `README.md` | Stack canônica suportada em `apps/web`, `apps/api`, `apps/worker` e `packages/database` | `apps/web/package.json`, `apps/api/package.json`, `apps/worker/package.json`, `packages/database/package.json` existem no `HEAD` | ✅ APTO | A promessa de composição canônica está refletida na árvore e nos manifests |
| `README.md` | Superfícies legadas em quarentena (`apps/dashboard`, `apps/api-gateway`, `apps/agent-orchestrator`, `packages/db`) | Os quatro domínios existem no `HEAD`; `docs/migration/legacy-api-gateway-strangler.md` chama `apps/api-gateway` de `frozen`, mas `apps/api/README.md` ainda diz que `pnpm --filter @birthub/api dev` inicia o gateway legado | ⚠️ PARCIAL | O legado está identificado, mas ainda permanece grande, versionado e parcialmente referenciado na operação |
| `README.md` | Governança e higiene por scripts (`artifacts:clean`, `branch:check`, `commits:check`, `hygiene:check`, `docs:check-links`, `monorepo:doctor`) | Scripts existem em `package.json` | ✅ APTO | Há rastreabilidade direta entre o README e os comandos reais |
| `docs/operations/f0-ownership-matrix.md` | `.github/CODEOWNERS` como fonte operacional única e revisão trimestral formal | `.github/CODEOWNERS`, `ops/governance/ownership-quarterly-review.ics` e `ops/governance/external-provisioning-status.md` existem | ✅ APTO | A promessa documental tem artefatos operacionais correspondentes |
| `docs/processes/documentation-source-of-truth.md` | Definir documento canônico por processo e manter superseded apenas como histórico | Existem o canônico `docs/operations/f0-ownership-matrix.md` e o superseded `docs/F0/ownership.md`; também coexistem `docs/cs/cs-tool-onboarding.md` e `docs/ux/cs_tool_onboarding.md`, além de `docs/security/incident_response_runbook.md` com runbooks/policies históricos | ⚠️ PARCIAL | A fonte de verdade foi formalizada, mas a coexistência de documentos históricos ainda amplia a ambiguidade de navegação |
| `docs/runbooks/db-migrations.md` | Processo robusto de migração/rollback com checks de drift e governança | `packages/database/prisma/migrations/*`, `packages/database/prisma/seed.ts` e `packages/database/scripts/post-migration-checklist.ts` existem | ⚠️ PARCIAL | Há evidência de migrações, seed e checklist pós-migração, mas nesta amostra não apareceu prova explícita do `reviewed-by-dba` nem do mecanismo de lock distribuído prometido |
| `docs/roadmap.md` | Q1 SDR: consolidar Lead Repository no gateway e ativar fluxo executável no orquestrador | `apps/api-gateway/src/repositories/lead-repository.ts`, `apps/api-gateway/src/routes/leads.ts`, `apps/agent-orchestrator/orchestrator/flows.py` | 🔀 DESVIO | A implementação aparece em superfícies legadas (`api-gateway` e `agent-orchestrator`), enquanto a stack canônica do README aponta para `apps/api` e `apps/worker` |
| `docs/roadmap.md` | Q1/Q2 CS: fluxo `HEALTH_ALERT`, health score operacional no dashboard e painel de churn risk | `packages/queue/src/definitions.ts` define `HEALTH_ALERT`/`CHURN_RISK_HIGH`; `apps/worker/src/jobs/healthScore.ts` existe; `apps/web/app/admin/cs/page.tsx` exibe health score | ⚠️ PARCIAL | Há base real de health score e eventos, mas a trilha continua dividida entre worker canônico, UI canônica e fluxo legado no `agent-orchestrator` |
| `docs/roadmap.md` | Q2 Jurídico: padrões de webhook idempotente para Clicksign/DocuSign | `apps/api/src/modules/webhooks/stripe.webhook.processing.ts` e `apps/api-gateway/src/middleware/webhook-idempotency.ts` implementam idempotência; `docs/api/operacao-api-gateway.md` cita DocuSign, mas não apareceu código específico de Clicksign/DocuSign nos paths auditados | ⚠️ PARCIAL | O padrão existe de forma concreta para Stripe, mas não há evidência suficiente nesta amostra para afirmar o mesmo nível de implementação para Clicksign/DocuSign |
| `docs/roadmap.md` | Q2 BI: `BOARD_REPORT` agendado na segunda às 8h | `apps/agent-orchestrator/orchestrator/flows.py` implementa `FLOW_BOARD_REPORT_GRAPH`; `packages/queue/src/definitions.ts` usa cron `0 8 * * 1` | ✅ APTO | O agendamento operacional está alinhado com o roadmap (segunda às 8h). |
| `.github/prompts/criar-agente.prompt.md` + `.github/skills/create-agent/references/checklist-validacao.md` | Agentes devem ter `description` no padrão `Use when...`, `tools` mínimos e saída numerada | `.github/agents/cycle-01/audit-bot.agent.md`, `.github/agents/cycle-02/health-score-architect.agent.md` e `.github/agents/cycle-10/mapeia.agent.md` contêm `description: "Use when..."`, `tools: [read, search, agent]` e seções `1.`, `2.`, `3.` | ✅ APTO | O contrato de criação e validação está refletido nos manifests auditados |
| `README.md`, `docs/roadmap.md`, `docs/processes/documentation-source-of-truth.md` e prompts auditados | Classificação explícita de `apps/voice-engine` no stack suportado | `apps/voice-engine/package.json` e `apps/voice-engine/src/server.ts` existem, mas a app não aparece na taxonomia canônica/legada do README nem nos artefatos instrucionais auditados | 👻 ÓRFÃO | O serviço existe no código, mas não recebeu enquadramento claro de governança na amostra cruzada |
| `README.md`, `docs/roadmap.md`, `docs/processes/documentation-source-of-truth.md` e prompts auditados | Justificativa instrucional para `google/genai/__init__.py` | `google/genai/__init__.py` existe como namespace isolado e não apareceu nos artefatos de orientação auditados | 👻 ÓRFÃO | O domínio é pequeno e rastreável no código, porém sem justificativa documental clara na amostra F2 |
=======
| "Apenas apps/web, apps/api, apps/worker, packages/database são o core" | `README.md` | `apps/dashboard` e `apps/api-gateway` e `packages/db` continuam no repositório. | ⚠️ PARCIAL | O código não foi fisicamente removido, apesar da promessa documental os tratar como "em quarentena". O repositório ainda não está purgado. |
| "Agentes de IA" | Vários docs e histórico | Existem pastas `agents/`, `.github/agents/`, `packages/agents/`, `packages/agent-packs/`. Apenas os `agent-packs` têm manifestos e integrações claras de carregamento. | 🔀 DESVIO | A pasta `.github/agents/` aparenta ser um acúmulo de prompts sem runtime. A pasta `agents/` contém código duplicado e nomenclaturas mistas. |
| Pipeline automatizada CI/CD rigorosa | `README.md` / `CONTRIBUTING.md` | `.github/workflows/cd.yml` e `ci.yml` existem, mas scripts de release usam fallback ou são preflight stubs (ex: `preflight-env.ts` precisa de mock ou falha). | ⚠️ PARCIAL | A esteira existe, mas depende de variáveis de staging/prod que estão mockadas ou em falta no ambiente atual. |
| Serviços como "voice-engine" ou "webhook-receiver" são satélites. | Catalog / Arquitetura | Eles estão dentro da pasta `apps/` no mesmo nível hierárquico das aplicações core. | 🔀 DESVIO | A estrutura não reflete o isolamento. O monorepo os trata no mesmo nível do `apps/api`. |
| Prompt Soberano e scripts na raiz | Histórico / Artefatos | Arquivos soltos como `prompt_soberano_v13.html` e scripts Python isolados (`fix_pkg.py`). | 👻 ÓRFÃO | Não pertencem a fluxos automatizados do `package.json` ou workflows estruturados. |
>>>>>>> origin/audit-forense-marco-zero-12009194758414298733

## Detalhamento

<<<<<<< HEAD
| Gap | Fonte que prometeu | Impacto | Severidade | Próxima ação sugerida |
| --- | --- | --- | --- | --- |
| Fluxos de SDR e lead repository continuam ancorados em superfícies legadas | `docs/roadmap.md`, `README.md` | Mantém lógica comercial crítica fora da stack canônica declarada | Alta | Planejar cutover explícito de `api-gateway`/`agent-orchestrator` para `apps/api`/`apps/worker` ou revisar a taxonomia canônica |
| Fluxo `BOARD_REPORT` ainda depende de superfície legada (`agent-orchestrator`) | `docs/roadmap.md` | Agenda está alinhada, porém a execução continua parcialmente fora da stack canônica declarada | Média | Planejar cutover do fluxo para `apps/api`/`apps/worker` mantendo o cron oficial de segunda às 8h |
| Idempotência de webhook para Clicksign/DocuSign não tem evidência suficiente | `docs/roadmap.md` | Risco jurídico/operacional em integrações de assinatura | Alta | Mapear conectores reais e registrar prova de idempotência específica por provedor |
| Documentação canônica ainda convive com históricos/superseded no mesmo fluxo de navegação | `docs/processes/documentation-source-of-truth.md` | Aumenta ambiguidade e risco de execução por documento desatualizado | Média | Arquivar/sinalizar melhor os documentos superseded e reforçar links para o canônico |
| `apps/voice-engine` não tem enquadramento claro de stack/governança na amostra auditada | Nenhuma instrução localizada na amostra F2 | Cria risco de ownership, deploy e criticidade sem contrato explícito | Média | Classificar formalmente o serviço como canônico, legado ou experimental |
| `google/genai/__init__.py` permanece sem justificativa instrucional visível | Nenhuma instrução localizada na amostra F2 | Reduz rastreabilidade e clareza de dependências auxiliares | Baixa-Média | Documentar o papel do namespace ou removê-lo se estiver ocioso |
=======
### Promessas Cumpridas (✅ APTO)
- O monorepo é de fato gerido pelo turborepo e pnpm com scripts root robustos.
- Os linting rules, prettier e git hooks (Husky) estão ativos e configurados.
>>>>>>> origin/audit-forense-marco-zero-12009194758414298733

### Promessas Parcialmente Cumpridas (⚠️ PARCIAL)
- A separação de core vs legado é declarativa no README, não é uma separação arquitetural estrita (tudo mora em `apps/` ou `packages/`).

### Implementações Divergentes (🔀 DESVIO)
- O volume esmagador de definições de agentes e duplicatas (em 4 pastas diferentes) contradiz a governança limpa de um monorepo SaaS.

### Código sem lastro (👻 ÓRFÃO)
- `apps/voice-engine` não tem entrada ativa nos workflows principais e aparenta ser experimental abandonado ou mal integrado.
- Múltiplos arquivos soltos na raiz.

<<<<<<< HEAD
- Arquivos criados:
  - `/audit/F2_traceability.md`
- Arquivos alterados:
  - `/audit/master_checklist.md`
- Arquivos removidos:
  - nenhum
- Matrizes de rastreabilidade geradas:
  - matriz promessa vs realidade
  - tabela de gaps prioritários
- Principais gaps identificados:
  - cutover incompleto de fluxos SDR/lead repository para a stack canônica
  - ausência de evidência suficiente para Clicksign/DocuSign com idempotência equivalente à de Stripe
  - artefatos órfãos sem enquadramento claro (`apps/voice-engine`, `google/genai/__init__.py`)
- Principais desvios identificados:
  - funcionalidades de roadmap implementadas em superfícies legadas em vez das canônicas
- Observação obrigatória se aplicável:
  - `Nenhum arquivo funcional do produto foi modificado nesta fase; apenas artefatos de auditoria foram produzidos.`
=======
---

## RELATÓRIO F2

**Quantidade por categoria identificada (Amostra crítica):**
- ✅ APTO: 2
- ⚠️ PARCIAL: 2
- ❌ GAP: 0 (No core pipeline)
- 🔀 DESVIO: 2
- 👻 ÓRFÃO: 2

**Principais gaps:**
- A pipeline de CD depende de segredos de preflight para `staging`/`prod` que não são resolvíveis nativamente sem intervenção ou mocks, bloqueando um true go-live automatizado.

**Principais desvios:**
- A enorme massa de código em `.github/agents/` que não passa de texto sem um runtime engine atrelado ao core atual.

**Principais órfãos:**
- `prompt_soberano_v13.html` solto na raiz.
- `apps/voice-engine` flutuando no repositório sem lastro forte no runtime da API canônica.

**Riscos estruturais do desalinhamento:**
- A presença de código legado (`packages/db`, `apps/api-gateway`) lado a lado com o core confunde novas contribuições e vaza no linting/testes.
- A taxonomia documental é uma máscara; a arquitetura física (as pastas) não acompanha a segregação imposta pelos documentos.
>>>>>>> origin/audit-forense-marco-zero-12009194758414298733
