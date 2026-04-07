import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";

import { createPrismaClient } from "../src/client.js";
import { ensureDatabaseAvailableOrSkip } from "./database-availability.js";

const databaseUrl = process.env.DATABASE_URL ?? "";
const testIfDatabase = databaseUrl ? test : test.skip;

void testIfDatabase("RLS bloqueia leitura cruzada de patients entre tenants no dominio clinico", async (context) => {
  const prisma = createPrismaClient({ databaseUrl });

  try {
    const databaseAvailable = await ensureDatabaseAvailableOrSkip(context, prisma);
    if (!databaseAvailable) {
      return;
    }

    const roleRows = await prisma.$queryRaw<Array<{ bypass: boolean }>>`
      SELECT (r.rolsuper OR r.rolbypassrls) AS "bypass"
      FROM pg_roles r
      WHERE r.rolname = current_user
    `;

    if ((roleRows[0]?.bypass ?? false) === true) {
      context.skip("A role atual ignora RLS e nao permite validar isolamento clinico por tenant.");
      return;
    }

    const tenantIdA = randomUUID();
    const tenantIdB = randomUUID();

    const organizationA = await prisma.organization.create({
      data: {
        id: tenantIdA,
        name: "Tenant Materno A",
        slug: `materno-a-${Date.now()}`,
        tenantId: tenantIdA
      }
    });

    const organizationB = await prisma.organization.create({
      data: {
        id: tenantIdB,
        name: "Tenant Materno B",
        slug: `materno-b-${Date.now()}`,
        tenantId: tenantIdB
      }
    });

    const patientB = await prisma.patient.create({
      data: {
        fullName: "Paciente Tenant B",
        organizationId: organizationB.id,
        tenantId: organizationB.tenantId
      }
    });

    const rows = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT set_config('app.current_tenant_id', ${organizationA.tenantId}, true)`;
      return tx.$queryRaw<Array<{ id: string }>>`SELECT id FROM patients WHERE id = ${patientB.id}`;
    });

    assert.equal(rows.length, 0, "O RLS deveria bloquear a visibilidade do patient do outro tenant.");
  } finally {
    await prisma.$disconnect();
  }
});
