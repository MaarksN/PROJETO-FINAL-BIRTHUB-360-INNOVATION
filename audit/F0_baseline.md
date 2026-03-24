# F0 — BASELINE

## Análise da Estrutura Completa

O repositório `BIRTHUB 360` é um monorepo baseado em PNPM Workspaces, organizado nas seguintes pastas principais:
- `apps/`: Contém as aplicações finais (ex: `api`, `web`, `dashboard`, `worker`, `voice-engine`, `webhook-receiver`).
- `packages/`: Bibliotecas internas compartilhadas (ex: `database`, `auth`, `security`, `workflows-core`).
- `agents/`: Contém a implementação dos agentes em Python (ex: `ae`, `ldr`, `sdr`, `financeiro`, `juridico`, `marketing`, etc). Existem também diretórios como `agent-packs` e `agents` dentro de `packages/`.
- `scripts/`: Scripts utilitários de build, deploy, test e CI/CD.

## Tecnologias Identificadas
- **Gerenciador de Pacotes:** PNPM Workspace (v9.1.0)
- **Node.js:** >=24 <25 (TypeScript)
- **Python:** Integração de agentes (usando pytest)
- **Frontend/Backend:** Next.js (Inferido pelo `apps/web`), Express/Outros APIs para backend (`apps/api`).
- **Testes:** Playwright (E2E), Jest/Vitest (core Node), k6 (Load), pytest (Python agents).
- **CI/CD:** Scripts locais e integrações em `.github`.
- **Banco de Dados:** Prisma ORM (`packages/database`).

## Tamanho e Complexidade
- Total de arquivos: ~3233 arquivos monitorados.
- Total de pacotes: 6 apps, 21 packages, +28 subdiretórios em `agents`.
- Complexidade: Alta (monorepo híbrido Node + Python), contendo sistema web, API, workers assíncronos, motor de workflows e ecossistema extenso de agentes especializados.

## Sinais de Organização / Desorganização
- **Positivo:** A infraestrutura de CI/scripts (em `scripts/` e em `package.json`) está bastante rica em comandos explícitos de tooling para linter, tests, e security. Uso de `turbo`. O código está separado de forma que se pode distinguir `core` (api, web, worker, database) de `satellites` (dashboard, etc) de acordo com os scripts (`build:core`, `build:satellites`).
- **Negativo/Problemas:**
  - Diretórios espalhados para agentes. Há agentes em `/agents` e ferramentas/agentes também em `/packages/agents`, `/packages/agents-core`.
  - Duplicação de escopos como `pos-venda` vs `pos_venda`, e `pre_sales` vs `pre_vendas`. A convenção para módulos Python é `snake_case`, mas a mescla de idiomas e hífens aponta desorganização grave.
  - Excesso de agentes com nomes baseados em cargos genéricos (ex: `analista`, `coordenador_comercial`, `gerente_comercial`, `copywriter`), sugerindo fragmentação sem função de runtime clara.

## Avaliação e Score Inicial
- **Score Inicial (0-100):** 65
- **Problemas Encontrados:** Despadronização severa na arquitetura dos agentes (idiomas misturados, `kebab-case` vs `snake_case` em Python, sobreposição de domínios). Potencial alto de código morto. Mistura conceitual de libs Node e pacotes Python.