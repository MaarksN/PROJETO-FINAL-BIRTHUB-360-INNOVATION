import fs from 'fs';
import path from 'path';

function getPackages(dir, packages = []) {
  if (!fs.existsSync(dir)) return packages;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && !['node_modules', 'dist', 'build', '.git', 'agents-core'].includes(entry.name)) {
      const fullPath = path.join(dir, entry.name);
      const pkgPath = path.join(fullPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        packages.push(pkgPath);
      } else {
        getPackages(fullPath, packages);
      }
    }
  }
  return packages;
}

const allPackages = getPackages('packages');

let failed = false;

for (const pkg of allPackages) {
    const content = JSON.parse(fs.readFileSync(pkg, 'utf-8'));
    const scripts = content.scripts || {};

    const missing = [];
    if (!scripts.lint) missing.push('lint');
    if (!scripts.typecheck) missing.push('typecheck');
    if (!scripts.test) missing.push('test');
    if (!scripts.build) missing.push('build');

    if (missing.length > 0) {
      console.error(`❌ [${content.name}] is missing scripts: ${missing.join(', ')}`);
      failed = true;
    } else {
      console.log(`✅ [${content.name}] has all required scripts.`);
    }
}

if (failed) {
  console.error('\n🚨 CI Build Failed: All packages must implement lint, typecheck, test, and build (or explicitly return N/A).');
  process.exit(1);
} else {
  console.log('\n✅ CI Build Passed: All packages comply with F4 script requirements.');
  process.exit(0);
}
