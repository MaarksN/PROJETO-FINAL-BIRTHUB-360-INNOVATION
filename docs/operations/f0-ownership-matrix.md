# F0 Ownership Matrix

| Domain | Responsible | Escalation | Notes |
| --- | --- | --- | --- |
| Web | Team Web | manager | |
| API | Team API | manager | |
| Worker | Team Backend | manager | |
| Database | Team DBA | manager | |
| Agents | Team AI | manager | |
| Security | Team Sec | manager | |
| DevOps | Team Ops | manager | |

[Wiki Permalink](https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION/wiki/Ownership-Matrix)

## Versionamento
Current Version: 1.0.0

| Segredo/configuracao critica | Owner primario | Backup | Rotacao minima |
| --- | --- | --- | --- |
| `DATABASE_URL` | `@platform-data` | `@platform-security` | 90 dias ou incidente |
| `REDIS_URL` | `@platform-worker` | `@platform-api` | 90 dias ou incidente |
| `SESSION_SECRET` | `@platform-security` | `@platform-api` | 60 dias ou incidente |
| `AUTH_MFA_ENCRYPTION_KEY` | `@platform-security` | `@platform-api` | 60 dias ou incidente |
| `JOB_HMAC_GLOBAL_SECRET` | `@platform-security` | `@platform-worker` | 60 dias ou incidente |
| `STRIPE_SECRET_KEY` | `@platform-api` | `@platform-security` | 90 dias ou incidente |
| `STRIPE_WEBHOOK_SECRET` | `@platform-api` | `@platform-security` | 90 dias ou incidente |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `@platform-devex` | `@platform-security` | troca de infra |
| `GCP_SERVICE_ACCOUNT_EMAIL` | `@platform-devex` | `@platform-architecture` | troca de infra |
| `CLOUD_RUN_REGION` | `@platform-devex` | `@platform-architecture` | troca de infra |
| `CLOUD_RUN_API_SERVICE` | `@platform-devex` | `@platform-api` | troca de infra |
| `CLOUD_RUN_WEB_SERVICE` | `@platform-devex` | `@platform-web` | troca de infra |
| `CLOUD_RUN_WORKER_SERVICE` | `@platform-devex` | `@platform-worker` | troca de infra |
| `SENTRY_DSN` | `@platform-api` | `@platform-devex` | N/A |

Tracking Ticket: https://jira.example.com/browse/BH-100

Calendar Event: ownership-quarterly-review.ics
Next Review Date: 2026-07-01 10:00 America/Sao_Paulo
