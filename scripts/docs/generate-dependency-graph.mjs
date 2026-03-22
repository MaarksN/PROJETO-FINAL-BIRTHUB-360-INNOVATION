#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "docs", "f10", "dependency-graph.md");
const skip = new Set([".git", ".next", ".turbo", "artifacts", "coverage", "dist", "node_modules", "test-results"]);
const manifests = [];
const byName = new Map();

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(target);
      continue;
    }
    if (entry.name === "package.json") {
      const data = JSON.parse(fs.readFileSync(target, "utf8"));
      manifests.push({
        name: data.name ?? path.basename(path.dirname(target)),
        group: path.relative(root, path.dirname(target)).split(path.sep)[0],
        deps: { ...data.dependencies, ...data.devDependencies, ...data.peerDependencies, ...data.optionalDependencies }
      });
    }
  }
}

walk(root);
for (const item of manifests) byName.set(item.name, item);
const edges = [];
for (const item of manifests) {
  for (const dep of Object.keys(item.deps ?? {}).filter((name) => byName.has(name)).sort()) {
    edges.push([item.name, dep]);
  }
}
const top = [...edges.reduce((map, [from]) => map.set(from, (map.get(from) ?? 0) + 1), new Map())].sort((a, b) => b[1] - a[1]).slice(0, 10);
const id = (value) => value.replace(/[^A-Za-z0-9_]/g, "_");
const groups = {
  apps: manifests.filter((item) => item.group === "apps").sort((a, b) => a.name.localeCompare(b.name)),
  packages: manifests.filter((item) => item.group === "packages").sort((a, b) => a.name.localeCompare(b.name)),
  agents: manifests.filter((item) => item.group === "agents").sort((a, b) => a.name.localeCompare(b.name))
};
const lines = [
  "# Dependency Graph",
  "",
  "Atualizado automaticamente via `pnpm docs:dependency-graph`.",
  "",
  `- Manifestos analisados: ${manifests.length}`,
  `- Dependencias internas mapeadas: ${edges.length}`,
  "",
  "## Hotspots",
  "",
  "| Pacote | Dependencias internas declaradas |",
  "| --- | --- |"
];
for (const [name, count] of top) lines.push(`| \`${name}\` | ${count} |`);
lines.push("", "## Mermaid", "", "```mermaid", "graph TD");
for (const [group, items] of Object.entries(groups)) {
  lines.push(`  subgraph ${group}[${group}]`);
  for (const item of items) lines.push(`    ${id(item.name)}["${item.name}"]`);
  lines.push("  end");
}
for (const [from, to] of edges) lines.push(`  ${id(from)} --> ${id(to)}`);
lines.push("```", "", "## Legend", "", "- `apps/*`: superficies de entrega.", "- `packages/*`: contratos e bibliotecas.", "- `agents/*`: workers e componentes especializados.");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${lines.join("\n")}\n`);
console.log(`Dependency graph written to ${path.relative(root, output)}`);
