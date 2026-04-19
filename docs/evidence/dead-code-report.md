# Dead Code Report

- Generated at: 2026-04-19T03:09:51.590Z
- Baseline: `artifacts\quality\knip-baseline.json`
- Raw report: `artifacts\quality\dead-code\knip-report.raw.json`
- Normalized report: `artifacts\quality\dead-code\knip-report.json`

| category | baseline | current | regressions | improvements |
| --- | ---: | ---: | ---: | ---: |
| files | 0 | 4 | 4 | 0 |
| dependencies | 0 | 0 | 0 | 0 |
| dev dependencies | 0 | 0 | 0 | 0 |
| optional peer dependencies | 0 | 0 | 0 | 0 |
| unlisted | 0 | 0 | 0 | 0 |
| binaries | 0 | 0 | 0 | 0 |
| exports | 0 | 37 | 37 | 0 |
| duplicates | 0 | 0 | 0 | 0 |

## Regressions

- files: `apps/web/components/sales-os/GeographicMap.tsx`
- files: `apps/web/components/sales-os/SdrAutomaticPlatform.tsx`
- files: `apps/web/components/sales-os/SdrLeadScoreWorkspace.helpers.tsx`
- files: `apps/worker/src/queues/agentQueue.ts`
- exports: `apps/api/src/app/pipeline.ts::mainApiPipeline`
- exports: `apps/api/src/app/pipeline.ts::mainInfrastructurePostWebhookPipeline`
- exports: `apps/api/src/app/pipeline.ts::mainInfrastructurePreWebhookPipeline`
- exports: `apps/api/src/app/pipeline.ts::routeScopedApiPipeline`
- exports: `apps/api/src/app/pipeline.ts::webhookApiPipeline`
- exports: `apps/api/src/modules/agents/queue.ts::QueueBackpressureError`
- exports: `apps/api/src/modules/agents/queue.ts::TenantQueueRateLimitError`
- exports: `apps/api/src/modules/auth/router.ts::AUTH_ROUTER_BASE_PATH`
- exports: `apps/api/src/modules/auth/router.ts::registerAuthRouterRoutes`
- exports: `apps/api/src/modules/clinical/service-runtime.records.ts::listNeonatalRecords`
- exports: `apps/api/src/modules/clinical/service-runtime.records.ts::listPregnancyRecords`
- exports: `apps/api/src/modules/clinical/service-support.ts::FETAL_WEIGHT_REFERENCE_POINTS`
- exports: `apps/api/src/modules/clinical/service-support.view.ts::createClinicalAlert`
- exports: `apps/api/src/modules/clinical/service-support.view.ts::deriveAppointmentAlerts`
- exports: `apps/api/src/modules/clinical/service-support.view.ts::deriveDueDateAlerts`
- exports: `apps/api/src/modules/clinical/service-support.view.ts::deriveMissingClinicalCoverageAlerts`
- exports: `apps/api/src/modules/clinical/service-support.view.ts::deriveRiskAlerts`
- exports: `apps/api/src/modules/connectors/schemas.ts::credentialSchema`
- exports: `apps/api/src/modules/invites/service.ts::cleanupExpiredInvites`
- exports: `apps/api/src/modules/profile/router.ts::registerProfileRoutes`
- exports: `apps/api/src/modules/tasks/router.ts::registerTaskRoutes`
- exports: `apps/web/lib/executive-premium.ts::EXECUTIVE_PREMIUM_PACK_IDS`
- exports: `apps/web/lib/product-capabilities.ts::isClinicalWorkspacePath`
- exports: `apps/web/lib/web-session.ts::getAuthenticatedWebSession`
- exports: `apps/web/lib/web-session.ts::hasMinimumRole`
- exports: `apps/web/lib/workflows.ts::getWorkflowById`
- exports: `apps/worker/src/agents/runtime.catalog.ts::recommendRuntimeManifestAgents`
- exports: `apps/worker/src/agents/runtime.catalog.ts::searchRuntimeManifestCatalog`
- exports: `apps/worker/src/agents/runtime.ingress.ts::emitCriticalTicketEvent`
- exports: `apps/worker/src/agents/runtime.ingress.ts::emitOperationalIncidentEvent`
- exports: `apps/worker/src/agents/runtime.ingress.ts::emitRenewalRiskEvent`
- exports: `apps/worker/src/agents/runtime.resolution.ts::resolveRuntimeAgent`
- exports: `apps/worker/src/engine/runner.ts::workflowQueueNames`
- exports: `apps/worker/src/notifications/emailQueue.ts::emailQueueName`
- exports: `apps/worker/src/webhooks/outbound.ts::outboundWebhookQueueName`
- exports: `packages/agents-core/src/runtime/manifestRuntimeCore.ts::readString`
- exports: `packages/agents-core/src/runtime/manifestRuntimeCore.ts::toolIsSensitive`

## Improvements

- none
