import { schemaPath } from "./lib/paths.js";
import { getPrismaCommand, runCommand } from "./lib/process.js";
import { createLogger } from "@birthub/logger";

const logger = createLogger("db-bootstrap-ci");

async function runPrismaStep(stepName: string, args: string[]): Promise<void> {
  const prisma = getPrismaCommand();
  const result = await runCommand(prisma.command, [...prisma.args, ...args]);
  process.stdout.write(result.output);

  if (result.code !== 0) {
    throw new Error(`${stepName} failed with exit code ${result.code}.`);
  }
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for db:bootstrap:ci.");
  }

  await runPrismaStep("prisma migrate deploy", [
    "migrate",
    "deploy",
    "--schema",
    schemaPath
  ]);
}

void main().catch((error) => {
  logger.error(error);
  process.exitCode = 1;
});
