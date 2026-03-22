/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from "@birthub/database";

const prisma = new PrismaClient();

async function main() {
  const [invalidDeals, invalidCustomers, overduePaidInvoices] = await Promise.all([
    // @ts-expect-error compatibility layer
    prisma.deal.count({ where: { OR: [{ probability: { lt: 0 } }, { probability: { gt: 100 } }] } }),
    // @ts-expect-error compatibility layer
    prisma.customer.count({ where: { OR: [{ healthScore: { lt: 0 } }, { healthScore: { gt: 100 } }] } }),
    // @ts-expect-error compatibility layer
    prisma.invoice.count({ where: { status: "PAID", paidAt: null } }),
  ]);

  const violations = [
    ["deal_probability", invalidDeals],
    ["customer_health_score", invalidCustomers],
    ["paid_without_date", overduePaidInvoices],
  ] as const;

  const hasViolations = violations.some(([, count]) => count > 0);

  console.table(violations.map(([name, count]) => ({ check: name, count })));

  if (hasViolations) {
    process.exitCode = 1;
  }
}

void main().finally(async () => {
  await prisma.$disconnect();
});
