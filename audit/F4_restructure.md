# F4 — REORGANIZAÇÃO ESTRUTURAL

## Estrutura Atual
O monorepo atualmente está mapeado pelo `pnpm-workspace.yaml` cobrindo `apps/*`, `packages/*`, e `agents/*`. A separação lógica falha porque a pasta `packages/` tem subpastas que competem com `agents/` (`packages/agents`, `packages/agents-core`, `packages/agents-registry`), criando confusão sobre onde os agentes residem e como são geridos.

## Proposta de Nova Arquitetura

Para limpar e escalar o projeto, aplicaremos a hierarquia rígida entre componentes:

### CORE (Sobrevivência Máxima - Blocking Go-Live)
Os elementos cruciais para o ecossistema e que bloqueiam a produção:
- `apps/web`: O frontend principal da plataforma
- `apps/api`: O backend primário
- `apps/worker`: Orquestrador de jobs/background e core Node
- `packages/database`: Prisma ORM, migrations, seeders, conexões DB
- `packages/auth`, `packages/security`, `packages/workflows-core`, `packages/queue` e pacotes core como `config`, `logger`, `testing`.
- `agents/shared`: Core Python que suporta todos os agentes.
- Agentes vitais (a decidir, ver Fase 3: `ae`, `ldr`, `sdr`, `pos_venda`, etc).

### SATELLITES (Não Bloqueiam Go-Live)
Pacotes secundários ou específicos que orbitam o core mas não determinam falha primária da plataforma:
- `apps/dashboard`: Legado / Proxy Frontend.
- `apps/webhook-receiver`: Integrador externo (Python).
- `apps/voice-engine`: Serviço isolado experimental.
- `packages/agent-packs`: Módulos ou pacotes de config de agentes opcionais.

### LEGACY (Candidatos à Remoção Imediata ou Isolamento)
Componentes legados e duplicações estruturais:
- Pacotes genéricos ou diretórios em `agents/` como `analista`, `copywriter`, `coordenador_comercial`, etc (Conforme fase F3).
- Diretórios que misturam linguagens de forma bizarra (e.g. `pre_sales`, `pos-venda` - quebrar a barreira de naming convencionada `snake_case` e idioma padrão).

## Benefícios da Reorganização (Atual vs Ideal)

- **Atual:** Confusão de responsabilidades, pacotes de infra e pacotes de domínio misturados, scripts rodando agentes de caminhos incorretos ou em Python/TypeScript com a mesma pasta.
- **Ideal:** Delimitação nítida e expurgo da duplicidade. O `apps/worker` absorve o runtime de Node de agentes (se aplicável) e as rotinas Python dos agentes operam através do `agents/shared` via gRPC/REST (ou outro protocolo). `packages/` volta a ser uma pasta apenas de utilitários e bibliotecas agnósticas a produto.

**Ações Principais:** Mover agentes satélites e obsoletos para o lixo e focar os pacotes essenciais dentro da esteira CI (via `scripts/ci/run-pnpm.mjs task core`).