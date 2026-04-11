#!/usr/bin/env node
// @ts-nocheck
// 
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { buildEnv, projectRoot } from "./shared.mjs";

const baselinePath = path.join(projectRoot, "artifacts", "quality", "ts-directives-baseline.json");
const shouldWriteBaseline = process.argv.includes("--write-baseline");
const trackedFiles = execSync("git ls-files", {
  cwd: projectRoot,
  encoding: "utf8",
  env: buildEnv()
})
  .trim()
  .split(/\r?\n/u)
  .filter(Boolean);

const sourceFiles = trackedFiles.filter((file) => /\.(ts|tsx|mts|cts)$/i.test(file));

function hasJustification(rawTail) {
  const normalized = rawTail.replace(/^[-:]+\s*/u, "").trim();
  return normalized.length >= 12;
}

function normalizeViolations(values) {
  return [...new Set(values.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

function collectViolations() {
  const noCheckViolations = [];
  const tsIgnoreViolations = [];

  for (const relativePath of sourceFiles) {
    const absolutePath = path.join(projectRoot, relativePath);
    const content = readFileSync(absolutePath, "utf8");
    const lines = content.split(/\r?\n/u);

    for (const [index, line] of lines.entries()) {
      const lineNumber = index + 1;
      const noCheckMatch = line.match(/@ts-nocheck\b/u);
      if (noCheckMatch) {
        noCheckViolations.push(`${relativePath.replaceAll("\\", "/")}:${lineNumber}`);
        continue;
      }

      const ignoreMatch = line.match(/@ts-ignore\b(.*)$/u);
      if (!ignoreMatch) {
        continue;
      }

      if (!hasJustification(ignoreMatch[1] ?? "")) {
        tsIgnoreViolations.push(`${relativePath.replaceAll("\\", "/")}:${lineNumber}`);
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    noCheck: normalizeViolations(noCheckViolations),
    scannedFiles: sourceFiles.length,
    tsIgnore: normalizeViolations(tsIgnoreViolations)
  };
}

function readBaseline() {
  if (!existsSync(baselinePath)) {
    return null;
  }

  const raw = JSON.parse(readFileSync(baselinePath, "utf8"));
  return {
    formatVersion: Number(raw.formatVersion ?? 1),
    generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : null,
    noCheck: normalizeViolations(Array.isArray(raw.noCheck) ? raw.noCheck : []),
    scannedFiles: Number(raw.scannedFiles ?? 0),
    tsIgnore: normalizeViolations(Array.isArray(raw.tsIgnore) ? raw.tsIgnore : [])
  };
}

function writeBaseline(snapshot) {
  mkdirSync(path.dirname(baselinePath), { recursive: true });
  writeFileSync(
    baselinePath,
    `${JSON.stringify(
      {
        formatVersion: 1,
        generatedAt: snapshot.generatedAt,
        noCheck: snapshot.noCheck,
        scannedFiles: snapshot.scannedFiles,
        tsIgnore: snapshot.tsIgnore
      },
      null,
      2
    )}\n`,
    "utf8"
  );
}

function diffViolations(current, baseline) {
  const baselineSet = new Set(baseline);
  return current.filter((value) => !baselineSet.has(value));
}

const current = collectViolations();

if (shouldWriteBaseline) {
  writeBaseline(current);
  console.log(
    `[ts-directives-guard] baseline updated at ${path.relative(projectRoot, baselinePath).replaceAll("\\", "/")}`
  );
  console.log(
    `[ts-directives-guard] captured ${current.noCheck.length} @ts-nocheck and ${current.tsIgnore.length} unjustified @ts-ignore directives`
  );
  process.exit(0);
}

const baseline = readBaseline();

if (!baseline) {
  console.error("[ts-directives-guard] FAILED");
  console.error(
    `- Baseline file is missing: ${path.relative(projectRoot, baselinePath).replaceAll("\\", "/")}`
  );
  console.error("- Run `node scripts/ci/ts-directives-guard.mjs --write-baseline` to capture the current debt.");
  process.exit(1);
}

const newNoCheckViolations = diffViolations(current.noCheck, baseline.noCheck);
const newTsIgnoreViolations = diffViolations(current.tsIgnore, baseline.tsIgnore);
const retiredNoCheckViolations = diffViolations(baseline.noCheck, current.noCheck);
const retiredTsIgnoreViolations = diffViolations(baseline.tsIgnore, current.tsIgnore);

if (newNoCheckViolations.length > 0 || newTsIgnoreViolations.length > 0) {
  console.error("[ts-directives-guard] FAILED");
  console.error(
    `- Baseline: ${baseline.noCheck.length} @ts-nocheck, ${baseline.tsIgnore.length} unjustified @ts-ignore`
  );
  console.error(
    `- Current: ${current.noCheck.length} @ts-nocheck, ${current.tsIgnore.length} unjustified @ts-ignore`
  );

  if (newNoCheckViolations.length > 0) {
    console.error("- New @ts-nocheck directives exceed the committed baseline:");
    for (const violation of newNoCheckViolations) {
      console.error(`  - ${violation}`);
    }
  }

  if (newTsIgnoreViolations.length > 0) {
    console.error("- New @ts-ignore directives require inline justification (>=12 chars after directive):");
    for (const violation of newTsIgnoreViolations) {
      console.error(`  - ${violation}`);
    }
  }

  process.exitCode = 1;
} else {
  console.log("[ts-directives-guard] OK");
  console.log(
    `- Baseline preserved at ${current.noCheck.length} @ts-nocheck and ${current.tsIgnore.length} unjustified @ts-ignore`
  );
  if (retiredNoCheckViolations.length > 0 || retiredTsIgnoreViolations.length > 0) {
    console.log(
      `- Improvements detected: ${retiredNoCheckViolations.length} @ts-nocheck and ${retiredTsIgnoreViolations.length} @ts-ignore removed from baseline coverage`
    );
  }
}
