// @ts-expect-error TODO: remover suppressão ampla
// 
import { PrismaClient } from "@prisma/client";

import { buildStagingTenants, smokeTenants } from "./shared";
import { seedAgents } from "./seed-agents";
import { seedBilling } from "./seed-billing";
import { seedSupportArtifacts } from "./seed-support";
import { seedTenants } from "./seed-tenants";
import { seedUsers } from "./seed-users";
import { seedWorkflows } from "./seed-workflows";

export type SeedProfile = "ci" | "development" | "smoke" | "staging";

export async function runSeedProfile(prisma: PrismaClient, profile: SeedProfile) {
  const tenants = profile === "staging" ? buildStagingTenants() : profile === "smoke" || profile === "ci" ? smokeTenants : undefined;

  await seedTenants(prisma, tenants);
  await seedUsers(prisma, tenants);
  await seedAgents(prisma, tenants);
  await seedWorkflows(prisma, tenants);
  await seedBilling(prisma, tenants);
  await seedSupportArtifacts(prisma, tenants);
}
