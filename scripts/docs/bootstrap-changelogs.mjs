#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const skip = new Set([".git", ".next", ".turbo", "artifacts", "coverage", "dist", "node_modules", "test-results"]);
const manifests = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(target);
      continue;
    }
    if (entry.name === "package.json" || entry.name === "pyproject.toml") manifests.push(target);
  }
}

function meta(file) {
  if (path.basename(file) === "package.json") {
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    return { name: json.name ?? path.basename(path.dirname(file)), version: json.version ?? "0.1.0" };
  }
  const content = fs.readFileSync(file, "utf8");
  const name = content.match(/^name\s*=\s*["'](.+?)["']/m)?.[1] ?? path.basename(path.dirname(file));
  return { name, version: "0.1.0" };
}

walk(root);
let created = 0;
for (const manifest of manifests) {
  const dir = path.dirname(manifest);
  const changelog = path.join(dir, "CHANGELOG.md");
  if (fs.existsSync(changelog)) continue;
  const info = meta(manifest);
  const body = [
    "# Changelog",
    "",
    `All notable changes to \`${info.name}\` will be documented in this file.`,
    "",
    "The format is based on Keep a Changelog and Semantic Versioning.",
    "",
    "## [Unreleased]",
    "",
    "### Added",
    "- Initial changelog scaffold created during the F10 documentation hardening pass.",
    "",
    `## [${info.version}] - 2026-03-20`,
    "",
    "### Added",
    "- Baseline entry registered for canonical release readiness."
  ];
  fs.writeFileSync(changelog, `${body.join("\n")}\n`);
  created += 1;
}
console.log(`Created ${created} changelog files.`);
