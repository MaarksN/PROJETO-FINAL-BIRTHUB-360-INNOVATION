# Deploy Canonical Stack

## Escopo

Este runbook cobre somente `apps/web`, `apps/api`, `apps/worker` e `packages/database`.

## Lane única

O deploy canonico da aplicacao e `GitHub Actions -> Artifact Registry -> Cloud Run`.
Qualquer rota manual fora desse fluxo é tratada como exceção operacional e não como estratégia oficial.

## Passos

1. Confirmar `main` como branch fonte.
2. Validar `pnpm install --frozen-lockfile`.
3. Confirmar `CI` verde para o commit candidato.
4. Confirmar `staging-preflight`, `release-sbom`, `build-staging-images` e `deploy-staging`.
5. Executar o workflow `CD` em `workflow_dispatch` com `deploy_target=production`.
6. Confirmar `production-preflight` e `build-production-images`.
7. Confirmar `deploy-production-candidate` e registrar `artifacts/release/production-rollout.json`.
8. Confirmar `release-smoke-gate`, `release-e2e-gate` e `rollback-rehearsal-evidence-gate`.
9. Confirmar `promote-production` concluido e as revisoes candidatas recebendo 100% do trafego no Cloud Run.

## Evidências mínimas

- `artifacts/release/staging-preflight-summary.json`
- `artifacts/release/production-preflight-summary.json`
- `artifacts/release/smoke-summary.json`
- `artifacts/release/production-rollback-evidence.json`
