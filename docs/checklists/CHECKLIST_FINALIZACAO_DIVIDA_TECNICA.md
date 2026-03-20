# Checklist de Finalização da Dívida Técnica — BirthHub 360

Atualizado em: 2026-03-20

## Objetivo

Encerrar de forma auditável a dívida técnica ativa do monorepo, cobrindo arquitetura, código, testes, segurança, observabilidade, CI/CD, documentação e operação.

## Escopo considerado

- Core canônico: `apps/web`, `apps/api`, `apps/worker`, `packages/database`
- Superfícies legadas/satélites com dívida residual: `apps/dashboard`, `packages/db`, `apps/api-gateway`, `apps/agent-orchestrator`, `apps/voice-engine`, `apps/webhook-receiver`
- Pacotes e agentes com lacunas de scripts de engenharia e hotspots de manutenção

## Como usar este checklist

1. Execute em ordem de fase (F0 → F11).
2. Só marque `[x]` quando houver evidência em PR, relatório ou artifact.
3. Não avance para fase seguinte com bloqueio aberto em fase anterior.
4. Toda exceção deve ter prazo, owner e risco explícitos.

---

## F0) Governança, ownership e baseline

- [ ] Definir um owner técnico por domínio (`web`, `api`, `worker`, `database`, `agents`, `security`, `devops`).
  - Entrega: tabela de ownership em doc versionado.
  - Aceite: nenhum item crítico sem owner.

- [ ] Definir SLA de fechamento da dívida por severidade.
  - Entrega: política com prazo máximo para P0/P1/P2.
  - Aceite: política publicada e aprovada.

- [ ] Congelar baseline de referência antes dos refactors.
  - Executar:
    - `corepack pnpm install --frozen-lockfile`
    - `corepack pnpm monorepo:doctor`
    - `corepack pnpm release:scorecard`
    - `corepack pnpm lint:core`
    - `corepack pnpm typecheck:core`
    - `corepack pnpm test:core`
    - `corepack pnpm build:core`
  - Aceite: todos verdes e evidências arquivadas.

---

## F1) Estabilização de pipeline e gates obrigatórios

- [ ] Garantir que `install --frozen-lockfile` permaneça gate obrigatório em CI.
  - Aceite: pipeline falha se lockfile divergir.

- [ ] Tornar o gate `governance-gates` obrigatório em PR para `main`.
  - Aceite: branch protection exige status check verde.

- [ ] Remover tolerância a erro de tipagem Python no CI.
  - Item: substituir `mypy ... || true` por execução bloqueante.
  - Aceite: PR falha quando houver erro de tipagem.

- [ ] Consolidar e descontinuar workflow legado desativado (`ci.yml.disabled`).
  - Entrega: decisão registrada (remover ou manter com justificativa formal).
  - Aceite: sem duplicidade ambígua de pipeline.

- [ ] Padronizar versão de Node entre workflows e toolchain local.
  - Aceite: matriz CI/CD sem drift de versão.

---

## F2) Encerramento da quarentena legada

- [ ] Eliminar consumo runtime de `@birthub/db` fora de superfícies explicitamente permitidas.
  - Itens ativos mapeados:
    - `apps/dashboard/package.json`
    - `apps/dashboard/src/components/kanban-board.tsx`
    - `apps/dashboard/src/lib/data.ts`
  - Aceite: `git grep "@birthub/db" -- apps packages agents` sem novos consumidores.

- [ ] Executar plano de estrangulamento `@birthub/db` → `@birthub/database` por domínio.
  - Entrega: PRs incrementais por bounded context.
  - Aceite: rota de rollback documentada e testada.

- [ ] Formalizar data de remoção definitiva de `packages/db`.
  - Aceite: cronograma com marcos e dependências.

- [ ] Auditar componentes legados fora do gate canônico (`dashboard`, `api-gateway`, `agent-orchestrator`, `voice-engine`, `webhook-receiver`).
  - Aceite: cada superfície com status `sunset`, `promovida` ou `removida`.

---

## F3) Modularização de hotspots críticos (redução de risco de regressão)

### Regras para todos os hotspots

- [ ] Definir limite de tamanho por arquivo e complexidade ciclomática por domínio.
- [ ] Refatorar em etapas pequenas com testes de regressão por commit.
- [ ] Proibir refactor “big bang”.
- [ ] Exigir ADR/resumo arquitetural para mudanças de fronteira de módulo.

### Backlog de hotspots mapeados (>= 500 linhas)

- [ ] `apps/api/src/modules/billing/service.ts` (~1492) — quebrar em serviços de domínio (cobrança, reconciliação, sync).
- [ ] `apps/api/src/modules/auth/auth.service.ts` (~1116) — separar sessão, credenciais, MFA, políticas.
- [ ] `apps/worker/src/agents/runtime.ts` (~989) — extrair orchestration, retries, telemetry e error mapping.
- [ ] `apps/api/src/modules/agents/service.ts` (~850) — separar registry, dispatch e integração de runtime.
- [ ] `apps/worker/src/worker.ts` (~822) — isolar boot, wiring e handlers por fila.
- [ ] `packages/agents/executivos/narrativeweaver/agent.ts` (~806) — padronizar geração via template/base comum.
- [ ] `packages/agents/executivos/pipelineoracle/agent.ts` (~800) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/quotaarchitect/agent.ts` (~800) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/brandguardian/agent.ts` (~792) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/budgetfluid/agent.ts` (~792) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/churndeflector/agent.ts` (~792) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/culturepulse/agent.ts` (~792) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/capitalallocator/agent.ts` (~792) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/pricingoptimizer/agent.ts` (~791) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/competitorxray/agent.ts` (~791) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/crisisnavigator/agent.ts` (~791) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/trendcatcher/agent.ts` (~790) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/marketsentinel/agent.ts` (~790) — reduzir duplicação estrutural.
- [ ] `packages/agents/executivos/expansionmapper/agent.ts` (~790) — reduzir duplicação estrutural.
- [ ] `packages/database/prisma/seed.ts` (~760) — separar seeds por domínio e idempotência.
- [ ] `scripts/generate-official-collection.ts` (~754) — modularizar parse, transformação e output.
- [ ] `apps/api/src/modules/connectors/service.ts` (~627) — extrair adaptadores por conector.
- [ ] `packages/agent-packs/corporate-v1/source/foundation-agent-overrides.ts` (~601) — separar overlays por vertical.
- [ ] `apps/api/src/app.ts` (~568) — decompor bootstrap e middlewares.
- [ ] `apps/worker/src/engine/runner.ts` (~530) — separar scheduler, executor e fallback path.
- [ ] `apps/api/src/modules/analytics/service.ts` (~500) — separar coleta, cálculo e exposição.

---

## F4) Padronização de scripts de engenharia por pacote

### Política-alvo (mínimo por pacote)

- [ ] Todo pacote deve possuir scripts: `lint`, `typecheck`, `test`, `build` (ou justificativa formal quando não aplicável).
- [ ] Todo pacote sem script obrigatório deve ser classificado como:
  - `N/A` (com justificativa técnica versionada), ou
  - `A corrigir` (com issue e prazo).

### Pacotes sem `lint` (22)

- [ ] `agents/ae/package.json` (`ae-agent-worker`)
- [ ] `agents/analista/package.json` (`analista-agent-worker`)
- [ ] `agents/financeiro/package.json` (`financeiro-agent-worker`)
- [ ] `agents/juridico/package.json` (`juridico-agent-worker`)
- [ ] `agents/ldr/package.json` (`ldr-agent-worker`)
- [ ] `agents/marketing/package.json` (`marketing-agent-worker`)
- [ ] `agents/pos_venda/package.json` (`pos-venda-agent-worker`)
- [ ] `agents/sdr/package.json` (`sdr-agent-worker`)
- [ ] `packages/agent-packs/package.json` (`@birthub/agent-packs`)
- [ ] `packages/agent-runtime/package.json` (`@birthub/agent-runtime`)
- [ ] `packages/agents-core/package.json` (`@birthub/agents-core`)
- [ ] `packages/agents-registry/package.json` (`@birthub/agents-registry`)
- [ ] `packages/auth/package.json` (`@birthub/auth`)
- [ ] `packages/conversation-core/package.json` (`@birthub/conversation-core`)
- [ ] `packages/db/package.json` (`@birthub/db`)
- [ ] `packages/integrations/package.json` (`@birthub/integrations`)
- [ ] `packages/llm-client/package.json` (`@birthub/llm-client`)
- [ ] `packages/queue/package.json` (`@birthub/queue`)
- [ ] `packages/security/package.json` (`@birthub/security`)
- [ ] `packages/shared-types/package.json` (`@birthub/shared-types`)
- [ ] `packages/shared/package.json` (`@birthub/shared`)
- [ ] `packages/utils/package.json` (`@birthub/utils`)

### Pacotes sem `typecheck` (18)

- [ ] `agents/ae/package.json` (`ae-agent-worker`)
- [ ] `agents/analista/package.json` (`analista-agent-worker`)
- [ ] `agents/financeiro/package.json` (`financeiro-agent-worker`)
- [ ] `agents/juridico/package.json` (`juridico-agent-worker`)
- [ ] `agents/ldr/package.json` (`ldr-agent-worker`)
- [ ] `agents/marketing/package.json` (`marketing-agent-worker`)
- [ ] `agents/pos_venda/package.json` (`pos-venda-agent-worker`)
- [ ] `agents/sdr/package.json` (`sdr-agent-worker`)
- [ ] `packages/agent-packs/package.json` (`@birthub/agent-packs`)
- [ ] `packages/agent-runtime/package.json` (`@birthub/agent-runtime`)
- [ ] `packages/auth/package.json` (`@birthub/auth`)
- [ ] `packages/conversation-core/package.json` (`@birthub/conversation-core`)
- [ ] `packages/emails/package.json` (`@birthub/emails`)
- [ ] `packages/integrations/package.json` (`@birthub/integrations`)
- [ ] `packages/security/package.json` (`@birthub/security`)
- [ ] `packages/shared-types/package.json` (`@birthub/shared-types`)
- [ ] `packages/shared/package.json` (`@birthub/shared`)
- [ ] `packages/utils/package.json` (`@birthub/utils`)

### Pacotes sem `test` (13)

- [ ] `agents/ae/package.json` (`ae-agent-worker`)
- [ ] `agents/analista/package.json` (`analista-agent-worker`)
- [ ] `agents/financeiro/package.json` (`financeiro-agent-worker`)
- [ ] `agents/juridico/package.json` (`juridico-agent-worker`)
- [ ] `agents/ldr/package.json` (`ldr-agent-worker`)
- [ ] `agents/marketing/package.json` (`marketing-agent-worker`)
- [ ] `agents/pos_venda/package.json` (`pos-venda-agent-worker`)
- [ ] `agents/sdr/package.json` (`sdr-agent-worker`)
- [ ] `packages/emails/package.json` (`@birthub/emails`)
- [ ] `packages/integrations/package.json` (`@birthub/integrations`)
- [ ] `packages/llm-client/package.json` (`@birthub/llm-client`)
- [ ] `packages/shared-types/package.json` (`@birthub/shared-types`)
- [ ] `packages/shared/package.json` (`@birthub/shared`)

### Pacotes sem `build` (11)

- [ ] `agents/ae/package.json` (`ae-agent-worker`)
- [ ] `agents/analista/package.json` (`analista-agent-worker`)
- [ ] `agents/financeiro/package.json` (`financeiro-agent-worker`)
- [ ] `agents/juridico/package.json` (`juridico-agent-worker`)
- [ ] `agents/ldr/package.json` (`ldr-agent-worker`)
- [ ] `agents/marketing/package.json` (`marketing-agent-worker`)
- [ ] `agents/pos_venda/package.json` (`pos-venda-agent-worker`)
- [ ] `agents/sdr/package.json` (`sdr-agent-worker`)
- [ ] `packages/agent-packs/package.json` (`@birthub/agent-packs`)
- [ ] `packages/emails/package.json` (`@birthub/emails`)
- [ ] `packages/shared/package.json` (`@birthub/shared`)

---

## F5) Qualidade de testes e cobertura

- [ ] Definir política única de cobertura para TS/JS (equivalente ao `cov-fail-under` já usado em Python).
  - Aceite: threshold mínimo por domínio e gate CI bloqueante.

- [ ] Garantir teste mínimo para cada pacote marcado sem `test` (ou justificar N/A).
  - Aceite: todo pacote com script `test` válido ou exceção aprovada.

- [ ] Rebalancear suíte Python de integração para reduzir tempo (sharding/paralelismo/escopo).
  - Meta sugerida: reduzir tempo em pelo menos 30% sem perder cobertura.

- [ ] Criar matriz de rastreabilidade “módulo crítico ↔ suíte de teste”.
  - Aceite: billing/auth/runtime/worker com cobertura explícita por tipo de teste.

- [ ] Garantir teste de regressão para cada hotspot refatorado antes e depois da extração.
  - Aceite: sem aumento de flaky tests e sem queda de cobertura.

---

## F6) Segurança, compliance e hardening

- [ ] Manter `security-guardrails` e `security-scan` verdes em toda release.
- [ ] Rodar auditoria de dependências e tratar `high/critical` sem exceção silenciosa.
- [ ] Revalidar controles de sessão, RBAC e cookies seguros após refactors.
- [ ] Confirmar que redação de PII e retenção de logs continuam aderentes.
- [ ] Reexecutar baseline OWASP e anexar evidência no ciclo de release.

Aceite da fase: nenhum achado crítico aberto sem plano formal com prazo.

---

## F7) Observabilidade e SLOs

- [ ] Revisar SLOs canônicos para web/api/worker e atualizar error budgets.
- [ ] Garantir métricas mínimas por serviço: latência, erro, throughput, fila, retries.
- [ ] Validar dashboards e alertas com teste de incidente controlado.
- [ ] Padronizar correlação de logs por request/job/tenant.
- [ ] Definir runbook de mitigação para cada alerta P1.

Aceite da fase: alertas acionáveis, sem “alert fatigue”, com runbook associado.

---

## F8) Banco, migração e integridade de dados

- [ ] Executar checklist de pós-migração e rollback para mudanças pendentes de schema.
- [ ] Garantir lock de migration e versionamento consistente entre ambientes.
- [ ] Segmentar `seed.ts` por domínio + idempotência validada.
- [ ] Validar RLS/isolamento de tenant e trilha de auditoria.
- [ ] Testar migração em staging com volume representativo.

Aceite da fase: migração + rollback testados e aprovados.

---

## F9) Higiene estrutural do repositório

- [ ] Resolver naming duplicado em agents: `pos_venda` vs `pos-venda`.
  - Aceite: apenas uma convenção canônica, com migração de imports/scripts.

- [ ] Revisar versionamento de `artifacts/` (61 arquivos rastreados).
  - Classificar cada artefato em: obrigatório, opcional, não-versionar.
  - Aceite: política aplicada e `.gitignore`/pipeline ajustados.

- [ ] Reduzir ruído de documentação histórica conflitante.
  - Aceite: fonte única de verdade por processo (doctor, scorecard, debt report).

- [ ] Automatizar validação para impedir volta de padrões proibidos.
  - Exemplo: novos imports `@birthub/db` fora da exceção explícita.

---

## F10) Documentação operacional e transferência de conhecimento

- [ ] Atualizar docs arquiteturais após cada refactor de hotspot.
- [ ] Atualizar runbooks de deploy, rollback e incidentes com passos reais pós-mudança.
- [ ] Criar changelog técnico de dívida fechada por sprint.
- [ ] Publicar matriz “dívida fechada / dívida remanescente / risco residual”.
- [ ] Registrar decisões em ADR quando houver mudança de contrato entre pacotes.

Aceite da fase: onboarding técnico consegue reproduzir o estado sem conhecimento tácito.

---

## F11) Validação final de encerramento da dívida

Marcar encerramento apenas quando todos os itens abaixo estiverem verdes:

- [ ] `corepack pnpm install --frozen-lockfile`
- [ ] `corepack pnpm monorepo:doctor`
- [ ] `corepack pnpm release:scorecard`
- [ ] `corepack pnpm lint:core`
- [ ] `corepack pnpm typecheck:core`
- [ ] `corepack pnpm test:core`
- [ ] `corepack pnpm test:isolation`
- [ ] `corepack pnpm build:core`
- [ ] `corepack pnpm test:e2e:release`
- [ ] `corepack pnpm release:preflight:staging`
- [ ] `corepack pnpm release:preflight:production`

Critério de encerramento global:

- [ ] Sem P0/P1 aberto no backlog técnico.
- [ ] Sem exceção de segurança/compliance sem prazo e owner.
- [ ] Sem import legado proibido em novas superfícies.
- [ ] Sem pacote crítico sem `lint/typecheck/test/build` ou justificativa `N/A` aprovada.
- [ ] Sem hotspot crítico sem plano de modularização em execução.

---

## Anexo A — Evidências mínimas por item

Para cada item marcado como concluído, anexar no PR:

- link da issue
- commit/PR de implementação
- log de execução do comando/gate
- impacto esperado e risco residual
- validação de rollback (quando aplicável)

## Anexo B — Template de fechamento por item

```md
- [x] ITEM-ID: <título>
  - Owner: <nome/time>
  - Severidade: <P0|P1|P2>
  - Prazo: <data>
  - Evidência: <link PR/artifact>
  - Risco residual: <baixo|médio|alto>
  - Rollback: <sim|não|N/A>
```

## Anexo C — Prompts de execução por fase (copiar e usar)

### Prompt de execução — F0 (Governança, ownership e baseline)

```md
Você é o responsável por executar a F0 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Definir governança e baseline técnico congelado antes de qualquer refactor.

Escopo:
- Monorepo completo, com foco no core canônico (`apps/web`, `apps/api`, `apps/worker`, `packages/database`).

Tarefas obrigatórias:
1) Criar matriz de ownership técnico por domínio (`web`, `api`, `worker`, `database`, `agents`, `security`, `devops`).
2) Definir SLA de fechamento por severidade (P0, P1, P2), com prazo máximo e responsável.
3) Executar e registrar baseline:
  - `corepack pnpm install --frozen-lockfile`
  - `corepack pnpm monorepo:doctor`
  - `corepack pnpm release:scorecard`
  - `corepack pnpm lint:core`
  - `corepack pnpm typecheck:core`
  - `corepack pnpm test:core`
  - `corepack pnpm build:core`

Critérios de aceite:
- Nenhum item crítico sem owner.
- Política de SLA publicada.
- Todos os comandos verdes com evidência versionada.

Entregáveis:
- PR com documento de ownership + SLA + evidências de baseline.
```

### Prompt de execução — F1 (Pipeline e gates obrigatórios)

```md
Você é o responsável por executar a F1 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Eliminar fragilidades de CI/CD e tornar gates de qualidade realmente bloqueantes.

Tarefas obrigatórias:
1) Garantir `install --frozen-lockfile` como gate obrigatório em PR para `main`.
2) Tornar `governance-gates` check obrigatório na proteção de branch.
3) Remover bypass de tipagem Python (`mypy ... || true`) e deixar falha bloqueante.
4) Consolidar destino de `ci.yml.disabled` (remover ou justificar oficialmente).
5) Padronizar versão de Node em workflows e execução local.

Critérios de aceite:
- PR falha ao quebrar lockfile, doctor, scorecard ou typecheck Python.
- Não existe pipeline legado ambíguo sem decisão formal.
- Versão de Node consistente em CI/CD.

Entregáveis:
- PR com ajuste de workflows + branch protection + evidências de execução.
```

### Prompt de execução — F2 (Encerramento da quarentena legada)

```md
Você é o responsável por executar a F2 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Encerrar dependências legadas remanescentes e formalizar sunset controlado.

Tarefas obrigatórias:
1) Eliminar consumo runtime de `@birthub/db` fora da exceção explicitamente aprovada.
2) Executar migração incremental para `@birthub/database` por domínio.
3) Formalizar cronograma de remoção de `packages/db` com rollback.
4) Classificar superfícies legadas (`dashboard`, `api-gateway`, `agent-orchestrator`, `voice-engine`, `webhook-receiver`) como `sunset`, `promovida` ou `removida`.

Critérios de aceite:
- `git grep "@birthub/db" -- apps packages agents` sem novos consumidores.
- Cronograma e plano de rollback publicados.
- Status de cada superfície legada documentado.

Entregáveis:
- PR de migração + relatório de impacto + atualização de docs de deprecação/cutover.
```

### Prompt de execução — F3 (Modularização de hotspots)

```md
Você é o responsável por executar a F3 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Reduzir risco de regressão e custo de manutenção em arquivos hotspot.

Tarefas obrigatórias:
1) Definir limites formais de tamanho e complexidade por domínio.
2) Refatorar hotspots em lotes pequenos com testes de regressão por etapa.
3) Priorizar arquivos mais críticos (billing/auth/runtime/worker).
4) Evitar refactor big bang; exigir ADR em mudanças de fronteira.
5) Atualizar backlog até cobrir todos os arquivos >=500 linhas listados no checklist.

Critérios de aceite:
- Hotspots prioritários com extração de módulos concluída.
- Sem queda de cobertura e sem aumento de flaky tests.
- ADRs publicados para mudanças estruturais.

Entregáveis:
- Série de PRs pequenos com before/after, métricas e risco residual.
```

### Prompt de execução — F4 (Padronização de scripts por pacote)

```md
Você é o responsável por executar a F4 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Garantir padrão mínimo de engenharia em todos os pacotes do workspace.

Tarefas obrigatórias:
1) Para cada pacote listado no checklist sem `lint`, `typecheck`, `test` ou `build`, implementar scripts faltantes.
2) Quando não aplicável, registrar justificativa `N/A` formal e versionada.
3) Adicionar validação automatizada para bloquear novos pacotes sem scripts mínimos.
4) Ajustar pipelines para usar os scripts padronizados.

Critérios de aceite:
- 100% dos pacotes com scripts mínimos ou justificativa `N/A` aprovada.
- CI bloqueia regressão de padronização.

Entregáveis:
- PR de padronização + relatório final por pacote (status: OK / N/A / pendente).
```

### Prompt de execução — F5 (Qualidade de testes e cobertura)

```md
Você é o responsável por executar a F5 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Elevar previsibilidade de qualidade com cobertura e rastreabilidade.

Tarefas obrigatórias:
1) Definir e aplicar política de cobertura mínima para TS/JS no CI.
2) Garantir `test` mínimo em todos os pacotes sem teste (ou justificar N/A).
3) Reduzir tempo da suíte Python de integração com paralelismo/sharding.
4) Criar matriz de rastreabilidade módulo crítico ↔ suíte de teste.
5) Validar regressão para cada hotspot refatorado.

Critérios de aceite:
- Cobertura mínima aplicada e bloqueante no CI.
- Pacotes críticos sem lacuna de teste.
- Tempo de integração Python reduzido sem perda de qualidade.

Entregáveis:
- PR com configuração de cobertura + testes novos + relatório comparativo de tempo.
```

### Prompt de execução — F6 (Segurança, compliance e hardening)

```md
Você é o responsável por executar a F6 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Fechar risco técnico de segurança/compliance sem exceções silenciosas.

Tarefas obrigatórias:
1) Rodar e manter verdes `security-guardrails` e `security-scan`.
2) Tratar dependências `high/critical` com plano e prazo.
3) Revalidar sessão, RBAC, cookies e controles de autenticação pós-refactor.
4) Confirmar políticas de PII, retenção e trilha de auditoria.
5) Reexecutar baseline OWASP com evidência.

Critérios de aceite:
- Nenhum achado crítico aberto sem owner e prazo.
- Evidências de segurança anexadas ao ciclo de release.

Entregáveis:
- PR/relatório de hardening com status dos achados e risco residual.
```

### Prompt de execução — F7 (Observabilidade e SLOs)

```md
Você é o responsável por executar a F7 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Garantir operação observável, acionável e aderente a SLO.

Tarefas obrigatórias:
1) Revisar SLOs de web/api/worker e atualizar error budgets.
2) Garantir métricas mínimas (latência, erro, throughput, fila, retries).
3) Validar dashboards/alertas com simulação de incidente.
4) Padronizar correlação de logs por request, job e tenant.
5) Criar runbook por alerta P1.

Critérios de aceite:
- Alertas com baixa ambiguidade e runbook associado.
- Visibilidade ponta a ponta para serviços canônicos.

Entregáveis:
- PR com dashboards/alertas/runbooks atualizados e evidência de teste de incidente.
```

### Prompt de execução — F8 (Banco, migração e integridade)

```md
Você é o responsável por executar a F8 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Eliminar risco de dados em mudanças de schema e operação de banco.

Tarefas obrigatórias:
1) Executar checklist de pós-migração e rollback.
2) Garantir lock de migration e consistência entre ambientes.
3) Modularizar `seed.ts` por domínio com idempotência validada.
4) Revalidar isolamento de tenant (RLS) e auditoria.
5) Testar migração em staging com volume representativo.

Critérios de aceite:
- Migração e rollback aprovados em staging.
- Sem drift de schema entre ambientes.

Entregáveis:
- PR com scripts/docs de migração + relatório de execução/rollback.
```

### Prompt de execução — F9 (Higiene estrutural do repositório)

```md
Você é o responsável por executar a F9 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Reduzir ruído estrutural, ambiguidade e regressão organizacional.

Tarefas obrigatórias:
1) Resolver duplicidade de naming em agents (`pos_venda` vs `pos-venda`).
2) Revisar versionamento de `artifacts/` e aplicar política (manter/remover/ignorar).
3) Consolidar documentação histórica para fonte única de verdade por processo.
4) Automatizar validações de padrões proibidos (ex.: novos imports legados fora da exceção).

Critérios de aceite:
- Uma única convenção de naming ativa.
- Política de artifacts aplicada em git e pipeline.
- Validações preventivas ativas.

Entregáveis:
- PR de higiene estrutural + policy docs + validações automatizadas.
```

### Prompt de execução — F10 (Documentação e transferência)

```md
Você é o responsável por executar a F10 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Garantir continuidade operacional sem dependência de conhecimento tácito.

Tarefas obrigatórias:
1) Atualizar documentação arquitetural após refactors.
2) Atualizar runbooks de deploy, rollback e incidentes.
3) Publicar changelog técnico de dívida fechada por sprint.
4) Publicar matriz de dívida fechada/remanescente/risco residual.
5) Registrar decisões estruturais em ADR.

Critérios de aceite:
- Time consegue operar e evoluir com base apenas na documentação.
- Mudanças estruturais rastreáveis por ADR.

Entregáveis:
- PR de documentação completa + evidência de revisão por pares.
```

### Prompt de execução — F11 (Validação final e encerramento)

```md
Você é o responsável por executar a F11 do plano de dívida técnica do BirthHub 360.

Objetivo:
- Validar encerramento real da dívida técnica com gate de fechamento auditável.

Tarefas obrigatórias:
1) Executar a bateria final de comandos:
  - `corepack pnpm install --frozen-lockfile`
  - `corepack pnpm monorepo:doctor`
  - `corepack pnpm release:scorecard`
  - `corepack pnpm lint:core`
  - `corepack pnpm typecheck:core`
  - `corepack pnpm test:core`
  - `corepack pnpm test:isolation`
  - `corepack pnpm build:core`
  - `corepack pnpm test:e2e:release`
  - `corepack pnpm release:preflight:staging`
  - `corepack pnpm release:preflight:production`
2) Confirmar ausência de P0/P1 aberto sem plano aprovado.
3) Confirmar ausência de exceção sem owner e prazo.
4) Publicar ata de encerramento com risco residual final.

Critérios de aceite:
- Todos os gates finais verdes.
- Fechamento assinado pelos owners técnicos.

Entregáveis:
- PR final de encerramento + relatório executivo de conclusão da dívida técnica.
```
