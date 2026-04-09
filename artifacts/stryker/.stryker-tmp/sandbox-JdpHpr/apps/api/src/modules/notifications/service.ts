// @ts-nocheck
// 
import {
  ConsentPurpose,
  ConsentSource,
  ConsentStatus,
  ensureUserPreference,
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  prisma,
  updateUserPreference
} from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { savePrivacyConsentDecisions } from "../privacy/consent.service.js";

async function resolveOrganization(tenantReference: string) {
  const organization = await prisma.organization.findFirst({
    where: {
      OR: [{ id: tenantReference }, { slug: tenantReference }, { tenantId: tenantReference }]
    }
  });

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for the active tenant context.",
      status: 404,
      title: "Not Found"
    });
  }

  return organization;
}

export async function getNotificationFeed(input: {
  cursor?: string;
  limit?: number;
  tenantReference: string;
  userId: string;
}) {
  const organization = await resolveOrganization(input.tenantReference);
  await ensureUserPreference({
    organizationId: organization.id,
    tenantId: organization.tenantId,
    userId: input.userId
  });

  return listNotifications({
    tenantId: organization.tenantId,
    userId: input.userId,
    ...(input.cursor !== undefined ? { cursor: input.cursor } : {}),
    ...(input.limit !== undefined ? { limit: input.limit } : {})
  });
}

export async function markNotificationReadForUser(input: {
  notificationId: string;
  tenantReference: string;
  userId: string;
}) {
  const organization = await resolveOrganization(input.tenantReference);
  return markNotificationAsRead({
    id: input.notificationId,
    tenantId: organization.tenantId,
    userId: input.userId
  });
}

export async function markAllNotificationsReadForUser(input: {
  tenantReference: string;
  userId: string;
}) {
  const organization = await resolveOrganization(input.tenantReference);
  return markAllNotificationsAsRead({
    tenantId: organization.tenantId,
    userId: input.userId
  });
}

export async function getNotificationPreferences(input: {
  tenantReference: string;
  userId: string;
}) {
  const organization = await resolveOrganization(input.tenantReference);
  return ensureUserPreference({
    organizationId: organization.id,
    tenantId: organization.tenantId,
    userId: input.userId
  });
}

export async function saveNotificationPreferences(input: {
  cookieConsent?: "ACCEPTED" | "PENDING" | "REJECTED";
  emailNotifications?: boolean;
  inAppNotifications?: boolean;
  marketingEmails?: boolean;
  pushNotifications?: boolean;
  tenantReference: string;
  userId: string;
}) {
  const organization = await resolveOrganization(input.tenantReference);
  const preferences = await updateUserPreference({
    organizationId: organization.id,
    tenantId: organization.tenantId,
    userId: input.userId,
    ...(input.cookieConsent !== undefined ? { cookieConsent: input.cookieConsent } : {}),
    ...(input.emailNotifications !== undefined ? { emailNotifications: input.emailNotifications } : {}),
    ...(input.inAppNotifications !== undefined ? { inAppNotifications: input.inAppNotifications } : {}),
    ...(input.marketingEmails !== undefined ? { marketingEmails: input.marketingEmails } : {}),
    ...(input.pushNotifications !== undefined ? { pushNotifications: input.pushNotifications } : {})
  });

  const decisions = [];

  if (input.cookieConsent !== undefined) {
    decisions.push({
      purpose: ConsentPurpose.ANALYTICS,
      source: ConsentSource.SETTINGS,
      status:
        input.cookieConsent === "ACCEPTED"
          ? ConsentStatus.GRANTED
          : input.cookieConsent === "REJECTED"
            ? ConsentStatus.REVOKED
            : ConsentStatus.PENDING
    });
  }

  if (input.marketingEmails !== undefined) {
    decisions.push({
      purpose: ConsentPurpose.MARKETING,
      source: ConsentSource.SETTINGS,
      status: input.marketingEmails ? ConsentStatus.GRANTED : ConsentStatus.REVOKED
    });
  }

  if (decisions.length > 0) {
    await savePrivacyConsentDecisions({
      decisions,
      organizationReference: organization.id,
      userId: input.userId
    });
  }

  return preferences;
}
