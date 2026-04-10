# Disaster Recovery Report

- generatedAt: 2026-04-10T13:28:52.718Z
- overall_status: fail

## Checks

| Check | Status | Artifact | Detail |
| --- | --- | --- | --- |
| backup health | fail | `artifacts/backups/backup-health.json` | Backup directory is missing: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\artifacts\backups. |
| rollback evidence | pass | `artifacts/release/production-rollback-evidence.json` | Rollback rehearsal evidence recorded for production at 2026-03-24T14:37:26.498Z |
| disaster recovery drill | fail | `artifacts/backups/drill-rto-rpo.json` | Missing or insufficient artifacts/backups/drill-rto-rpo.json. |

## Blockers

- Backup directory is missing: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\artifacts\backups.
- Missing or insufficient artifacts/backups/drill-rto-rpo.json.
