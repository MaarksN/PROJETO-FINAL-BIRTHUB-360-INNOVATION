#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const report = path.join(root, "artifacts", "documentation", "link-check-report.md");
const skip = new Set([".git", ".next", ".turbo", "artifacts", "coverage", "dist", "node_modules", "test-results"]);
const files = [];
const broken = [];
const warnings = [];

function walk(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (/\.(md|mdx)$/i.test(target)) files.push(target);
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    walk(path.join(target, entry.name));
  }
}

function slug(value) {
  return value.toLowerCase().trim().replace(/[`*_~[\](){}:;'",.?!/\\|+=<>@#$%^&]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function headings(file) {
  return new Set([...fs.readFileSync(file, "utf8").matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => slug(match[1])));
}

function resolveTarget(file, raw) {
  const target = raw.trim().replace(/^<|>$/g, "").split(/\s+/)[0];
  if (!target || /^https?:\/\//i.test(target) || target.startsWith("mailto:") || target.startsWith("data:") || target.startsWith("tel:")) return;
  if (/^[A-Za-z]:[\\/]/.test(target)) {
    warnings.push(`- \`${path.relative(root, file)}\` -> \`${target}\` (absolute local path)`);
    return;
  }
  const [filePart, anchor] = target.split("#");
  const resolved = target.startsWith("#") ? file : (filePart.startsWith("/") ? path.join(root, filePart.slice(1)) : path.resolve(path.dirname(file), filePart));
  let finalTarget = resolved;
  if (!fs.existsSync(finalTarget)) {
    if (fs.existsSync(`${finalTarget}.md`)) finalTarget = `${finalTarget}.md`;
    else if (fs.existsSync(path.join(finalTarget, "README.md"))) finalTarget = path.join(finalTarget, "README.md");
    else {
      broken.push(`- \`${path.relative(root, file)}\` -> \`${target}\` (target missing)`);
      return;
    }
  }
  if (anchor) {
    const known = headings(finalTarget);
    if (!known.has(slug(anchor))) broken.push(`- \`${path.relative(root, file)}\` -> \`${target}\` (anchor missing)`);
  }
}

walk(path.join(root, "README.md"));
walk(path.join(root, "docs"));
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  for (const match of content.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)) resolveTarget(file, match[1]);
}

const lines = [
  "# Documentation Link Check",
  "",
  `Files scanned: ${files.length}`,
  `Broken links: ${broken.length}`,
  `Warnings: ${warnings.length}`,
  ""
];
if (broken.length) lines.push("## Broken links", "", ...broken, "");
if (warnings.length) lines.push("## Warnings", "", ...warnings, "");
if (!broken.length) lines.push("All repo-relative documentation links resolved successfully.");
fs.mkdirSync(path.dirname(report), { recursive: true });
fs.writeFileSync(report, `${lines.join("\n")}\n`);
console.log(lines.join("\n"));
if (broken.length) process.exit(1);
