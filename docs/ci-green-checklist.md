# Checklist de Aceite de CI ("Pipeline Verde")

A obtenção de uma **Pipeline Verde** no BirthHub 360 não é apenas evitar um erro de syntax no código. Trata-se de uma suíte abrangente validando toda a arquitetura baseada em Turborepo e agentes LangGraph. A cor verde é a confirmação do CI/CD de que o commit obedeceu aos requisitos documentados para ir para a `main`.

Abaixo descrevemos o **Checklist Passo a Passo** que acontece na nuvem, definindo rigorosamente o que significa uma _"Pipeline Verde"_.

## O Fluxo da Pipeline Verde

- [ ] **1. Checkout e Setup:**
  - O código foi copiado (`git checkout`).
  - O ambiente Node.js (v20+) e Python (3.12+) foram configurados.
  - O cache do gerenciador de pacotes (`pnpm install`) foi populado/usado para resolver dependências sem warnings críticos.

- [ ] **2. Checagem de Estilo (Formatting & Linting):**
  - O comando `pnpm run format` rodou sem modificar arquivos (Prettier em TypeScript, Markdown, etc).
  - O comando `pnpm run lint` validou a regra Zero Warnings:
    - O linter TypeScript/ESLint rodou sem falhas nos pacotes/aplicações.
    - O linter Python (`ruff` e `mypy`) rodou sobre os 8 agentes e não reportou erro de tipagem ou uso indevido de variáveis (`strict` mode).

- [ ] **3. Build e Compilação:**
  - O comando `turbo run build` rodou local ou utilizando remote caching no Vercel (se habilitado).
  - Nenhuma tipagem TypeScript explodiu de dependências (`packages/` construíram os pacotes e tipagens que o `apps/api-gateway` consome) e o Next.js build (`apps/dashboard`) completou com sucesso as páginas estáticas/server.

- [ ] **4. Testes Unitários e de Integração:**
  - Agentes Python: `pytest agents tests/integration --cov` validou com os mocks configurados.
  - Não houve quebras nos testes dos agentes que conversam com as APIs externas (simuladas).

- [ ] **5. Testes E2E e de Carga (Optional/Canary):**
  - Em PRs que alteram o painel de UI (Sales OS) ou Gateway de Webhooks, os testes Playwright (`pnpm test:e2e`) rodaram em modo headless.
  - Para alteração em pacotes de infraestrutura, os testes de carga do BullMQ (`pnpm test:load`) passaram, provando a resiliência na enfileiração dos workers.

- [ ] **6. Quality Gates de Cobertura (Coverage):**
  - A cobertura global combinada (Python + TypeScript) foi comparada.
  - A cobertura está superior ou igual a **80%** e não diminuiu drasticamente em relação ao commit anterior.

## Consequência

Qualquer caixa não marcada interrompe a pipeline com estado `Failed (❌)`, e as automações vão requerer que o Desenvolvedor faça os ajustes em sua máquina antes de outro commit. Somente quando **todos os checkboxes** finalizam com o status `Success (✅)` a CI sinaliza o repositório habilitando o botão de Merge.
