import { PrismaClient } from "@prisma/client";

import { runSeedProfile, type SeedProfile } from "./seeds/profiles.js";

const prisma = new PrismaClient();

function parseProfileFlag(): string | undefined {
  const flag = process.argv.find((value) => value.startsWith("--profile="));
  return flag ? flag.slice("--profile=".length) : undefined;
}

function resolveProfile(): SeedProfile {
  const profile = (parseProfileFlag() ?? process.env.SEED_PROFILE ?? "development").toLowerCase();

  if (profile === "ci" || profile === "development" || profile === "smoke" || profile === "staging") {
    return profile;
  }

  throw new Error(`Unsupported seed profile '${profile}'. Use development, smoke, ci or staging.`);
}

async function main(): Promise<void> {
  const profile = resolveProfile();
  await runSeedProfile(prisma, profile);
  console.log(`Seed profile '${profile}' applied successfully.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
