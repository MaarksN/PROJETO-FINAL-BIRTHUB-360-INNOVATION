# F0 - Baseline Report (2026-03-22)

## Freeze metadata

- Tag: baseline-f0
- Commit: 4b7e6cb41515f33d6fe3a2880485e86ee289ca5e
- Freeze timestamp (America/Sao_Paulo): 2026-03-22T20:56:46-03:00
- Manifest: artifacts/f0-freeze-2026-03-22/freeze-manifest.json

## Governanca e aprovacoes

- Ownership assinado: docs/operations/f0-ownership-matrix.md
- Politica de SLA assinada: docs/operations/f0-sla-severity-policy.md
- Baseline 90d SLA: docs/operations/f0-sla-adherence-baseline-90d.md

## Logs de comandos em verde

| Comando | Resultado | Log |
| --- | --- | --- |
| git show -s --date=iso --pretty=format:"%H%n%h%n%ad%n%s" HEAD | PASS | artifacts/f0-freeze-2026-03-22/logs/20260322T205646-0300-01-git-head.log |
| corepack pnpm monorepo:doctor | PASS | artifacts/f0-freeze-2026-03-22/logs/20260322T205646-0300-02-monorepo-doctor.log |
| corepack pnpm workspace:audit | PASS | artifacts/f0-freeze-2026-03-22/logs/20260322T205646-0300-03-workspace-audit.log |
| corepack pnpm release:scorecard | PASS | artifacts/f0-freeze-2026-03-22/logs/20260322T205646-0300-04-release-scorecard.log |

Checksums SHA-256: artifacts/f0-freeze-2026-03-22/logs.sha256

## Metricas capturadas do repositorio

Fonte: artifacts/f0-freeze-2026-03-22/reports/repo-inventory.json

- Branch: main
- Commit: 4b7e6cb
- Node: v24.14.0
- pnpm: 9.1.0
- Python: Python 3.12.10

### Source file counts

| Surface | Files |
| --- | ---: |
| Web | 79 |
| API | 166 |
| Worker | 67 |
| Database | 63 |
| Agents | 219 |

### Test file counts

| Surface | Files |
| --- | ---: |
| Web | 3 |
| API | 29 |
| Worker | 19 |
| Packages | 37 |
| Python agents | 49 |

### Directory size (bytes)

| Surface | Bytes |
| --- | ---: |
| Web | 774298 |
| API | 626900 |
| Worker | 256493 |
| Database | 279194 |
| Agents | 1031483 |

## Decisao

Baseline F0 publicado com metricas capturadas e trilha de evidencias em verde.
