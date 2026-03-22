# BirthHub 360 Monorepo

Repositório canônico da plataforma SaaS BirthHub 360.

## Stack canônica suportada

- **Frontend oficial:** `apps/web`
- **API oficial:** `apps/api`
- **Worker oficial:** `apps/worker`
- **Banco canônico:** `packages/database`

## Superfícies legadas em quarentena

- `apps/dashboard`
- `apps/api-gateway`
- `apps/agent-orchestrator`
- `packages/db`

## Setup rápido

```bash
pnpm install
pnpm db:generate
pnpm monorepo:doctor
pnpm dev
```

## Governança e higiene

```bash
pnpm artifacts:clean
pnpm branch:check
pnpm commits:check
pnpm hygiene:check
pnpm docs:check-links
pnpm monorepo:doctor
```

## Documentação principal

- [Contribution guide](CONTRIBUTING.md)
- [Documentation index](docs/README.md)
- [Repository naming standard](docs/standards/repository-naming.md)
- [Documentation source of truth](docs/processes/documentation-source-of-truth.md)
- [Internal package graph](docs/architecture/internal-package-graph.md)
- [Dependency approval register](docs/processes/dependency-approval-register.md)
