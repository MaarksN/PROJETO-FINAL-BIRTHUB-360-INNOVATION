import { prisma } from "../client.js";
const rolePriority = {
    ADMIN: 3,
    MEMBER: 2,
    OWNER: 4,
    READONLY: 1,
    SUPER_ADMIN: 5
};
export function hasRequiredRole(currentRole, requiredRole) {
    return rolePriority[currentRole] >= rolePriority[requiredRole];
}
export async function findMembershipForTenant(organizationId, userId) {
    return prisma.membership.findUnique({
        where: {
            organizationId_userId: {
                organizationId,
                userId
            }
        }
    });
}
export async function requireMembershipForTenant(organizationId, userId) {
    const membership = await findMembershipForTenant(organizationId, userId);
    if (!membership) {
        throw new Error("MEMBERSHIP_NOT_FOUND");
    }
    return membership;
}
export function buildTenantMembershipFilter(organizationId, userId) {
    return {
        memberships: {
            some: {
                organizationId,
                userId
            }
        }
    };
}
