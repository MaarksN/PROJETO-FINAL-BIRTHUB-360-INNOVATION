# F1 — INVENTÁRIO

## Resumo do Inventário

Este inventário mapeia os principais componentes do monorepo, cobrindo aplicações (apps), pacotes internos (packages), agentes (agents) e scripts utilitários.

## Aplicações (`/apps`)

| Caminho | Tipo | Função | Status / Observação |
|---|---|---|---|
| `apps/api` | API (Node/Express/Outro) | Backend principal do sistema. | Core |
| `apps/web` | Frontend (Next.js) | Interface principal do usuário (Painel/Plataforma). | Core |
| `apps/worker` | Worker (Node) | Processamento em background e filas. | Core |
| `apps/dashboard` | Frontend/Proxy | Painel administrativo legado ou satélite. | Satellite / Legacy |
| `apps/voice-engine` | Serviço | Motor de voz (possivelmente para agentes/bots). | Satellite |
| `apps/webhook-receiver` | Serviço (Python) | Receptor de webhooks isolado. | Satellite |

## Pacotes (`/packages`)

| Caminho | Tipo | Função | Status / Observação |
|---|---|---|---|
| `packages/database` | Database (Prisma) | Modelagem, migrações e ORM principal. | Core |
| `packages/auth` | Biblioteca | Módulo de autenticação compartilhado. | Core |
| `packages/security` | Biblioteca | Regras de segurança, guardas. | Core |
| `packages/workflows-core` | Biblioteca | Motor central de fluxos. | Core |
| `packages/queue` | Biblioteca | Gerenciamento de filas. | Core |
| `packages/testing` | Configuração | Tooling de testes e utilitários. | Core |
| `packages/config` | Configuração | Configs do workspace (Prettier, ESLint). | Core |
| `packages/agent-runtime` | Core Agents | Runtime para agentes Node. | Agents |
| `packages/agent-packs` | Core Agents | Pacotes/configurações de agentes pre-fabricados. | Agents |
| `packages/agents-core` | Core Agents | Core logic para agentes. | Agents |
| `packages/agents-registry` | Core Agents | Registro de agentes disponíveis. | Agents |

## Agentes (`/agents` e Python)

*Obs: A lista abaixo resume os domínios encontrados em `/agents`. Há uma proliferação de agentes com nomes variados.*

| Caminho | Tipo | Função | Status / Observação |
|---|---|---|---|
| `agents/ae` | Agente | Executivo de Contas. | Contém worker.py e worker.ts |
| `agents/ldr` | Agente | Lead Development Representative. | Contém worker.py e worker.ts |
| `agents/sdr` | Agente | Sales Development Representative. | Contém worker.py e worker.ts |
| `agents/financeiro` | Agente | Financeiro. | Contém worker.py e worker.ts |
| `agents/juridico` | Agente | Jurídico. | Contém worker.py e worker.ts |
| `agents/marketing` | Agente | Marketing. | Contém worker.py e worker.ts |
| `agents/analista` | Agente | Cargo genérico. | Cargo sem domínio específico |
| `agents/pos_venda` / `pos-venda` | Agente | Pós-venda. | Duplicação de escopo |
| `agents/pre_vendas` / `pre_sales` | Agente | Pré-vendas. | Duplicação de escopo / idioma |
| `agents/shared` | Core | Código base compartilhado para os agentes Python. | Core Python Agents |
| *Outros ~15+ agentes* | Agente | Domínios diversos e sobrepostos. | Fragilidade estrutural. |

## Scripts (`/scripts`)
- **Volume:** ~700KB+ de scripts diversos.
- **Funções Principais:** CI local, verificação de git branch, deploy pré-flight, reset, banco de dados (seed, reset), segurança (guardrails, verificação de auth), testes de performance, e manipulação de scripts (e.g. `cleanup-artifacts.mjs`).

## Conclusões do Inventário
- A arquitetura do *Core* em Node está clara e segue um modelo de monorepo maduro.
- O diretório de agentes (`/agents`) contém uma mistura de Python e TypeScript (ex: `worker.py` e `worker.ts` na mesma pasta), além de misturar idiomas (`pre_sales` vs `pre_vendas`) e formatos. A quantidade de agentes sugere que a maioria não é utilizada em produção ou carece de um *worker* validado e de um ciclo de vida orquestrado.