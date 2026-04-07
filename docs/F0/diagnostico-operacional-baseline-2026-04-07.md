# Fase 0 — Diagnóstico Operacional e Baseline

## Objetivo do ciclo
Validar o estado real do monorepo no `HEAD` de 2026-04-07, confirmar ou refutar os itens mais sensíveis do relatório, materializar o baseline inicial de risco e definir a sequência exata das próximas fases.

## Itens do relatório atacados
- [x] `TD-001` do relatório master: refresh token store em memória
- [x] `TD-002` do relatório master: prova de isolamento/RLS
- [x] `TD-003` do relatório master: schema drift check
- [x] `TD-004` a `TD-008`: auditados com tratamento explícito de ambiguidade de catálogo
- [x] `TD-018`, `TD-020`, `TD-021`, `TD-022`, `TD-024`
- [x] `TD-031`, `TD-032`, `TD-033`, `TD-035`, `TD-037`, `TD-038`

## Leitura do estado atual
- Existe um monorepo real com `apps/*`, `apps/legacy/*` e `packages/*`, com core canônico documentado em `docs/service-catalog.md`.
- O core de runtime está concentrado em `apps/web`, `apps/api`, `apps/worker` e `packages/database`.
- `apps/legacy/dashboard` segue versionado e `apps/dashboard` hoje não é uma aplicação de runtime; ele contém apenas bibliotecas (`lib/dashboard-data.ts`, `lib/dashboard-static-snapshot.ts`).
- O frontend em `apps/web` possui superfícies de detalhe para workflows (`/(dashboard)/workflows/[id]/edit`, `/(dashboard)/workflows/[id]/revisions`, `/(dashboard)/workflows/[id]/runs`), mas não possui `app/(dashboard)/page.tsx` nem `app/(dashboard)/workflows/page.tsx`.
- O backend possui rota real para listar workflows em `apps/api/src/modules/workflows/router.ts` (`GET /api/v1/workflows`), o que contradiz a ausência de uma listagem canônica no frontend.
- O schema Prisma existe em `packages/database/prisma/schema.prisma` com 1170 linhas, migrations versionadas e `migration-registry.json`.
- O domínio persistido é majoritariamente operacional/SaaS (`Organization`, `Workflow`, `WorkflowExecution`, billing, notifications, connectors, audit), sem modelos explícitos materno-infantis no schema atual.
- `.env.example` cobre superfície relevante de segurança e operação: CSP, cookies seguros, CSRF, rate limit, Redis, Stripe, SendGrid, HubSpot, Google e Microsoft.
- Headers de segurança existem nos dois lados: Helmet na API e CSP/HSTS/X-Frame-Options/Referrer-Policy no Next.js.
- Há UI e API de privacidade/LGPD (`/settings/privacy`, `/api/v1/privacy`) e banner de consentimento de analytics, mas isso não substitui prova de isolamento multi-tenant em runtime.
- Há sinais fortes de PT-BR (`lang="pt-BR"`, `toLocaleString("pt-BR")`, manifest com `lang: pt-BR`), porém não foi localizada uma camada formal de i18n como `next-intl`, `react-intl` ou `i18next`.
- O pipeline de CI executa lint, typecheck, test, test:isolation, build, suite de segurança, suite RBAC e workflow-suite com Postgres e Redis efêmeros; porém ainda existem testes que fazem `skip` quando não há banco real ou contexto externo.

## Decisões arquiteturais
- Tratar `docs/service-catalog.md` como fonte canônica de fronteiras operacionais.
- Tratar `apps/web` como frontend canônico de produto.
- Tratar `apps/legacy/dashboard` como legado/quarentena e `apps/dashboard` como biblioteca auxiliar, não como superfície válida para fechar o checklist de dashboard home.
- Separar o catálogo de dívida em duas fontes até a renumeração ser saneada:
  - Bloqueadores de go-live: `audit/RELATORIO_DIVIDA_TECNICA_MASTER.md`
  - Backlog estrutural atual: `audit/.auditor-prime/2026-04-07/03-scored-report.json`
- Considerar `TD-001` a `TD-008` como ambíguos sem uma tabela de mapeamento, porque os mesmos IDs foram reutilizados para problemas diferentes.
- Considerar a plataforma em `RED` enquanto existirem, ao mesmo tempo, lacuna de RLS em `workflow_revisions`, prova runtime de isolamento não fechada e ausência de superfícies canônicas de dashboard/workflow list no frontend principal.

Alternativas descartadas:
- Considerar `apps/dashboard` como “dashboard home” do produto.
- Considerar `TD-001` a `TD-008` do auditor-prime como equivalentes aos `TD-001` a `TD-008` do relatório master.
- Considerar o problema de schema drift ainda ativo no `HEAD` atual sem revalidar o artefato fresco.

Justificativa:
- Essas três leituras falseariam o baseline e esconderiam divergências concretas entre documentação, código e artefatos atuais.

## Plano executável
- Passo 1: congelar a taxonomia canônica do ciclo, separando claramente relatório master e auditor-prime.
- Passo 2: fechar o bloqueador de isolamento multi-tenant, adicionando RLS em `workflow_revisions` e rerodando a prova runtime com banco acessível.
- Passo 3: substituir o refresh token store em memória por persistência durável compartilhada.
- Passo 4: decidir o caminho canônico para dashboard home e workflow list no `apps/web`; implementar ou despublicar explicitamente.
- Passo 5: endurecer `cd.yml` e fechar warnings de segurança com evidência fresca versionada.
- Passo 6: atacar backlog estrutural de complexidade, `process.env` fora do boundary de config e usos de `any`.
- Passo 7: só depois abrir Fase 3 de domínio clínico, porque o schema atual ainda não materializa o domínio materno-infantil prometido.

## Arquivos impactados
- criar:
  - `docs/F0/diagnostico-operacional-baseline-2026-04-07.md`
- alterar:
  - nenhum arquivo de runtime neste ciclo diagnóstico
- remover:
  - nenhum

## Checklist de implementação
- [ ] migrations
- [ ] rotas
- [ ] serviços
- [ ] validações
- [ ] UI
- [ ] loading/error/empty
- [ ] testes
- [x] docs

## A. Leitura do estado atual

### 1. Estrutura real do monorepo

| Área | Estado observado | Evidência |
|---|---|---|
| `apps/` | existe com `api`, `dashboard`, `legacy`, `voice-engine`, `web`, `webhook-receiver`, `worker` | árvore real do repositório |
| `packages/` | existe com `auth`, `database`, `integrations`, `llm-client`, `workflows-core` e outros | `package.json`, `pnpm-workspace.yaml` |
| `infra/` | existe com `cloudrun`, `docker`, `k8s`, `monitoring`, `terraform` | árvore real do repositório |
| `docs/` | existe com áreas operacionais, arquitetura, release, security, workflows e `F0` | árvore real do repositório |
| `apps/legacy/dashboard` | ainda presente | `docs/service-catalog.md`, diretório `apps/legacy/dashboard` |
| `apps/dashboard` | não é app de runtime; contém só `lib/*.ts` | `apps/dashboard/lib/dashboard-data.ts`, `apps/dashboard/lib/dashboard-static-snapshot.ts` |

### 2. Rotas reais do frontend

Superfícies confirmadas em `apps/web/app`:
- `/login`
- `/pricing`
- `/legal/privacy`
- `/legal/terms`
- `/billing/success`
- `/billing/cancel`
- `/invites/accept`
- `/admin/dashboard`
- `/admin/analytics`
- `/admin/cs`
- `/(dashboard)/agents`
- `/(dashboard)/billing`
- `/(dashboard)/marketplace`
- `/(dashboard)/outputs`
- `/(dashboard)/packs`
- `/(dashboard)/profile/notifications`
- `/(dashboard)/profile/security`
- `/(dashboard)/settings/audit`
- `/(dashboard)/settings/billing`
- `/(dashboard)/settings/developers/webhooks`
- `/(dashboard)/settings/members`
- `/(dashboard)/settings/privacy`
- `/(dashboard)/settings/security`
- `/(dashboard)/settings/team`
- `/(dashboard)/settings/users`
- `/(dashboard)/workflows/[id]/edit`
- `/(dashboard)/workflows/[id]/revisions`
- `/(dashboard)/workflows/[id]/runs`

Lacunas confirmadas:
- `apps/web/app/(dashboard)/page.tsx`: inexistente
- `apps/web/app/(dashboard)/workflows/page.tsx`: inexistente
- `apps/web/app/page.tsx` redireciona apenas para `/login`

Leitura operacional:
- Existe detalhe de workflow, mas não existe home canônica do dashboard no app principal.
- Existe detalhe de workflow, mas não existe listagem canônica de workflows no app principal.
- Isso contradiz um produto minimamente navegável via `apps/web` sem deep links.

### 3. Rotas reais da API

Mounts principais confirmados em `apps/api/src/app/module-routes.ts`:
- `/api/v1/auth`
- `/api/v1/apikeys`
- `/api/v1/agents`
- `/api/v1/analytics`
- `/api/v1/dashboard`
- `/api/v1/connectors`
- `/api/v1/marketplace`
- `/api/v1/billing`
- `/api/v1/budgets`
- `/api/v1/packs`
- `/api/v1/outputs`
- `/api/v1/privacy`
- `/api/v1/workflows`
- superfícies adicionais para sessões, invites, notifications, organizations, users e webhooks

Rotas de workflow confirmadas:
- `GET /api/v1/workflows`
- `POST /api/v1/workflows`
- `GET /api/v1/workflows/:id`
- `PUT /api/v1/workflows/:id`
- `DELETE /api/v1/workflows/:id`
- `POST /api/v1/workflows/:id/run`
- `GET /api/v1/workflows/:id/executions/lineage`

Conclusão:
- A API já oferece superfície canônica para listagem de workflows.
- O desalinhamento está hoje principalmente no frontend principal.

### 4. Banco, schema e migrations

- `packages/database/prisma/schema.prisma` existe e tem 1170 linhas.
- Existem migrations versionadas de `20260313000100_cycle1_foundation` até `20260402000100_cycle12_ci_schema_alignment`.
- O schema contém `Workflow`, `WorkflowStep`, `WorkflowTransition`, `WorkflowRevision` e `WorkflowExecution`.
- O schema não materializa modelos clínicos explícitos como gravidez, gestante, parto, recém-nascido, cuidado materno ou infantil.
- Isso indica que o produto ainda está modelado mais como plataforma operacional multi-tenant do que como healthtech materno-infantil de domínio profundo.

### 5. Segurança, LGPD, i18n e testes

- API com Helmet e CSP em `apps/api/src/app/core.ts`.
- Web com CSP/HSTS/X-Frame-Options/Referrer-Policy em `apps/web/next.config.mjs`.
- Privacidade/LGPD visível em UI e API:
  - `/settings/privacy`
  - `/api/v1/privacy`
  - banner de consentimento de analytics
- PT-BR confirmado por `lang="pt-BR"` e formatação local, mas sem camada formal de i18n detectada.
- CI real existe e sobe Postgres/Redis para várias lanes.
- Ainda existem `skip`s condicionais em testes dependentes de banco/contexto externo.

### 6. Contradições relevantes entre relatório e código real

- O relatório master diz que `TD-003` é drift de schema bloqueando; o artefato atual de drift está em `PASS`.
- O relatório master usa `TD-001` e `TD-002` para riscos operacionais de auth/RLS; o auditor-prime atual reutiliza `TD-001` e `TD-002` para hotspots arquiteturais completamente diferentes.
- O frontend principal não comprova dashboard home nem workflow list, embora a API e os detalhes de workflow existam.
- Há UI de LGPD/consentimento, mas a prova forte de isolamento multi-tenant segue insuficiente.

### 7. O que bloqueia avanço imediato

- `packages/auth/index.ts` ainda mantém refresh token store em `Map` local.
- `artifacts/tenancy/rls-proof-head.json` aponta `runtimeProof.status = skipped-no-database`.
- O mesmo artefato registra `FAIL workflow_revisions` por política RLS ausente.
- Não há home do dashboard nem workflow list canônica em `apps/web`.
- O catálogo de dívida não é estável: o mesmo ID significa coisas diferentes em relatórios diferentes.

### 8. Confirmação/refutação do relatório master (`audit/RELATORIO_DIVIDA_TECNICA_MASTER.md`)

| ID | Status | Evidência principal | Leitura |
|---|---|---|---|
| TD-001 | CONFIRMADO | `packages/auth/index.ts:21` | `refreshStore` continua em memória, sem durabilidade ou compartilhamento entre instâncias. |
| TD-002 | CONFIRMADO COM DESVIO | `packages/database/test/rls.test.ts`, `artifacts/tenancy/rls-proof-head.json:8` | O risco de isolamento permanece aberto, mas o sintoma atual não é “teste falhando” e sim prova runtime não fechada + `workflow_revisions` sem RLS. |
| TD-003 | REFUTADO NO HEAD ATUAL | `artifacts/database/f8/schema-drift-report.txt:1`, `packages/database/scripts/check-schema-drift.ts` | O artefato fresco atual está em `PASS`; o risco restante é operacional, porque o check pode ser pulado sem `DATABASE_URL`. |
| TD-004 | AMBÍGUO | ausência de definição no relatório master + reutilização no auditor-prime | Não há definição estável do item neste catálogo. |
| TD-005 | AMBÍGUO | ausência de definição no relatório master + reutilização no auditor-prime | Não há definição estável do item neste catálogo. |
| TD-006 | AMBÍGUO | ausência de definição no relatório master + reutilização no auditor-prime | Não há definição estável do item neste catálogo. |
| TD-007 | AMBÍGUO | ausência de definição no relatório master + reutilização no auditor-prime | Não há definição estável do item neste catálogo. |
| TD-008 | AMBÍGUO | ausência de definição no relatório master + reutilização no auditor-prime | Não há definição estável do item neste catálogo. |

### 9. Confirmação do backlog estrutural atual (`audit/.auditor-prime/2026-04-07/03-scored-report.json`)

| ID | Status | Evidência principal | Leitura |
|---|---|---|---|
| TD-001 | CONFIRMADO | `apps/api/src/modules/workflows/router.ts:61` | hotspot arquitetural real no router de workflows |
| TD-002 | CONFIRMADO | `packages/database/scripts/check-migration-governance.ts` | backlog estrutural atual, separado do master |
| TD-003 | CONFIRMADO | `apps/web/app/(dashboard)/workflows/[id]/edit/page.tsx` | página de edição complexa |
| TD-004 | CONFIRMADO | `apps/web/app/(dashboard)/workflows/[id]/revisions/page.tsx:19` | página de revisões complexa |
| TD-005 | CONFIRMADO | `apps/web/app/(dashboard)/workflows/[id]/runs/page.tsx:17` | página de runs complexa |
| TD-006 | CONFIRMADO | `apps/worker/src/agents/conversations.ts:57` | função de conversa complexa |
| TD-007 | CONFIRMADO | `docs/service-catalog.md`, `apps/legacy/dashboard` | legado ainda convive com o core |
| TD-008 | CONFIRMADO | `packages/database/prisma/schema.prisma` | schema central grande e concentrado |
| TD-018 | CONFIRMADO | `packages/database/scripts/check-schema-drift.ts:9` | `process.env` fora de camada única de config |
| TD-020 | CONFIRMADO | `apps/worker/src/engine/runner.db-integration.harness.ts:4` | harness lê `WORKFLOW_TEST_*` diretamente de `process.env` |
| TD-021 | CONFIRMADO | `packages/integrations/src/clients/fiscal.ts:63` | uso de `postJson<any>` em runtime |
| TD-022 | CONFIRMADO | `packages/llm-client/src/index.ts:58` | uso de `any` em erro/fallback |
| TD-024 | CONFIRMADO | `packages/integrations/src/clients/payments-br.ts:87` | uso de `postJson<any>` em runtime |
| TD-031 | CONFIRMADO | `.github/workflows/cd.yml:4`, `.github/workflows/cd.yml:68` | workflow usa `workflow_run` e checkout do SHA vindo do run anterior |
| TD-032 | CONFIRMADO | `.github/workflows/cd.yml:181`, `.github/workflows/cd.yml:195` | mesmo padrão reaparece na etapa de SBOM/release |
| TD-033 | CONFIRMADO | `packages/database/scripts/lib/prisma-schema.ts:40` | regex construída dinamicamente |
| TD-035 | CONFIRMADO COM CONTEXTO | `apps/worker/src/worker.job-validation.test.ts:47` | finding existe, mas está em arquivo de teste; não é o mesmo peso de um secret runtime |
| TD-037 | CONFIRMADO COMO GAP DE EVIDÊNCIA | `.github/workflows/security-scan.yml` | existe esqueleto de ZAP, mas roda só se `ZAP_TARGET_URL` estiver configurada |
| TD-038 | PARCIAL | `.github/workflows/security-scan.yml` | Semgrep roda no pipeline, mas o pacote soberano do ciclo não expõe baseline JSON fresca como artefato canônico de F0 |

## B. Decisões arquiteturais

### Caminhos canônicos propostos

- Frontend de produto: `apps/web`
- Backend de negócio: `apps/api`
- Worker assíncrono: `apps/worker`
- Banco/schema/migrations: `packages/database`
- Legado: `apps/legacy/dashboard`
- App auxiliar sem papel de runtime: `apps/dashboard`
- Fonte canônica de fronteiras: `docs/service-catalog.md`
- Fonte canônica de bloqueadores de go-live deste ciclo: `audit/RELATORIO_DIVIDA_TECNICA_MASTER.md`
- Fonte canônica de backlog estrutural atual: `audit/.auditor-prime/2026-04-07/03-scored-report.json`

### Definição clara do que impede sair de RED

Para sair de `RED`, o repositório precisa fechar simultaneamente:
- RLS de `workflow_revisions`
- prova runtime de isolamento com banco acessível no ciclo atual
- persistência durável de refresh tokens
- definição explícita do dashboard home e workflow list canônicos no `apps/web`
- tabela oficial de mapeamento entre relatório master e auditor-prime, ou renumeração única

## C. Plano executável do ciclo atual

1. Congelar este baseline como documento canônico de Fase 0.
2. Abrir ciclo curto de remediação de tenancy:
   - adicionar política RLS para `workflow_revisions`
   - rerodar prova estática e runtime com DB real
3. Abrir ciclo curto de auth:
   - substituir `Map` local por store durável
4. Abrir ciclo curto de navegação canônica:
   - criar `app/(dashboard)/page.tsx`
   - criar `app/(dashboard)/workflows/page.tsx`
   - ou, se a decisão for outra, ajustar docs/runbooks para refletir a ausência
5. Abrir ciclo curto de governança:
   - renumerar ou mapear formalmente os TDs conflitantes
6. Fechar segurança de pipeline e evidência:
   - revisar `cd.yml`
   - tornar DAST menos condicional
   - publicar baseline SAST/DAST como artefato do ciclo
7. Só então entrar em Fase 2/Fase 3 de refactor e domínio clínico

Sequência exata recomendada:
1. tenancy/RLS
2. auth durável
3. catálogo de dívida canônico
4. dashboard/workflows canônicos
5. pipeline de segurança
6. refactors estruturais
7. expansão de domínio materno-infantil

## D. Implementação

- Este ciclo implementou o baseline documental da Fase 0.
- Nenhum arquivo de runtime foi alterado nesta rodada.
- O principal resultado produzido é uma leitura unificada, rastreável e acionável do estado real do repositório.

## E. Validação

### Local
- [x] Estrutura real de `apps/`, `packages/`, `infra/`, `docs/` auditada
- [x] `schema.prisma`, migrations e artefatos de drift/RLS auditados
- [x] Rotas reais do frontend e da API auditadas
- [x] Dashboard home e workflow list validados como ausentes no `apps/web`
- [x] Modelos materno-infantis explícitos validados como ausentes no schema atual
- [x] `.env.example`, CSP e headers de segurança auditados
- [x] CI auditada com distinção entre testes reais e `skip`s condicionais
- [x] legado, PT-BR e fluxos LGPD/consentimento auditados

### CI
- [ ] validação em CI concluída

Observação:
- O pipeline versionado existe e é robusto, mas não foi reexecutado integralmente neste ciclo diagnóstico.

### Staging
- [ ] validação em staging concluída

Observação:
- Não houve execução em staging nesta rodada.

### Baseline de risco

| Dimensão | Status | Justificativa |
|---|---|---|
| Risco de produção | ALTO | auth sem store durável, dashboard/workflows canônicos incompletos |
| Risco de segurança | ALTO | `workflow_revisions` sem RLS + warnings de CD + evidência DAST incompleta |
| Risco regulatório | ALTO | LGPD de UI existe, mas isolamento multi-tenant ainda não está comprovado ponta a ponta |
| Risco de produto | ALTO | ausência de dashboard home, ausência de workflow list e ausência de domínio materno-infantil explícito |
| Risco operacional | ALTO | colisão de IDs de dívida e dependência de evidência parcialmente dispersa |

## F. Status
- [x] RED
- [ ] BLUE
- [ ] YELLOW
- [ ] GREEN

Resumo final:
- O monorepo é real, grande e operacional.
- O core canônico existe.
- O produto não está pronto para sair de `RED`.
- O maior bloqueio não é falta de código; é desalinhamento entre catálogo de dívida, prova de isolamento, superfícies canônicas de produto e evidência operacional fresca.
