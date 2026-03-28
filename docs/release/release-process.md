# Release Process

## Fonte canônica

- Workflow: `.github/workflows/cd.yml`
- Gates locais: `scripts/release/preflight-env.ts`, `scripts/release/verify-rollback-evidence.ts`

## Pipeline

1. `CI` aprova o commit em `main`.
2. `staging-preflight` valida configuração de staging.
3. `release-sbom` gera o SBOM da release.
4. `production-preflight` valida configuração de produção.
5. `release-smoke-gate` executa smoke do core canônico.
6. `release-e2e-gate` executa E2E de release.
7. `rollback-rehearsal-evidence-gate` exige prova verificável de rollback.
8. `deploy-production` dispara o hook de produção.

## Evidências obrigatórias

- `artifacts/release/staging-preflight-summary.json`
- `artifacts/release/production-preflight-summary.json`
- `artifacts/release/smoke-summary.json`
- `artifacts/release/production-rollback-evidence.json`

## Artefatos esperados

- `releases/manifests/release_artifact_catalog.md`
- `CHANGELOG.md`
- `docs/release/2026-03-20-go-live-runbook.md`
