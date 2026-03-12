#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const PACKAGES_DIRS = ["packages", "services", "agents"];
const TARGET_EXPORTS = [
  "ForbiddenError",
  "UnauthorizedError",
  "NotFoundError",
  "ValidationError",
];

const FLAGS = new Set(process.argv.slice(2));
const APPLY = FLAGS.has("--apply");
const BUILD = FLAGS.has("--build");

function exists(p) {
  return fs.existsSync(p);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function getAllPackageDirs() {
  const out = [];

  for (const base of PACKAGES_DIRS) {
    const absBase = path.join(ROOT, base);
    if (!exists(absBase)) continue;

    for (const entry of fs.readdirSync(absBase, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const pkgDir = path.join(absBase, entry.name);
      if (exists(path.join(pkgDir, "package.json"))) out.push(pkgDir);
    }
  }

  return out;
}

function listTsFilesRecursively(dir) {
  const out = [];

  function walk(curr) {
    for (const entry of fs.readdirSync(curr, { withFileTypes: true })) {
      const abs = path.join(curr, entry.name);

      if (entry.isDirectory()) {
        if (["dist", "node_modules", "__tests__", "tests"].includes(entry.name)) continue;
        walk(abs);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;
      if (entry.name.endsWith(".d.ts")) continue;

      out.push(abs);
    }
  }

  walk(dir);
  return out;
}

function parseNamedExports(tsCode) {
  const names = new Set();

  for (const m of tsCode.matchAll(/export\s+class\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  for (const m of tsCode.matchAll(/export\s+function\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);
  for (const m of tsCode.matchAll(/export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)/g)) names.add(m[1]);

  for (const m of tsCode.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const raw of m[1].split(",")) {
      const [left] = raw.trim().split(/\s+as\s+/i);
      if (left?.trim()) names.add(left.trim());
    }
  }

  return [...names];
}

function findSourceExports(pkgDir) {
  const srcDir = path.join(pkgDir, "src");
  const byFile = {};

  if (!exists(srcDir)) return byFile;

  for (const abs of listTsFilesRecursively(srcDir)) {
    const relFromSrc = path.relative(srcDir, abs).replace(/\\/g, "/");
    const code = fs.readFileSync(abs, "utf8");
    const names = parseNamedExports(code);
    if (names.length > 0) byFile[relFromSrc] = names;
  }

  return byFile;
}

function extractCurrentBarrelTargets(indexCode) {
  const targets = new Set();
  for (const m of indexCode.matchAll(/export\s+\*\s+from\s+["'](.+?)["']/g)) {
    targets.add(m[1]);
  }
  return targets;
}

function ensureIndexBarrel(pkgDir, sourceExports) {
  const srcDir = path.join(pkgDir, "src");
  const indexFile = path.join(srcDir, "index.ts");

  if (!exists(srcDir)) return { changed: false, notes: ["sem src/"] };

  const current = exists(indexFile) ? fs.readFileSync(indexFile, "utf8") : "";
  const currentTargets = extractCurrentBarrelTargets(current);

  const additions = [];

  for (const relFile of Object.keys(sourceExports).sort((a, b) => a.localeCompare(b))) {
    if (relFile === "index.ts") continue;

    const base = `./${relFile.replace(/\.(tsx?|mts|cts)$/, "").replace(/\\/g, "/")}`;
    if (currentTargets.has(base) || currentTargets.has(`${base}.js`) || currentTargets.has(relFile)) {
      continue;
    }

    additions.push(`export * from "${base}";`);
  }

  if (!additions.length) return { changed: false, notes: [] };

  if (APPLY) {
    const next = `${current.trimEnd()}${current.trim() ? "\n\n" : ""}${additions.join("\n")}\n`;
    ensureDir(indexFile);
    fs.writeFileSync(indexFile, next, "utf8");
  }

  return { changed: additions.length > 0, notes: additions.map((x) => `barrel faltante: ${x}`) };
}

function normalizeMain(p) {
  return p === "./dist/index.js" || p === "dist/index.js";
}

function normalizeTypes(p) {
  return p === "./dist/index.d.ts" || p === "dist/index.d.ts";
}

function ensurePackageJson(pkgDir) {
  const file = path.join(pkgDir, "package.json");
  const pkg = readJson(file);
  const notes = [];
  let changed = false;

  if (pkg.type !== "module") {
    notes.push('type deveria ser "module"');
    if (APPLY) {
      pkg.type = "module";
      changed = true;
    }
  }

  if (!normalizeMain(pkg.main)) {
    notes.push('main deveria apontar para "./dist/index.js"');
    if (APPLY) {
      pkg.main = "./dist/index.js";
      changed = true;
    }
  }

  if (!normalizeTypes(pkg.types)) {
    notes.push('types deveria apontar para "./dist/index.d.ts"');
    if (APPLY) {
      pkg.types = "./dist/index.d.ts";
      changed = true;
    }
  }

  const exportsField = pkg.exports;
  const hasDotExport = Boolean(exportsField && typeof exportsField === "object" && exportsField["."]);
  if (!hasDotExport) {
    notes.push('exports["."] ausente (entrypoint público)');
    if (APPLY) {
      pkg.exports = {
        ...(exportsField && typeof exportsField === "object" ? exportsField : {}),
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.js",
        },
      };
      changed = true;
    }
  }

  if (changed) writeJson(file, pkg);

  return {
    changed,
    notes,
    packageName: pkg.name || path.basename(pkgDir),
  };
}

function ensureTsconfig(pkgDir) {
  const file = path.join(pkgDir, "tsconfig.json");
  if (!exists(file)) return { changed: false, notes: ["sem tsconfig.json"] };

  const tsconfig = readJson(file);
  tsconfig.compilerOptions ||= {};

  const notes = [];
  let changed = false;

  const desired = {
    module: "NodeNext",
    moduleResolution: "NodeNext",
  };

  for (const [k, v] of Object.entries(desired)) {
    if (tsconfig.compilerOptions[k] !== v) {
      notes.push(`${k} deveria ser ${JSON.stringify(v)}`);
      if (APPLY) {
        tsconfig.compilerOptions[k] = v;
        changed = true;
      }
    }
  }

  if (changed) writeJson(file, tsconfig);

  return { changed, notes };
}

function inspectSuspiciousExports(sourceExports) {
  const all = new Set(Object.values(sourceExports).flat());
  return TARGET_EXPORTS.filter((name) => all.has(name));
}

function buildPackage(pkgDir) {
  try {
    execSync("pnpm build", { cwd: pkgDir, stdio: "pipe" });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err?.stderr || err?.message || err) };
  }
}

function inspectDist(pkgDir) {
  const distIndex = path.join(pkgDir, "dist", "index.js");
  if (!exists(distIndex)) return { ok: false, reason: "dist/index.js não existe" };

  const code = fs.readFileSync(distIndex, "utf8");
  const exportedTargets = TARGET_EXPORTS.filter((name) => code.includes(name));
  return { ok: true, exportedTargets };
}

function writeReport(report) {
  const reportFile = path.join(ROOT, "docs", "evidence", "package-exports-fix-report.json");
  ensureDir(reportFile);
  fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return reportFile;
}

function main() {
  const packageDirs = getAllPackageDirs();
  const report = [];

  console.log(`\n🔎 Encontrados ${packageDirs.length} pacotes internos`);
  console.log(`🛠️ Modo: ${APPLY ? "apply" : "audit"}${BUILD ? " + build" : ""}\n`);

  for (const pkgDir of packageDirs) {
    const packagePath = path.relative(ROOT, pkgDir);
    const sourceExports = findSourceExports(pkgDir);

    const suspiciousSymbols = inspectSuspiciousExports(sourceExports);
    const barrel = ensureIndexBarrel(pkgDir, sourceExports);
    const pkg = ensurePackageJson(pkgDir);
    const tsconfig = ensureTsconfig(pkgDir);

    const changed = APPLY && (barrel.changed || pkg.changed || tsconfig.changed);

    let build = { ok: null };
    let dist = { ok: null };
    if (BUILD && changed) {
      build = buildPackage(pkgDir);
      if (build.ok) dist = inspectDist(pkgDir);
    }

    const item = {
      package: packagePath,
      suspiciousSymbols,
      auditNotes: {
        barrel: barrel.notes,
        packageJson: pkg.notes,
        tsconfig: tsconfig.notes,
      },
      changed,
      build,
      dist,
    };

    report.push(item);

    const noteCount = barrel.notes.length + pkg.notes.length + tsconfig.notes.length;
    console.log(`=== ${packagePath} ===`);
    console.log(`símbolos de interesse: ${suspiciousSymbols.join(", ") || "(nenhum)"}`);
    console.log(`itens de ajuste detectados: ${noteCount}`);
    if (BUILD && changed) {
      console.log(`build: ${build.ok ? "ok" : "falhou"}`);
    }
    console.log();
  }

  const reportFile = writeReport(report);
  console.log(`📄 Relatório salvo em: ${path.relative(ROOT, reportFile)}`);

  if (!APPLY) {
    console.log("\nPróximo passo (aplicar mudanças):");
    console.log("  node scripts/fix-internal-package-exports.mjs --apply --build");
  }
}

main();
