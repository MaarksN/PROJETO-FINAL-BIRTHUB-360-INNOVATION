# F7 — ROADMAP DE EXECUÇÃO ESTRUTURAL (R0 → R6)

Este roadmap guia a transição do estado atual do monorepo para a arquitetura alvo, focando em remover a dívida crítica listada nas Fases F3 a F6, consolidando as aplicações *Core* e o subset de agentes vital para o ecossistema.

A regra máxima deste roadmap é: **Não adicionar nada novo antes de expurgar o lixo (Onda R0 e R1).**

## ONDA R0: Sobrevivência e Limpeza Bruta (Purga Massiva)
- **Tempo Estimado:** 1 Semana
- **Complexidade:** Alta (Cirúrgica e destrutiva)
- **Ações:**
  - Remover todos os agentes e pastas de `agents/` classificados como lixo/duplicados/órfãos na Fase F3.
  - Excluir pacotes em `/packages/` que só servem como clones conceituais de agentes.
  - Padronizar os nomes mantidos em `/agents/` estritamente para `snake_case`.

## ONDA R1: Estabilização do Core (Node/TS)
- **Tempo Estimado:** 2 Semanas
- **Complexidade:** Média
- **Ações:**
  - Garantir o tooling obrigatório do ecossistema: `build`, `test`, `lint`, e `typecheck` para os pacotes mantidos (Core `apps/web`, `apps/api`, `apps/worker` e pacotes em `packages/`).
  - Auditar e resolver alertas crônicos nos pacotes que não compilam localmente sem `skip`.
  - Fixar configurações em `.npmrc` / `.pnpm-workspace.yaml` limitando transpilePackages se necessário, removendo overhead.

## ONDA R2: Unificação e Empacotamento do Runtime Python (Agentes)
- **Tempo Estimado:** 2 a 3 Semanas
- **Complexidade:** Alta
- **Ações:**
  - Desacoplar workers TS de dentro dos diretórios de Python em `agents/` transferindo ou integrando o runtime logic sob `apps/worker`.
  - Estruturar a base `agents/shared` como um pacote unificado acessível aos agentes restantes (`ae`, `sdr`, `ldr`, etc).
  - Configurar Dockerfile / Build process dedicado para orquestrar os agentes Python isolados do contexto Next.js/Node.

## ONDA R3: Refatoração e Contratos de Dados (Banco)
- **Tempo Estimado:** 2 Semanas
- **Complexidade:** Alta (Prisma/DB)
- **Ações:**
  - Focar nas referências a RLS (Row Level Security) e tabelas. Ajustar testes e seeds em `packages/database` para sempre injetar `tenantId` nos relacionamentos org/user.
  - Otimizar migrações ou esquemas remanescentes atrelados a agentes extintos.

## ONDA R4: Estabelecimento das Barreiras E2E (Testes e Integração)
- **Tempo Estimado:** 2 Semanas
- **Complexidade:** Média
- **Ações:**
  - Atualizar o `playwright.config.ts` e scripts relacionados aos dashboards.
  - Implementar suites de teste cross-agente (simulando, ex: ingestão `ldr` -> qualificação `sdr` -> repasse `ae`).
  - Padronizar o ambiente de CI com uso explícito de mocks de segredos (para não travar no Trivy).

## ONDA R5: CI/CD Produção (Preflight)
- **Tempo Estimado:** 1 Semana
- **Complexidade:** Alta (Infra)
- **Ações:**
  - Adequar `release:preflight:production` às novas delimitações *Core* e *Satellites*.
  - Configurar timeout, limitação de recursos e alertas automáticos via GitHub Actions.

## ONDA R6: Go-Live
- **Tempo Estimado:** 1 Semana
- **Complexidade:** Crítica
- **Ações:**
  - Execução dos testes de stress/k6 final (validados na F0 e scripts locais).
  - Ativação do monitoramento, deploy real na arquitetura core validada, rollback testado.