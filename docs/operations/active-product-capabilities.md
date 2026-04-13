# Active Product Capabilities

Status date: 2026-04-13

## Objective

Provide a single operational reference for which product capabilities are actively supported in runtime and which preserved domains remain disabled by default.

## Canonical runtime sources

- Capability flags: `packages/config/src/product-capabilities.ts`
- API gating:
- `apps/api/src/modules/dashboard/router.ts`
- `apps/api/src/modules/privacy/router.ts`
- `apps/api/src/modules/clinical/router.ts`
- `apps/api/src/modules/fhir/router.ts`
- Web gating:
- `apps/web/lib/product-capabilities.ts`
- `apps/web/lib/bff-policy.ts`
- `apps/web/app/(dashboard)/settings/privacy/page.tsx`
- `apps/web/app/(dashboard)/patients/page.tsx`
- `apps/web/app/(dashboard)/patients/[id]/page.tsx`
- `apps/web/app/(dashboard)/patients/[id]/appointments/page.tsx`
- `apps/web/app/(dashboard)/appointments/page.tsx`

## Default capability flags

- `BIRTHUB_ENABLE_CLINICAL_WORKSPACE=false`
- `BIRTHUB_ENABLE_FHIR_FACADE=false`
- `BIRTHUB_ENABLE_PRIVACY_ADVANCED=false`
- `BIRTHUB_ENABLE_PRIVACY_SELF_SERVICE=true`
- `NEXT_PUBLIC_ENABLE_CLINICAL_WORKSPACE=false`
- `NEXT_PUBLIC_ENABLE_FHIR_FACADE=false`
- `NEXT_PUBLIC_ENABLE_PRIVACY_ADVANCED=false`
- `NEXT_PUBLIC_ENABLE_PRIVACY_SELF_SERVICE=true`

## Active and supported now

- Operational dashboard, workflows, billing, analytics, notifications and Sales OS
- Self-service privacy:
- `GET /api/v1/privacy/export`
- `POST /api/v1/privacy/delete-account`
- Web privacy page in self-service mode
- Cookie consent and legal/privacy navigation

## Preserved but disabled by default

- Clinical workspace UI and API
- FHIR facade
- Advanced privacy consent management
- Retention policy management
- Manual or automated advanced retention execution
- Clinical dashboard summary

## Operational rules

1. Do not treat preserved domains as part of the default product path unless the corresponding flags are explicitly re-enabled.
2. Do not add new primary navigation, BFF allowlist entries, main dashboard fetches, smoke tests, or runbooks that assume clinical, FHIR, or advanced privacy by default.
3. If a preserved domain is reintroduced, schema support, runtime delegates, navigation, tests, and documentation must be restored together in the same lane.
4. Historical cycle reports, evidence, and audit artifacts may describe older states and must not override this document for current operational decisions.

## Related references

- `docs/service-catalog.md`
- `docs/LGPD_OPERACIONAL.md`
- `docs/tenant-deletion-policy.md`
- `audit/cycle7_domain_alignment_disablement.md`
