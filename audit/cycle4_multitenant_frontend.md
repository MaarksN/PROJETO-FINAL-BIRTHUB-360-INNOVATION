# Cycle 4 - Multi-tenant Frontend Review

Date: 2026-04-11

## Scope reviewed

- tenant propagation in browser session helpers
- tenant propagation in SSR/server fetches
- tenant propagation in BFF proxying
- privileged pages that can cross organizational boundaries
- parity between frontend assumptions and backend tenant isolation

## Hardening applied

1. Tenant context is now explicit in the browser session helper.
   - `apps/web/lib/session-context.ts` defines:
     - `bh_active_tenant`
     - `bh360_csrf`
     - `bh_user_id`
   - `apps/web/lib/auth-client.ts` injects `x-active-tenant` from browser session context.

2. Server-side fetches now forward active tenant context.
   - `apps/web/lib/product-api.server.ts` forwards `x-active-tenant` from cookies.

3. Same-origin BFF now forwards tenant headers for critical paths.
   - `apps/web/app/api/bff/[...path]/route.ts`
   - `apps/web/app/api/auth/[...session]/route.ts`

4. Admin impersonation now updates tenant context through the shared session helper.
   - `apps/web/app/admin/dashboard/page.tsx` writes the new tenant/user context via `persistStoredSession(...)`.

5. Authorization now uses backend role + tenant data returned by `/api/v1/me`.
   - `apps/api/src/app/core-business-routes.ts`
   - `apps/web/lib/web-session.ts`

## Backend/frontend coherence

Frontend assumptions now better match the backend:

- Backend auth middleware already populates `request.context.tenantId` and `request.context.role`.
- Backend tenant middleware already validates active tenant membership.
- Frontend now consumes that context instead of inventing role/tenant state locally for SSR guards.

This is a meaningful coherence improvement.

## Multi-tenant risks fixed in Cycle 4

- Tenant switching was not consistently attached to browser requests.
- SSR/server fetches did not consistently propagate active tenant state.
- Admin impersonation could update browser-visible tenant context without a stronger shared contract.
- Several critical settings/admin pages were not routed through the hardened BFF path.

## Remaining critical multi-tenant gaps

1. BFF coverage is still incomplete.
   - Several operational pages still call `${NEXT_PUBLIC_API_URL}` directly or use public API links/forms.
   - Examples found during review:
     - `apps/web/app/(dashboard)/developers/apikeys/page.tsx`
     - `apps/web/app/(dashboard)/profile/security/page.tsx`
     - `apps/web/app/(dashboard)/workflows/[id]/edit/page.tsx`
     - billing/export and output export links in multiple pages

2. Tenant continuity still depends on a browser bridge cookie plus legacy storage cleanup.
   - This is much safer than the old bearer-token path, but it is not the same as a fully opaque, server-owned tenant switch flow.

3. Visual tenant safety is not universal.
   - Some pages still build client affordances from locally loaded lists instead of server-produced capability flags.

4. There is no e2e evidence for:
   - tenant switch
   - impersonation
   - logout/login into a second tenant
   - stale tab behavior after tenant change

## Operational recommendation

The next multi-tenant pass should focus on moving the remaining direct browser-to-API operational flows behind same-origin BFF routes and replacing page-local permission heuristics with server-derived capability models.

## Verdict

The frontend now has a credible tenant propagation path for the hardened areas. The system is not yet uniformly multi-tenant-safe because the boundary is still mixed: part SSR/BFF-enforced, part legacy direct API usage, part UI-local affordance logic.
