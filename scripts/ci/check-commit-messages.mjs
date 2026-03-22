#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { projectRoot } from "./shared.mjs";

const allowlistPath = path.join(projectRoot, ".github", "commit-message-allowlist.txt");
const conventionalPattern =
  /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\([^)]+\))?!?: .+/;
const extraAllowedPatterns = [/^Merge .+/, /^Revert ".+"/];

function gitCapture(args, allowFailure = false) {
  try {
    return execSync(`git ${args.join(" ")}`, {
      cwd: projectRoot,
      encoding: "utf8"
    }).trim();
  } catch (error) {
    if (allowFailure) {
      return "";
    }
    throw error;
  }
}

function hasRef(ref) {
  return Boolean(gitCapture(["rev-parse", "--verify", ref], true));
}

function resolveBaseRef() {
  const explicitBase = process.env.COMMIT_CHECK_BASE?.trim();
  if (explicitBase && hasRef(explicitBase)) {
    return explicitBase;
  }

  const githubBaseRef = process.env.GITHUB_BASE_REF?.trim();
  if (githubBaseRef) {
    const remoteRef = `origin/${githubBaseRef}`;
    if (hasRef(remoteRef)) {
      return remoteRef;
    }
  }

  return hasRef("HEAD~1") ? "HEAD~1" : null;
}

function loadAllowlist() {
  if (!existsSync(allowlistPath)) {
    return [];
  }

  return readFileSync(allowlistPath, "utf8")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/u)[0]);
}

function listCommitSubjects(baseRef) {
  const output = baseRef
    ? gitCapture(["log", "--format=%H%x09%s", `${baseRef}..HEAD`], true)
    : gitCapture(["log", "--format=%H%x09%s", "-1", "HEAD"], true);

  if (!output) {
    return [];
  }

  return output
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sha = "", subject = ""] = line.split("\t");
      return { sha, subject };
    });
}

function isAllowedSubject(subject) {
  return conventionalPattern.test(subject) || extraAllowedPatterns.some((pattern) => pattern.test(subject));
}

try {
  const allowlist = loadAllowlist();
  const baseRef = resolveBaseRef();
  const commits = listCommitSubjects(baseRef);
  const invalidCommits = commits.filter(({ sha, subject }) => {
    const allowlisted = allowlist.some((entry) => sha.startsWith(entry));
    return !allowlisted && !isAllowedSubject(subject);
  });

  if (invalidCommits.length > 0) {
    console.error("[commit-check] FAILED");
    for (const invalidCommit of invalidCommits) {
      console.error(`- ${invalidCommit.sha.slice(0, 7)} ${invalidCommit.subject}`);
    }
    console.error(
      `Add only temporary legacy exceptions to ${path.relative(projectRoot, allowlistPath).replaceAll("\\", "/")}.`
    );
    process.exitCode = 1;
  } else {
    console.log(
      `[commit-check] ok (${commits.length} commit${commits.length === 1 ? "" : "s"} validated${baseRef ? ` against ${baseRef}` : ""})`
    );
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[commit-check] FAILED: ${message}`);
  process.exitCode = 1;
}
