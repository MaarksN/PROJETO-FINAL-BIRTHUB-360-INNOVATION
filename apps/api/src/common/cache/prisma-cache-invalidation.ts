import { type Prisma, prisma } from "@birthub/database";

import { invalidateTenantCache } from "./tenant-cache.js";

const MUTATION_ACTIONS = new Set(["update", "delete"]);

let middlewareRegistered = false;

type CachedOrganization = {
  id: string;
  slug: string | null;
  tenantId: string;
};

function collectTenantReferences(values: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value?.trim())).map((value) => value.trim()))
  );
}

function organizationToReferences(organization: CachedOrganization): string[] {
  return collectTenantReferences([organization.id, organization.slug, organization.tenantId]);
}

async function resolveOrganizationsFromWhere(where: unknown): Promise<CachedOrganization[]> {
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      slug: true,
      tenantId: true
    },
    where: where as Prisma.OrganizationWhereInput
  });

  return organizations.map((organization) => ({
    id: organization.id,
    slug: organization.slug ?? null,
    tenantId: organization.tenantId
  }));
}

async function resolveTenantIdsForUsers(where: unknown): Promise<string[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true
    },
    where: where as Prisma.UserWhereInput
  });

  if (users.length === 0) {
    return [];
  }

  const memberships = await prisma.membership.findMany({
    select: {
      tenantId: true
    },
    where: {
      userId: {
        in: users.map((user) => user.id)
      }
    }
  });

  return collectTenantReferences(memberships.map((membership) => membership.tenantId));
}

export function registerTenantCacheInvalidationMiddleware(): void {
  if (middlewareRegistered) {
    return;
  }

  middlewareRegistered = true;

  prisma.$use(async (params, next) => {
    if (!params.model || !MUTATION_ACTIONS.has(params.action)) {
      return next(params);
    }

    let referencesBeforeMutation: string[] = [];

    if (params.model === "Organization") {
      const organizations = await resolveOrganizationsFromWhere(params.args?.where);
      referencesBeforeMutation = organizations.flatMap(organizationToReferences);
    }

    if (params.model === "User") {
      referencesBeforeMutation = await resolveTenantIdsForUsers(params.args?.where);
    }

    const result = await next(params);

    const referencesAfterMutation: string[] = [];

    if (params.model === "Organization" && result && typeof result === "object") {
      const organization = result as {
        id?: string;
        slug?: string | null;
        tenantId?: string;
      };

      referencesAfterMutation.push(
        ...collectTenantReferences([organization.id, organization.slug ?? null, organization.tenantId])
      );
    }

    const referencesToInvalidate = collectTenantReferences([
      ...referencesBeforeMutation,
      ...referencesAfterMutation
    ]);

    if (referencesToInvalidate.length > 0) {
      await invalidateTenantCache(referencesToInvalidate);
    }

    return result;
  });
}
