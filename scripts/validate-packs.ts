import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AgentManifestParseError, parseAgentManifest } from "@birthub/agents-core";

async function findManifestFiles(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const manifestFiles: string[] = [];

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      manifestFiles.push(...(await findManifestFiles(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name === "manifest.json") {
      manifestFiles.push(entryPath);
    }
  }

  return manifestFiles;
}

async function main(): Promise<void> {
  const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = path.resolve(scriptsDir, "..");
  const catalogRoot = path.join(workspaceRoot, "packages", "agent-packs");
  const manifestFiles = await findManifestFiles(catalogRoot);

  if (manifestFiles.length === 0) {
    throw new Error("No manifest files found under packages/agent-packs.");
  }

  const failures: Array<{ filePath: string; issues: string[] }> = [];

  for (const filePath of manifestFiles) {
    const fileContent = await readFile(filePath, "utf8");

    try {
      parseAgentManifest(JSON.parse(fileContent) as unknown);
    } catch (error) {
      if (error instanceof AgentManifestParseError) {
        failures.push({
          filePath,
          issues: error.issues
        });
      } else {
        failures.push({
          filePath,
          issues: [error instanceof Error ? error.message : "Unknown parser error"]
        });
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`\n[INVALID MANIFEST] ${failure.filePath}`);
      for (const issue of failure.issues) {
        console.error(`- ${issue}`);
      }
    }

    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${manifestFiles.length} manifests successfully.`);
}

void main();
