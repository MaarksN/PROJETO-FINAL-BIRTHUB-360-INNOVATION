#!/usr/bin/env node
import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";

import {
  fromRepo,
  listTrackedFiles,
  relativePath,
  reportDateParts,
  safeRun,
  writeJson,
  writeText
} from "./shared-prime.mjs";

const supplementalEvidencePaths = [
  "docs/operations/environment-parity.md",
  "docs/operations/sla.md",
  "artifacts/security/semgrep-head.json",
  "artifacts/testing/module-coverage.json",
  "artifacts/performance/web-bundle-head.json",
  "artifacts/accessibility/axe-report.json",
  "artifacts/dr/latest-drill.json",
  "artifacts/tenancy/rls-proof-head.json"
];

function fileExists(relativePathValue) {
  return existsSync(fromRepo(relativePathValue));
}

async function readJsonIfExists(relativePathValue) {
  if (!fileExists(relativePathValue)) {
    return null;
  }

  return JSON.parse(await fs.readFile(fromRepo(relativePathValue), "utf8"));
}

function dedupe(values) {
  return [...new Set(values)];
}

function collectEvidenceFiles() {
  return dedupe([
    ...listTrackedFiles(),
    ...supplementalEvidencePaths.filter(fileExists)
  ]);
}

async function writeEnvironmentParity() {
  const stagingPreflight = await readJsonIfExists("artifacts/release/staging-preflight-summary.json");
  const productionPreflight = await readJsonIfExists("artifacts/release/production-preflight-summary.json");
  const dockerfiles = [
    "apps/api/Dockerfile",
    "apps/web/Dockerfile",
    "apps/worker/Dockerfile"
  ].filter(fileExists);
  const composeFiles = ["docker-compose.yml", "docker-compose.prod.yml"].filter(fileExists);
  const sealedEnvFiles = [
    "ops/release/sealed/.env.staging.sealed",
    "ops/release/sealed/.env.production.sealed"
  ].filter(fileExists);
  const cloudRunFiles = ["infra/cloudrun/service.yaml"].filter(fileExists);
  const monitoringFiles = [
    "infra/monitoring/prometheus.yml",
    "infra/monitoring/alert.rules.yml",
    "infra/monitoring/grafana-dashboard.json"
  ].filter(fileExists);

  const lines = [
    "# Environment Parity",
    "",
    `- Refreshed at: ${new Date().toISOString()}`,
    `- Source of truth: \`${reportDateParts().slug}\` evidence refresh over the current HEAD.`,
    "",
    "## Runtime Surfaces",
    "",
    `- Dockerfiles present: ${dockerfiles.length}/3 (${dockerfiles.map((entry) => `\`${entry}\``).join(", ")})`,
    `- Compose surfaces present: ${composeFiles.length}/2 (${composeFiles.map((entry) => `\`${entry}\``).join(", ")})`,
    `- Cloud Run manifest: ${cloudRunFiles.length ? `present (\`${cloudRunFiles[0]}\`)` : "missing"}`,
    `- Monitoring stack refs: ${monitoringFiles.map((entry) => `\`${entry}\``).join(", ")}`,
    "",
    "## Release Preflight Evidence",
    "",
    `- Staging preflight: ${stagingPreflight?.ok ? "PASS" : "pending/fail"} (\`artifacts/release/staging-preflight-summary.json\`)`,
    `- Production preflight: ${productionPreflight?.ok ? "PASS" : "pending/fail"} (\`artifacts/release/production-preflight-summary.json\`)`,
    `- Sealed env files: ${sealedEnvFiles.length}/2 (${sealedEnvFiles.map((entry) => `\`${entry}\``).join(", ")})`,
    "",
    "## Parity Snapshot",
    "",
    "| Surface | Dev | Staging | Production | Evidence |",
    "| --- | --- | --- | --- | --- |",
    `| API | ${dockerfiles.includes("apps/api/Dockerfile") ? "containerized" : "gap"} | ${stagingPreflight?.results?.find((entry) => entry.scope === "api")?.ok ? "preflight ok" : "unknown"} | ${productionPreflight?.results?.find((entry) => entry.scope === "api")?.ok ? "preflight ok" : "unknown"} | \`apps/api/Dockerfile\`, \`artifacts/release/staging-preflight-summary.json\`, \`artifacts/release/production-preflight-summary.json\` |`,
    `| Web | ${dockerfiles.includes("apps/web/Dockerfile") ? "containerized" : "gap"} | ${stagingPreflight?.results?.find((entry) => entry.scope === "web")?.ok ? "preflight ok" : "unknown"} | ${productionPreflight?.results?.find((entry) => entry.scope === "web")?.ok ? "preflight ok" : "unknown"} | \`apps/web/Dockerfile\`, \`artifacts/release/staging-preflight-summary.json\`, \`artifacts/release/production-preflight-summary.json\` |`,
    `| Worker | ${dockerfiles.includes("apps/worker/Dockerfile") ? "containerized" : "gap"} | ${stagingPreflight?.results?.find((entry) => entry.scope === "worker")?.ok ? "preflight ok" : "unknown"} | ${productionPreflight?.results?.find((entry) => entry.scope === "worker")?.ok ? "preflight ok" : "unknown"} | \`apps/worker/Dockerfile\`, \`artifacts/release/staging-preflight-summary.json\`, \`artifacts/release/production-preflight-summary.json\` |`,
    "",
    "## Known Gaps",
    "",
    `- Kubernetes manifests: ${fileExists("infra/k8s") ? "present" : "not versioned in the canonical infra tree"}.`,
    `- Runtime parity is documented, but local proof still depends on machine-specific inputs because \`${process.env.DATABASE_URL ? "DATABASE_URL is configured on this runner" : "DATABASE_URL is not configured on this runner"}\`.`,
    `- This snapshot is documentation-backed; it does not replace live staging/prod smoke execution beyond the recorded preflight summaries.`,
    ""
  ];

  await writeText(fromRepo("docs/operations/environment-parity.md"), `${lines.join("\n")}\n`);
}

async function writeSlaSnapshot() {
  const policy = await fs.readFile(fromRepo("docs/operations/f0-sla-severity-policy.md"), "utf8");
  const baseline = await fs.readFile(fromRepo("docs/operations/f0-sla-adherence-baseline-90d.md"), "utf8");
  const uptimeLine = baseline
    .split(/\r?\n/)
    .find((line) => line.includes("Aderência Média Global P0")) ?? "Aderência Média Global P0: não encontrada.";

  const lines = [
    "# SLA Operacional",
    "",
    `- Refreshed at: ${new Date().toISOString()}`,
    `- Canonical policy: \`docs/operations/f0-sla-severity-policy.md\``,
    `- Baseline 90d: \`docs/operations/f0-sla-adherence-baseline-90d.md\``,
    `- Disaster recovery runbook: \`docs/runbooks/disaster-recovery.md\``,
    "",
    "## Snapshot",
    "",
    `- ${uptimeLine.replace(/\*\*/g, "").trim()}`,
    `- Policy review cadence: ${policy.includes("Revisao obrigatoria desta politica: trimestral") ? "trimestral documentada" : "não explicitada"}.`,
    `- Monitoring linkage: ${policy.includes("infra/monitoring/alert.rules.yml") && policy.includes("infra/monitoring/grafana-dashboard.json") ? "alert rules + dashboard versionados" : "incompleto"}.`,
    "",
    "## Source References",
    "",
    "- `docs/operations/f0-sla-severity-policy.md`",
    "- `docs/operations/f0-sla-adherence-baseline-90d.md`",
    "- `docs/runbooks/p1-alert-response-matrix.md`",
    "- `docs/runbooks/disaster-recovery.md`",
    ""
  ];

  await writeText(fromRepo("docs/operations/sla.md"), `${lines.join("\n")}\n`);
}

async function writeSemgrepSnapshot() {
  const artifactPath = "artifacts/security/semgrep-head.json";
  const semgrepVersion = safeRun("semgrep", ["--version"], { timeoutMs: 10_000 });

  if (semgrepVersion.exitCode !== 0) {
    await writeJson(fromRepo(artifactPath), {
      checkedAt: new Date().toISOString(),
      command: "semgrep --config auto --json",
      status: "tool-missing",
      sufficient: false,
      reason: "Semgrep binary is not available on the current runner.",
      stderr: semgrepVersion.stderr || semgrepVersion.stdout || "semgrep not found",
      requiredAction: "Install semgrep on the runner or provide a connector-backed SAST lane."
    });
    return;
  }

  const result = safeRun(
    "semgrep",
    ["scan", "--config", "auto", "--json", "--output", fromRepo(artifactPath)],
    { timeoutMs: 600_000 }
  );

  await writeJson(fromRepo(artifactPath), {
    checkedAt: new Date().toISOString(),
    command: result.command,
    exitCode: result.exitCode,
    status: result.exitCode === 0 ? "pass" : "findings-or-failure",
    sufficient: result.exitCode === 0,
    stdout: result.stdout,
    stderr: result.stderr
  });
}

async function writeModuleCoverageSnapshot(files) {
  const surfaces = [
    {
      module: "apps/api",
      runtimePrefixes: ["apps/api/src/"],
      testPrefixes: ["apps/api/tests/"],
      sharedTests: ["tests/e2e/critical-routes.spec.ts"]
    },
    {
      module: "apps/web",
      runtimePrefixes: ["apps/web/app/", "apps/web/components/", "apps/web/lib/", "apps/web/providers/", "apps/web/stores/"],
      testPrefixes: ["apps/web/tests/"],
      sharedTests: ["tests/e2e/critical-routes.spec.ts", "tests/e2e/billing-premium.spec.ts"]
    },
    {
      module: "apps/worker",
      runtimePrefixes: ["apps/worker/src/"],
      testPrefixes: ["apps/worker/src/", "apps/worker/test/"],
      sharedTests: ["tests/e2e/workflow-editor-evidence.spec.ts", "tests/e2e/workflow-agent-output.spec.ts"]
    },
    {
      module: "packages/database",
      runtimePrefixes: ["packages/database/src/"],
      testPrefixes: ["packages/database/test/"],
      sharedTests: []
    }
  ];

  const runtimeFiles = files.filter((filePath) => /\.(ts|tsx|js|mjs)$/.test(filePath));
  const testFiles = files.filter((filePath) => {
    return (
      filePath.includes("/test/") ||
      filePath.includes("/tests/") ||
      /\.(test|spec)\.[tj]sx?$/.test(path.posix.basename(filePath))
    );
  });
  const traceability = await readJsonIfExists("scripts/testing/traceability-data.json");

  const rows = surfaces.map((surface) => {
    const moduleRuntimeFiles = runtimeFiles.filter((filePath) =>
      surface.runtimePrefixes.some((prefix) => filePath.startsWith(prefix))
    );
    const moduleTests = dedupe([
      ...testFiles.filter((filePath) => surface.testPrefixes.some((prefix) => filePath.startsWith(prefix))),
      ...surface.sharedTests.filter(fileExists)
    ]);
    const traceabilityFlows = (traceability?.modules ?? []).filter((entry) =>
      (entry.criticalModules ?? []).some((pattern) => pattern.includes(surface.module.split("/")[1]))
    );

    return {
      module: surface.module,
      runtimeFiles: moduleRuntimeFiles.length,
      directTestFiles: moduleTests.length,
      traceabilityFlows: traceabilityFlows.length,
      directTests: moduleTests,
      gaps: moduleRuntimeFiles.slice(0, 12).filter((filePath) => {
        const baseName = path.posix.basename(filePath).replace(/\.(d\.)?[a-z0-9]+$/i, "");
        return !moduleTests.some((testPath) => testPath.includes(baseName));
      })
    };
  });

  await writeJson(fromRepo("artifacts/testing/module-coverage.json"), {
    checkedAt: new Date().toISOString(),
    mode: "static-coverage-proxy",
    sufficient: false,
    limitations: [
      "This snapshot is structural and traceability-backed; it is not line or branch coverage.",
      "Environment-gated suites and Python runtime coverage remain outside this proxy."
    ],
    summary: {
      modules: rows.length,
      modulesWithDirectTests: rows.filter((row) => row.directTestFiles > 0).length,
      modulesWithTraceability: rows.filter((row) => row.traceabilityFlows > 0).length
    },
    surfaces: rows
  });
}

async function writeBundleSnapshot() {
  const artifactPath = "artifacts/performance/web-bundle-head.json";
  const buildManifest = fromRepo("apps/web/.next/build-manifest.json");
  const historicalBaseline = await readJsonIfExists("artifacts/quality/bundle/web-bundle-baseline.json");

  if (!existsSync(buildManifest)) {
    await writeJson(fromRepo(artifactPath), {
      checkedAt: new Date().toISOString(),
      status: "build-missing",
      sufficient: false,
      reason: "apps/web/.next/build-manifest.json was not found on the current runner.",
      historicalBaseline: historicalBaseline
        ? {
            generatedAt: historicalBaseline.generatedAt,
            totalKiB: historicalBaseline.chunks?.totalKiB ?? null,
            files: historicalBaseline.chunks?.files ?? null
          }
        : null,
      requiredAction: "Run the web build on the runner before the next sovereign audit."
    });
    return;
  }

  const generation = safeRun("node", ["scripts/quality/generate-web-bundle-baseline.mjs"], {
    timeoutMs: 300_000
  });
  const freshBaseline = await readJsonIfExists("artifacts/quality/bundle/web-bundle-baseline.json");

  await writeJson(fromRepo(artifactPath), {
    checkedAt: new Date().toISOString(),
    status: generation.exitCode === 0 ? "fresh" : "generation-failed",
    sufficient: generation.exitCode === 0,
    command: generation.command,
    stdout: generation.stdout,
    stderr: generation.stderr,
    baseline: freshBaseline
  });
}

async function writeAccessibilitySnapshot(files) {
  const webFiles = files.filter((filePath) => filePath.startsWith("apps/web/") && filePath.endsWith(".tsx"));
  const findings = [];

  for (const filePath of webFiles) {
    const content = await fs.readFile(fromRepo(filePath), "utf8");
    const lines = content.split(/\r?\n/);
    let tableWithoutCaptionReported = false;

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (/<img\b(?![^>]*\balt=)/.test(line)) {
        findings.push({
          file: filePath,
          line: index + 1,
          rule: "img-alt",
          severity: "medium",
          message: "Potential image without alt attribute."
        });
      }

      if (!tableWithoutCaptionReported && /<table\b/.test(line) && !/<caption\b/.test(content)) {
        findings.push({
          file: filePath,
          line: index + 1,
          rule: "table-caption",
          severity: "low",
          message: "Table rendered without an in-file caption element."
        });
        tableWithoutCaptionReported = true;
      }

      if (/<input\b/.test(line) && !/(aria-label|aria-labelledby)/.test(line) && !content.includes("<label")) {
        findings.push({
          file: filePath,
          line: index + 1,
          rule: "input-label",
          severity: "medium",
          message: "Potential input without associated label or aria label in the same file."
        });
      }
    }
  }

  await writeJson(fromRepo("artifacts/accessibility/axe-report.json"), {
    checkedAt: new Date().toISOString(),
    mode: "static-fallback",
    requestedTool: "axe",
    sufficient: false,
    limitations: [
      "No browser-backed axe runner is configured in the current sovereign audit lane.",
      "Findings are heuristic and should be validated by a real Playwright+axe pass."
    ],
    summary: {
      filesScanned: webFiles.length,
      findings: findings.length
    },
    findings
  });
}

async function writeDisasterRecoverySnapshot() {
  const liveDrill = await readJsonIfExists("artifacts/backups/drill-rto-rpo.json");
  const rollbackEvidence = await readJsonIfExists("artifacts/release/production-rollback-evidence.json");

  if (liveDrill) {
    await writeJson(fromRepo("artifacts/dr/latest-drill.json"), {
      checkedAt: new Date().toISOString(),
      status: "recorded",
      sufficient: true,
      drill: liveDrill
    });
    return;
  }

  await writeJson(fromRepo("artifacts/dr/latest-drill.json"), {
    checkedAt: new Date().toISOString(),
    status: "missing-drill-record",
    sufficient: false,
    reason: "No disaster-recovery drill artifact is currently versioned in artifacts/backups/.",
    runbook: "docs/runbooks/disaster-recovery.md",
    script: "scripts/ops/record-disaster-recovery-drill.ts",
    relatedRollbackEvidence: rollbackEvidence
  });
}

async function writeRlsSnapshot() {
  const tenancyControl = safeRun(
    "node",
    ["--import", "tsx", "packages/database/scripts/check-tenancy-controls.ts"],
    { timeoutMs: 300_000 }
  );
  const rlsTestRun = safeRun(
    "node",
    ["--import", "tsx", "--test", "packages/database/test/rls.test.ts"],
    { timeoutMs: 300_000 }
  );

  await writeJson(fromRepo("artifacts/tenancy/rls-proof-head.json"), {
    checkedAt: new Date().toISOString(),
    databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
    tenancyControl: {
      command: tenancyControl.command,
      exitCode: tenancyControl.exitCode,
      stdout: tenancyControl.stdout,
      stderr: tenancyControl.stderr
    },
    runtimeProof: {
      command: rlsTestRun.command,
      exitCode: rlsTestRun.exitCode,
      stdout: rlsTestRun.stdout,
      stderr: rlsTestRun.stderr,
      status: !process.env.DATABASE_URL
        ? "skipped-no-database"
        : rlsTestRun.exitCode === 0
          ? "passed"
          : "failed"
    },
    sufficient: Boolean(process.env.DATABASE_URL) && rlsTestRun.exitCode === 0
  });
}

export async function refreshPrimeEvidence() {
  const files = collectEvidenceFiles();

  await writeEnvironmentParity();
  await writeSlaSnapshot();
  await writeSemgrepSnapshot();
  await writeModuleCoverageSnapshot(files);
  await writeBundleSnapshot();
  await writeAccessibilitySnapshot(files);
  await writeDisasterRecoverySnapshot();
  await writeRlsSnapshot();

  return {
    refreshedAt: new Date().toISOString(),
    outputs: supplementalEvidencePaths.filter(fileExists).map((entry) => relativePath(fromRepo(entry)))
  };
}

async function main() {
  const summary = await refreshPrimeEvidence();
  console.log(JSON.stringify(summary, null, 2));
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
