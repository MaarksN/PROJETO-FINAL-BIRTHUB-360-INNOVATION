import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const catalogDir = path.join(repoRoot, 'packages', 'agent-packs');

const requiredPackFields = [
  'id',
  'name',
  'version',
  'status',
  'owner',
  'domain',
  'level',
  'persona',
  'useCases',
  'industry',
  'description',
  'skills',
  'tools',
  'tags'
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

if (!fs.existsSync(catalogDir)) {
  fail('Diretório packages/agent-packs não encontrado.');
  process.exit(process.exitCode ?? 1);
}

const catalogManifests = fs
  .readdirSync(catalogDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(catalogDir, entry.name, 'manifest.json'))
  .filter((manifestPath) => fs.existsSync(manifestPath));

if (!catalogManifests.length) {
  fail('Nenhum manifest.json de catálogo encontrado em packages/agent-packs/*');
  process.exit(process.exitCode ?? 1);
}

for (const catalogManifestPath of catalogManifests) {
  const catalogManifest = readJson(catalogManifestPath);
  const catalogBase = path.dirname(catalogManifestPath);

  if (!isNonEmptyArray(catalogManifest.packManifests)) {
    fail(`${path.relative(repoRoot, catalogManifestPath)} deve conter packManifests com ao menos 1 arquivo.`);
    continue;
  }

  const seenIds = new Set();

  for (const manifestRelPath of catalogManifest.packManifests) {
    const packManifestPath = path.join(catalogBase, manifestRelPath);

    if (!fs.existsSync(packManifestPath)) {
      fail(`${path.relative(repoRoot, catalogManifestPath)} referencia manifest inexistente: ${manifestRelPath}`);
      continue;
    }

    const packManifest = readJson(packManifestPath);

    for (const field of requiredPackFields) {
      if (!(field in packManifest)) {
        fail(`${path.relative(repoRoot, packManifestPath)} sem campo obrigatório: ${field}`);
      }
    }

    if (!isNonEmptyArray(packManifest.skills)) {
      fail(`${path.relative(repoRoot, packManifestPath)} deve conter skills com ao menos 1 item.`);
    }

    if (!isNonEmptyArray(packManifest.tools)) {
      fail(`${path.relative(repoRoot, packManifestPath)} deve conter tools com ao menos 1 item.`);
    }

    if (!isNonEmptyArray(packManifest.tags)) {
      fail(`${path.relative(repoRoot, packManifestPath)} deve conter tags com ao menos 1 item.`);
    }

    if (seenIds.has(packManifest.id)) {
      fail(`ID duplicado no catálogo ${path.relative(repoRoot, catalogManifestPath)}: ${packManifest.id}`);
    }

    seenIds.add(packManifest.id);
  }

  if (!process.exitCode) {
    console.log(`✅ Catálogo válido: ${path.relative(repoRoot, catalogManifestPath)} (${catalogManifest.packManifests.length} manifests).`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}
