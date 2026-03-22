import { workspaceRoot } from "./lib/paths.js";
import { collectRepoTextFiles } from "./lib/repo-scan.js";
import { writeJsonReport, writeTextReport } from "./lib/report.js";

type QueryJoinFinding = {
  issues: string[];
  path: string;
};

function shouldInspect(relativePath: string): boolean {
  return !relativePath.startsWith("packages/database/prisma/migrations/");
}

async function main(): Promise<void> {
  const files = (await collectRepoTextFiles(workspaceRoot)).filter((file) => shouldInspect(file.relativePath));
  const findings: QueryJoinFinding[] = [];
  const issues: string[] = [];

  for (const file of files) {
    const hasJoin = /\bJOIN\b/i.test(file.content);
    const isRawSql = /\$(queryRaw|executeRaw)|prisma\.[A-Za-z0-9_]+\.findMany\(|SELECT\s+/i.test(file.content);

    if (!hasJoin || !isRawSql) {
      continue;
    }

    const localIssues: string[] = [];
    const hasTenantFilter = /(tenantId|tenant_id|get_current_tenant_id|app\.current_tenant_id)/i.test(file.content);

    if (!hasTenantFilter) {
      localIssues.push(`${file.relativePath}: JOIN detected without an explicit tenant filter marker.`);
    }

    findings.push({
      issues: localIssues,
      path: file.relativePath
    });
    issues.push(...localIssues);
  }

  const report = {
    checkedAt: new Date().toISOString(),
    findings,
    issues,
    ok: issues.length === 0
  };

  const text = [
    `Raw JOIN audit: ${report.ok ? "PASS" : "FAIL"}`,
    ...findings.map((finding) => `${finding.issues.length === 0 ? "PASS" : "FAIL"} ${finding.path}`),
    ...(issues.length === 0 ? [] : ["", ...issues])
  ].join("\n");

  const jsonPath = await writeJsonReport("f8/raw-join-audit-report.json", report);
  const txtPath = await writeTextReport("f8/raw-join-audit-report.txt", text);

  console.log(`${text}\n\nArtifacts:\n- ${jsonPath}\n- ${txtPath}`);

  if (!report.ok) {
    process.exitCode = 1;
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
