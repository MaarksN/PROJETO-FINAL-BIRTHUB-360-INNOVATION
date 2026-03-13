import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadManifestCatalog, runAgentDryRun } from "@birthub/agents-core";

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(scriptsDir, "..");
  const catalog = await loadManifestCatalog(path.join(root, "packages", "agent-packs"));

  const dryRunResults = await Promise.all(
    catalog.map(async (entry) => ({
      agentId: entry.manifest.agent.id,
      dryRun: await runAgentDryRun(entry.manifest)
    }))
  );

  const docsCoverage = await Promise.all(
    catalog.map(async (entry) => {
      const docPath = path.join(root, "docs", "agent-packs", `${entry.manifest.agent.id}.mdx`);
      return {
        agentId: entry.manifest.agent.id,
        exists: await fileExists(docPath)
      };
    })
  );

  const allDryRunsOk = dryRunResults.every((result) => result.dryRun.logs.length > 0);
  const docsOkCount = docsCoverage.filter((item) => item.exists).length;

  console.log("=== Cycle 5 Pack QA Report ===");
  console.log(`Catalog agents: ${catalog.length}`);
  console.log(`Dry-run success: ${allDryRunsOk ? "OK" : "FAIL"}`);
  console.log(`Docs coverage: ${docsOkCount}/${catalog.length}`);
}

void main();
