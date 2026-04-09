// @ts-nocheck
// 
import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";

import { WorkflowStatus } from "@prisma/client";
import { createPrismaClient } from "../src/client.js";
import { ensureDatabaseAvailableOrSkip } from "./database-availability.js";

const databaseUrl = process.env.DATABASE_URL ?? "";
const testIfDatabase = databaseUrl ? test : test.skip;

void testIfDatabase("RLS bloqueia SELECT de tenant B quando a sessao esta fixada no tenant A", async (context) => {
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
    if (roleRows.length === 0) {
      context.skip("Não foi possível determinar flags de RLS da role atual (pg_roles vazio para current_user).");
      return;
    }
    const bypass = roleRows[0]?.bypass ?? false;

    if (bypass) {
      context.skip("A role atual ignora RLS (superuser/BYPASSRLS), impossibilitando validar isolamento por tenant.");
      return;
    }

    // 1. Geramos os IDs de Tenant antecipadamente para o setup
    const tenantIdA = randomUUID();
    const tenantIdB = randomUUID();

    // 2. Criamos as Organizações garantindo que o tenantId seja enviado
    // Nota: Se o seu schema usa o ID da Org como TenantID, passamos o mesmo valor.
    const organizationA = await prisma.organization.create({
      data: {
        id: tenantIdA,
        tenantId: tenantIdA,
        name: "Tenant A",
        slug: `tenant-a-${Date.now()}-${Math.random().toString(36).substring(7)}`
      }
    });

    const organizationB = await prisma.organization.create({
      data: {
        id: tenantIdB,
        tenantId: tenantIdB,
        name: "Tenant B",
        slug: `tenant-b-${Date.now()}-${Math.random().toString(36).substring(7)}`
      }
    });

    // 3. Criamos o Workflow explicitamente vinculado ao Tenant B
    const workflowB = await prisma.workflow.create({
      data: {
        name: "Workflow B",
        organizationId: organizationB.id,
        status: WorkflowStatus.PUBLISHED,
        tenantId: tenantIdB
      }
    });

    const revisionB = await prisma.workflowRevision.create({
      data: {
        definition: {
          version: 1
        },
        organizationId: organizationB.id,
        tenantId: tenantIdB,
        version: workflowB.version,
        workflowId: workflowB.id
      }
    });

    // 4. Teste de Fogo: Tentamos acessar o Workflow B usando a sessão do Tenant A
    const { revisionRows, workflowRows } = await prisma.$transaction(async (tx) => {
      // Configuramos a sessão do Postgres para o Tenant A
      await tx.$queryRaw`SELECT set_config('app.current_tenant_id', ${organizationA.tenantId}, true)`;

      // Tentamos buscar o workflow que pertence ao Tenant B
      // O RLS deve fazer com que o Postgres retorne zero linhas, mesmo o ID existindo
      const workflowRows = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM workflows WHERE id = ${workflowB.id}
      `;
      const revisionRows = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM workflow_revisions WHERE id = ${revisionB.id}
      `;

      return {
        revisionRows,
        workflowRows
      };
    });

    // Validação: O array deve vir vazio porque o RLS barrou a visibilidade
    assert.equal(
      workflowRows.length,
      0,
      "O RLS deveria ter bloqueado o acesso ao workflow do outro tenant"
    );
    assert.equal(
      revisionRows.length,
      0,
      "O RLS deveria ter bloqueado o acesso a revisoes de workflow do outro tenant"
    );

  } catch (error) {
    console.error("Erro detalhado no teste:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});
