# Cycle 4 - Operational UX Review

Date: 2026-04-11

## Rating scale

- Critical: failure or ambiguity can cause security, support or data-isolation damage
- High: core operator flow works but still has trust or recovery gaps
- Medium: usable, but incomplete for production-grade supportability

## Reviewed flows

| Flow | Operational criticality | Current state | Main remaining gaps |
| --- | --- | --- | --- |
| Login and session bootstrap | Critical | Functional through same-origin auth proxy; clear error path; request id propagated | MFA branch is not complete UX. It only reports that MFA is required. |
| Dashboard shell entry | Critical | SSR auth guard now blocks unauthenticated dashboard rendering | Forbidden-role UX is still redirect-based, with limited operator feedback. |
| Security sessions | Critical | Real session list, revoke and logout-all now hit live backend routes | No per-action loading state, no disable while pending, no confirmation for global logout, no rollback messaging on action failure. |
| Users admin | High | Filtering, suspend and delete are functionally wired through BFF | Missing explicit loading state, empty state, retry CTA and success feedback. |
| Team role management | High | Role updates are functionally wired through BFF | Affordances still depend on client-loaded role context; no row-level pending/error feedback. |
| Admin impersonation | Critical | Server-protected and functionally switches tenant context | No explicit audit receipt, no reversible "return to original tenant" UX, no confirmation step before privileged switch. |
| Privacy settings | High | Consent, retention, export and delete-account flows are functionally backed by session-aware client calls | Destructive/regulated operations still need stronger progress, confirmation and evidence feedback. |
| Notifications/preferences | Medium | Stores now behave safely with anonymous and authenticated states | Surrounding UI remains partially legacy and typing debt remains high. |
| Workflow inventory | High | Inventory helper restored and tested | Workflow editor still uses direct API-base flows and has not been brought under the same hardened transport policy. |

## UX findings by severity

### Critical

1. MFA is not finishable from the login UI.
2. Impersonation lacks an operator-grade confirmation and "return" path.
3. Session termination UX does not protect the operator from duplicate clicks or partial failures.

### High

1. Settings screens are now functional, but still thin on progress, success and retry states.
2. Users/team admin pages are operationally useful, but they feel like control panels rather than robust admin workflows.
3. Some privileged pages still rely on local page logic for affordance control after server guard has admitted the user.

### Medium

1. Empty states are inconsistent across operational pages.
2. Action-level telemetry/feedback is still sparse in the UI.
3. Legacy typedness debt makes UX regressions harder to trust even when the screen renders.

## UX verdict

Cycle 4 improved operational truthfulness more than appearance, which was the correct priority. The hardened flows are now closer to "real SaaS operations" than "render-only demos". The next pass should not redesign the product; it should add action-state discipline, MFA completion, impersonation return flow and stronger operator feedback around destructive or privileged actions.
