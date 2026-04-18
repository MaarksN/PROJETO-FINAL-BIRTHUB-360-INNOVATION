// @ts-expect-error TODO: remover suppressão ampla
// 
import { Role } from "@prisma/client";
import { prisma } from "../client.js";
const ORGANIZATION_ROLE_NOTIFICATION_LIMIT = 100;
function resolveClient(options) {
    return options?.client ?? prisma;
}
function normalizeCookieConsent(value) {
    return value ?? "PENDING";
}
function buildUserPreferenceLookup(input) {
    return {
        organizationId_userId: {
            organizationId: input.organizationId,
            userId: input.userId
        }
    };
}
function buildUserPreferenceCreateData(input) {
    return {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        userId: input.userId,
        ...(input.cookieConsent !== undefined ? { cookieConsent: input.cookieConsent } : {}),
        ...(input.emailNotifications !== undefined
            ? { emailNotifications: input.emailNotifications }
            : {}),
        ...(input.inAppNotifications !== undefined
            ? { inAppNotifications: input.inAppNotifications }
            : {}),
        ...(input.locale !== undefined ? { locale: input.locale } : {}),
        ...(input.lgpdConsentedAt !== undefined ? { lgpdConsentedAt: input.lgpdConsentedAt } : {}),
        ...(input.lgpdConsentStatus !== undefined
            ? { lgpdConsentStatus: input.lgpdConsentStatus }
            : {}),
        ...(input.lgpdConsentVersion !== undefined
            ? { lgpdConsentVersion: input.lgpdConsentVersion }
            : {}),
        ...(input.lgpdLegalBasis !== undefined ? { lgpdLegalBasis: input.lgpdLegalBasis } : {}),
        ...(input.marketingEmails !== undefined ? { marketingEmails: input.marketingEmails } : {}),
        ...(input.pushNotifications !== undefined ? { pushNotifications: input.pushNotifications } : {})
    };
}
function buildUserPreferenceUpdateData(input) {
    return {
        ...(input.cookieConsent !== undefined ? { cookieConsent: input.cookieConsent } : {}),
        ...(input.emailNotifications !== undefined
            ? { emailNotifications: input.emailNotifications }
            : {}),
        ...(input.inAppNotifications !== undefined
            ? { inAppNotifications: input.inAppNotifications }
            : {}),
        ...(input.locale !== undefined ? { locale: input.locale } : {}),
        ...(input.lgpdConsentedAt !== undefined ? { lgpdConsentedAt: input.lgpdConsentedAt } : {}),
        ...(input.lgpdConsentStatus !== undefined
            ? { lgpdConsentStatus: input.lgpdConsentStatus }
            : {}),
        ...(input.lgpdConsentVersion !== undefined
            ? { lgpdConsentVersion: input.lgpdConsentVersion }
            : {}),
        ...(input.lgpdLegalBasis !== undefined ? { lgpdLegalBasis: input.lgpdLegalBasis } : {}),
        ...(input.marketingEmails !== undefined ? { marketingEmails: input.marketingEmails } : {}),
        ...(input.pushNotifications !== undefined ? { pushNotifications: input.pushNotifications } : {})
    };
}
function shouldAuditCookieConsentChange(input, previousPreference, updatedPreference) {
    if (input.cookieConsent === undefined) {
        return false;
    }
    const previousCookieConsent = normalizeCookieConsent(previousPreference?.cookieConsent);
    return previousCookieConsent !== updatedPreference.cookieConsent;
}
function buildCookieConsentAuditLogDataFromPrevious(input, previousPreference, updatedPreference) {
    return {
        action: "user.cookie_consent_updated",
        actorId: input.userId,
        diff: {
            after: {
                cookieConsent: updatedPreference.cookieConsent
            },
            before: {
                cookieConsent: normalizeCookieConsent(previousPreference?.cookieConsent)
            }
        },
        entityId: updatedPreference.id,
        entityType: "user_preference",
        tenantId: input.tenantId
    };
}
function buildNotificationCreateData(input) {
    const notificationData = {
        content: input.content,
        link: input.link ?? null,
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        type: input.type,
        userId: input.userId
    };
    if (input.metadata !== undefined) {
        notificationData.metadata = input.metadata;
    }
    return notificationData;
}
function selectUsersWithEnabledInAppNotifications(memberships, organizationId) {
    return memberships
        .filter((membership) => {
        const preference = membership.user.preferences.find((candidate) => candidate.organizationId === organizationId);
        return preference?.inAppNotifications ?? true;
    })
        .map((membership) => membership.userId);
}
function buildBulkNotificationCreateData(input, userIds) {
    return userIds.map((userId) => {
        const notificationData = {
            content: input.content,
            link: input.link ?? null,
            organizationId: input.organizationId,
            tenantId: input.tenantId,
            type: input.type,
            userId
        };
        if (input.metadata !== undefined) {
            notificationData.metadata = input.metadata;
        }
        return notificationData;
    });
}
function resolveNotificationListLimit(limit) {
    return Math.min(Math.max(limit ?? 10, 1), 50);
}
function buildNotificationReadUpdateData() {
    return {
        isRead: true,
        readAt: new Date()
    };
}
export async function ensureUserPreference(input, options) {
    const client = resolveClient(options);
    return client.userPreference.upsert({
        create: {
            organizationId: input.organizationId,
            tenantId: input.tenantId,
            userId: input.userId
        },
        update: {},
        where: buildUserPreferenceLookup(input)
    });
}
export async function updateUserPreference(input, options) {
    const client = resolveClient(options);
    const previousPreference = input.cookieConsent !== undefined
        ? await client.userPreference.findUnique({
            where: {
                ...buildUserPreferenceLookup(input)
            }
        })
        : null;
    const updatedPreference = await client.userPreference.upsert({
        create: buildUserPreferenceCreateData(input),
        update: buildUserPreferenceUpdateData(input),
        where: buildUserPreferenceLookup(input)
    });
    if (shouldAuditCookieConsentChange(input, previousPreference, updatedPreference)) {
        await client.auditLog.create({
            data: buildCookieConsentAuditLogDataFromPrevious(input, previousPreference, updatedPreference)
        });
    }
    return updatedPreference;
}
export async function createNotificationForUser(input, options) {
    const client = resolveClient(options);
    const preference = await ensureUserPreference({
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        userId: input.userId
    }, options);
    if (!preference.inAppNotifications) {
        return null;
    }
    return client.notification.create({
        data: buildNotificationCreateData(input)
    });
}
export async function createNotificationForOrganizationRoles(input, options) {
    const client = resolveClient(options);
    const roles = input.roles ?? [Role.OWNER, Role.ADMIN];
    const memberships = await client.membership.findMany({
        include: {
            user: {
                select: {
                    preferences: {
                        select: {
                            inAppNotifications: true,
                            organizationId: true
                        }
                    }
                }
            }
        },
        take: ORGANIZATION_ROLE_NOTIFICATION_LIMIT,
        where: {
            organizationId: input.organizationId,
            role: {
                in: roles
            },
            tenantId: input.tenantId
        }
    });
    const targetUserIds = selectUsersWithEnabledInAppNotifications(memberships, input.organizationId);
    if (targetUserIds.length === 0) {
        return { count: 0 };
    }
    const result = await client.notification.createMany({
        data: buildBulkNotificationCreateData(input, targetUserIds)
    });
    return {
        count: result.count
    };
}
export async function listNotifications(input, options) {
    const client = resolveClient(options);
    const limit = resolveNotificationListLimit(input.limit);
    const notifications = await client.notification.findMany({
        orderBy: [
            {
                createdAt: "desc"
            },
            {
                id: "desc"
            }
        ],
        skip: input.cursor ? 1 : 0,
        take: limit + 1,
        where: {
            tenantId: input.tenantId,
            userId: input.userId
        },
        ...(input.cursor
            ? {
                cursor: {
                    id: input.cursor
                }
            }
            : {})
    });
    const unreadCount = await client.notification.count({
        where: {
            isRead: false,
            tenantId: input.tenantId,
            userId: input.userId
        }
    });
    return {
        items: notifications.slice(0, limit),
        nextCursor: notifications.length > limit ? notifications[limit - 1]?.id ?? null : null,
        unreadCount
    };
}
export async function markNotificationAsRead(input, options) {
    const client = resolveClient(options);
    const updated = await client.notification.updateMany({
        data: buildNotificationReadUpdateData(),
        where: {
            id: input.id,
            tenantId: input.tenantId,
            userId: input.userId
        }
    });
    return {
        updated: updated.count
    };
}
export async function markAllNotificationsAsRead(input, options) {
    const client = resolveClient(options);
    return client.notification.updateMany({
        data: buildNotificationReadUpdateData(),
        where: {
            isRead: false,
            tenantId: input.tenantId,
            userId: input.userId
        }
    });
}
