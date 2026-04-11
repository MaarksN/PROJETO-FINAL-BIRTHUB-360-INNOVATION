# Dead Code Report

- Generated at: 2026-04-11T16:44:36.364Z
- Baseline: `artifacts\quality\knip-baseline.json`
- Raw report: `artifacts\quality\dead-code\knip-report.raw.json`
- Normalized report: `artifacts\quality\dead-code\knip-report.json`

| category | baseline | current | regressions | improvements |
| --- | ---: | ---: | ---: | ---: |
| files | 0 | 1 | 1 | 0 |
| dependencies | 0 | 2 | 2 | 0 |
| dev dependencies | 0 | 0 | 0 | 0 |
| optional peer dependencies | 0 | 0 | 0 | 0 |
| unlisted | 0 | 5 | 5 | 0 |
| binaries | 0 | 0 | 0 | 0 |
| exports | 0 | 13 | 13 | 0 |
| duplicates | 0 | 0 | 0 | 0 |

## Regressions

- files: `apps/web/lib/web-session.ts`
- dependencies: `packages/agents-core/package.json::@birthub/logger`
- dependencies: `packages/database/package.json::zod`
- unlisted: `packages/emails/templates/critical-error.tsx::react`
- unlisted: `packages/emails/templates/org-invite.tsx::react`
- unlisted: `packages/emails/templates/workflow-finished.tsx::react`
- unlisted: `packages/logger/src/otel.ts::@opentelemetry/api`
- unlisted: `stryker.config.mjs::@stryker-mutator/api`
- exports: `apps/api/src/modules/analytics/dashboard.service.ts::getMasterAdminDashboard`
- exports: `apps/api/src/modules/analytics/dashboard.service.ts::getOperationsDashboard`
- exports: `apps/api/src/modules/connectors/schemas.ts::credentialSchema`
- exports: `apps/api/src/modules/notifications/service.ts::getNotificationFeed`
- exports: `apps/api/src/modules/notifications/service.ts::getNotificationPreferences`
- exports: `apps/api/src/modules/notifications/service.ts::markAllNotificationsReadForUser`
- exports: `apps/api/src/modules/notifications/service.ts::markNotificationReadForUser`
- exports: `apps/api/src/modules/notifications/service.ts::saveNotificationPreferences`
- exports: `apps/web/lib/auth-client.ts::clearStoredSession`
- exports: `apps/web/lib/auth-client.ts::persistStoredSession`
- exports: `apps/web/lib/product-api.server.ts::ProductApiError`
- exports: `apps/worker/src/agents/runtime.shared.ts::readNumbers`
- exports: `apps/worker/src/agents/runtime.shared.ts::readStrings`

## Improvements

- none
