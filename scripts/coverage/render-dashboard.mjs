// @ts-nocheck
//
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const summaryPath = path.join(repoRoot, "artifacts", "coverage", "summary.json");
const outputPath = path.join(repoRoot, "docs", "evidence", "test-coverage-dashboard.md");

function loadSummary() {
  return JSON.parse(readFileSync(summaryPath, "utf8"));
}

function formatPercent(value) {
  return `${Number(value ?? 0).toFixed(2)}%`;
}

function renderThresholds(thresholds) {
  if (!thresholds) {
    return "none";
  }

  return [
    `lines ${thresholds.lines}%`,
    `branches ${thresholds.branches}%`,
    `functions ${thresholds.functions}%`,
    `statements ${thresholds.statements}%`
  ].join(" | ");
}

function renderAlerts(alerts) {
  return Array.isArray(alerts) && alerts.length > 0 ? alerts.join("; ") : "none";
}

function renderSurface(surface) {
  return [
    `## ${surface.label}`,
    "",
    `- Lines: ${formatPercent(surface.coverage?.lines)}`,
    `- Branches: ${formatPercent(surface.coverage?.branches)}`,
    `- Functions: ${formatPercent(surface.coverage?.functions)}`,
    `- Statements: ${formatPercent(surface.coverage?.statements)}`,
    `- Command: \`${surface.command}\``,
    `- Thresholds: ${renderThresholds(surface.thresholds)}`,
    `- Alerts: ${renderAlerts(surface.alerts)}`,
    ""
  ].join("\n");
}

export function renderCoverageDashboard(summary) {
  const lines = [
    "# Test Coverage Dashboard",
    "",
    `- Generated at: ${summary.generatedAt}`,
    `- Surfaces: ${summary.surfaces.length}`,
    `- Status: ${summary.ok ? "PASS" : "FAIL"}`,
    ""
  ];

  for (const surface of summary.surfaces) {
    lines.push(renderSurface(surface));
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function main() {
  const summary = loadSummary();
  const markdown = renderCoverageDashboard(summary);

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, markdown, "utf8");
  console.log(`[coverage:dashboard] rendered ${path.relative(repoRoot, outputPath)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
