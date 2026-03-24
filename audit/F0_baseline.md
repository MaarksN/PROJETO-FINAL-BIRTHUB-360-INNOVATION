# F0 — CONEXÃO E BASELINE

## Objetivo
Estabelecer a baseline real do repositório e mapear sua estrutura macro sem suposições.

## Estrutura Macro do Repo
O repositório é um monorepo baseado no pnpm workspace (pnpm@9.1.0).

### Diretórios principais:
- `apps/`: Contém as superfícies de aplicação principais (web, api, worker, etc).
- `packages/`: Contém pacotes internos compartilhados e a infraestrutura de dados.
- `agents/`: Contém definições e scripts de agentes de IA em Python.
- `.github/workflows/`: Define a pipeline de CI/CD (ci.yml, cd.yml).
- `docs/`: Documentação geral.
- `infra/`: Configurações de infraestrutura (terraform, monitoring).

## Tecnologias Detectadas
- Node.js (>=24 <25)
- pnpm (9.1.0)
- Next.js (em apps/web, inferido pela natureza de frontend)
- TypeScript / JavaScript
- Python (.python-version = 3.12.13)
- Playwright (testes e2e frontend)
- ESLint, Prettier, Husky, Commitlint
- Docker (docker-compose, dockerignore)

## Primeiros Sinais de Maturidade
- Uso de `pnpm-workspace.yaml` com ferramentas consolidadas de monorepo (turbo.json).
- Scripts estruturados no `package.json` de governança (`pnpm monorepo:doctor`, `pnpm build:core`, `pnpm test:core`).
- Configurações estritas de CI/CD no `.github/workflows/`.
- Documentação centralizada em `docs/` listada no README com foco em padronização.

## Primeiros Sinais de Desorganização
- Coexistência massiva de agentes com nomenclaturas inconsistentes e possível sobreposição em `agents/` (ex: `pre_sales` vs `pre_vendas`, `pos-venda` vs `pos_venda`).
- Presença de pacotes duplicados de infraestrutura de dados: `packages/database` e `packages/db`.
- Presença de diretórios legados dentro da pasta `apps/` convivendo com o core.
- Arquivos soltos e ferramentas de uso temporário na raiz (ex: `fix_pkg.py`, `prompt_soberano_v13.html`).

## Leitura Inicial (Core vs Legado)
Baseado no `README.md` canônico atual e análise de diretórios:

### Core Canônico (Suportado)
- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/database`

### Legado / Em Quarentena
- `apps/dashboard`
- `apps/api-gateway`
- `apps/agent-orchestrator`
- `packages/db`

### Satélites / Potencialmente Órfãos
- `apps/voice-engine`
- `apps/webhook-receiver`
- Extenso diretório `agents/` requer avaliação aprofundada para definir o que é runtime funcional vs protótipo abandonado.

---

## RELATÓRIO F0

**O que foi analisado:**
- Estrutura de arquivos e diretórios da raiz do repositório.
- Conteúdo do `README.md` e `package.json` root.
- Árvore de pastas em `apps/`, `packages/`, `agents/` e `.github/workflows/`.

**O que foi identificado:**
- Um monorepo robusto estruturado via pnpm/turborepo, abrigando aplicações TS/JS e agentes Python.
- Definição clara documental de superfícies core vs legadas (conforme README.md).
- Evidência física de código legado e arquivos transientes (dívida técnica estrutural inicial).

**Problemas encontrados:**
- Poluição na raiz e nos pacotes com arquivos que aparentam ser artefatos soltos.
- Duplicação conceitual evidente na estrutura de agentes (inglês/português, hifenização/snake_case) na pasta `agents/`.
- Presença de múltiplos frameworks e abordagens de execução lado a lado.

**Nível inicial de organização (0–100):** 60
*(Justificativa: Embora haja tooling moderno e intenção de segregação core/legado, a convivência ativa dos códigos no repositório gera confusão visual e risco operacional).*

**Observações sobre risco estrutural inicial:**
O maior risco inicial identificado é o acoplamento entre os diretórios do core e os diretórios legados/em quarentena. Se pipelines ou processos compartilhados (como os definidos na raiz) testarem, buildarem ou dependerem de pacotes depreciados, o sistema não é confiavelmente isolado.
