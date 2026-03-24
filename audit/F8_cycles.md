# F8 — CICLOS E ATIVIDADES

Para implementar o roadmap detalhado nas fases anteriores, definimos **10 ciclos curtos (Sprints)** de execução técnica, cada um com aproximadamente 15-25 tarefas estritas baseadas nas conclusões das Fases F1 a F7.

## Total de Tarefas Projetado: ~200

---

### Ciclo 1: Purga e Higienização Brutal (C1)
Foco exclusivo na Onda R0 (remover lixo estrutural de agentes).

**Tarefas Principais:**
1. Excluir `agents/pos-venda`.
2. Excluir `agents/pre_sales`.
3. Excluir `agents/pre_vendas`.
4. Excluir `agents/partners`.
5. Excluir `agents/analista`.
6. Excluir `agents/coordenador_comercial`.
7. Excluir `agents/executivo_negocios`.
8. Excluir `agents/gerente_comercial`.
9. Excluir `agents/copywriter`.
10. Excluir `agents/inside_sales`.
11. Excluir `agents/account_manager`.
12. Excluir `packages/agent-packs` (após validar se há itens em uso).
13. Atualizar dependências órfãs e `.pnpm-workspace.yaml`.
14. Consolidar `parcerias`.
15. Validar lint pós-remoção global.

### Ciclo 2: Padronização do Core Python (C2)
Foco nos agentes que sobreviveram (F3 e F4).

**Tarefas Principais:**
1. Renomear diretórios para `snake_case` rígido se houver violação.
2. Migrar arquivos `worker.ts` ou `.js` soltos dentro dos domínios Python para `apps/worker` ou similar, limpando a sujeira bilíngue.
3. Centralizar utilitários duplicados de LLM em `agents/shared`.
4. Estabelecer o pyproject.toml / requirements.txt base unificado.
5. Criar pipeline de lint para código Python mantido.
6. Adequar imports Python nos 7-8 agentes sobreviventes.
7. Revisar e unificar os schemas em `agents/shared/schemas.sql`.
8. Atualizar documentação local (`README.md`) dos agentes sobreviventes.
9. Refatorar arquivos `agent.py` eliminando referências a ferramentas mortas.
10. Revisar testes locais unitários para a sintaxe pytest.
11. Testar chamadas simuladas nos agents em sandbox.
12. Ajustar os pacotes de runtime do Python para a versão mais recente e remover duplicatas.
13. Atualizar dependências em todos os agentes mantidos em Python.
14. Corrigir formatação dos módulos `crm_sync.py`.
15. Validar lint pós-padronização global.

### Ciclo 3: Core Node.js - Lint & Configs (C3)
Foco na padronização da raiz (`packages/` e `apps/web`/`api`).

**Tarefas Principais:**
1. Rodar `pnpm dedupe` e atualizar `pnpm-lock.yaml`.
2. Sincronizar versões entre `engines` no `package.json` e arquivos de ambiente (`.node-version`, `.python-version`).
3. Remover pacotes Node legados sem dependência.
4. Otimizar `tsconfig.json` dos pacotes.
5. Resolver `max-lines` / `complexity` explícitos reportados.
6. Garantir `lint`, `typecheck`, `test` em todos os packages.
7. Otimizar `.eslintrc` ou `eslint.config.mjs` removendo ignores não utilizados.
8. Consolidar exports não utilizados.
9. Limpar `.npmrc` obsoleto ou diretivas desnecessárias.
10. Validar e unificar a sintaxe ESM x CJS no monorepo.
11. Remover pastas dist e artefatos cacheados em todas as sub-pastas.
12. Revisar configuração de `husky`.
13. Atualizar hook `pre-commit` para o lint mais estrito possível.
14. Executar varredura local Trivy / security.
15. Corrigir falhas pendentes detectadas no monorepo.

### Ciclo 4: Base de Dados e Testes Core (C4)
**Tarefas Principais:**
1. Modificar seeds para forçar o campo `tenantId` e RLS.
2. Simplificar esquemas legados de agentes extintos em Prisma.
3. Consolidar e rodar `pnpm db:generate`.
4. Validar os testes em `packages/database`.
5. Adaptar queries antigas para a sintaxe suportada.
6. Executar migration mock no banco local.
7. Atualizar schemas do banco relacionados a log de eventos.
8. Substituir campos deprecados nas rotinas do database.
9. Ajustar repositório Node responsável pelo Prisma connection pool.
10. Verificar testes com jest/vitest associados ao banco.
11. Refatorar os conectores ORM dentro das apis.
12. Remover lixo SQL abandonado nas pastas do projeto.
13. Ajustar `package.json` de database scripts.
14. Revisar as políticas de segurança aplicadas no banco (RLS).
15. Executar CI local da pipeline de database inteira para conferir quebra.

### Ciclo 5: Empacotamento Docker (APIs e Worker Node) (C5)
**Tarefas Principais:**
1. Reescrever Dockerfile do `apps/api`.
2. Otimizar camadas do Dockerfile reduzindo tamanho final.
3. Atualizar scripts de build de imagens para `.env.vps`.
4. Reescrever Dockerfile do `apps/worker`.
5. Integrar testes de build na Actions.
6. Atualizar `.dockerignore` global.
7. Testar multi-stage build do Next.js.
8. Revisar permissões de root nos containers.
9. Ajustar logs para padrão JSON dentro do container.
10. Limpar volumes pendentes no ambiente dev.
11. Revisar docker-compose.prod.yml para as novas imagens.
12. Garantir isolamento de rede no compose local e prod.
13. Revisar variáveis em `release:preflight:production`.
14. Atualizar healthcheck local do Node.
15. Finalizar validação de imagens construídas via CI.

### Ciclo 6: Empacotamento Docker (Agentes Python Runtime) (C6)
**Tarefas Principais:**
1. Escrever Dockerfile base para `agents/shared`.
2. Adicionar healthchecks de workers Python.
3. Atualizar pacotes pip para rodar offline ou com dependências mínimas no container.
4. Adaptar entrypoint para os workers remanescentes.
5. Criar pipeline de deploy para containers de agentes Python.
6. Validar memória / limites de CPU estipulados para cada container.
7. Acoplar volumes de cache e estado do modelo LLM.
8. Padronizar variáveis de ambiente LLM-Client no entrypoint.
9. Limpar vestígios de debug do Dockerfile (ex. shell args).
10. Escanear container gerado por vulnerabilidades no base image.
11. Adicionar usuário sem permissão root no container.
12. Verificar timeouts internos das requisições via gRPC.
13. Atualizar documentação de dev setup via Docker para Python.
14. Executar carga de testes mínima via `make run` com compose local.
15. Validar integração com fila compartilhada.

### Ciclo 7: Segredos e Mocks Seguros no CI (C7)
**Tarefas Principais:**
1. Localizar todos os chaves vazadas em `.env.example`.
2. Substituir por strings padrão como `sk_test_mock`.
3. Escrever script para validar `.env` contra template antes de commit.
4. Adicionar exceções estritas no `.gitleaks.toml`.
5. Mover arquivos com inline config para variables baseadas em AWS / GCP env.
6. Configurar scanner Trivy corretamente sem image-ref se `fs` type.
7. Modificar arquivos `api.config.ts` para assumirem sufixos corretos de dev.
8. Bloquear no PR qualquer adição de nova chave mock sem padrão.
9. Integrar rotina de limpeza de chaves antigas.
10. Validar CI workflows falhando no secret scanning e aprovar fix.
11. Corrigir variáveis do Playwright para uso local seguro.
12. Revisar acessos das rotas não autenticadas em `api`.
13. Documentar fluxo correto para engenheiros em `CONTRIBUTING.md`.
14. Verificar arquivos em `/tests/` com hardcoded senhas.
15. Finalizar relatórios locais de Trivy com score Zero Vuln.

### Ciclo 8: Testes E2E Cross-Agentes básicos (C8)
**Tarefas Principais:**
1. Configurar Playwright E2E master (`test:e2e:release`).
2. Adicionar setup step no Playwright para popular banco com fixtures consistentes.
3. Escrever spec para injetar lead no CRM_Sync.
4. Escrever spec para simular validação do SDR e passagem.
5. Escrever spec para visualização pelo dashboard pelo usuário humano.
6. Ajustar `playwright.config.ts` com retries e timeout configurados.
7. Otimizar proxy.ts e mocking server para rodar local sem rede externa forte.
8. Evidenciar testes com captura de telas em falhas.
9. Substituir scripts locais E2E arcaicos.
10. Ajustar pipelines `.github` para separar o Playwright do resto.
11. Modificar Next.js config para rodar corretamente com test IDs.
12. Adicionar ID tags no frontend para hooks do e2e.
13. Refatorar testes legados web isolando o mock DB.
14. Validar que E2E consome containers C5 e C6 recém-criados.
15. Ajustar e reportar métricas em report html ou json do test runner.

### Ciclo 9: Integração e Performance (K6) (C9)
**Tarefas Principais:**
1. Atualizar stress test via K6 em `/scripts/load-tests`.
2. Revisar rotas vitais sob teste (Login, Ingestão lead, Status workflow).
3. Determinar threshold local vs threshold server.
4. Adicionar hooks de métricas para memory leak.
5. Iniciar teste e capturar perfil CPU Node.js.
6. Identificar gargalos da infra do Prisma.
7. Ajustar limits em docker-compose.yml de dev com base em resultados.
8. Criar documentação para escalar workers.
9. Integrar script `test:worker:overload` na esteira final.
10. Otimizar as chamadas a fila baseando no report.
11. Escalar serviços de voz (`voice-engine`) em testes separados.
12. Validar limite de taxa de requisições no API Gateway com K6.
13. Consolidar saídas na interface de CI/CD metrics.
14. Refinar script `performance-report.mjs`.
15. Ajustar o `timeout-minutes` de CI para comportar a carga otimizada.

### Ciclo 10: Preflight Final para Go-Live (C10)
**Tarefas Principais:**
1. Acionar checklist de infra final (script de `ops:vps:preflight`).
2. Conferir todas as branches na master de repositórios acoplados (se houver).
3. Realizar smoke test total via `release:smoke`.
4. Atualizar os labels do GitHub issues baseados na higienização concluída.
5. Checar a documentação de deploy gerada na C5 e C6.
6. Validar as migrations do Prisma prontas para RDS em prod.
7. Auditar se a política IAM e AWS / Deploy tokens tem perms.
8. Rodar verificação de links `docs:check-links`.
9. Verificar dependência de satélites rodando de acordo (ex. `dashboard`).
10. Configurar e testar alarmes de rollback automatizados caso a release quebre dados.
11. Atualizar versionamento no `package.json` de todos apps.
12. Checar integridade `master_checklist.md` se todos estão marcados em `🟢`.
13. Simular e validar recovery data (backup tests).
14. Obter sinal verde dos stakeholders / CI tools (100%).
15. Efetuar deploy à produção.

---

**Resumo:** Este plano engloba a higienização massiva no Ciclo 1, seguida da consolidação tecnológica nos subsequentes, culminando no preflight exigido pela Fase F6 e F7, detalhando 15-25 tarefas por sprint sem omissões.