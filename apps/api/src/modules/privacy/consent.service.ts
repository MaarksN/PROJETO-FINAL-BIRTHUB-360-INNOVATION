import {
  ConsentPurpose,
  ConsentSource,
  ConsentStatus,
  CookieConsentStatus,
  LawfulBasis,
  prisma
} from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { findOrganizationByReference } from "./service.js";

const DEFAULT_CONSENT_PURPOSES = [
  ConsentPurpose.ANALYTICS,
  ConsentPurpose.MARKETING,
  ConsentPurpose.HEALTH_DATA_SHARING
] as const;

function mapAnalyticsConsent(status: ConsentStatus): CookieConsentStatus {
  switch (status) {
    case ConsentStatus.GRANTED:
      return CookieConsentStatus.ACCEPTED;
    case ConsentStatus.REVOKED:
      return CookieConsentStatus.REJECTED;
    default:
      return CookieConsentStatus.PENDING;
  }
}

export async function ensurePrivacyConsents(input: {
  organizationReference: string;
  userId: string;
}) {
  const organization = await findOrganizationByReference(input.organizationReference);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for privacy consent.",
      status: 404,
      title: "Not Found"
    });
  }

  await prisma.$transaction(
    DEFAULT_CONSENT_PURPOSES.map((purpose) =>
      prisma.privacyConsent.upsert({
        create: {
          lawfulBasis: LawfulBasis.CONSENT,
          organizationId: organization.id,
          purpose,
          source: ConsentSource.SETTINGS,
          tenantId: organization.tenantId,
          userId: input.userId
        },
        update: {},
        where: {
          organizationId_userId_purpose: {
            organizationId: organization.id,
            purpose,
            userId: input.userId
          }
        }
      })
    )
  );

  return organization;
}

export async function listPrivacyConsents(input: {
  organizationReference: string;
  userId: string;
}) {
  const organization = await ensurePrivacyConsents(input);
  const [items, history] = await Promise.all([
    prisma.privacyConsent.findMany({
      orderBy: {
        purpose: "asc"
      },
      where: {
        organizationId: organization.id,
        userId: input.userId
      }
    }),
    prisma.privacyConsentEvent.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      where: {
        organizationId: organization.id,
        userId: input.userId
      }
    })
  ]);

  return {
    history,
    items
  };
}

export async function savePrivacyConsentDecisions(input: {
  decisions: Array<{
    purpose: ConsentPurpose;
    source: ConsentSource;
    status: ConsentStatus;
  }>;
  organizationReference: string;
  userId: string;
}) {
  const organization = await ensurePrivacyConsents({
    organizationReference: input.organizationReference,
    userId: input.userId
  });

  const updatedItems = await prisma.$transaction(async (tx) => {
    const results = [];

    for (const decision of input.decisions) {
      const current = await tx.privacyConsent.findUnique({
        where: {
          organizationId_userId_purpose: {
            organizationId: organization.id,
            purpose: decision.purpose,
            userId: input.userId
          }
        }
      });

      if (!current) {
        throw new ProblemDetailsError({
          detail: "Consent state was not initialized for this user.",
          status: 409,
          title: "Conflict"
        });
      }

      const nextGrantedAt =
        decision.status === ConsentStatus.GRANTED ? new Date() : current.grantedAt;
      const nextRevokedAt =
        decision.status === ConsentStatus.REVOKED ? new Date() : null;

      const updated = await tx.privacyConsent.update({
        data: {
          grantedAt: decision.status === ConsentStatus.GRANTED ? nextGrantedAt : null,
          lastChangedAt: new Date(),
          revokedAt: nextRevokedAt,
          source: decision.source,
          status: decision.status
        },
        where: {
          id: current.id
        }
      });

      if (current.status !== decision.status || current.source !== decision.source) {
        await tx.privacyConsentEvent.create({
          data: {
            lawfulBasis: LawfulBasis.CONSENT,
            newStatus: decision.status,
            organizationId: organization.id,
            previousStatus: current.status,
            purpose: decision.purpose,
            source: decision.source,
            tenantId: organization.tenantId,
            userId: input.userId
          }
        });

        await tx.auditLog.create({
          data: {
            action: "privacy.consent.updated",
            actorId: input.userId,
            diff: {
              after: {
                purpose: decision.purpose,
                source: decision.source,
                status: decision.status
              },
              before: {
                source: current.source,
                status: current.status
              }
            },
            entityId: current.id,
            entityType: "privacy_consent",
            tenantId: organization.tenantId
          }
        });
      }

      if (decision.purpose === ConsentPurpose.ANALYTICS) {
        await tx.userPreference.upsert({
          create: {
            cookieConsent: mapAnalyticsConsent(decision.status),
            organizationId: organization.id,
            tenantId: organization.tenantId,
            userId: input.userId
          },
          update: {
            cookieConsent: mapAnalyticsConsent(decision.status)
          },
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: input.userId
            }
          }
        });
      }

      if (decision.purpose === ConsentPurpose.MARKETING) {
        await tx.userPreference.upsert({
          create: {
            marketingEmails: decision.status === ConsentStatus.GRANTED,
            organizationId: organization.id,
            tenantId: organization.tenantId,
            userId: input.userId
          },
          update: {
            marketingEmails: decision.status === ConsentStatus.GRANTED
          },
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: input.userId
            }
          }
        });
      }

      results.push(updated);
    }

    return results;
  });

  return updatedItems;
}
