# Cycle 4 - Web Auth Review

Date: 2026-04-11

## Baseline note

The prompt requested these exact files:

- `audit/source_of_truth.md`
- `audit/master_backlog_revalidated.md`
- `audit/readiness_matrix.md`
- `audit/reconciliation_report.md`
- `audit/phase1_execution_summary.md`
- `audit/cycle2_execution_summary.md`
- `audit/cycle3_execution_summary.md`

They do not exist in this repository with those names. This review used the closest canonical artifacts that do exist:

- `audit/README.md`
- `audit/target_architecture.md`
- `audit/validation_log.md`
- `audit/auditor-prime-latest.backlog.md`

This mismatch is itself a governance/documentation gap.

## What was hardened

1. Server-side auth guards were added to the web shell and privileged areas.
   - `apps/web/app/(dashboard)/layout.tsx`
   - `apps/web/app/admin/layout.tsx`
   - `apps/web/app/admin/dashboard/layout.tsx`
   - `apps/web/app/(dashboard)/settings/users/layout.tsx`
   - `apps/web/app/(dashboard)/settings/team/layout.tsx`
   - `apps/web/app/(dashboard)/settings/members/layout.tsx`

2. Session resolution was centralized in `apps/web/lib/web-session.ts`.
   - `/api/v1/me` is now treated as the server-side source for `tenantId`, `organizationId`, `userId` and `role`.
   - Minimum role checks now redirect before rendering privileged UI.

3. Browser auth stopped relying on bearer tokens in `localStorage`.
   - `apps/web/lib/auth-client.ts` now uses a cookie-first session model.
   - Frontend requests propagate `x-csrf-token` and `x-active-tenant`.
   - Legacy `bh_access_token` and `bh_refresh_token` are cleared instead of reused.

4. Login now goes through same-origin auth proxying.
   - `apps/web/components/login-form.tsx` posts to `/api/auth/signin`.
   - Successful login persists only tenant/user browser context, not raw access tokens.

5. Session management UX was connected to real backend routes.
   - `apps/api/src/app/auth-routes.ts` now exposes:
     - `DELETE /api/v1/sessions/:sessionId`
     - `POST /api/v1/sessions/logout-all`
   - `apps/web/app/(dashboard)/settings/security/page.tsx` now uses the same-origin BFF routes.

6. The profile contract was expanded for real authorization.
   - `apps/api/src/app/core-business-routes.ts` now returns `organizationId` and `role` from `/api/v1/me`.

## Critical auth gaps fixed in Cycle 4

- Dashboard pages could render without a server-side authenticated session check.
- `/admin` and super-admin flows relied too much on client-side access assumptions.
- The browser stored bearer credentials in `localStorage`, increasing exfiltration risk.
- Session list UX had action buttons for backend routes that did not exist.
- Multiple critical pages were calling the public API directly without a hardened same-origin proxy path.
- Route/session state and permission state were not strongly joined by a canonical server-side profile object.

## Remaining auth gaps

1. MFA is not operationally complete in the web UI.
   - `apps/web/components/login-form.tsx` shows a message when `mfaRequired=true`, but it does not continue the challenge flow.

2. Role-based UX is still partially visual/client-side after the server guard.
   - Example: `apps/web/app/(dashboard)/settings/team/page.tsx` computes affordances from loaded member data rather than a canonical SSR authorization model.

3. The BFF still forwards `authorization` when present.
   - This is correct for server-to-server compatibility, but it means old callers can still try to push bearer headers through the proxy.

4. There is no end-to-end browser test covering:
   - login
   - MFA branch
   - role downgrade/forbidden redirect
   - session revocation followed by forced re-authentication

## Validation evidence

- `pnpm --filter @birthub/web typecheck` -> PASS
- `pnpm --filter @birthub/web build` -> PASS
- `pnpm --filter @birthub/web test` -> PASS (41/41)
- `pnpm --filter @birthub/web lint` -> FAIL due broad pre-existing lint debt, mainly `@ts-nocheck`
- `pnpm --filter @birthub/api typecheck` -> PASS
- `pnpm --filter @birthub/api test:auth` -> FAIL before test logic runs because `@birthub/database` does not export `SessionAccessMode` in the current environment

## Auth verdict

Cycle 4 materially improved the auth boundary. The web is no longer pretending that client renderability equals authorization. The remaining weak point is not the new guard model; it is the amount of legacy UI still outside that hardened path, especially MFA completion, residual `@ts-nocheck`, and missing end-to-end auth regression coverage.
