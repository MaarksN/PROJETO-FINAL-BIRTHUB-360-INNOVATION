# Next Logical Batch

Generated at: 2026-03-27T19:38:59.485Z

## Summary
- Requested item count: 100
- Materialized item count: 100
- Pending backlog at generation time: 567
- First backlog id: F0-2
- Last backlog id: F2-109
- Source prompt: PROMPT_GERAL_PENDENCIAS.md
- Source program set: docs/programs/12-ciclos/F*.html

## Execution Order
- F0 S01 | 1. Matriz de Ownership Técnico | 6 itens
- F0 S02 | 2. Política de SLA por Severidade | 7 itens
- F0 S03 | 3. Baseline de Comandos — Todos Devem Estar Verdes | 8 itens
- F0 S04 | 4. Baseline de Qualidade e Segurança | 8 itens
- F0 S05 | 5. Baseline de Performance e Infraestrutura | 8 itens
- F0 S06 | 6. Congelamento e Entregáveis | 7 itens
- F1 S01 | 1. Gates de Lockfile e Instalação | 8 itens
- F1 S02 | 2. Gates de Governança e Qualidade | 7 itens
- F1 S03 | 3. Pipeline Python — Eliminação de Tolerâncias | 8 itens
- F1 S04 | 4. Resolução de Pipelines Legados e Ambíguos | 8 itens
- F1 S05 | 5. Padronização de Versões e Toolchain | 8 itens
- F1 S06 | 6. Segurança no Pipeline | 6 itens
- F2 S01 | 1. Eliminação de @birthub/db — Consumo Runtime | 7 itens
- F2 S02 | 2. Migração Incremental @birthub/db → @birthub/database | 4 itens

## F0 S01 - 1. Matriz de Ownership Técnico
- F0-2 | F0-S0-I0 | APENAS DOCUMENTADO | Criar matriz formal de ownership por domínio: web, api, worker, database, agents, security, devops
- F0-3 | F0-S0-I1 | APENAS DOCUMENTADO | Designar owner primário e backup para cada domínio crítico
- F0-4 | F0-S0-I2 | APENAS DOCUMENTADO | Nenhum componente crítico sem owner nomeado e confirmado
- F0-5 | F0-S0-I3 | APENAS DOCUMENTADO | Publicar matriz no wiki interno com link permanente e versionamento
- F0-6 | F0-S0-I4 | APENAS DOCUMENTADO | Definir protocolo de handoff quando owner muda de time ou sai da empresa
- F0-7 | F0-S0-I5 | APENAS DOCUMENTADO | Criar canal de comunicação oficial por domínio (Slack/Teams) e vincular na matriz

## F0 S02 - 2. Política de SLA por Severidade
- F0-10 | F0-S1-I8 | APENAS DOCUMENTADO | Publicar SLA por severidade: P0 (≤2h), P1 (≤8h), P2 (≤72h), P3 (≤2 semanas)
- F0-11 | F0-S1-I9 | APENAS DOCUMENTADO | Definir critérios objetivos de classificação por severidade com exemplos reais
- F0-12 | F0-S1-I10 | APENAS DOCUMENTADO | Documentar escalonamento automático caso SLA seja violado
- F0-13 | F0-S1-I11 | APENAS DOCUMENTADO | Criar dashboard de SLA com rastreamento em tempo real
- F0-14 | F0-S1-I12 | APENAS DOCUMENTADO | Definir plano de comunicação com stakeholders por severidade
- F0-15 | F0-S1-I13 | APENAS DOCUMENTADO | Configurar alertas automáticos quando SLA está em risco (75% do prazo)
- F0-16 | F0-S1-I14 | APENAS DOCUMENTADO | Publicar histórico de aderência a SLA dos últimos 90 dias como baseline

## F0 S03 - 3. Baseline de Comandos — Todos Devem Estar Verdes
- F0-18 | F0-S2-I16 | APENAS DOCUMENTADO | corepack pnpm install --frozen-lockfile → verde com log arquivado
- F0-19 | F0-S2-I17 | APENAS DOCUMENTADO | corepack pnpm monorepo:doctor → verde com log arquivado
- F0-20 | F0-S2-I18 | APENAS DOCUMENTADO | corepack pnpm release:scorecard → verde com log arquivado
- F0-21 | F0-S2-I19 | APENAS DOCUMENTADO | corepack pnpm lint:core → verde com log arquivado
- F0-22 | F0-S2-I20 | APENAS DOCUMENTADO | corepack pnpm typecheck:core → verde com log arquivado
- F0-23 | F0-S2-I21 | APENAS DOCUMENTADO | corepack pnpm test:core → verde com log arquivado
- F0-24 | F0-S2-I22 | APENAS DOCUMENTADO | corepack pnpm build:core → verde com log arquivado
- F0-25 | F0-S2-I23 | APENAS DOCUMENTADO | Arquivar todos os logs com timestamp e hash de commit de referência

## F0 S04 - 4. Baseline de Qualidade e Segurança
- F0-26 | F0-S3-I24 | APENAS DOCUMENTADO | Executar SAST (Semgrep/CodeQL) e arquivar relatório de achados inicial
- F0-27 | F0-S3-I25 | APENAS DOCUMENTADO | Executar auditoria de dependências (pnpm audit) e arquivar snapshot
- F0-28 | F0-S3-I26 | APENAS DOCUMENTADO | Executar análise de complexidade ciclomática por módulo e arquivar métricas
- F0-29 | F0-S3-I27 | APENAS DOCUMENTADO | Medir cobertura de testes atual por pacote e arquivar como baseline
- F0-30 | F0-S3-I28 | APENAS DOCUMENTADO | Medir duplicação de código (jscpd) e arquivar percentual por pacote
- F0-31 | F0-S3-I29 | APENAS DOCUMENTADO | Capturar tamanhos de bundle antes de qualquer mudança (rollup-plugin-visualizer)
- F0-32 | F0-S3-I30 | APENAS DOCUMENTADO | Executar baseline OWASP Top 10 e documentar achados iniciais
- F0-33 | F0-S3-I31 | APENAS DOCUMENTADO | Fotografar estado do grafo de dependências internas (depgraph)

## F0 S05 - 5. Baseline de Performance e Infraestrutura
- F0-34 | F0-S4-I32 | APENAS DOCUMENTADO | Medir Core Web Vitals da aplicação web atual e arquivar (LCP, FID, CLS)
- F0-35 | F0-S4-I33 | APENAS DOCUMENTADO | Capturar métricas de latência P50/P95/P99 da API como baseline
- F0-36 | F0-S4-I34 | APENAS DOCUMENTADO | Inventariar recursos GCP ativos com custos mensais atuais
- F0-37 | F0-S4-I35 | APENAS DOCUMENTADO | Documentar configuração atual de banco de dados (pools, índices, vacuums)
- F0-38 | F0-S4-I36 | APENAS DOCUMENTADO | Registrar DORA metrics baseline: deployment frequency, lead time, MTTR, CFR
- F0-39 | F0-S4-I37 | APENAS DOCUMENTADO | Mapear fluxos críticos com número atual de pontos de falha
- F0-40 | F0-S4-I38 | APENAS DOCUMENTADO | Documentar versões de todas as dependências críticas (Node, Python, Prisma, etc.)
- F0-41 | F0-S4-I39 | NÃO ENCONTRADO | Criar snapshot de infraestrutura Terraform com estado atual

## F0 S06 - 6. Congelamento e Entregáveis
- F0-42 | F0-S5-I40 | APENAS DOCUMENTADO | Criar tag git 'baseline-f0' com hash e data de congelamento
- F0-43 | F0-S5-I41 | APENAS DOCUMENTADO | Publicar documento de ownership aprovado e assinado pelos owners
- F0-44 | F0-S5-I42 | APENAS DOCUMENTADO | Publicar política de SLA com aprovação formal registrada
- F0-45 | F0-S5-I43 | APENAS DOCUMENTADO | Arquivar todos os logs de comandos com evidência de verde
- F0-46 | F0-S5-I44 | APENAS DOCUMENTADO | Publicar relatório de baseline com todas as métricas capturadas
- F0-47 | F0-S5-I45 | APENAS DOCUMENTADO | Comunicar congelamento para todo o time técnico
- F0-48 | F0-S5-I46 | APENAS DOCUMENTADO | Agendar kick-off da F1 com todos os owners presentes

## F1 S01 - 1. Gates de Lockfile e Instalação
- F1-50 | F1-S0-I0 | APENAS DOCUMENTADO | Garantir install --frozen-lockfile como gate obrigatório em PR para main e develop
- F1-51 | F1-S0-I1 | APENAS DOCUMENTADO | Bloquear merge se lockfile estiver desatualizado (pnpm-lock.yaml diff detectado)
- F1-52 | F1-S0-I2 | APENAS DOCUMENTADO | Adicionar verificação de integridade de hash do lockfile no CI
- F1-53 | F1-S0-I3 | APENAS DOCUMENTADO | Configurar caching correto do lockfile no GitHub Actions/GitLab CI
- F1-54 | F1-S0-I4 | APENAS DOCUMENTADO | Validar que TODOS os workflows usam frozen-lockfile sem exceção
- F1-55 | F1-S0-I5 | APENAS DOCUMENTADO | Criar alerta para pull requests que modifiquem o lockfile sem aprovação de security
- F1-56 | F1-S0-I6 | APENAS DOCUMENTADO | Documentar processo de atualização segura de dependências com aprovação dupla
- F1-57 | F1-S0-I7 | APENAS DOCUMENTADO | Testar que workflow falha corretamente ao simular lockfile corrompido

## F1 S02 - 2. Gates de Governança e Qualidade
- F1-58 | F1-S1-I8 | APENAS DOCUMENTADO | Tornar governance-gates um status check obrigatório na proteção de branch main
- F1-60 | F1-S1-I10 | APENAS DOCUMENTADO | Adicionar CODEOWNERS file com aprovações obrigatórias por domínio crítico
- F1-61 | F1-S1-I11 | APENAS DOCUMENTADO | Tornar monorepo:doctor bloqueante: CI falha se doctor retornar erros
- F1-62 | F1-S1-I12 | APENAS DOCUMENTADO | Tornar release:scorecard bloqueante: threshold mínimo de score definido e aplicado
- F1-63 | F1-S1-I13 | APENAS DOCUMENTADO | Bloquear merge com lint errors — zero tolerância, sem --fix automático em CI
- F1-64 | F1-S1-I14 | APENAS DOCUMENTADO | Bloquear merge com typecheck errors — sem nocheck, sem @ts-ignore sem justificativa
- F1-65 | F1-S1-I15 | APENAS DOCUMENTADO | Implementar conventional commits enforcement com commitlint

## F1 S03 - 3. Pipeline Python — Eliminação de Tolerâncias
- F1-66 | F1-S2-I16 | APENAS DOCUMENTADO | Substituir mypy ... || true por execução bloqueante em TODOS os workflows Python
- F1-67 | F1-S2-I17 | APENAS DOCUMENTADO | Substituir pytest ... || true por execução bloqueante — falha é falha
- F1-68 | F1-S2-I18 | APENAS DOCUMENTADO | Substituir flake8/ruff ... || true por execução bloqueante
- F1-69 | F1-S2-I19 | APENAS DOCUMENTADO | Configurar mypy com --strict mode nos módulos críticos (agents, api Python)
- F1-70 | F1-S2-I20 | APENAS DOCUMENTADO | Adicionar bandit (SAST Python) como gate obrigatório no pipeline
- F1-71 | F1-S2-I21 | APENAS DOCUMENTADO | Configurar cobertura mínima Python (--cov-fail-under) bloqueante no CI
- F1-72 | F1-S2-I22 | APENAS DOCUMENTADO | Validar que todos os agentes Python passam em mypy sem ignore comments não-aprovados
- F1-73 | F1-S2-I23 | APENAS DOCUMENTADO | Adicionar safety check de dependências Python como gate de segurança

## F1 S04 - 4. Resolução de Pipelines Legados e Ambíguos
- F1-74 | F1-S3-I24 | APENAS DOCUMENTADO | Resolver ci.yml.disabled: remover permanentemente ou formalizar com ADR justificado
- F1-75 | F1-S3-I25 | APENAS DOCUMENTADO | Auditar TODOS os arquivos .yml em .github/workflows/ e classificar: ativo, obsoleto, experimental
- F1-76 | F1-S3-I26 | APENAS DOCUMENTADO | Remover workflows duplicados ou conflitantes após auditoria
- F1-77 | F1-S3-I27 | APENAS DOCUMENTADO | Consolidar jobs similares em workflows reutilizáveis (reusable workflows)
- F1-78 | F1-S3-I28 | APENAS DOCUMENTADO | Documentar purpose, trigger e owner de cada workflow ativo
- F1-79 | F1-S3-I29 | APENAS DOCUMENTADO | Configurar timeout máximo por job para evitar runners presos indefinidamente
- F1-80 | F1-S3-I30 | APENAS DOCUMENTADO | Implementar matrix strategy para testes em múltiplos ambientes
- F1-81 | F1-S3-I31 | APENAS DOCUMENTADO | Criar workflow de validação de workflows (meta-CI)

## F1 S05 - 5. Padronização de Versões e Toolchain
- F1-82 | F1-S4-I32 | APENAS DOCUMENTADO | Padronizar versão exata de Node entre todos os workflows e .nvmrc local
- F1-83 | F1-S4-I33 | APENAS DOCUMENTADO | Padronizar versão exata de Python entre todos os workflows e .python-version
- F1-84 | F1-S4-I34 | APENAS DOCUMENTADO | Padronizar versão de pnpm em package.json engines e workflows
- F1-85 | F1-S4-I35 | APENAS DOCUMENTADO | Criar .tool-versions (asdf) ou equivalente como fonte única de versões
- F1-86 | F1-S4-I36 | APENAS DOCUMENTADO | Validar que Docker images usadas em CI têm versão pinada, não :latest
- F1-87 | F1-S4-I37 | APENAS DOCUMENTADO | Auditar e pinnar versões de GitHub Actions (usar @sha256 para críticos)
- F1-88 | F1-S4-I38 | APENAS DOCUMENTADO | Documentar matriz de compatibilidade de versões (Node x pnpm x Prisma x Next.js)
- F1-89 | F1-S4-I39 | APENAS DOCUMENTADO | Automatizar notificação quando versões ficam defasadas (Dependabot/Renovate)

## F1 S06 - 6. Segurança no Pipeline
- F1-91 | F1-S5-I41 | APENAS DOCUMENTADO | Configurar GITLEAKS no pipeline para detectar secrets em commits
- F1-92 | F1-S5-I42 | APENAS DOCUMENTADO | Implementar Docker image scanning (Trivy/Snyk) como gate de segurança
- F1-93 | F1-S5-I43 | APENAS DOCUMENTADO | Configurar SBOM (Software Bill of Materials) gerado automaticamente a cada release
- F1-94 | F1-S5-I44 | APENAS DOCUMENTADO | Implementar verificação de licenças de dependências (license-checker)
- F1-95 | F1-S5-I45 | APENAS DOCUMENTADO | Configurar Dependabot ou Renovate com auto-merge apenas para patches de segurança
- F1-96 | F1-S5-I46 | APENAS DOCUMENTADO | Adicionar gate de PR size: PRs > 500 linhas requerem justificativa formal

## F2 S01 - 1. Eliminação de @birthub/db — Consumo Runtime
- F2-98 | F2-S0-I0 | APENAS DOCUMENTADO | Auditar apps/dashboard/package.json: remover @birthub/db ou registrar exceção formal
- F2-99 | F2-S0-I1 | APENAS DOCUMENTADO | Auditar apps/dashboard/src/components/kanban-board.tsx: migrar imports
- F2-101 | F2-S0-I3 | APENAS DOCUMENTADO | Executar git grep '@birthub/db' em todo o repositório e registrar achados
- F2-102 | F2-S0-I4 | APENAS DOCUMENTADO | Mapear cada consumidor com o bounded context equivalente em @birthub/database
- F2-103 | F2-S0-I5 | APENAS DOCUMENTADO | Criar plano de migração por arquivo com owner e prazo definidos
- F2-104 | F2-S0-I6 | NÃO ENCONTRADO | Validar que CI bloqueia novos imports de @birthub/db (lint rule customizada)
- F2-105 | F2-S0-I7 | APENAS DOCUMENTADO | Executar verificação final: git grep '@birthub/db' deve retornar zero resultados

## F2 S02 - 2. Migração Incremental @birthub/db → @birthub/database
- F2-106 | F2-S1-I8 | APENAS DOCUMENTADO | Definir bounded contexts para migração: auth, billing, agents, analytics, tenant
- F2-107 | F2-S1-I9 | APENAS DOCUMENTADO | Criar PR separado por bounded context — sem big bang migration
- F2-108 | F2-S1-I10 | APENAS DOCUMENTADO | Validar testes de regressão após cada PR de migração antes de avançar
- F2-109 | F2-S1-I11 | APENAS DOCUMENTADO | Garantir que @birthub/database expõe todas as entidades necessárias antes de migrar
