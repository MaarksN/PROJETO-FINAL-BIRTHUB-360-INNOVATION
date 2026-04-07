import {
  asObject,
  buildFinanceRows,
  clampScore,
  type DashboardAgentStatuses,
  type DashboardBillingSummary,
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
