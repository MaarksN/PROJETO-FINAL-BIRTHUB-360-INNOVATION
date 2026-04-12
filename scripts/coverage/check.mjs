// @ts-nocheck
// 
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderCoverageDashboard } from "./render-dashboard.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const coverageDashboardPath = path.join(repoRoot, "docs", "evidence", "test-coverage-dashboard.md");
const coverageSummaryPath = path.join(repoRoot, "artifacts", "coverage", "summary.json");
const moduleCoveragePath = path.join(repoRoot, "artifacts", "testing", "module-coverage.json");

function assertFileExists(label, filePath) {
  if (existsSync(filePath)) {
    return;
  }

  throw new Error(`[coverage:check] missing ${label} at ${filePath}`);
}

function loadModuleCoverageSnapshot() {
  try {
    return JSON.parse(readFileSync(moduleCoveragePath, "utf8"));
  } catch (error) {
    throw new Error(`[coverage:check] failed to read ${moduleCoveragePath}: ${error.message}`);
  }
}

function loadCoverageSummary() {
  try {
    return JSON.parse(readFileSync(coverageSummaryPath, "utf8"));
  } catch (error) {
    throw new Error(`[coverage:check] failed to read ${coverageSummaryPath}: ${error.message}`);
  }
}

assertFileExists("coverage dashboard", coverageDashboardPath);
assertFileExists("coverage summary", coverageSummaryPath);
assertFileExists("module coverage snapshot", moduleCoveragePath);

const coverageSummary = loadCoverageSummary();
const snapshot = loadModuleCoverageSnapshot();
const status = snapshot.sufficient === false ? "WARN" : "OK";
const expectedDashboard = renderCoverageDashboard(coverageSummary);
const actualDashboard = readFileSync(coverageDashboardPath, "utf8");

if (actualDashboard !== expectedDashboard) {
  throw new Error(
    `[coverage:check] ${coverageDashboardPath} is out of sync with ${coverageSummaryPath}. Run pnpm coverage:dashboard.`
  );
}

console.log(`[coverage:check] dashboard ready at ${coverageDashboardPath}`);
console.log(`[coverage:check] module coverage mode: ${snapshot.mode ?? "unknown"}`);
console.log(`[coverage:check] module coverage sufficiency: ${status}`);

if (snapshot.sufficient === false) {
  console.warn(
    "[coverage:check] coverage snapshot marked insufficient; update tests or baseline before the next release gate."
  );
}
