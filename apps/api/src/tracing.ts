import { context, trace } from "@opentelemetry/api";

const forceSampledTenants = new Set<string>();

export function annotateTenantSpan(input: {
  tenantId?: string | null;
  tenantSlug?: string | null;
}): void {
  const span = trace.getSpan(context.active());

  if (!span) {
    return;
  }

  if (input.tenantId) {
    span.setAttribute("tenant.id", input.tenantId);
    span.setAttribute("tenant.force_sampled", forceSampledTenants.has(input.tenantId));
  }

  if (input.tenantSlug) {
    span.setAttribute("tenant.slug", input.tenantSlug);
  }
}

export function flagTenantForFullSampling(tenantId: string): void {
  forceSampledTenants.add(tenantId);
}

export function shouldForceTenantSampling(tenantId?: string | null): boolean {
  return Boolean(tenantId && forceSampledTenants.has(tenantId));
}
