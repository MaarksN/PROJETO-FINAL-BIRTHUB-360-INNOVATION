import { PrismaClient } from "@prisma/client";

import { writeJsonReport, writeTextReport } from "./lib/report.js";

type ConstraintRow = {
  constraint_name: string;
  table_name: string;
};

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    const report = {
      checkedAt: new Date().toISOString(),
      ok: true,
      reason: "DATABASE_URL is not configured.",
      skipped: true
    };

    const jsonPath = await writeJsonReport("f8/referential-integrity-report.json", report);
    const txtPath = await writeTextReport(
      "f8/referential-integrity-report.txt",
      "Referential integrity check skipped because DATABASE_URL is not configured."
    );

    console.log(`Referential integrity check skipped.\nArtifacts:\n- ${jsonPath}\n- ${txtPath}`);
    return;
  }

  const prisma = new PrismaClient();

  try {
    const invalidConstraints = await prisma.$queryRawUnsafe<ConstraintRow[]>(`
      SELECT conname AS constraint_name, conrelid::regclass::text AS table_name
      FROM pg_constraint
      WHERE contype = 'f'
        AND NOT convalidated
      ORDER BY conrelid::regclass::text ASC, conname ASC
    `);

    const report = {
      checkedAt: new Date().toISOString(),
      invalidConstraints,
      ok: invalidConstraints.length === 0
    };

    const text = [
      `Referential integrity check: ${report.ok ? "PASS" : "FAIL"}`,
      ...(invalidConstraints.length === 0
        ? ["All foreign key constraints are validated."]
        : invalidConstraints.map((constraint) => `${constraint.table_name}: ${constraint.constraint_name}`))
    ].join("\n");

    const jsonPath = await writeJsonReport("f8/referential-integrity-report.json", report);
    const txtPath = await writeTextReport("f8/referential-integrity-report.txt", text);

    console.log(`${text}\n\nArtifacts:\n- ${jsonPath}\n- ${txtPath}`);

    if (!report.ok) {
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
