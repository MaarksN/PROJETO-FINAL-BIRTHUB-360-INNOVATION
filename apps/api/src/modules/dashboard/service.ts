// @ts-nocheck
// 
import { prisma } from "@birthub/database";

import {
  asObject,
  buildFinanceRows,
  clampScore,
  type DashboardAgentStatuses,
  type DashboardBillingSummary,
  type DashboardClinicalSummary,
  type DashboardOnboarding,
  type DashboardMetrics,
  type DashboardRecentTasks,
  formatCurrencyFromCents,
  formatDelta,
  formatPercent,
  loadOrganizationContext,
  readNumber,
  readString,
  riskFromScore
} from "./service.shared.js";
import { ProblemDetailsError } from "../../lib/problem-details.js";

const ACTIVE_PREGNANCY_STATUS = "ACTIVE";
const HIGH_PREGNANCY_RISK = "HIGH";
const APPOINTMENT_STATUSES_IN_PROGRESS = ["CHECKED_IN", "SCHEDULED"] as const;

function startOfDay(value: Date): Date {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(value: Date, days: number): Date {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function calculateGestationalAgeLabel(input: {
  estimatedDeliveryDate: Date | null;
  lastMenstrualPeriod: Date | null;
}): string | null {
  const today = startOfDay(new Date());
  let gestationalAgeDays: number | null = null;

  if (input.lastMenstrualPeriod) {
    gestationalAgeDays = Math.floor(
      (today.getTime() - startOfDay(input.lastMenstrualPeriod).getTime()) /
        (24 * 60 * 60 * 1000)
    );
  } else if (input.estimatedDeliveryDate) {
    gestationalAgeDays =
      280 -
      Math.floor(
        (startOfDay(input.estimatedDeliveryDate).getTime() - today.getTime()) /
          (24 * 60 * 60 * 1000)
      );
  }

  if (gestationalAgeDays === null || gestationalAgeDays < 0) {
    return null;
  }

  const weeks = Math.floor(gestationalAgeDays / 7);
  const days = gestationalAgeDays % 7;
  return `${weeks} sem ${days} d`;
}

async function updateOrganizationOnboardingFlag(input: {
  enabled: boolean;
  organizationId: string;
  tenantId: string;
}) {
  const organization = await prisma.organization.findFirst({
    select: {
      settings: true
    },
    where: {
      id: input.organizationId,
      tenantId: input.tenantId
    }
  });

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for dashboard onboarding settings.",
      status: 404,
      title: "Not Found"
    });
  }

  const settings = asObject(organization.settings) ?? {};

  return prisma.organization.update({
    data: {
      settings: {
        ...settings,
        onboarding: input.enabled
      }
    },
    where: {
      id: input.organizationId
    }
  });
}

export async function getDashboardMetrics(
  organizationId: string,
  tenantId: string
): Promise<DashboardMetrics> {
  const context = await loadOrganizationContext(organizationId, tenantId);

  return {
    finance: buildFinanceRows({
      creditBalanceCents: context.snapshot.creditBalanceCents,
      paidCurrentCents: context.paidInvoicesCurrent._sum.amountPaidCents ?? 0,
      paidCurrentCount: context.paidInvoicesCurrent._count._all ?? 0,
      paidPreviousCents: context.paidInvoicesPrevious._sum.amountPaidCents ?? 0,
      pastDueInvoices: context.pastDueInvoices,
      planMonthlyPriceCents: context.planMonthlyPriceCents,
      planName: context.snapshot.plan.name,
      planStatus: context.snapshot.status
    }),
    pipeline: [
      {
        stage: "Clientes ativos",
        trend: formatDelta(context.newCustomersCurrent, context.newCustomersPrevious, "clientes"),
        value: context.customerTotalCount
      },
      {
        stage: "Workflows 30d",
        trend: formatDelta(context.workflowCurrent, context.workflowPrevious, "execuções"),
        value: context.workflowCurrent
      },
      {
        stage: "Agentes 30d",
        trend: formatDelta(context.agentCurrent, context.agentPrevious, "execuções"),
        value: context.agentCurrent
      }
    ]
  };
}

export async function getDashboardAgentStatuses(
  organizationId: string,
  tenantId: string
): Promise<DashboardAgentStatuses> {
  const context = await loadOrganizationContext(organizationId, tenantId);
  const baseScore = clampScore(
    context.organization.healthScore -
      Math.min(context.activityWindow?.runFailures ?? 0, 25) -
      Math.min((context.activityWindow?.billingErrors ?? 0) * 2, 15)
  );

  const items = (context.customers.length > 0
    ? context.customers
    : [
        {
          metadata: null,
          name: context.organization.name
        }
      ]
  ).map((customer, index) => {
    const metadata = asObject(customer.metadata);
    const score = clampScore(
      readNumber(metadata, "healthScore") ??
        baseScore - index * 2 +
          Math.min(context.activityWindow?.activeUsers ?? 0, 10)
    );
    const nps = clampScore(readNumber(metadata, "nps") ?? score - 8);

    return {
      client: customer.name,
      nps,
      risk: riskFromScore(score),
      score
    };
  });

  return {
    healthScore: items
  };
}

export async function getDashboardRecentTasks(
  organizationId: string,
  tenantId: string
): Promise<DashboardRecentTasks> {
  const context = await loadOrganizationContext(organizationId, tenantId);
  const paidCurrentCents = context.paidInvoicesCurrent._sum.amountPaidCents ?? 0;
  const averageCustomerValueCents =
    context.customers.length > 0
      ? Math.round((context.planMonthlyPriceCents || paidCurrentCents || 0) / context.customers.length)
      : context.planMonthlyPriceCents || paidCurrentCents || 0;

  const contracts = context.customers.map((customer) => {
    const metadata = asObject(customer.metadata);

    return {
      customer: customer.name,
      mrr: formatCurrencyFromCents(
        readNumber(metadata, "mrrCents") ?? averageCustomerValueCents
      ),
      owner: readString(metadata, "ownerName") ?? context.defaultOwnerName,
      status: customer.status
    };
  });

  const groupedAttribution = new Map<string, number>();
  for (const customer of context.customers) {
    const metadata = asObject(customer.metadata);
    const source = readString(metadata, "source") ?? "direct";
    groupedAttribution.set(source, (groupedAttribution.get(source) ?? 0) + 1);
  }

  const attribution = Array.from(groupedAttribution.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([source, leads]) => ({
      cac: leads > 0 ? formatCurrencyFromCents(Math.round(paidCurrentCents / leads)) : formatCurrencyFromCents(0),
      conversion: context.customerTotalCount > 0 ? formatPercent(leads / context.customerTotalCount) : "0%",
      leads,
      source
    }));

  return {
    attribution,
    contracts
  };
}

export async function getDashboardBillingSummary(
  organizationId: string,
  tenantId: string
): Promise<DashboardBillingSummary> {
  const context = await loadOrganizationContext(organizationId, tenantId);

  return {
    finance: buildFinanceRows({
      creditBalanceCents: context.snapshot.creditBalanceCents,
      paidCurrentCents: context.paidInvoicesCurrent._sum.amountPaidCents ?? 0,
      paidCurrentCount: context.paidInvoicesCurrent._count._all ?? 0,
      paidPreviousCents: context.paidInvoicesPrevious._sum.amountPaidCents ?? 0,
      pastDueInvoices: context.pastDueInvoices,
      planMonthlyPriceCents: context.planMonthlyPriceCents,
      planName: context.snapshot.plan.name,
      planStatus: context.snapshot.status
    })
  };
}

export async function getDashboardClinicalSummary(
  organizationId: string,
  tenantId: string
): Promise<DashboardClinicalSummary> {
  const now = new Date();
  const today = startOfDay(now);
  const nextTwoWeeks = addDays(today, 14);

  const [
    activePatients,
    activePregnancies,
    highRiskPregnancies,
    nearDuePregnancies,
    scheduledFollowUps,
    neonatalRecords,
    spotlightPatients
  ] = await Promise.all([
    prisma.patient.count({
      where: {
        deletedAt: null,
        organizationId,
        status: "ACTIVE",
        tenantId
      }
    }),
    prisma.pregnancyRecord.count({
      where: {
        deletedAt: null,
        organizationId,
        status: ACTIVE_PREGNANCY_STATUS,
        tenantId
      }
    }),
    prisma.pregnancyRecord.count({
      where: {
        deletedAt: null,
        organizationId,
        riskLevel: HIGH_PREGNANCY_RISK,
        status: ACTIVE_PREGNANCY_STATUS,
        tenantId
      }
    }),
    prisma.pregnancyRecord.count({
      where: {
        deletedAt: null,
        estimatedDeliveryDate: {
          gte: today,
          lte: nextTwoWeeks
        },
        organizationId,
        status: ACTIVE_PREGNANCY_STATUS,
        tenantId
      }
    }),
    prisma.appointment.count({
      where: {
        deletedAt: null,
        organizationId,
        scheduledAt: {
          gte: now
        },
        status: {
          in: APPOINTMENT_STATUSES_IN_PROGRESS
        },
        tenantId
      }
    }),
    prisma.neonatalRecord.count({
      where: {
        deletedAt: null,
        organizationId,
        tenantId
      }
    }),
    prisma.patient.findMany({
      orderBy: {
        updatedAt: "desc"
      },
      select: {
        clinicalNotes: {
          orderBy: {
            updatedAt: "desc"
          },
          select: {
            title: true
          },
          take: 1,
          where: {
            deletedAt: null,
            isLatest: true
          }
        },
        fullName: true,
        id: true,
        appointments: {
          orderBy: {
            scheduledAt: "asc"
          },
          select: {
            scheduledAt: true
          },
          take: 1,
          where: {
            deletedAt: null,
            scheduledAt: {
              gte: now
            },
            status: {
              in: APPOINTMENT_STATUSES_IN_PROGRESS
            }
          }
        },
        pregnancyRecords: {
          orderBy: {
            updatedAt: "desc"
          },
          select: {
            estimatedDeliveryDate: true,
            lastMenstrualPeriod: true,
            riskLevel: true,
            status: true
          },
          take: 1,
          where: {
            deletedAt: null,
            status: ACTIVE_PREGNANCY_STATUS
          }
        }
      },
      take: 4,
      where: {
        deletedAt: null,
        organizationId,
        tenantId
      }
    })
  ]);

  const alerts: DashboardClinicalSummary["alerts"] = [];

  if (highRiskPregnancies > 0) {
    alerts.push({
      description:
        "Gestacoes de alto risco exigem fila prioritaria na home e revisao de acompanhamento.",
      href: "/patients?riskLevel=HIGH",
      id: "high-risk-pregnancies",
      severity: "high",
      title: `${highRiskPregnancies} gestacao(oes) de alto risco`
    });
  }

  if (nearDuePregnancies > 0) {
    alerts.push({
      description:
        "Existem pacientes entrando na janela final da gestacao e sem espaco para perder acompanhamento.",
      href: "/appointments?view=week",
      id: "near-due-pregnancies",
      severity: "medium",
      title: `${nearDuePregnancies} DPP(s) nas proximas duas semanas`
    });
  }

  if (scheduledFollowUps === 0 && activePregnancies > 0) {
    alerts.push({
      description:
        "Nao ha consultas futuras agendadas para a fila obstetrica ativa do tenant atual.",
      href: "/appointments",
      id: "missing-follow-ups",
      severity: "medium",
      title: "Agenda clinica sem retornos futuros"
    });
  }

  return {
    alerts,
    metrics: [
      {
        delta: activePregnancies > 0 ? `${activePregnancies} gestacoes em acompanhamento` : "sem gestacoes ativas",
        label: "Pacientes ativos",
        value: activePatients
      },
      {
        delta:
          highRiskPregnancies > 0
            ? `${highRiskPregnancies} com risco alto`
            : "sem casos de alto risco",
        label: "Gestacoes ativas",
        value: activePregnancies
      },
      {
        delta:
          nearDuePregnancies > 0
            ? `${nearDuePregnancies} com DPP <= 14 dias`
            : "sem DPP imediata",
        label: "Retornos futuros",
        value: scheduledFollowUps
      },
      {
        delta:
          neonatalRecords > 0
            ? `${neonatalRecords} registro(s) neonatal(is) persistido(s)`
            : "baseline neonatal ainda vazio",
        label: "Neonatais",
        value: neonatalRecords
      }
    ],
    spotlight: spotlightPatients.map((patient) => {
      const pregnancy = patient.pregnancyRecords[0];
      const nextAppointment = patient.appointments[0];
      const latestNote = patient.clinicalNotes[0];

      return {
        gestationalAgeLabel: pregnancy
          ? calculateGestationalAgeLabel({
              estimatedDeliveryDate: pregnancy.estimatedDeliveryDate,
              lastMenstrualPeriod: pregnancy.lastMenstrualPeriod
            })
          : null,
        latestNoteTitle: latestNote?.title ?? null,
        nextAppointmentAt: nextAppointment?.scheduledAt.toISOString() ?? null,
        patientId: patient.id,
        patientName: patient.fullName,
        riskLevel: pregnancy?.riskLevel ?? "LOW",
        status: pregnancy?.status ?? "CLOSED"
      };
    })
  };
}

export async function getDashboardOnboarding(input: {
  organizationId: string;
  tenantId: string;
  userId: string;
}): Promise<DashboardOnboarding> {
  const context = await loadOrganizationContext(input.organizationId, input.tenantId);
  const [workflowCount, outputCount, notificationPreference] = await Promise.all([
    prisma.workflow.count({
      where: {
        organizationId: input.organizationId,
        tenantId: input.tenantId
      }
    }),
    prisma.outputArtifact.count({
      where: {
        organizationId: input.organizationId,
        tenantId: input.tenantId
      }
    }),
    prisma.userPreference.findFirst({
      where: {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        userId: input.userId
      }
    })
  ]);

  const onboardingEnabled = asObject(context.organization.settings)?.onboarding !== false;

  const items = [
    {
      complete: true,
      ctaHref: "/dashboard",
      ctaLabel: "Abrir home",
      description: "Checar indicadores, billing e riscos operacionais.",
      id: "dashboard-home",
      title: "Explorar a home do dashboard"
    },
    {
      complete: workflowCount > 0,
      ctaHref: "/workflows",
      ctaLabel: "Criar workflow",
      description: "Publicar o primeiro fluxo operacional com trigger e CTA.",
      id: "workflow-first",
      title: "Criar ou revisar workflows"
    },
    {
      complete: notificationPreference?.inAppNotifications ?? true,
      ctaHref: "/notifications",
      ctaLabel: "Configurar feed",
      description: "Ativar o feed in-app e validar o sino de notificacoes.",
      id: "notifications-feed",
      title: "Configurar notificacoes"
    },
    {
      complete: outputCount > 0,
      ctaHref: "/reports",
      ctaLabel: "Abrir reports",
      description: "Visualizar artefatos exportaveis e validar integridade.",
      id: "reports-review",
      title: "Abrir reports e exports"
    }
  ];

  return {
    enabled: onboardingEnabled,
    items,
    nextHref: items.find((item) => !item.complete)?.ctaHref ?? "/dashboard",
    progress: items.length === 0 ? 100 : Math.round((items.filter((item) => item.complete).length / items.length) * 100)
  };
}

export async function setDashboardOnboardingEnabled(input: {
  enabled: boolean;
  organizationId: string;
  tenantId: string;
}) {
  return updateOrganizationOnboardingFlag(input);
}
