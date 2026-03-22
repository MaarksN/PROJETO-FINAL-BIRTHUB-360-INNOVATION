#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tracker = JSON.parse(fs.readFileSync(path.join(root, "docs", "technical-debt", "tracker.json"), "utf8"));
const items = tracker.items;
const dashboard = path.join(root, "docs", "technical-debt", "dashboard.md");
const velocity = path.join(root, "docs", "technical-debt", "velocity.md");
const ratio = path.join(root, "docs", "technical-debt", "debt-feature-ratio.md");
const executive = path.join(root, "docs", "technical-debt", "executive-report.md");
const artifact = path.join(root, "artifacts", "documentation", "technical-health-dashboard.md");
const byStatus = items.reduce((map, item) => map.set(item.status, (map.get(item.status) ?? 0) + 1), new Map());
const byDomain = items.reduce((map, item) => map.set(item.domain, (map.get(item.domain) ?? 0) + 1), new Map());
const open = items.filter((item) => item.status !== "closed");
const closed = items.filter((item) => item.status === "closed");
const dashLines = [
  "# Technical Health Dashboard",
  "",
  `Sprint atual: \`${tracker.currentSprint}\``,
  "",
  `- Itens monitorados: ${items.length}`,
  `- Itens fechados: ${closed.length}`,
  `- Itens abertos: ${open.length}`,
  "",
  "## Status",
  "",
  "| Status | Quantidade |",
  "| --- | --- |"
];
for (const [status, count] of [...byStatus.entries()].sort((a, b) => a[0].localeCompare(b[0]))) dashLines.push(`| \`${status}\` | ${count} |`);
dashLines.push("", "## Domains", "", "| Dominio | Itens |", "| --- | --- |");
for (const [domain, count] of [...byDomain.entries()].sort((a, b) => b[1] - a[1])) dashLines.push(`| \`${domain}\` | ${count} |`);
dashLines.push("", "## Tracker snapshot", "", "| ID | Titulo | Status | Prioridade | Owner | Risco |", "| --- | --- | --- | --- | --- | --- |");
for (const item of items) dashLines.push(`| \`${item.id}\` | ${item.title} | \`${item.status}\` | \`${item.priority}\` | ${item.owner} | \`${item.residualRisk}\` |`);
const velocityLines = ["# Technical Debt Velocity", "", "| Sprint | Opened | Closed | Net |", "| --- | --- | --- | --- |"]; 
for (const row of tracker.velocity) velocityLines.push(`| \`${row.sprint}\` | ${row.opened} | ${row.closed} | ${row.closed - row.opened} |`);
const ratioLines = ["# Debt-to-Feature Ratio", "", "| Sprint | Debt closed | Features closed | Ratio |", "| --- | --- | --- | --- |"]; 
for (const row of tracker.debtFeatureRatio) ratioLines.push(`| \`${row.sprint}\` | ${row.debtClosed} | ${row.featuresClosed} | ${row.ratio.toFixed(2)} |`);
const executiveLines = [
  "# Executive Technical Health Report",
  "",
  `Resumo mensal da sprint \`${tracker.currentSprint}\`.`,
  "",
  `- Backlog aberto: ${open.length}`,
  `- Debt fechado no programa F10: ${closed.length}`,
  `- Maior risco remanescente: ${open.filter((item) => item.residualRisk === "high").map((item) => item.title).join("; ") || "nenhum"}`,
  "",
  "## Focus areas",
  "",
  "| Dominio | Risco | Acao recomendada |",
  "| --- | --- | --- |"
];
for (const row of tracker.focusAreas) executiveLines.push(`| \`${row.domain}\` | \`${row.risk}\` | ${row.action} |`);
for (const file of [dashboard, velocity, ratio, executive, artifact]) fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(dashboard, `${dashLines.join("\n")}\n`);
fs.writeFileSync(artifact, `${dashLines.join("\n")}\n`);
fs.writeFileSync(velocity, `${velocityLines.join("\n")}\n`);
fs.writeFileSync(ratio, `${ratioLines.join("\n")}\n`);
fs.writeFileSync(executive, `${executiveLines.join("\n")}\n`);
console.log(`Technical health dashboard written to ${path.relative(root, artifact)}`);
