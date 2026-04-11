# Disaster Recovery Report

- generatedAt: 2026-04-11T16:44:39.983Z
- overall_status: fail

## Checks

| Check | Status | Artifact | Detail |
| --- | --- | --- | --- |
| backup health | fail | `artifacts/backups/backup-health.json` | No backup files found in C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\artifacts\backups. |
| rollback evidence | pass | `artifacts/release/production-rollback-evidence.json` | Rollback rehearsal evidence recorded for production at 2026-03-24T14:37:26.498Z |
| disaster recovery drill | fail | `artifacts/backups/drill-rto-rpo.json` | DR drill artifact exists but is insufficient for auditability (scenario=legacy-unclassified, backupArtifact=legacy-untracked, RTO=60m, RPO=15m). |

## Blockers

- No backup files found in C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\artifacts\backups.
- DR drill artifact exists but is insufficient for auditability (scenario=legacy-unclassified, backupArtifact=legacy-untracked, RTO=60m, RPO=15m).
