<!-- [SOURCE] CI-TS-004 -->
# CI-TS-004 — Bloqueio técnico em @birthub/dashboard

## Contexto
Após correções em `@birthub/queue`, `@birthub/db`, `@birthub/llm-client`, `@birthub/worker` e `@birthub/api`, a matriz de typecheck por pacote ficou em `16/17` passando.

Pacote ainda falhando:
- `@birthub/dashboard`

## Erros representativos
- Resolução de módulos internos ausentes (`@/lib/data`, `@/components/...`).
- Dependências/tipos ausentes (`clsx`, `tailwindcss` com `moduleResolution` incompatível).
- Contrato divergente com `@birthub/db` (`DealStage`, `prisma` não exportados conforme uso atual).
- Diversos erros de tipagem estrita (`implicit any`, `possibly undefined`).

## Motivo do bloqueio
A correção exige intervenção estrutural no módulo dashboard (arquitetura de imports, contrato de dados, dependências e cobertura de tipos) e tem risco de regressão funcional além de ajuste pontual de compilação.

## Ação humana requerida
1. Definir baseline canônico do dashboard (paths, alias TS, dependências obrigatórias).
2. Confirmar o contrato oficial esperado entre `@birthub/dashboard` e `@birthub/db`.
3. Autorizar ciclo dedicado para saneamento completo do dashboard (escopo amplo), separado das correções pontuais de infra TS.

## Revalidação em 2026-03-20
- `corepack pnpm -r --reporter append-only typecheck` continua falhando exclusivamente no `@birthub/dashboard`.
- Os demais pacotes-alvo de infra (`@birthub/queue`, `@birthub/agents-core`, `@birthub/db`, `@birthub/llm-client`) permanecem verdes em typecheck isolado.
