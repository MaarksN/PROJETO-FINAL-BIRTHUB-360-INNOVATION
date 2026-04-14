import type { Organization } from "@birthub/database";

import { deleteCacheKeys, readCacheValue, writeCacheValue } from "./cache-store.js";

const TENANT_CACHE_TTL_SECONDS = 5 * 60;

export interface CachedTenant {
  id: string;
  slug: string | null;
  tenantId: string;
}

function normalizeReference(reference: string): string {
  return reference.trim().toLowerCase();
}

function buildTenantCacheKey(reference: string): string {
  return `tenant:${normalizeReference(reference)}`;
}

function buildCacheKeysFromTenant(tenant: CachedTenant): string[] {
  return [tenant.id, tenant.slug, tenant.tenantId]
    .filter((value): value is string => Boolean(value))
    .map((value) => buildTenantCacheKey(value));
}

export async function invalidateTenantCache(references: Array<string | null | undefined>): Promise<void> {
  const keys = Array.from(
    new Set(
      references
        .filter((reference): reference is string => Boolean(reference?.trim()))
        .map((reference) => buildTenantCacheKey(reference))
    )
  );

  await deleteCacheKeys(keys);
}
