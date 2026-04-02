import { schemaPath } from "./lib/paths.js";
import { getPrismaBinaryPath, runCommand } from "./lib/process.js";
import { createLogger } from "@birthub/logger";

const logger = createLogger("db-bootstrap-ci");

async function runPrismaStep(stepName: string, args: string[]): Promise<void> {
  const result = await runCommand(getPrismaBinaryPath(), args);
  process.stdout.write(result.output);

  if (result.code !== 0) {
    throw new Error(`${stepName} failed with exit code ${result.code}.`);
  }
}

async function runPrismaStepWithOutput(
  stepName: string,
  args: string[]
): Promise<{ code: number; output: string }> {
  const result = await runCommand(getPrismaBinaryPath(), args);
  process.stdout.write(result.output);

  if (result.code !== 0) {
    throw new Error(`${stepName} failed with exit code ${result.code}.`);
  }

  return result;
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

  // CI jobs need the live schema to match the current Prisma datamodel, even if
  // historical migrations still lag behind on indexes/defaults.
  try {
    await runPrismaStep("prisma db push", [
      "db",
      "push",
      "--schema",
      schemaPath,
      "--accept-data-loss",
      "--skip-generate"
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(
      {
        reason:
          "db push failed after migrate deploy; retrying with force-reset for ephemeral CI database.",
        step: "prisma db push"
      },
      message
    );

    await runPrismaStepWithOutput("prisma db push --force-reset", [
      "db",
      "push",
      "--schema",
      schemaPath,
      "--accept-data-loss",
      "--force-reset",
      "--skip-generate"
    ]);
  }
}

void main().catch((error) => {
  logger.error(error);
  process.exitCode = 1;
});
