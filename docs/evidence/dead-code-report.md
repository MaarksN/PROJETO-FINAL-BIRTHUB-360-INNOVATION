# Dead Code Report

- Generated at: 2026-04-09T04:03:40.364Z
- Baseline: `artifacts\quality\knip-baseline.json`
- Raw report: `artifacts\quality\dead-code\knip-report.raw.json`
- Normalized report: `artifacts\quality\dead-code\knip-report.json`

| category | baseline | current | regressions | improvements |
| --- | ---: | ---: | ---: | ---: |
| files | 21 | 10 | 0 | 11 |
| dependencies | 0 | 0 | 0 | 0 |
| dev dependencies | 0 | 0 | 0 | 0 |
| optional peer dependencies | 0 | 0 | 0 | 0 |
| unlisted | 0 | 0 | 0 | 0 |
| binaries | 0 | 0 | 0 | 0 |
| exports | 58 | 18 | 0 | 40 |
| duplicates | 1 | 0 | 0 | 1 |

## Regressions

- none

## Improvements

- files: `apps/api/src/modules/analytics/index.ts`
- files: `apps/api/src/modules/apikeys/apikeys.service.ts`
- files: `apps/api/src/modules/apikeys/index.ts`
- files: `apps/api/src/modules/auth/index.ts`
- files: `apps/api/src/modules/outputs/output-retention.ts`
- files: `apps/api/src/services/QuotaService.ts`
- files: `apps/worker/src/agents/tools/handoffTool.ts`
- files: `apps/worker/src/metrics.ts`
- files: `packages/agents-core/src/execution/redaction.ts`
- files: `packages/agents-core/src/runtime/toolkit.ts`
- files: `packages/utils/src/app-error.ts`
- exports: `apps/api/src/common/cache/index.ts::cacheTenant`
- exports: `apps/api/src/common/cache/index.ts::getCachedTenant`
- exports: `apps/api/src/common/cache/tenant-cache.ts::cacheTenant`
- exports: `apps/api/src/common/cache/tenant-cache.ts::getCachedTenant`
- exports: `apps/api/src/common/guards/require-role.ts::requireAuthenticated`
- exports: `apps/api/src/lib/encryption.ts::decryptConnectorToken`
- exports: `apps/api/src/metrics.ts::recordBillingProcessedMetric`
- exports: `apps/api/src/metrics.ts::recordTenantJobMetric`
- exports: `apps/api/src/metrics.ts::recordWebVitalMetric`
- exports: `apps/api/src/metrics.ts::setTenantStorageMetric`
- exports: `apps/api/src/modules/agents/service.ts::InstalledAgentsService`
- exports: `apps/api/src/modules/auth/auth.service.shared.ts::findOrganizationByReference`
- exports: `apps/api/src/modules/auth/auth.service.ts::verifyApiKeyScope`
- exports: `apps/api/src/modules/billing/service.checkout.customer.ts::normalizeStripeLocale`
- exports: `apps/api/src/modules/billing/service.checkout.customer.ts::readOrganizationSetting`
- exports: `apps/api/src/modules/budget/budget.types.ts::createBudgetRecord`
- exports: `apps/api/src/modules/marketplace/marketplace-service.ts::MarketplaceService`
- exports: `apps/api/src/modules/outputs/output.service.ts::OutputService`
- exports: `apps/api/src/modules/privacy/service.ts::PRIVACY_DELETE_CONFIRMATION`
- exports: `apps/api/src/modules/workflows/schemas.ts::workflowStateSchema`
- exports: `apps/api/src/modules/workflows/service.ts::getWorkflowRevisions`
- exports: `apps/api/src/modules/workflows/service.ts::revertWorkflow`
- exports: `apps/api/src/observability/otel.ts::flagTenantForFullSampling`
- exports: `apps/api/src/observability/otel.ts::shouldForceTenantSampling`
- exports: `apps/api/src/tracing.ts::flagTenantForFullSampling`
- exports: `apps/api/src/tracing.ts::shouldForceTenantSampling`
- exports: `apps/api/src/tracing.ts::startTracing`
- exports: `apps/web/lib/auth-client.ts::SESSION_FETCH_TIMEOUT_MS`
- exports: `apps/web/lib/i18n.ts::defaultLocale`
- exports: `apps/web/lib/product-api.server.ts::ProductApiError`
- exports: `apps/worker/src/engine/runner.ts::createWorkflowExecutionQueue`
- exports: `apps/worker/src/events/internalEventBus.ts::onInternalEvent`
- exports: `apps/worker/src/jobs/auditFlush.ts::bufferAuditEvent`
- exports: `packages/database/src/repositories/engagement.ts::getUserPreference`
- exports: `scripts/agent/github-agent-collection.ts::extractMarkdownSections`
- exports: `scripts/agent/github-agent-collection.ts::normalizeWhitespace`
- exports: `scripts/agent/github-agent-collection.ts::parseFrontmatterValue`
- exports: `scripts/agent/github-agent-collection.ts::stripAgentMarkdownStem`
- exports: `scripts/ci/shared.mjs::portableCorepackHome`
- exports: `scripts/ci/shared.mjs::portablePnpmCli`
- duplicates: `apps/api/src/middleware/error-handler.ts::errorHandler|globalErrorHandler`
