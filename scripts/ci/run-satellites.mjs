import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import { buildEnv, portableNodeExecutable, projectRoot, run } from "./shared.mjs";

function packageDir(...segments) {
  return path.join(projectRoot, ...segments);
}

function resolveBin(command) {
  const filename = process.platform === "win32" ? `${command}.CMD` : command;
  const candidates = [
    path.join(projectRoot, "node_modules", ".bin", filename),
    path.join(projectRoot, ".tools", "node-v22.22.1-win-x64", filename)
  ];

  const resolved = candidates.find((candidate) => existsSync(candidate));
  if (!resolved) {
    throw new Error(`Unable to resolve '${command}' binary for satellite tasks.`);
  }

  return resolved;
}

function runBinIn(cwd, command, args) {
  const cliScripts = {
    eslint: path.join(projectRoot, "node_modules", "eslint", "bin", "eslint.js"),
    tsc: path.join(projectRoot, "node_modules", "typescript", "bin", "tsc")
  };

  const cliScript = cliScripts[command];
  if (cliScript && existsSync(cliScript)) {
    runNodeScript(cwd, [cliScript, ...args]);
    return;
  }

  run(resolveBin(command), args, { cwd });
}

function runNodeScript(cwd, args) {
  run(portableNodeExecutable, args, { cwd });
}

function runIfDirectoryExists(relativeSegments, label, callback) {
  const cwd = packageDir(...relativeSegments);
  if (!existsSync(cwd)) {
    console.log(`[satellites] Skipping ${label}: missing ${cwd}`);
    return;
  }

  callback(cwd);
}

function runPython(args) {
  const candidates =
    process.platform === "win32"
      ? [
          { command: "python", args },
          { command: "py", args: ["-3", ...args] }
        ]
      : [
          { command: "python3", args },
          { command: "python", args }
        ];

  for (const candidate of candidates) {
    const probe = spawnSync(candidate.command, ["--version"], {
      cwd: projectRoot,
      encoding: "utf8",
      env: buildEnv(),
      stdio: "pipe"
    });

    if (!probe.error && (probe.status ?? 1) === 0) {
      run(candidate.command, candidate.args);
      return;
    }
  }

  throw new Error("Python 3.12+ is required for satellite smoke suites.");
}

const target = process.argv[2] ?? "test";

const lanes = {
  build: [
    () =>
      runIfDirectoryExists(["apps", "agent-orchestrator"], "agent-orchestrator build", (cwd) =>
        runBinIn(cwd, "tsc", ["-p", "tsconfig.supported.json"])
      ),
    () => runBinIn(packageDir("apps", "voice-engine"), "tsc", ["-p", "tsconfig.json"])
  ],
  lint: [
    () =>
      runIfDirectoryExists(["apps", "agent-orchestrator"], "agent-orchestrator lint", (cwd) =>
        runBinIn(cwd, "eslint", ["worker.ts", "src/worker.contract.test.ts"])
      ),
    () => runBinIn(packageDir("apps", "voice-engine"), "eslint", ["src"])
  ],
  smoke: [
    () =>
      runNodeScript(packageDir("apps", "dashboard"), [
        "--experimental-strip-types",
        "--test",
        "__tests__/*.test.ts"
      ]),
    () => {
      const pytestTargets = ["agents", "tests/integration", "apps/webhook-receiver/tests"];
      if (existsSync(packageDir("apps", "agent-orchestrator"))) {
        pytestTargets.splice(2, 0, "apps/agent-orchestrator/tests");
      }
      runPython(["-m", "pytest", ...pytestTargets]);
    }
  ],
  test: [
    () =>
      runNodeScript(packageDir("apps", "voice-engine"), [
        "--import",
        "tsx",
        "--test",
        "src/**/*.test.ts"
      ]),
    () =>
      runIfDirectoryExists(["apps", "agent-orchestrator"], "agent-orchestrator test", (cwd) =>
        runNodeScript(cwd, ["--import", "tsx", "--test", "src/worker.contract.test.ts"])
      )
  ],
  typecheck: [
    () =>
      runIfDirectoryExists(["apps", "agent-orchestrator"], "agent-orchestrator typecheck", (cwd) =>
        runBinIn(cwd, "tsc", ["-p", "tsconfig.supported.json", "--noEmit"])
      ),
    () => runBinIn(packageDir("apps", "voice-engine"), "tsc", ["-p", "tsconfig.json", "--noEmit"])
  ]
};

const commands = lanes[target];

if (!commands) {
  throw new Error(`Unknown satellites target '${target}'.`);
}

for (const command of commands) {
  command();
}
