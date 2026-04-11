// @ts-nocheck
import {
  ensureUserPreference,
  prisma
} from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { findOrganizationByReference } from "./service.js";

const CONSENT_PURPOSE = {
  ANALYTICS: "ANALYTICS",
  HEALTH_DATA_SHARING: "HEALTH_DATA_SHARING",
  MARKETING: "MARKETING"
} as const;

const CONSENT_SOURCE = {
  SETTINGS: "SETTINGS"
} as const;

const CONSENT_STATUS = {
  GRANTED: "GRANTED",
  PENDING: "PENDING",
  REVOKED: "REVOKED"
} as const;

const COOKIE_CONSENT_STATUS = {
  ACCEPTED: "ACCEPTED",
  PENDING: "PENDING",
  REJECTED: "REJECTED"
} as const;

const LAWFUL_BASIS = {
  CONSENT: "CONSENT",
  HEALTH_PROTECTION: "HEALTH_PROTECTION"
} as const;

type ConsentPurpose = (typeof CONSENT_PURPOSE)[keyof typeof CONSENT_PURPOSE];
type ConsentSource = (typeof CONSENT_SOURCE)[keyof typeof CONSENT_SOURCE];
type ConsentStatus = (typeof CONSENT_STATUS)[keyof typeof CONSENT_STATUS];
type CookieConsentStatus = (typeof COOKIE_CONSENT_STATUS)[keyof typeof COOKIE_CONSENT_STATUS];
type LawfulBasis = (typeof LAWFUL_BASIS)[keyof typeof LAWFUL_BASIS];

const DEFAULT_CONSENT_PURPOSES = [
  CONSENT_PURPOSE.ANALYTICS,
  CONSENT_PURPOSE.MARKETING,
  CONSENT_PURPOSE.HEALTH_DATA_SHARING
] as const;
const CONSENT_VERSION = "2026-04";
const CONSENT_PURPOSE_LIST_LIMIT = DEFAULT_CONSENT_PURPOSES.length;

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
    case CONSENT_STATUS.GRANTED:
      return COOKIE_CONSENT_STATUS.ACCEPTED;
    case CONSENT_STATUS.REVOKED:
      return COOKIE_CONSENT_STATUS.REJECTED;
    default:
      return COOKIE_CONSENT_STATUS.PENDING;
  }
}

function deriveLgpdPreferenceState(
  items: ConsentSnapshot[],
  currentConsentedAt: Date | null
): LgpdPreferenceState {
  const byPurpose = new Map(items.map((item) => [item.purpose, item.status]));
  const statuses = DEFAULT_CONSENT_PURPOSES.map(
    (purpose) => byPurpose.get(purpose) ?? CONSENT_STATUS.PENDING
  );
  const status = statuses.some((value) => value === CONSENT_STATUS.PENDING)
    ? "PENDING"
    : statuses.every((value) => value === CONSENT_STATUS.REVOKED)
      ? "REJECTED"
      : "ACCEPTED";
  const healthDataGranted =
    byPurpose.get(CONSENT_PURPOSE.HEALTH_DATA_SHARING) === CONSENT_STATUS.GRANTED;

  return {
    consentedAt: status === "ACCEPTED" ? currentConsentedAt ?? new Date() : null,
    legalBasis: healthDataGranted ? LAWFUL_BASIS.HEALTH_PROTECTION : LAWFUL_BASIS.CONSENT,
    status,
    version: CONSENT_VERSION
  };
}

async function applyConsentDecision(input: {
  decision: {
    purpose: ConsentPurpose;
    source: ConsentSource;
    status: ConsentStatus;
  };
  organization: {
    id: string;
    tenantId: string;
  };
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
  userId: string;
}) {
  const current = await input.tx.privacyConsent.findUnique({
    where: {
      organizationId_userId_purpose: {
        organizationId: input.organization.id,
        purpose: input.decision.purpose,
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
    input.decision.status === CONSENT_STATUS.GRANTED ? new Date() : current.grantedAt;
  const nextRevokedAt =
    input.decision.status === CONSENT_STATUS.REVOKED ? new Date() : null;

  const updated = await input.tx.privacyConsent.update({
    data: {
      grantedAt: input.decision.status === CONSENT_STATUS.GRANTED ? nextGrantedAt : null,
      lastChangedAt: new Date(),
      revokedAt: nextRevokedAt,
      source: input.decision.source,
      status: input.decision.status
    },
    where: {
      id: current.id
    }
  });

  if (current.status !== input.decision.status || current.source !== input.decision.source) {
    await Promise.all([
      input.tx.privacyConsentEvent.create({
        data: {
          lawfulBasis: LAWFUL_BASIS.CONSENT,
          newStatus: input.decision.status,
          organizationId: input.organization.id,
          previousStatus: current.status,
          purpose: input.decision.purpose,
          source: input.decision.source,
          tenantId: input.organization.tenantId,
          userId: input.userId
        }
      }),
      input.tx.auditLog.create({
        data: {
          action: "privacy.consent.updated",
          actorId: input.userId,
          diff: {
            after: {
              purpose: input.decision.purpose,
              source: input.decision.source,
              status: input.decision.status
            },
            before: {
              source: current.source,
              status: current.status
            }
          },
          entityId: current.id,
          entityType: "privacy_consent",
          tenantId: input.organization.tenantId
        }
      })
    ]);
  }

  if (input.decision.purpose === CONSENT_PURPOSE.ANALYTICS) {
    await input.tx.userPreference.upsert({
      create: {
        cookieConsent: mapAnalyticsConsent(input.decision.status),
        organizationId: input.organization.id,
        tenantId: input.organization.tenantId,
        userId: input.userId
      },
      update: {
        cookieConsent: mapAnalyticsConsent(input.decision.status)
      },
      where: {
        organizationId_userId: {
          organizationId: input.organization.id,
          userId: input.userId
        }
      }
    });
  }

  if (input.decision.purpose === CONSENT_PURPOSE.MARKETING) {
    await input.tx.userPreference.upsert({
      create: {
        marketingEmails: input.decision.status === CONSENT_STATUS.GRANTED,
        organizationId: input.organization.id,
        tenantId: input.organization.tenantId,
        userId: input.userId
      },
      update: {
        marketingEmails: input.decision.status === CONSENT_STATUS.GRANTED
      },
      where: {
        organizationId_userId: {
          organizationId: input.organization.id,
          userId: input.userId
        }
      }
    });
  }

  return updated;
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
          lawfulBasis: LAWFUL_BASIS.CONSENT,
          organizationId: organization.id,
          purpose,
          source: CONSENT_SOURCE.SETTINGS,
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
      take: CONSENT_PURPOSE_LIST_LIMIT,
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
    const currentPreference = await tx.userPreference.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: input.userId
        }
      }
    });
    const results = await Promise.all(
      input.decisions.map((decision) =>
        applyConsentDecision({
          decision,
          organization,
          tx,
          userId: input.userId
        })
      )
    );

    const currentItems = await tx.privacyConsent.findMany({
      orderBy: {
        purpose: "asc"
      },
      select: {
        purpose: true,
        status: true
      },
      take: CONSENT_PURPOSE_LIST_LIMIT,
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
