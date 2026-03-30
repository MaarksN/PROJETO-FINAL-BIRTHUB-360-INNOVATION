# Materialização Técnica de Itens Apenas Documentados

Gerado em: 2026-03-30T18:40:17.842Z

## Status dos controles

| Controle | Status | Detalhes |
| --- | --- | --- |
| codeowners-present | PASS | {} |
| f11-evidence-bundle-complete | PASS | {"missingF11Evidence":[]} |
| frozen-lockfile-in-workflows | PASS | {} |
| workflow-timeouts | PASS | {"missingTimeout":[]} |
| branch-protection-baseline | FAIL | {"hasDevelopBranchProtection":true,"hasMainBranchProtection":true,"missingStatusChecks":["\"platform (lint)\"","\"platform (typecheck)\""]} |
| setup-node-version-pinned | PASS | {"setupNodeLines":["v6","v6","v6","v6","v6","v6","v6"]} |
| setup-python-version-pinned | PASS | {"setupPythonLines":["v6","v6","v6","v6"]} |
| node-version-aligned-with-nvmrc | PASS | {"nvmrc":"24.14.0"} |
| python-version-aligned-with-python-version | PASS | {"pythonVersion":"3.12"} |
| pnpm-version-pinned-in-packageManager | PASS | {"packageManager":"pnpm@9.1.0"} |
| f11-docs-consistent-with-latest-closure | PASS | {"staleMentions":[]} |
| pr-template-merge-markers | PASS | {} |
| agent-naming-conflict-pos-venda | PASS | {"hasCompatibilityShim":false,"hasDualDirs":false,"legacyAliasFiles":[],"mode":"single-directory"} |
| legacy-db-imports-quarantined | PASS | {"forbiddenImportHits":[]} |

## Resumo

- Blockers: 1
- Warnings: 0

### Blockers

- branch-protection-baseline
