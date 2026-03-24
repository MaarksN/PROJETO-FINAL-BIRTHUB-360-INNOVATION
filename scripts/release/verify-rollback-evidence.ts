import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type RollbackTarget = "production" | "staging";

function parseFlag(name: string): string | undefined {
  const match = process.argv.find((item) => item.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

function parseTarget(): RollbackTarget {
  const value = parseFlag("--target");
  if (value === "staging" || value === "production") {
    return value;
  }

  throw new Error("Missing or invalid --target flag. Use --target=staging or --target=production.");
}

function validateEvidenceRef(raw: string | undefined): string {
  const evidence = raw?.trim() ?? "";
  if (!evidence) {
    throw new Error("Missing --evidence value. Provide an incident ticket, runbook URL or artifact URI.");
  }

  const normalized = evidence.toLowerCase();
  if (["todo", "replace", "placeholder", "changeme"].some((token) => normalized.includes(token))) {
    throw new Error("Rollback evidence contains placeholder markers and is not valid.");
  }

  if (evidence.length < 12) {
    throw new Error("Rollback evidence reference is too short. Use a verifiable identifier.");
  }

  return evidence;
}

async function main() {
  const target = parseTarget();
  const evidence = validateEvidenceRef(parseFlag("--evidence"));
  const outputPath =
    parseFlag("--output") ??
    resolve(process.cwd(), "artifacts", "release", `${target}-rollback-evidence.json`);

  const report = {
    checkedAt: new Date().toISOString(),
    evidence,
    ok: true,
    target
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2), "utf8");
  await writeFile(
    outputPath.replace(/\.json$/i, ".txt"),
    [`Target: ${target}`, `Checked at: ${report.checkedAt}`, `Evidence: ${evidence}`, "Status: PASS"].join("\n"),
    "utf8"
  );

  console.log(JSON.stringify(report, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
