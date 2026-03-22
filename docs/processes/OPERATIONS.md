# Guia de Operacoes

Este e o atalho operacional para o stack canonico (`apps/web`, `apps/api`, `apps/worker`, `packages/database`).

## Links rapidos

- Hub F10: `docs/f10/README.md`
- Deploy: `docs/runbooks/deploy-canonical-stack.md`
- Rollback: `docs/runbooks/rollback-canonical-stack.md`
- Incidentes: `docs/runbooks/incident-response-matrix.md`
- Alertas P1: `docs/runbooks/p1-alert-response-matrix.md`
- Disaster recovery: `docs/runbooks/disaster-recovery.md`
- Processo de release: `docs/release/release-process.md`

## Comandos operacionais essenciais

```bash
pnpm monorepo:doctor
pnpm release:scorecard
pnpm docs:verify
pnpm release:preflight:staging
pnpm release:preflight:production
pnpm release:smoke
```

## Verificacoes minimas antes de operar

- `pnpm monorepo:doctor` sem findings criticos.
- `pnpm docs:verify` sem links quebrados ou drift nos artefatos F10.
- `pnpm release:scorecard` aprovado para o core lane.
- OpenAPI exposta em `apps/api` (`/api/openapi.json`) e `apps/api-gateway` (`/openapi.json`) quando o ambiente permitir docs.

## Guardrails

- Nao promova superficies legadas para o fluxo principal sem RFC e ADR.
- Nao rode rollback de schema sem validar backup e janela de impacto.
- Nao use `apps/dashboard` ou `apps/api-gateway` como evidencia de pronto do go-live canonico.

## Saude e observabilidade

- SLOs base: `docs/OBSERVABILIDADE_E_SLOS.md`
- Alertas e thresholds: `docs/observability-alerts.md`
- Report tecnico: `docs/technical-debt/dashboard.md`
