import path from "node:path";
import { promises as fs } from "node:fs";

import {
  analysisOutputPath,
  auditRoot,
  classifyKind,
  countMatches,
  detectLanguage,
  ensureDirectory,
  fromRepo,
  getTopLevel,
  listMatches,
  listTrackedExistingFiles,
  readTextFile,
  relativeToAbsolute,
  repoRoot,
  runCommand,
  sha256File,
  shouldIncludeEvidence,
  summarizeList,
  toPosix,
  writeJson,
  writeText
} from "./shared.mjs";

const fixCatalog = [
  {
    issue_id: "utils-logger-alignment",
    severity: "high",
    role: "Structured logging baseline for shared utility consumers.",
    explanation:
      "Aligns the legacy utils logger with the structured Pino-based logger used across the platform and preserves backwards-compatible call patterns.",
    source_paths: ["packages/utils/src/logger.ts", "packages/utils/package.json", "packages/utils/index.ts", "packages/utils/src/index.ts"],
    verification_commands: ["corepack pnpm --filter @birthub/utils typecheck"]
  },
  {
    issue_id: "queue-manager-hardening",
    severity: "critical",
    role: "Shared queue runtime used by agent workers and queue scripts.",
    explanation:
      "Hardens the shared BullMQ queue manager with stronger types, default retention settings, structured logs and queue metrics.",
    source_paths: ["packages/queue/src/index.ts", "packages/queue/src/definitions.ts", "packages/queue/package.json"],
    verification_commands: ["corepack pnpm --filter @birthub/queue typecheck"]
  },
  {
    issue_id: "api-security-suite-listener-stability",
    severity: "medium",
    role: "API security regression test stability.",
    explanation:
      "Caps listener warnings in the API security suite so the security lane reports actionable failures instead of framework listener noise.",
    source_paths: ["apps/api/tests/security.test.ts"],
    verification_commands: ["corepack pnpm --filter @birthub/api test:security"]
  },
  {
    issue_id: "api-error-handler-snapshot",
    severity: "medium",
    role: "Central API error handler.",
    explanation: "Materializes the production API error handler into the autofix snapshot set.",
    source_paths: ["apps/api/src/middleware/error-handler.ts"],
    verification_commands: ["corepack pnpm --filter @birthub/api typecheck"]
  },
  {
    issue_id: "api-rate-limit-snapshot",
    severity: "medium",
    role: "Global/login/webhook rate limiting middleware.",
    explanation: "Materializes the production API rate limiting middleware into the autofix snapshot set.",
    source_paths: ["apps/api/src/middleware/rate-limit.ts"],
    verification_commands: ["corepack pnpm --filter @birthub/api typecheck"]
  },
  {
    issue_id: "api-authentication-snapshot",
    severity: "medium",
    role: "Session/API key authentication middleware.",
    explanation: "Materializes the production authentication middleware into the autofix snapshot set.",
    source_paths: ["apps/api/src/middleware/authentication.ts"],
    verification_commands: ["corepack pnpm --filter @birthub/api typecheck"]
  },
  {
    issue_id: "worker-runtime-snapshot",
    severity: "medium",
    role: "Primary worker queue runtime.",
    explanation: "Materializes the production worker runtime entrypoint into the autofix snapshot set.",
    source_paths: ["apps/worker/src/worker.ts"],
    verification_commands: ["corepack pnpm --filter @birthub/worker typecheck"]
  },
  {
    issue_id: "metrics-service-snapshot",
    severity: "medium",
    role: "Agent metrics service used by the API.",
    explanation: "Materializes the production metrics service into the autofix snapshot set.",
    source_paths: ["apps/api/src/modules/agents/metrics.service.ts"],
    verification_commands: ["corepack pnpm --filter @birthub/api typecheck"]
  }
];

function relatedTestsFor(relativePath, allFiles) {
  if (classifyKind(relativePath) === "test") {
    return [relativePath];
  }

  const stem = path.posix.basename(relativePath).replace(/\.(d\.)?[a-z0-9]+$/i, "");
  return allFiles
    .filter((candidate) => classifyKind(candidate) === "test")
    .filter((candidate) => candidate.includes(stem))
    .slice(0, 8);
}

function extractFacts(relativePath, content, allFiles) {
  const imports = content
    ? listMatches(
        content,
        /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g
      )
    : [];
  const exports = content
    ? listMatches(content, /export\s+(?:async\s+)?(?:class|const|enum|function|interface|type)\s+([A-Za-z0-9_]+)/g)
    : [];
  const envVars = content ? listMatches(content, /process\.env\.([A-Z0-9_]+)/g) : [];
  const relatedTests = relatedTestsFor(relativePath, allFiles);
  const riskFlags = [];
  const runtimeLike = classifyKind(relativePath) === "runtime";

  if (!content) {
    riskFlags.push({ code: "non_text", detail: "Binary or non-text file; static content scan skipped.", weight: 0 });
  }

  if (content) {
    const anyCount = countMatches(content, /\bany\b/g);
    if (anyCount > 0) {
      riskFlags.push({ code: "any_usage", detail: `Contains ${anyCount} occurrence(s) of 'any'.`, weight: Math.min(30, anyCount * 3) });
    }

    if (/\beval\s*\(|new Function\s*\(/.test(content)) {
      riskFlags.push({ code: "dynamic_code_execution", detail: "Contains dynamic code execution primitives.", weight: 60 });
    }

    const consoleCount = countMatches(content, /console\.(?:debug|error|info|log|warn)\s*\(/g);
    if (runtimeLike && consoleCount > 0) {
      riskFlags.push({ code: "console_logging", detail: `Uses console-based logging ${consoleCount} time(s) in runtime code.`, weight: Math.min(25, consoleCount * 5) });
    }

    if (
      runtimeLike &&
      countMatches(content, /axios\.(?:get|post|put|delete|request)|fetch\s*\(|https?:\/\/|new URL\(/g) > 0 &&
      !/timeout|AbortController|AbortSignal/.test(content)
    ) {
      riskFlags.push({ code: "network_without_timeout", detail: "External network operations do not show an explicit timeout or abort path.", weight: 20 });
    }

    if (
      runtimeLike &&
      /process\.env\./.test(content) &&
      !/@birthub\/config/.test(content) &&
      !relativePath.includes("config")
    ) {
      riskFlags.push({ code: "direct_env_access", detail: "Reads environment variables directly outside the shared config surface.", weight: 10 });
    }

    if (
      runtimeLike &&
      /(createWorker|new Worker|new Queue|QueueManager)/.test(content) &&
      !/attempts|backoff|removeOnFail|removeOnComplete|rate limit|rateLimit/i.test(content)
    ) {
      riskFlags.push({ code: "queue_guardrails_missing", detail: "Queue usage appears without obvious retry/retention/backpressure controls in the same file.", weight: 15 });
    }

    if (
      runtimeLike &&
      !/createLogger|logger\.|incrementCounter|observeHistogram|setGauge/.test(content) &&
      /(express|Queue|Worker|axios|fetch|prisma|listen\(|router\.)/.test(content)
    ) {
      riskFlags.push({ code: "limited_observability", detail: "Runtime side effects appear without structured logging or metrics in the same file.", weight: 12 });
    }

    if (runtimeLike && relatedTests.length === 0) {
      riskFlags.push({ code: "no_related_test", detail: "No directly related automated test file was found by filename heuristic.", weight: 10 });
    }
  }

  let riskScore = classifyKind(relativePath) === "runtime" ? 20 : 0;
  if (classifyKind(relativePath) === "test") {
    riskScore += 5;
  }
  if (classifyKind(relativePath) === "infra" || classifyKind(relativePath) === "config") {
    riskScore += 10;
  }

  for (const riskFlag of riskFlags) {
    riskScore += riskFlag.weight;
  }

  if (runtimeLike && relatedTests.length > 0) {
    riskScore = Math.max(0, riskScore - 5);
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  let status = "OK";
  if (classifyKind(relativePath) === "historical" || classifyKind(relativePath) === "artifact") {
    status = "ORFAO";
  } else if (riskScore >= 70) {
    status = "CRITICO";
  } else if (riskScore >= 35) {
    status = "MELHORAR";
  }

  return { envVars, exports, imports, relatedTests, riskFlags, riskScore, status };
}

function inferPurpose(relativePath, kind, facts) {
  const exportSummary =
    facts.exports.length > 0
      ? `Declares exports such as ${summarizeList(facts.exports, 5)}.`
      : "No explicit named exports detected.";

  if (kind === "runtime") return `Executable source under ${getTopLevel(relativePath)}. ${exportSummary}`;
  if (kind === "test") return "Automated verification asset for runtime or package behavior.";
  if (kind === "infra") return `Infrastructure or delivery definition. ${exportSummary}`;
  if (kind === "config") return `Configuration or manifest file controlling runtime/build behavior. ${exportSummary}`;
  if (kind === "historical") return "Historical/reporting artifact preserved only for backup or repository hygiene reasons.";
  return "Documentation or non-runtime supporting material.";
}

function inferArchitecturalRole(relativePath, kind) {
  if (relativePath.startsWith("apps/api/")) return "API layer component.";
  if (relativePath.startsWith("apps/web/")) return "Web application component.";
  if (relativePath.startsWith("apps/worker/")) return "Background worker and queue execution component.";
  if (relativePath.startsWith("packages/")) return "Shared package surface used across the monorepo.";
  if (relativePath.startsWith("agents/")) return "Agent-specific runtime or support module.";
  if (kind === "infra") return "Infrastructure-as-code or delivery pipeline definition.";
  if (kind === "test") return "Verification and regression coverage surface.";
  if (kind === "doc" || kind === "historical") return "Non-executable supporting material.";
  return "Repository root or cross-cutting support file.";
}

function inferOperationalRelevance(relativePath, kind, evidenceIncluded) {
  if (!evidenceIncluded) {
    return `Excluded from the SaaS score as ${kind}; still inventoried for completeness.`;
  }
  if (relativePath.startsWith("apps/") || relativePath.startsWith("packages/") || relativePath.startsWith("agents/")) {
    return "Included in the SaaS score because it directly shapes runtime behavior or quality gates.";
  }
  if (kind === "infra" || kind === "config") {
    return "Included in the SaaS score because it affects deployment, security or environment control.";
  }
  return "Included in the SaaS score.";
}

function renderAnalysis(relativePath, entry, facts) {
  const evidenceLines = [
    `Kind: ${entry.kind}`,
    `Language: ${entry.language}`,
    `Top level: ${entry.top_level}`,
    `Size: ${entry.size} bytes`,
    `SHA-256: ${entry.sha256}`,
    `Direct imports/refs: ${summarizeList(facts.imports)}`,
    `Env vars: ${summarizeList(facts.envVars)}`,
    `Related tests: ${summarizeList(facts.relatedTests)}`
  ];
  const problems =
    facts.riskFlags.length === 0
      ? ["No heuristic issues were triggered by the static scan."]
      : facts.riskFlags.map((riskFlag) => `${riskFlag.code}: ${riskFlag.detail}`);

  return [
    `# ${relativePath}`,
    "",
    "## Purpose",
    `- ${inferPurpose(relativePath, entry.kind, facts)}`,
    "",
    "## Architectural Role",
    `- ${inferArchitecturalRole(relativePath, entry.kind)}`,
    "",
    "## Dependencies",
    `- Imports/refs: ${summarizeList(facts.imports)}`,
    `- Env vars: ${summarizeList(facts.envVars)}`,
    `- Related tests: ${summarizeList(facts.relatedTests)}`,
    "",
    "## Operational Relevance",
    `- ${inferOperationalRelevance(relativePath, entry.kind, entry.evidence_included)}`,
    "",
    "## Problems",
    ...problems.map((problem) => `- ${problem}`),
    "",
    "## Risk Score",
    `- ${facts.riskScore}/100`,
    "",
    "## Status",
    `- ${facts.status}`,
    "",
    "## Evidence",
    ...evidenceLines.map((line) => `- ${line}`),
    ""
  ].join("\n");
}

function summarizeChecks(checks) {
  return checks.map((check) => ({
    name: check.name,
    command: check.command,
    exit_code: check.exitCode,
    stdout: check.stdout,
    stderr: check.stderr
  }));
}

function buildChecks() {
  return [
    { name: "logger-tests", ...runCommand("corepack", ["pnpm", "--filter", "@birthub/logger", "test"]) },
    { name: "api-security-tests", ...runCommand("corepack", ["pnpm", "--filter", "@birthub/api", "test:security"]) },
    { name: "database-tests", ...runCommand("corepack", ["pnpm", "--filter", "@birthub/database", "test"]) }
  ];
}

function parseCheckSummary(check) {
  const text = `${check.stdout}\n${check.stderr}`;
  return {
    hasMaxListenersWarning: text.includes("MaxListenersExceededWarning"),
    passed: /pass\s+\d+/i.test(text) || /✔/u.test(text),
    skippedCount: Number((text.match(/skip(?:ped)?\s+(\d+)/i) ?? [])[1] ?? 0)
  };
}
