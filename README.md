# BirthHub360

![CI](https://img.shields.io/badge/CI-platform-blue)
![Security](https://img.shields.io/badge/security-semgrep%20%2B%20dependency--check-informational)
![Cycle](https://img.shields.io/badge/cycle-1-orange)

Monorepo do BirthHub360 com a fundação do Ciclo 1 centralizada em `apps/web`, `apps/api` e `apps/worker`.

## Quick start

```bash
cp .env.example .env
pnpm setup:local
```

O comando acima instala dependências, sobe Postgres/Redis, gera o Prisma client, aplica migrations, executa seed e inicia os três apps em paralelo com Turbo.

## Estrutura principal

- `apps/web`: Next.js com headers de segurança, login inicial e Sentry client-side.
- `apps/api`: Express com Zod, RFC 7807, Swagger, Sentry, OpenTelemetry e health checks.
- `apps/worker`: BullMQ worker com correlação de `requestId`.
- `packages/config`: contratos Zod de ambiente e payloads compartilhados.
- `packages/database`: schema Prisma inicial, singleton e seed.
- `packages/logger`: logger estruturado com contexto assíncrono.
- `packages/testing`: helpers de banco isolado e factories.

## Documentação

- [Arquitetura](./docs/ARCHITECTURE.md)
- [Checklist mestre](./CHECKLIST_MASTER.md)
- [Log de execução](./CHECKLIST_LOG.md)

## Comandos úteis

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm reset:local
```

## CI e segurança

- `.github/workflows/ci.yml`: `gitleaks` + `lint`, `typecheck`, `test`, `build` em paralelo.
- `.github/workflows/security-scan.yml`: `semgrep` + `dependency-check`.
- `.github/settings.yml`: branch protection declarativa para `main`.
