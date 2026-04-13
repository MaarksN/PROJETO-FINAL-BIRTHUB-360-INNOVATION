// @ts-nocheck
// 
import { resolve } from "node:path";

import { readRequiredEnv } from "./env.js";
import { databasePackageRoot } from "./paths.js";
import {
  getPrismaCommand,
  type CommandResult,
  type CommandSpec,
  runCommand
} from "./process.js";
import { writeJsonReport } from "./report.js";

type RuntimeLogger = {
  error: (...args: unknown[]) => void;
  info?: (...args: unknown[]) => void;
};

export type ScriptStepStatus = "failed" | "passed";

export type ScriptStepReport = {
  command?: string;
  durationMs: number;
  exitCode?: number;
  finishedAt: string;
  name: string;
  script?: string;
  startedAt: string;
  status: ScriptStepStatus;
};

export type ScriptRunReport = {
  error?: {
    message: string;
    name: string;
  };
  finishedAt: string;
  name: string;
  startedAt: string;
  status: "failed" | "passed";
  steps: ScriptStepReport[];
};

type RuntimeDependencies = {
  env: NodeJS.ProcessEnv;
  getPrismaCommand: () => CommandSpec;
  now: () => Date;
  runCommand: (
    command: string,
    args: string[],
    options?: {
      cwd?: string;
      env?: NodeJS.ProcessEnv;
    }
  ) => Promise<CommandResult>;
  writeJsonReport: <T>(relativePath: string, payload: T) => Promise<string>;
};

const DEFAULT_DEPENDENCIES: RuntimeDependencies = {
  env: process.env,
  getPrismaCommand,
  now: () => new Date(),
  runCommand,
  writeJsonReport
};

function serializeError(error: unknown): { message: string; name: string } {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name
    };
  }

  return {
    message: String(error),
    name: "Error"
  };
}

export function createScriptRuntime(
  config: {
    logger: RuntimeLogger;
    name: string;
    reportPath?: string;
  },
  dependencies: Partial<RuntimeDependencies> = {}
) {
  const resolved = {
    ...DEFAULT_DEPENDENCIES,
    ...dependencies
  } satisfies RuntimeDependencies;

  const startedAt = resolved.now();
  const steps: ScriptStepReport[] = [];

  async function recordStep(
    name: string,
    runner: () => Promise<void>,
    metadata?: {
      command?: string;
      script?: string;
    }
  ): Promise<void> {
    const stepStartedAt = resolved.now();

    try {
      await runner();

      steps.push({
        command: metadata?.command,
        durationMs: resolved.now().getTime() - stepStartedAt.getTime(),
        finishedAt: resolved.now().toISOString(),
        name,
        script: metadata?.script,
        startedAt: stepStartedAt.toISOString(),
        status: "passed"
      });
    } catch (error) {
      steps.push({
        command: metadata?.command,
        durationMs: resolved.now().getTime() - stepStartedAt.getTime(),
        finishedAt: resolved.now().toISOString(),
        name,
        script: metadata?.script,
        startedAt: stepStartedAt.toISOString(),
        status: "failed"
      });

      throw error;
    }
  }

  function requireEnv(key: string): string {
    return readRequiredEnv(resolved.env, key, config.name);
  }

  async function runProcessStep(
    name: string,
    command: string,
    args: string[],
    options?: {
      cwd?: string;
      env?: NodeJS.ProcessEnv;
      script?: string;
    }
  ): Promise<void> {
    await recordStep(
      name,
      async () => {
        const result = await resolved.runCommand(command, args, options);
        process.stdout.write(result.output);

        if (result.code !== 0) {
          const error = new Error(`${name} failed with exit code ${result.code}.`);
          (error as Error & { exitCode?: number }).exitCode = result.code;
          throw error;
        }
      },
      {
        command: [command, ...args].join(" "),
        script: options?.script
      }
    );
  }

  async function runNodeScriptStep(name: string, scriptName: string): Promise<void> {
    const scriptPath = resolve(databasePackageRoot, "scripts", scriptName);

    await runProcessStep(name, process.execPath, ["--import", "tsx", scriptPath], {
      cwd: databasePackageRoot,
      script: scriptName
    });
  }

  async function runPrismaStep(name: string, args: string[]): Promise<void> {
    const prisma = resolved.getPrismaCommand();

    await runProcessStep(name, prisma.command, [...prisma.args, ...args], {
      cwd: databasePackageRoot
    });
  }

  async function writeReport(report: ScriptRunReport): Promise<void> {
    await resolved.writeJsonReport(
      config.reportPath ?? `scripts/${config.name}.json`,
      report
    );
  }

  async function run(handler: () => Promise<void>): Promise<void> {
    try {
      await handler();

      await writeReport({
        finishedAt: resolved.now().toISOString(),
        name: config.name,
        startedAt: startedAt.toISOString(),
        status: "passed",
        steps
      });
    } catch (error) {
      await writeReport({
        error: serializeError(error),
        finishedAt: resolved.now().toISOString(),
        name: config.name,
        startedAt: startedAt.toISOString(),
        status: "failed",
        steps
      });

      config.logger.error(error);
      process.exitCode = 1;
    }
  }

  return {
    recordStep,
    requireEnv,
    run,
    runNodeScriptStep,
    runPrismaStep,
    runProcessStep
  };
}
