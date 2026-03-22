# BirthHub 360 Monorepo

Repositorio canonico da plataforma SaaS BirthHub 360.

## Stack canonica suportada

- **Frontend oficial:** `apps/web` (Next.js + BFF em `app/api/bff`).
- **API oficial:** `apps/api` (Express modular, OpenAPI, auth, billing, workflows).
- **Worker oficial:** `apps/worker`.
- **Banco canonico:** `packages/database` (Prisma schema + migrations).

## Legado e deprecacao controlada

- `apps/dashboard`: legado, nao e a UI oficial para novos fluxos.
- `apps/api-gateway`: compat/proxy layer legado para cutover.
- `packages/db`: camada de compatibilidade temporaria para migracao de imports.

## Setup rapido

```bash
pnpm install
pnpm db:generate
pnpm monorepo:doctor
pnpm dev
```

## Portas locais padrao

- API: `3000`
- Web canonica: `3001`
- Dashboard legado: `3010`

## Comandos essenciais

```bash
pnpm monorepo:doctor
pnpm release:scorecard
pnpm docs:verify
pnpm lint
pnpm typecheck
pnpm test
```

## Governanca, operacao e F10

- Hub F10: `docs/f10/README.md`
- Arquitetura e integracoes: `docs/f10/architecture.md`
- Onboarding tecnico: `docs/ONBOARDING.md`
- Operacoes e runbooks: `docs/OPERATIONS.md`
- Debt program: `docs/technical-debt/README.md`
- Templates canonicos: `docs/templates/README.md`
- ADR index: `docs/adrs/INDEX.md`

## Documentos de referencia

- Observabilidade e SLOs: `docs/OBSERVABILIDADE_E_SLOS.md`
- Migracao canonica de banco: `docs/MIGRACAO_CANONICA_DB.md`
- Deprecacao e cutover: `docs/DEPRECACAO_E_CUTOVER.md`
- Politicas de auditoria e aprovacoes: `docs/AUDITORIA_E_APROVACOES.md`
- LGPD operacional: `docs/LGPD_OPERACIONAL.md`
