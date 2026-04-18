import { prisma } from "../client.js";
const USER_REPOSITORY_LIST_LIMIT = 100;
export async function listUsersByTenant(organizationId, filters = {}) {
    const where = {
        ...(filters.status ? { status: filters.status } : {}),
        memberships: {
            some: {
                organizationId,
                ...(filters.role ? { role: filters.role } : {})
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
        take: USER_REPOSITORY_LIST_LIMIT,
        where
    });
}
export async function updateMembershipRole(organizationId, userId, role) {
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
