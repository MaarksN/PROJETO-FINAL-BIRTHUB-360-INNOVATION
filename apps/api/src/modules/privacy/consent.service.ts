import {
  ConsentPurpose,
  ConsentSource,
  ConsentStatus,
  CookieConsentStatus,
  LawfulBasis,
  ensureUserPreference,
  prisma
} from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { findOrganizationByReference } from "./service.js";

const DEFAULT_CONSENT_PURPOSES = [
  ConsentPurpose.ANALYTICS,
  ConsentPurpose.MARKETING,
  ConsentPurpose.HEALTH_DATA_SHARING
] as const;
const CONSENT_VERSION = "2026-04";

type ConsentSnapshot = {
  purpose: ConsentPurpose;
  status: ConsentStatus;
};

type LgpdPreferenceState = {
  consentedAt: Date | null;
  legalBasis:
    | "CONSENT"
    | "CONTRACT"
    | "HEALTH_PROTECTION"
    | "LEGAL_OBLIGATION"
    | "LEGITIMATE_INTEREST";
  status: "ACCEPTED" | "PENDING" | "REJECTED";
  version: string;
};

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

function deriveLgpdPreferenceState(
  items: ConsentSnapshot[],
  currentConsentedAt: Date | null
): LgpdPreferenceState {
  const byPurpose = new Map(items.map((item) => [item.purpose, item.status]));
  const statuses = DEFAULT_CONSENT_PURPOSES.map(
    (purpose) => byPurpose.get(purpose) ?? ConsentStatus.PENDING
  );
  const status = statuses.some((value) => value === ConsentStatus.PENDING)
    ? "PENDING"
    : statuses.every((value) => value === ConsentStatus.REVOKED)
      ? "REJECTED"
      : "ACCEPTED";
  const healthDataGranted =
    byPurpose.get(ConsentPurpose.HEALTH_DATA_SHARING) === ConsentStatus.GRANTED;

  return {
    consentedAt: status === "ACCEPTED" ? currentConsentedAt ?? new Date() : null,
    legalBasis: healthDataGranted ? "HEALTH_PROTECTION" : "CONSENT",
    status,
    version: CONSENT_VERSION
  };
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
  const [items, history, preferences] = await Promise.all([
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
    }),
    ensureUserPreference({
      organizationId: organization.id,
      tenantId: organization.tenantId,
      userId: input.userId
    })
  ]);

  return {
    history,
    items,
    preferences: {
      cookieConsent: preferences.cookieConsent,
      emailNotifications: preferences.emailNotifications,
      inAppNotifications: preferences.inAppNotifications,
      lgpdConsentedAt: preferences.lgpdConsentedAt,
      lgpdConsentStatus: preferences.lgpdConsentStatus,
      lgpdConsentVersion: preferences.lgpdConsentVersion,
      lgpdLegalBasis: preferences.lgpdLegalBasis,
      marketingEmails: preferences.marketingEmails,
      pushNotifications: preferences.pushNotifications
    }
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
    const currentPreference = await tx.userPreference.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: input.userId
        }
      }
    });

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

    const currentItems = await tx.privacyConsent.findMany({
      select: {
        purpose: true,
        status: true
      },
      where: {
        organizationId: organization.id,
        userId: input.userId
      }
    });
    const lgpdState = deriveLgpdPreferenceState(
      currentItems,
      currentPreference?.lgpdConsentedAt ?? null
    );

    await tx.userPreference.upsert({
      create: {
        lgpdConsentedAt: lgpdState.consentedAt,
        lgpdConsentStatus: lgpdState.status,
        lgpdConsentVersion: lgpdState.version,
        lgpdLegalBasis: lgpdState.legalBasis,
        organizationId: organization.id,
        tenantId: organization.tenantId,
        userId: input.userId
      },
      update: {
        lgpdConsentedAt: lgpdState.consentedAt,
        lgpdConsentStatus: lgpdState.status,
        lgpdConsentVersion: lgpdState.version,
        lgpdLegalBasis: lgpdState.legalBasis
      },
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: input.userId
        }
      }
    });

    return results;
  });

  return updatedItems;
}
