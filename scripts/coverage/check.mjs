import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const coverageDashboardPath = path.join(repoRoot, "docs", "evidence", "test-coverage-dashboard.md");
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

assertFileExists("coverage dashboard", coverageDashboardPath);
assertFileExists("module coverage snapshot", moduleCoveragePath);

const snapshot = loadModuleCoverageSnapshot();
const status = snapshot.sufficient === false ? "WARN" : "OK";

console.log(`[coverage:check] dashboard ready at ${coverageDashboardPath}`);
console.log(`[coverage:check] module coverage mode: ${snapshot.mode ?? "unknown"}`);
console.log(`[coverage:check] module coverage sufficiency: ${status}`);

if (snapshot.sufficient === false) {
  console.warn(
    "[coverage:check] coverage snapshot marked insufficient; update tests or baseline before the next release gate."
  );
}
