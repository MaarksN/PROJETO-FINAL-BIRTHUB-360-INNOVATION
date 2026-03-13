import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadManifestCatalog } from "@birthub/agents-core";

function toDocSlug(agentId: string): string {
  return agentId.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

async function main(): Promise<void> {
  const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(scriptsDir, "..");
  const catalogDir = path.join(root, "packages", "agent-packs");
  const outputDir = path.join(root, "docs", "agent-packs");

  const catalog = await loadManifestCatalog(catalogDir);
  await mkdir(outputDir, { recursive: true });

  for (const entry of catalog) {
    const { manifest } = entry;
    const outputPath = path.join(outputDir, `${toDocSlug(manifest.agent.id)}.mdx`);

    const content = [
      `# ${manifest.agent.name}`,
      "",
      manifest.agent.description,
      "",
      "## Prompt",
      manifest.agent.prompt,
      "",
      "## Tags",
      `- domain: ${manifest.tags.domain.join(", ")}`,
      `- level: ${manifest.tags.level.join(", ")}`,
      `- persona: ${manifest.tags.persona.join(", ")}`,
      `- use-case: ${manifest.tags["use-case"].join(", ")}`,
      `- industry: ${manifest.tags.industry.join(", ")}`,
      "",
      "## Skills",
      ...manifest.skills.map((skill) => `- **${skill.name}**: ${skill.description}`),
      "",
      "## Tools",
      ...manifest.tools.map((tool) => `- **${tool.name}**: ${tool.description}`),
      "",
      "## Changelog",
      ...(manifest.agent.changelog.length > 0
        ? manifest.agent.changelog.map((line) => `- ${line}`)
        : ["- No changelog entries."])
    ].join("\n");

    await writeFile(outputPath, `${content}\n`, "utf8");
  }

  console.log(`Generated docs for ${catalog.length} agents in docs/agent-packs.`);
}

void main();
