# F8 — EXECUÇÃO POR CICLOS

## Visão Geral
Transformação do roadmap (F7) em 10 ciclos detalhados.

---

## Ciclo 01: Preflight e Mocks Seguros (Gate de Produção)
**Objetivo:** Garantir que o CI/CD pare quando faltar segredos e não rode às cegas.
**Dependência Principal:** NDA
**Entrega:** Jobs implementados no `.github/workflows/cd.yml`.

### Tarefas
1. Criar `.env.staging.mock`. (Critério: Arquivo criado).
2. Criar `.env.production.mock` (adicionar `_mock` nos tokens). (Critério: Arquivo criado).
3. Adicionar mocks ao `.gitignore`. (Critério: gitignore att).
4. Implementar `production-preflight` job no CD YAML. (Critério: Job criado).
5. Configurar `deploy-production` para depender do preflight. (Critério: Needs configurado).
6. Rodar CI local e garantir falha sem mock. (Critério: Pipeline quebra).
7. Rodar CI e garantir sucesso com mock. (Critério: Pipeline passa).
8. Adicionar validação de variáveis no `production-preflight`. (Critério: Script adicionado).
9. Ajustar timeout de workflow para 15 min. (Critério: `timeout-minutes` presente).
10. Validar Trivy filesystem scan. (Critério: `scan-type: fs` configurado).
11. Documentar processo no Runbook de release. (Critério: Runbook atualizado).
12. Adicionar artifacts upload para logs do preflight. (Critério: Artifact gerado).
13. Revisar `scripts/release/preflight-env.ts`. (Critério: Compatível com CI).
14. Exigir chaves críticas de banco e JWT. (Critério: Checagem explícita).
15. Emitir sumário de "Produção Bloqueada Segura". (Critério: Relatório no GH Actions).

---

## Ciclo 02: Readiness Probes do Core
**Objetivo:** Health checks reais que acusam falha de banco e cache.
**Dependência Principal:** Ciclo 01
**Entrega:** Rotas `/health/liveness` e `/health/readiness` coerentes.

### Tarefas
1. Mapear endpoints de health de `apps/web`. (Critério: Endpoints definidos).
2. Mapear endpoints de health de `apps/worker`. (Critério: Endpoints definidos).
3. Implementar liveness em `apps/web` (ping sem dependências). (Critério: 200 OK sem query).
4. Implementar readiness em `apps/web` (pingando banco). (Critério: Falha se db cair).
5. Implementar liveness em `apps/worker`. (Critério: 200 OK).
6. Implementar readiness em `apps/worker` (pingando banco/fila). (Critério: Falha se db/fila cair).
7. Ajustar `apps/api/src/lib/health.ts` para usar o pacote novo de banco. (Critério: Import atualizado).
8. Atualizar testes E2E do web para mockar novo health. (Critério: Testes passam).
9. Atualizar testes de worker. (Critério: Testes passam).
10. Documentar endpoints no `docs/observability-alerts.md`. (Critério: Doc atualizada).
11. Testar via Postman simulando queda do postgres local. (Critério: Status 503 retornado).
12. Configurar CI local para curlar os endpoints. (Critério: Script no CI).
13. Configurar log padronizado para falha de probe (warn/error). (Critério: Winston/console att).
14. Adequar política de PR security (`docs/security-pr-acceptance.md`). (Critério: Exigência de readiness).
15. Validar Docker Compose usando as probes novas. (Critério: `healthcheck` no compose).

---

## Ciclo 03: Consolidar Banco de Dados (Remover Legacy DB)
**Objetivo:** Substituir `packages/db` por `packages/database` integralmente.
**Dependência Principal:** NDA (Pode ser paralelo a C01/C02).
**Entrega:** Nenhum código consome `packages/db`.

### Tarefas
1. Buscar no workspace imports estáticos de `packages/db`. (Critério: Grep mapeado).
2. Substituir imports em `apps/api` para `@birthub/database`. (Critério: Imports trocados).
3. Substituir imports em `apps/worker` para `@birthub/database`. (Critério: Imports trocados).
4. Substituir imports em `packages/*` para `@birthub/database`. (Critério: Imports trocados).
5. Remover pasta física `packages/db`. (Critério: RM).
6. Limpar `packages/db` dos `package.json` de todos os consumidores. (Critério: Arquivos limpos).
7. Rodar `pnpm dedupe` para acertar lockfile. (Critério: `pnpm-lock.yaml` att).
8. Ajustar migrations em `packages/database`. (Critério: Consistentes).
9. Injetar `tenantId` nos seeds de `packages/database/prisma/seed.ts` (idempotência). (Critério: Evita erros RLS).
10. Rodar suite `corepack pnpm test:core`. (Critério: Verde).
11. Rodar CI com foco em auth e rbac (`test:auth`). (Critério: Verde).
12. Habilitar regra `no-restricted-imports` para `@birthub/db`. (Critério: ESLint att).
13. Rodar lint core e confirmar zero erros do db. (Critério: Lint verde).
14. Refatorar factories de teste do web se usarem db. (Critério: TDD passa).
15. Validar `monorepo:doctor`. (Critério: Passa limpo).

---

## Ciclo 04: Reorganização Física (Pastas .legacy e .satellites)
**Objetivo:** Purgar visualmente a raiz do `apps/`.
**Dependência Principal:** Ciclo 03.
**Entrega:** Árvore do monorepo clara.

### Tarefas
1. Modificar paths no `tsconfig.base.json` e turborepo para ler pastas novas se necessário. (Critério: config att).
2. Criar diretório `apps/.legacy`. (Critério: Dir existe).
3. Mover `apps/dashboard` para `.legacy/`. (Critério: MV).
4. Mover `apps/api-gateway` para `.legacy/`. (Critério: MV).
5. Mover `apps/agent-orchestrator` para `.legacy/`. (Critério: MV).
6. Criar diretório `apps/.satellites`. (Critério: Dir existe).
7. Mover `apps/voice-engine` para `.satellites/`. (Critério: MV).
8. Mover `apps/webhook-receiver` para `.satellites/`. (Critério: MV).
9. Ajustar referências de workspace no root `package.json` ou `pnpm-workspace.yaml`. (Critério: Glob match att).
10. Validar imports internos do turborepo pós mudança. (Critério: Turbo builda).
11. Fixar links em READMEs se quebrados. (Critério: Markdown links ok).
12. Congelar dependências no dashboard legado (aviso de freeze). (Critério: Doc inserido).
13. Ajustar paths em Dockerfiles se referenciar o nome antigo. (Critério: Docker builda).
14. Atualizar diagrama de F4 no `architecture.md`. (Critério: Doc atual).
15. Rodar bateria full de testes no repo local. (Critério: Tests ok).

---

## Ciclo 05: Purga do Sistema de Agentes
**Objetivo:** Reduzir o ruído massivo apagando agentes mortos.
**Dependência Principal:** Ciclo 04.
**Entrega:** Pasta `agents/` enxuta (ou apagada em favor de `agent-packs`).

### Tarefas
1. Identificar agentes em `agents/` usados ativamente no worker via grep. (Critério: Lista de agentes ativos).
2. Excluir pasta `.github/agents/`. (Critério: RM).
3. Migrar agentes úteis de `agents/` para `packages/agent-packs/`. (Critério: Código movido).
4. Padronizar nomenclatura (kebab-case em pacotes e snake_case em modulos python locais). (Critério: Rename).
5. Deletar `agents/` se esvaziada. (Critério: RM).
6. Avaliar uso de `packages/agents/executivos`. (Critério: Retido ou apagado se não tiver loader).
7. Remover arquivos inúteis root (ex: prompt_soberano, fix_pkg.py). (Critério: Limpeza raiz).
8. Validar dependências python (pyenv) do agent-packs via teste manual isolado. (Critério: Pytest roda).
9. Garantir schemas (Zod/Pydantic) de entrada e saída no que sobrar. (Critério: Schema forte).
10. Validar o loader do `marketplace-service` na API apontando para packs corretos. (Critério: API sobe e acha os manifestos).
11. Remover referências de agentes apagados do catálogo. (Critério: Sem ghost agents na ui).
12. Adicionar checks de qualidade (Lint/Semgrep) nos pacotes restantes. (Critério: CI cobre a IA).
13. Substituir "todos" por "100%" em markdown audit (Anti-drift rule). (Critério: Grep clean).
14. Rodar testes de worker que dependem de agentes (`test:core`). (Critério: Worker testes ok).
15. Ajustar docs de Agentes apontando para `packages/agent-packs/`. (Critério: Doc atual).

---

## Ciclo 06: Desacoplamento do Legado Transacional
**Objetivo:** Garantir que fluxos não passem pelo gateway nem orquestrador legado.
**Dependência Principal:** Ciclo 04 e 05.
**Entrega:** Core api serve o web diretamente.

### Tarefas
1. Mapear variáveis de ambiente do `apps/web` (`NEXT_PUBLIC_API_URL`). (Critério: Mapeado).
2. Roteá-las estaticamente para `apps/api` (bypass api-gateway). (Critério: Var alterada).
3. Habilitar middlewares (CORS, Rate Limit, Helmet) do gateway direto no `apps/api`. (Critério: Middlewares no app.ts).
4. Resolver problemas de Duplicated Identifier no `apps/api`. (Critério: Typescript compila limpo).
5. Alterar scripts de login/auth do web para consumir API core se estivessem no gateway. (Critério: Login passa).
6. Rodar E2E Playwright de Frontend apontado pro novo Host. (Critério: Config ajustada e sucesso).
7. Habilitar `NEXT_PUBLIC_DASHBOARD_USE_STATIC_SNAPSHOT` para legados nos testes. (Critério: Teste não trava no mock).
8. Inspecionar fluxos de background (webhook) garantindo que vão para worker core. (Critério: Endpoints bypassam satellite).
9. Comentar ou desativar os workflows de CI do api-gateway e dashboard. (Critério: Menos jobs rodando).
10. Verificar logs do docker local após uso intensivo sem gateway. (Critério: Zero hits no port antigo).
11. Documentar o desacoplamento formalmente. (Critério: Runbook atual).
12. Limpar referências obsoletas de gateway nos env examples. (Critério: .env.example refatorado).
13. Rodar bateria de E2E full no CI (Playwright) com novo roteamento. (Critério: Verde no CI).
14. Desligar o container de gateway e orchestrator do compose padrão (`docker-compose.yml`). (Critério: YML att).
15. Fazer validação visual de smoke. (Critério: Web UI ok).

---

## Ciclo 07: Observabilidade e Malha de Alertas
**Objetivo:** Focar os dashboards no Core e remover ruído.
**Dependência Principal:** Ciclo 06.
**Entrega:** Grafana / Prometheus apontando pro path certo.

### Tarefas
1. Revisar `infra/monitoring/alert.rules.yml`. (Critério: Remover refs `job="api-gateway"`).
2. Adicionar rule para 5xx errors no `apps/api`. (Critério: Regra Prometheus).
3. Adicionar rule para Latência no `apps/api`. (Critério: Regra).
4. Adicionar rule para Fila presa no RabbitMQ/Redis do worker. (Critério: Regra DLQ).
5. Adicionar rule para quedas das probes Liveness/Readiness criadas no Ciclo 02. (Critério: Regra Liveness).
6. Exportar dashboards Grafana em JSON versionável (se possível). (Critério: JSON no repositório).
7. Validar `promtool check rules` localmente se suportado. (Critério: Pass check).
8. Atualizar documentação `docs/observability-alerts.md`. (Critério: Foco em API/Web/Worker).
9. Definir matriz de criticidade no `service-criticality.md` com legados como P2. (Critério: Markdown att).
10. Validar logs injetados no Winston (apps/api) garantindo envio correto. (Critério: Log formatado).
11. Testar timeout de query com worker mockado e ver alerta estourar local. (Critério: Simulação validada).
12. Inserir timeout-minutes nos CI da observabilidade. (Critério: Yaml CI ok).
13. Atualizar F10 Architecture docs ref. observability. (Critério: Doc ok).
14. Configurar alertas para quedas pontuais (DB connection error na API). (Critério: Alerta spec).
15. Validar dependência de otel local importada nativamente. (Critério: CommonJS loader no ESM resolvido).

---

## Ciclo 08: Rollback Rehearsal e Ensaios E2E
**Objetivo:** Garantir a prova de conceito do bloqueador de produção do F6.
**Dependência Principal:** Ciclo 01 e Ciclo 06.
**Entrega:** Script robusto no workflow barrando rollouts sem reversoes e E2Es limpos.

### Tarefas
1. Adicionar Job `release:smoke` no workflow. (Critério: Yaml).
2. Criar script bash ou TS de smoke simples (pós deploy). (Critério: TS criado).
3. Encadear `test:e2e:release` como gate. (Critério: Yaml).
4. Otimizar teste E2E Playwright de pipeline para não exceder 15min. (Critério: E2E roda sob tempo).
5. Criar `rollback-rehearsal.ts` (verifica prev pointer vs next). (Critério: Script).
6. Injetar `rollback` como step no CD. (Critério: Yaml).
7. Fazer simulação Fail Driven em homologação branch. (Critério: O E2E deve falhar se UI não carregar e barrar o hook de prod).
8. Ajustar pnpm overrides se dependências de E2E derem conflitos em CI. (Critério: Lockfile seguro).
9. Confirmar que jobs de Produção rodam DEPOIS do ensaio passar. (Critério: Needs chain no yml).
10. Validar artefatos gerados pelo E2E (screenshots/logs) no Github actions. (Critério: Zip gerado).
11. Testar timeout longo (400s+) em testes locais (quebrar suíte gigante em isolados `test:auth`, `test:rbac` se preciso no CI). (Critério: Turbo runs eficientes).
12. Certificar que `package.json` root contém scripts delegados (e.g. `pnpm release:smoke`). (Critério: Root pkg.json att).
13. Revisar documentação `go-live-runbook.md` com novos gates. (Critério: Doc att).
14. Consolidar Playwright web app configs para CI (headles true by default). (Critério: Config ok).
15. Avaliar resiliência contra Trivy failures para assets mockados. (Critério: Sec scans ok).

---

## Ciclo 09: Higiene de Dependências e Lint Final
**Objetivo:** Deixar a estrutura limpa para o check final.
**Dependência Principal:** Ciclo 05, 06.
**Entrega:** Linter, Typescript e Auditoria NPM verdes.

### Tarefas
1. Rodar pnpm dedupe. (Critério: Sync final de pacotes).
2. Rodar lint:core global e resolver os max-lines (500) ou complexity (20). (Critério: eslint --fix passado; e refs marcadas ou consertadas).
3. Apagar comentários TODO ou campos draft que firam a "Anti-Drift Quality rule" (ex: trocar 'todos' por '100%'). (Critério: Regex search limpa).
4. Validar versionamento cruzado de pacotes locais (`workspace:*`). (Critério: Sem refs duras em pacotes legados deletados).
5. Atualizar `.nvmrc` e `.tool-versions` para as versões idênticas do `package.json`. (Critério: Sincronia de ambiente).
6. Rodar `pnpm audit` (via corepack/npx se CI falhar). (Critério: Remediação via override ou patch).
7. Testar script `monorepo:doctor` localmente. (Critério: Pass limpo).
8. Limpar `logs/` locais injetando `.gitkeep`. (Critério: Pasta varrida).
9. Apagar bundles `/dist` buildados no repo (adicionar ao gitignore geral). (Critério: Git RM cached dist).
10. Validar types (`pnpm run typecheck:core` via turbo). (Critério: Compilação TS limpa).
11. Corrigir Dynamic imports CJS em modulos Node (usar `createRequire`). (Critério: Sem warnings modulares no run).
12. Revisão final das policies e sec rules. (Critério: Semgrep green).
13. Ajustar `lint-staged` pra pegar arquivos novos e velhos na base core. (Critério: Husky rule).
14. Fazer cleanup do `.env.example` final. (Critério: Envs atualizadas do novo core).
15. Certificar que a documentação técnica principal aponta para a nova árvore estrutural. (Critério: Docs check).

---

## Ciclo 10: Score, Checklist e Pacote Executivo (Fechamento)
**Objetivo:** Consolidar e validar todo o avanço.
**Dependência Principal:** Ciclo 09.
**Entrega:** Score F10 verde, e Relatórios finais (F11 e Validation Log).

### Tarefas
1. Executar o preenchimento de todo o F9_checklist.md. (Critério: Documento checklist preenchido com evidências baseadas nas PRs/commits dos ciclos).
2. Computar o Score Final F10. (Critério: Notas baseadas nas remediações do C01 a C09).
3. Gerar resumo executivo `F11_final_report.md`. (Critério: Doc ok).
4. Elaborar relatório forense UI `final_report.html` usando mapeamento de cores (VERDE, AMARELO, VERMELHO). (Critério: Script HTML gerado cirurgicamente mantendo IDs e métricas).
5. Validar que não existe nenhuma marcação TBD, TODO ou similar na documentação recém criada. (Critério: Limpo).
6. Preencher registro em `audit/validation_log.md` com formato estrito (`DATA | ITEM-ID | Jules | APROVADO | <evidência>`). (Critério: Log appended).
7. Criar `/audit/JULES_PRE_VALIDACAO.md` se requisitado pela fase 0. (Critério: Doc state).
8. Mover itens pendentes de `audit/human_required/` caso humanos tenham aprovado. (Critério: Pastas tratadas).
9. Criar `/audit/JULES_PARECER_FINAL.md` para submissão da Fase 7/Final de governança. (Critério: Documento compilado).
10. Re-rodar bateria completa via `scripts/ci/run-pnpm.mjs` testando core. (Critério: Sucesso de integração contínua final simulada).
11. Atualizar o `REGISTRY.md` dos agentes aprovando ciclo se houver agent lifecycle demandado. (Critério: Docs).
12. Produzir template `=== RELATÓRIO DE EXECUÇÃO JULES ===` no stdout como resposta final da operação total, caso necessário. (Critério: Template respeitado).
13. Submeter pre-commit hooks (`git commit`). (Critério: Husky tests verdes).
14. Auditar Master Checklist, botando todas as Fases em Verde. (Critério: Progresso 100%).
15. Realizar request final de submissão do branch com pacote audit/remediado consolidado. (Critério: Branch merged ou PR abert).

---

## RELATÓRIO F8

- **Número total de tarefas:** 150 (distribuídas equitativamente e testáveis).
- **Complexidade Operacional:** Alta nas execuções de cutover e purga (Ciclos 03, 04, 05, 06) com risco de quebrar tipagens globais (necessitando forte typechecking e refactoring). Baixa/Média nas frentes de documentação final.
- **Dependências entre Ciclos:** Há uma ordem natural: A infra preflight (C01, C02) assegura a pipeline, a purga/banco (C03 a C06) enxuga a estrutura e o código, para que o linting, testes e governança final (C07 a C10) consolidem o pacote sem sujeira de dependências residuais.
- **Ciclos Bloqueadores:** Ciclo 01 (Preflight) é o que trava a garantia técnica de deploy na CI/CD. O Ciclo 03 (Banco) e 06 (Gateway bypass) são o coração do refactor arquitetural real (e os mais arriscados, exigindo TDD local e bypass de timeout no monorepo).
- **Ciclos Paralelizáveis:** Ciclos de Infra/Ops (C01, C02, C07, C08) podem rodar em paralelo com as alterações físicas e banco (C03, C04) caso tenhamos engenheiros/agentes alocados sem tocar nas mesmas superfícies de arquivo massivamente (e.g. Github Actions vs Prisma vs Routing).
