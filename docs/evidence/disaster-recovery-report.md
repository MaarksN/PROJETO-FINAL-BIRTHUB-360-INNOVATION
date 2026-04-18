# Disaster Recovery Report

- generatedAt: 2026-04-18T05:25:33.349Z
- overall_status: fail

## Checks

| Check | Status | Artifact | Detail |
| --- | --- | --- | --- |
| backup health | fail | `artifacts/backups/backup-health.json` | No backup files found in /home/runner/work/PROJETO-FINAL-BIRTHUB-360-INNOVATION/PROJETO-FINAL-BIRTHUB-360-INNOVATION/artifacts/backups. |
| rollback evidence | fail | `artifacts/release/production-rollback-evidence.json` | Missing or invalid artifacts/release/production-rollback-evidence.json. |
| disaster recovery drill | fail | `artifacts/backups/drill-rto-rpo.json` | DR drill artifact exists but is insufficient for auditability (scenario=scheduled release rehearsal, backupArtifact=artifacts/backups/backup-health.json, RTO=0m, RPO=27423m). |

## Blockers

- No backup files found in /home/runner/work/PROJETO-FINAL-BIRTHUB-360-INNOVATION/PROJETO-FINAL-BIRTHUB-360-INNOVATION/artifacts/backups.
- Missing or invalid artifacts/release/production-rollback-evidence.json.
- DR drill artifact exists but is insufficient for auditability (scenario=scheduled release rehearsal, backupArtifact=artifacts/backups/backup-health.json, RTO=0m, RPO=27423m).
