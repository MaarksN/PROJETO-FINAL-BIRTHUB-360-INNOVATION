# ADR-001: Monorepo Tooling (Turborepo vs Nx vs pnpm workspaces)

## Status

Accepted

## Context

O ecossistema BirthHub 360 é complexo, envolvendo 8 agentes de IA, aplicações frontend (Next.js), serviços de backend (FastAPI, Express) e pacotes compartilhados. Para suportar a arquitetura baseada em monorepo, precisamos de uma ferramenta eficiente de build, cache e orquestração de tarefas que ofereça boa Developer Experience (DX) e pipelines rápidas no CI/CD. As principais opções analisadas foram Turborepo, Nx e pnpm workspaces puros.

## Análise das Alternativas

### 1. pnpm workspaces puros

- **Vantagens**: Simples, já nativo do pnpm, sem dependências adicionais ou curva de aprendizado. Lida bem com dependências (hoisting) e instalação rápida (links simbólicos).
- **Desvantagens**: Não possui cache inteligente de builds (build caching), não entende automaticamente grafos de dependência complexos entre pacotes para ordenar tarefas de forma otimizada.

### 2. Nx

- **Vantagens**: Extremamente poderoso, suporte a plugins (Next.js, React, Node), visualização interativa do grafo, geração de código nativa.
- **Desvantagens**: Alta complexidade, curva de aprendizado íngreme. Requer bastante configuração e refatoração para se adequar ao "jeito Nx" de pensar, o que poderia atrasar o setup inicial da arquitetura.

### 3. Turborepo + pnpm workspaces

- **Vantagens**: Focado em ser "zero-config" ou configuração mínima. Excelente em orquestração de tarefas (pipelines) e cache (local e remoto). Combina a eficiência do pnpm (gerenciamento de pacotes) com a inteligência do Turborepo (task running). Curva de aprendizado muito menor que o Nx, preservando a estrutura padrão de projetos JavaScript/TypeScript.
- **Desvantagens**: Menos plugins e features "enterprise" avançadas comparado ao Nx, sem geradores nativos de código prontos para uso profundo (embora o `turbo gen` exista, é mais simples).

## Decision

Foi decidido utilizar **pnpm workspaces** para o gerenciamento e linkagem local dos pacotes (resolução de dependências), combinado com o **Turborepo** para a orquestração e caching das tarefas de build, teste e lint.

## Consequences

- O projeto deve manter um arquivo `turbo.json` na raiz declarando a pipeline global (build, test, lint, dev).
- Novos pacotes ou apps adicionados aos diretórios `apps/`, `agents/` ou `packages/` são automaticamente reconhecidos pelo pnpm via `pnpm-workspace.yaml`.
- Desenvolvedores têm builds instantâneos e testes mais rápidos localmente devido ao cache agressivo do Turborepo nas pastas `.turbo` e `node_modules/.cache`.
- Aumenta a dependência na Vercel (mantenedora do Turborepo), mas os riscos são baixos pela ferramenta ser open-source.
