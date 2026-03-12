# ADR-001: Turborepo vs Nx vs pnpm workspaces

## Status
Aceito

## Contexto
Precisamos de uma ferramenta para gerenciar o monorepo do BirthHub360, suportando múltiplas aplicações (Next.js, LangGraph, etc) e pacotes compartilhados.

## Decisão
Utilizaremos **pnpm workspaces** aliado ao **Turborepo**.

## Justificativa
O pnpm é mais rápido e eficiente em espaço que npm/yarn, e o Turborepo oferece cache de build excepcional com menor curva de aprendizado em comparação ao Nx.
