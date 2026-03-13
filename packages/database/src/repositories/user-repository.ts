import { MembershipStatus, Role, type Prisma } from "@prisma/client";

import { prisma } from "../client.js";

export interface TenantUserFilters {
  role?: Role;
  search?: string;
  status?: MembershipStatus;
}

export async function listUsersByTenant(
  organizationId: string,
  filters: TenantUserFilters = {}
) {
  const where: Prisma.UserWhereInput = {
    memberships: {
      some: {
        organizationId,
        ...(filters.role ? { role: filters.role } : {}),
        ...(filters.status ? { status: filters.status } : {})
      }
    }
  };

  if (filters.search) {
    where.OR = [
      {
        email: {
          contains: filters.search,
          mode: "insensitive"
        }
      },
      {
        name: {
          contains: filters.search,
          mode: "insensitive"
        }
      }
    ];
  }

  return prisma.user.findMany({
    include: {
      memberships: {
        where: {
          organizationId
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    where
  });
}

export async function updateMembershipRole(
  organizationId: string,
  userId: string,
  role: Role
) {
  return prisma.membership.update({
    data: {
      role
    },
    where: {
      organizationId_userId: {
        organizationId,
        userId
      }
    }
  });
}
