# Materialização Técnica de Itens Apenas Documentados

Gerado em: 2026-03-25T04:47:34.748Z

## Status dos controles

| Controle | Status | Detalhes |
| --- | --- | --- |
| codeowners-present | PASS | {} |
| f11-evidence-bundle-complete | FAIL | {"missingF11Evidence":["01-install-rerun.log","01-install-rerun.log.sha256\|01-install-rerun.sha256","02-monorepo-doctor.log","02-monorepo-doctor.log.sha256\|02-monorepo-doctor.sha256","03-release-scorecard.log","03-release-scorecard.log.sha256\|03-release-scorecard.sha256","04-lint-core-rerun.log","04-lint-core-rerun.log.sha256\|04-lint-core-rerun.sha256","05-typecheck-core-rerun.log","05-typecheck-core-rerun.log.sha256\|05-typecheck-core-rerun.sha256","06-test-core-rerun.log","06-test-core-rerun.log.sha256\|06-test-core-rerun.sha256","07-test-isolation.log","07-test-isolation.log.sha256\|07-test-isolation.sha256","08-build-core-rerun.log","08-build-core-rerun.log.sha256\|08-build-core-rerun.sha256","09-test-e2e-release.log","09-test-e2e-release.log.sha256\|09-test-e2e-release.sha256","10-preflight-staging-rerun.log","10-preflight-staging-rerun.log.sha256\|10-preflight-staging-rerun.sha256","11-preflight-production-rerun.log","11-preflight-production-rerun.log.sha256\|11-preflight-production-rerun.sha256","12-workspace-audit.log","12-workspace-audit.log.sha256\|12-workspace-audit.sha256","13-security-report.log","13-security-report.log.sha256\|13-security-report.sha256","14-privacy-verify.log","14-privacy-verify.log.sha256\|14-privacy-verify.sha256","15-security-guardrails.log","15-security-guardrails.log.sha256\|15-security-guardrails.sha256","16-grep-legacy-db.log","16-grep-legacy-db.log.sha256\|16-grep-legacy-db.sha256"]} |
| frozen-lockfile-in-workflows | PASS | {} |
| workflow-timeouts | PASS | {"missingTimeout":[]} |
| branch-protection-baseline | FAIL | {"hasDevelopBranchProtection":true,"hasMainBranchProtection":true,"missingStatusChecks":["platform (lint)","platform (typecheck)"]} |
| setup-node-version-pinned | PASS | {"setupNodeLines":["v6","v6","v6","v6","v6","v6","v6"]} |
| setup-python-version-pinned | PASS | {"setupPythonLines":["v6","v6","v6","v6"]} |
| node-version-aligned-with-nvmrc | PASS | {"nvmrc":"24.14.0"} |
| python-version-aligned-with-python-version | PASS | {"pythonVersion":"3.12"} |
| pnpm-version-pinned-in-packageManager | PASS | {"packageManager":"pnpm@9.1.0"} |
| f11-docs-consistent-with-latest-closure | PASS | {"staleMentions":[]} |
| pr-template-merge-markers | PASS | {} |
| agent-naming-conflict-pos-venda | PASS | {"hasCompatibilityShim":true,"hasDualDirs":true,"legacyAliasFiles":["agents/pos-venda/main.py"],"mode":"compatibility-shim-enforced"} |
| legacy-db-imports-quarantined | PASS | {"forbiddenImportHits":[]} |

## Resumo

- Blockers: 2
- Warnings: 0

### Blockers

- f11-evidence-bundle-complete
- branch-protection-baseline
