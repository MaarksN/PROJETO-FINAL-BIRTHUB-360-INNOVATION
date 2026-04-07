# Release Process

## Fonte canônica

- Workflow: `.github/workflows/cd.yml`
- Gates locais: `scripts/release/preflight-env.ts`, `scripts/release/verify-rollback-evidence.ts`
- Materialização local: `scripts/release/generate-sbom.mjs`, `scripts/release/materialize-release.ts`

## Pipeline

1. `CI` aprova o commit em `main`.
2. `staging-preflight` valida configuracao de staging.
3. `release-sbom` gera o SBOM (`artifacts/sbom/bom.xml`) e materializa catalogo/checksums.
4. `build-staging-images` publica imagens canonicas no Artifact Registry.
5. `deploy-staging` sobe revisoes candidatas no Cloud Run e promove staging para 100%.
6. `production-preflight` valida configuracao de producao.
7. `build-production-images` publica imagens de producao no Artifact Registry.
8. `deploy-production-candidate` sobe revisoes candidatas em producao sem promover trafego.
9. `release-smoke-gate` executa smoke HTTP contra as URLs candidatas.
10. `release-e2e-gate` executa E2E de release contra as URLs candidatas.
11. `rollback-rehearsal-evidence-gate` exige prova verificavel de rollback.
12. `promote-production` envia 100% do trafego para as revisoes candidatas aprovadas.

## Evidências obrigatórias

- `artifacts/release/staging-preflight-summary.json`
- `artifacts/release/production-preflight-summary.json`
- `artifacts/release/smoke-summary.json`
- `artifacts/release/production-rollback-evidence.json`
- `artifacts/release/staging-rollout.json`
- `artifacts/release/production-rollout.json`
- `artifacts/release/checksums-manifest.sha256`
- `artifacts/release/release-artifact-catalog.json`

## Artefatos esperados

- `releases/manifests/release_artifact_catalog.md`
- `releases/notes/v1.0.0.md`
- `CHANGELOG.md`
- `docs/release/2026-03-20-go-live-runbook.md`
- `scripts/ops/rollback-release.sh`
- `docs/release/reproducible-build.md`
