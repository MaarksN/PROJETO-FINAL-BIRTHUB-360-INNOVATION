// @ts-nocheck
// 
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type ReleaseTarget = "production" | "staging";
type ReleaseStage = "all" | "bundle" | "preflight" | "rollback" | "smoke";

type CheckResult = {
  detail: string;
  ok: boolean;
  path: string;
};

function parseFlag(name: string): string | undefined {
  const match = process.argv.find((item) => item.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

function parseTarget(): ReleaseTarget {
  const raw = parseFlag("--target");
  if (raw === "production" || raw === "staging") {
    return raw;
  }

  throw new Error("Missing or invalid --target flag. Use --target=staging or --target=production.");
}

function parseStage(): ReleaseStage {
  const raw = parseFlag("--stage") ?? "all";
  if (raw === "all" || raw === "bundle" || raw === "preflight" || raw === "rollback" || raw === "smoke") {
    return raw;
  }

  throw new Error("Missing or invalid --stage flag. Use --stage=preflight|smoke|rollback|bundle|all.");
}

function summaryPath(target: ReleaseTarget, stage: ReleaseStage): string {
  return resolve(process.cwd(), "artifacts", "release", `${target}-${stage}-evidence-summary.json`);
}

async function ensureFile(relativePath: string): Promise<CheckResult> {
  const absolutePath = resolve(process.cwd(), relativePath);

  try {
    await access(absolutePath);
    return {
      detail: "present",
      ok: true,
      path: relativePath
    };
  } catch {
    return {
      detail: "missing",
      ok: false,
      path: relativePath
    };
  }
}

async function ensureJsonOk(relativePath: string, expectedTarget?: ReleaseTarget): Promise<CheckResult> {
  const presence = await ensureFile(relativePath);
  if (!presence.ok) {
    return presence;
  }

  const raw = await readFile(resolve(process.cwd(), relativePath), "utf8");
  const payload = JSON.parse(raw);

  if (payload.ok !== true) {
    return {
      detail: "json present but ok != true",
      ok: false,
      path: relativePath
    };
  }

  if (expectedTarget && payload.target && payload.target !== expectedTarget) {
    return {
      detail: `json target mismatch (${payload.target})`,
      ok: false,
      path: relativePath
    };
  }

  return {
    detail: "json ok=true",
    ok: true,
    path: relativePath
  };
}

async function stageChecks(target: ReleaseTarget, stage: ReleaseStage): Promise<CheckResult[]> {
  const checks: CheckResult[] = [];

  if (stage === "preflight" || stage === "all") {
    checks.push(
      await ensureJsonOk(
        `artifacts/release/${target === "staging" ? "staging" : "production"}-preflight-summary.json`,
        target
      )
    );
  }

  if (stage === "smoke" || stage === "all") {
    checks.push(await ensureJsonOk("artifacts/release/smoke-summary.json"));
  }

  if (stage === "rollback" || stage === "all") {
    checks.push(
      await ensureJsonOk(
        `artifacts/release/${target === "staging" ? "staging" : "production"}-rollback-evidence.json`,
        target
      )
    );
  }

  if (stage === "bundle" || stage === "all") {
    checks.push(await ensureFile("artifacts/release/checksums-manifest.sha256"));
    checks.push(await ensureFile("artifacts/release/release-artifact-catalog.json"));
    checks.push(await ensureFile("artifacts/sbom/bom.xml"));
    checks.push(await ensureFile("artifacts/sbom/sbom.spdx.json"));
    checks.push(await ensureFile("releases/manifests/release_artifact_catalog.md"));
    checks.push(await ensureFile("releases/notes/v1.0.0.md"));
  }

  return checks;
}

async function main() {
  const target = parseTarget();
  const stage = parseStage();
  const checks = await stageChecks(target, stage);
  const ok = checks.every((check) => check.ok);
  const report = {
    checkedAt: new Date().toISOString(),
    checks,
    ok,
    stage,
    target
  };

  const outputPath = summaryPath(target, stage);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(
    outputPath.replace(/\.json$/i, ".txt"),
    [
      `Target: ${target}`,
      `Stage: ${stage}`,
      `Checked at: ${report.checkedAt}`,
      ...checks.map((check) => `${check.ok ? "PASS" : "FAIL"} ${check.path} (${check.detail})`),
      `Status: ${ok ? "PASS" : "FAIL"}`
    ].join("\n"),
    "utf8"
  );

  if (!ok) {
    const failed = checks
      .filter((check) => !check.ok)
      .map((check) => `${check.path} (${check.detail})`)
      .join(", ");
    throw new Error(`Release evidence verification failed for ${stage}/${target}: ${failed}`);
  }

  console.log(JSON.stringify(report, null, 2));
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
