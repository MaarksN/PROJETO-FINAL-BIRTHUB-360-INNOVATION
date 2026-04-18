# 1. RESUMO EXECUTIVO DO CICLO 0
- Scorecard por dimensão (0–10):
  - snapshot: 8
  - inventario: 7
  - tipagem: 0
  - build_runtime: 6
  - env: 0
  - testes: 6
  - deps: 8
- Total de achados por severidade: P0=2 P1=0 P2=16 P3=3
- Gatilhos de bloqueio ativados: Credenciais reais commitadas em arquivo rastreado, Lockfile ausente, Mais de 3 arquivos @ts-nocheck no core canônico

# 2. ESTADO GIT E SNAPSHOT
- Branch: work
- SHA: 6cef6df11978c34c0debe73e101d11072d4d1993
- Dirty state: {'is_dirty': False, 'modified': [], 'untracked': [], 'staged': []}
- Último commit: MaarksN em 2026-04-18T05:55:46-03:00

# 3. INVENTÁRIO GLOBAL
- packageManager(root): pnpm@9.15.9
- executáveis: pnpm=False npm=True yarn=True
- lockfiles: nenhum
- workspaces declarados: 2 | reais: 25
- contagem arquivos: {'ts': 824, 'tsx': 132, 'py': 19, 'tests': 307, 'configs': 26, 'dockerfiles': 9, 'workflows': 12}

# 4. NÚCLEO CANÔNICO IDENTIFICADO
- apps/api: presente
- apps/web: presente
- apps/worker: presente
- packages/config: presente
- packages/database: presente
- packages/logger: presente

# 5. ÁREAS SUSPEITAS, LEGADO E RUÍDO
- apps/legacy/dashboard => LEGADO (QUARENTENA)
- audit => EVIDÊNCIA / DOCUMENTAÇÃO (SOBREVIVE)
- artifacts => EVIDÊNCIA / DOCUMENTAÇÃO (SOBREVIVE)
- docs => EVIDÊNCIA / DOCUMENTAÇÃO (SOBREVIVE)
- scripts => SATÉLITE ÚTIL (INVESTIGAR)
- scripts/diagnostics/audit-legacy-db-imports.mjs => RUÍDO OPERACIONAL (QUARENTENA)
- scripts/fix-internal-package-exports.mjs => RUÍDO OPERACIONAL (QUARENTENA)
- scripts/ci/check-legacy-runtime-surface-freeze.mjs => RUÍDO OPERACIONAL (QUARENTENA)
- scripts/ci/check-legacy-db-surface-freeze.mjs => RUÍDO OPERACIONAL (QUARENTENA)
- scripts/legacy/block-legacy-entrypoint.mjs => RUÍDO OPERACIONAL (QUARENTENA)
- scripts/ops/check-backup-health.test.ts => RUÍDO OPERACIONAL (QUARENTENA)
- scripts/ops/check-backup-health.ts => RUÍDO OPERACIONAL (QUARENTENA)
- scripts/ops/backup-postgres.sh => RUÍDO OPERACIONAL (QUARENTENA)

# 6. VARIÁVEIS DE AMBIENTE E SEGREDOS
- arquivos .env*: 16
- arquivos example: 8
- variáveis usadas não documentadas: 59
- variáveis documentadas não usadas: 91
- segredos detectados (heurística): 792

# 7. ESTADO DOS TESTES
- frameworks detectados: []
- arquivos de teste detectados: 307
- marcas skip/TODO: 58
- CI com continue-on-error em algum workflow: False

# 8. SAÚDE DAS DEPENDÊNCIAS
- lockfile presente: False
- múltiplos lockfiles: False
- dependências com versões divergentes: 6
- dependencies com ferramentas dev: 1
- runtime em devDependencies: 6
- refs patch/file/link/portal: 0
- refs '*'/'latest': 0

# 9. SUPRESSÕES DE TIPAGEM CRÍTICAS
| arquivo | tipo | severidade | contexto |
|---|---|---|---|
| scripts/audit/generate-sovereign-report.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/shared-prime.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-normalize.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-catalog.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/reconcile-td-catalog.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/generate-governance-suite.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-render.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-backlog.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-collect.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-refresh-evidence.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/audit/prepare-history.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-verify.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/audit/generate-report.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/prime-score.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/audit/shared.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/audit/executive-agents-governance.mjs:192 | ts-nocheck | CRITICAL | build |
| scripts/audit/executive-agents-governance.mjs:193 | ts-nocheck | CRITICAL | build |
| scripts/audit/executive-agents-governance.mjs:194 | ts-nocheck | CRITICAL | build |
| scripts/audit/executive-agents-governance.mjs:222 | ts-nocheck | CRITICAL | build |
| scripts/audit/executive-agents-governance.mjs:230 | ts-nocheck | CRITICAL | build |
| scripts/audit/executive-agents-governance.mjs:238 | ts-nocheck | CRITICAL | build |
| scripts/audit/executive-agents-governance.mjs:245 | ts-nocheck | CRITICAL | build |
| scripts/audit/generate-auditor-prime-report.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/agent/github-agent-collection.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/agent/generate-github-agent-catalog-doc.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/agent/generate-snapshot.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/agent/compile-github-agents.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/agent/check-github-agent-readiness.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/agent/upgrade-github-agent-manifests.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/diagnostics/check-ownership-governance.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/diagnostics/audit-legacy-db-imports.mjs:2 | ts-nocheck | CRITICAL | legacy |
| scripts/diagnostics/materialize-doc-only-controls.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/testing/generate-regression-zero-report.mjs:1 | ts-nocheck | CRITICAL | test |
| scripts/testing/run-tagged-tests.mjs:1 | ts-nocheck | CRITICAL | test |
| scripts/testing/run-isolation-suite.mjs:2 | ts-nocheck | CRITICAL | test |
| scripts/testing/generate-performance-report.mjs:1 | ts-nocheck | CRITICAL | test |
| scripts/testing/generate-traceability-report.mjs:1 | ts-nocheck | CRITICAL | test |
| scripts/testing/run-shard.mjs:1 | ts-nocheck | CRITICAL | test |
| scripts/sync-birthhub-html.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/privacy/verify-anonymization.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/load-tests/stress.js:1 | ts-nocheck | CRITICAL | build |
| scripts/load-tests/worker-overload.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/ai/export-finetune.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/generate-official-collection.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/f0/generate-governance-baseline.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/docs/generate-technical-health-dashboard.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/docs/check-doc-links.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/docs/generate-dependency-graph.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/docs/bootstrap-changelogs.mjs:2 | ts-nocheck | CRITICAL | bootstrap |
| scripts/release/generate-sbom.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/release/global-smoke.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/release/verify-rollback-evidence.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/release/materialize-release.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/release/final-data-migration.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/fix-internal-package-exports.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/verify-workflow-step-coverage.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/notifications/validate-org-invite-email.ts:1 | ts-nocheck | CRITICAL | build |
| scripts/postinstall-db-generate.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/lint-policy.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/ts-directives-guard.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/ts-directives-guard.mjs:215 | ts-nocheck | CRITICAL | build |
| scripts/ci/ts-directives-guard.mjs:348 | ts-nocheck | CRITICAL | build |
| scripts/ci/ts-directives-guard.mjs:389 | ts-nocheck | CRITICAL | build |
| scripts/ci/ts-directives-guard.mjs:390 | ts-nocheck | CRITICAL | build |
| scripts/ci/ts-directives-guard.mjs:411 | ts-nocheck | CRITICAL | build |
| scripts/ci/ts-directives-guard.mjs:426 | ts-nocheck | CRITICAL | build |
| scripts/ci/write-lockfile-hash.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/monorepo-doctor.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-branch-name.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/full.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/run-pnpm.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/workspace-audit.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/release-scorecard.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/repo-hygiene.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-legacy-runtime-surface-freeze.mjs:1 | ts-nocheck | CRITICAL | legacy |
| scripts/ci/check-web-inline-style-freeze.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/cleanup-artifacts.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-legacy-db-surface-freeze.mjs:1 | ts-nocheck | CRITICAL | legacy |
| scripts/ci/check-default-e2e-surface-freeze.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/lockfile-governance.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/preflight.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/audit-scripts.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-agent-surface-freeze.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-doc-links.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-commit-messages.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/generate_mock_agents.js:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/run-satellites.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-active-product-capabilities-alignment.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/f3-hotspot-metrics.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-runtime-governance.mjs:2 | ts-nocheck | CRITICAL | build |
| scripts/ci/shared.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/script-compliance-audit.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/check-dirty-tree.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/ci/security-guardrails-local.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/forensics/materialize-logical-batch.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/coverage/render-dashboard.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/coverage/check.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/quality/run-mutation-suite.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/quality/check-dead-code.mjs:1 | ts-nocheck | CRITICAL | build |
| scripts/quality/run-stryker.mjs:1 | ts-nocheck | CRITICAL | build |

# 10. INCOERÊNCIAS BUILD / START / EXPORT / DIST
| pacote | dimensão | declarado | real | incoerência |
|---|---|---|---|---|
| apps/api | runtime | start=node dist/apps/api/src/server.js | docker=["pnpm", "start"] compose=None | Docker start command references runtime without dist present locally |
| apps/worker | runtime | start=node dist/apps/worker/src/index.js | docker=["pnpm", "start"] compose=None | Docker start command references runtime without dist present locally |

# 11. MATRIZ PRELIMINAR DE SOBREVIVÊNCIA
- SOBREVIVE: 9
- QUARENTENA: 9
- INVESTIGAR: 1

# 12. RISCOS P0 / P1 ENCONTRADOS
1. Credenciais reais commitadas em arquivo rastreado
2. Lockfile ausente
3. Mais de 3 arquivos @ts-nocheck no core canônico

# 13. PRONTIDÃO PARA ENTRAR NO CICLO 1
- Pré-requisitos cumpridos: snapshot/inventário gerados; matriz núcleo-vs-ruído gerada; env/testes/dependências auditados.
- Pendências: resolver gatilhos P0 antes de reconstrução.

# 14. VEREDITO EXECUTIVO
## VEREDITO EXECUTIVO
**Status:** [NÃO APTO PARA AVANÇAR]
**Scorecard:**
| Dimensão | Score (0–10) | Observação |
|---|:---:|---|
| Snapshot / Git | 8 | Repositório Git válido. |
| Inventário | 7 | Inventário gerado com divergências de workspace/deps. |
| Tipagem | 0 | Supressões críticas e altas detectadas. |
| Build / Runtime | 6 | Incoerências em scripts x runtime detectadas. |
| Env / Segredos | 0 | Cobertura de env insuficiente e potenciais segredos. |
| Testes | 6 | Core sem garantia de testes executáveis. |
| Dependências | 8 | Lockfile ausente e divergências de versão. |
| **TOTAL** | 5.0 | média simples |
**Gatilhos de bloqueio ativados:** [Credenciais reais commitadas em arquivo rastreado; Lockfile ausente; Mais de 3 arquivos @ts-nocheck no core canônico]
**Justificativa:**
1) Estado atual viola pré-condições estruturais de reprodutibilidade. 2) Há bloqueios objetivos em lockfile/testes/env. 3) Núcleo e satélites coexistem sem fronteira operacional rígida. 4) Supressões de tipagem elevam risco de regressão silenciosa. 5) Avanço sem saneamento mínimo amplia custo de reconstrução.
**Condições para avançar ao Ciclo 1:**
1. Restabelecer lockfile rastreado e coerente com manifests.
2. Definir suíte mínima executável para módulos do core e acoplar no CI sem continue-on-error crítico.