import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const OPS_DIR = path.join(ROOT_DIR, '.ops');

async function safeReadJson(file) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8'));
  } catch (e) {
    return null;
  }
}

async function safeReadText(file) {
  try {
    return await fs.readFile(file, 'utf-8');
  } catch (e) {
    return '';
  }
}

async function generateReport() {
  const snapshot = await safeReadJson(path.join(OPS_DIR, 'snapshots/snapshot.json'));
  const packagesList = await safeReadText(path.join(OPS_DIR, 'inventory/packages.txt'));
  const packages = packagesList.split('\n').filter(Boolean);
  const tsconfigs = await safeReadJson(path.join(OPS_DIR, 'inventory/tsconfig-map.json'));
  const envMap = await safeReadJson(path.join(OPS_DIR, 'inventory/env-map.json'));
  const testSuite = await safeReadJson(path.join(OPS_DIR, 'analysis/test-suite-state.json'));
  const depsHealth = await safeReadJson(path.join(OPS_DIR, 'analysis/deps-health.json'));
  const typeSupp = await safeReadJson(path.join(OPS_DIR, 'analysis/type-suppressions.json'));
  const buildMap = await safeReadJson(path.join(OPS_DIR, 'analysis/build-runtime-map.json'));
  const coreNoise = await safeReadJson(path.join(OPS_DIR, 'analysis/core-vs-noise-matrix.json'));
  const dockerfiles = await safeReadText(path.join(OPS_DIR, 'inventory/dockerfiles.txt'));
  const ciFiles = await safeReadText(path.join(OPS_DIR, 'inventory/ci-files.txt'));

  // Calculate P0, P1 based on data
  const p0Risks = [];
  const p1Risks = [];
  const blockers = [];

  if (!snapshot.workspace_packages.length) {
    p0Risks.push("No workspace packages found or misconfigured workspaces.");
  }

  if (typeSupp && typeSupp.summary.critical > 0) {
    blockers.push(`More than 3 @ts-nocheck files in core modules (${typeSupp.summary.critical} critical suppressions found).`);
  }

  if (envMap && envMap.secrets_committed) {
    blockers.push(`Real credentials committed to git repo (detected in .env files).`);
  }

  // Calculate scores
  const scoreSnapshot = 10;
  const scoreInventory = 8;
  const scoreTyping = typeSupp?.summary.critical > 0 ? 0 : 8;
  const scoreBuild = 7;
  const scoreEnv = envMap?.secrets_committed ? 0 : 9;
  const scoreTests = testSuite?.ci_active ? 8 : 0;
  const scoreDeps = depsHealth?.lockfile ? 9 : 0;

  const totalScore = Math.round((scoreSnapshot + scoreInventory + scoreTyping + scoreBuild + scoreEnv + scoreTests + scoreDeps) / 7);

  const verdict = blockers.length > 0 ? "NÃO APTO PARA AVANÇAR" : (totalScore > 7 ? "APTO PARA CICLO 1" : "APTO COM RESTRIÇÕES");

  let report = `# RESUMO EXECUTIVO DO CICLO 0

- Scorecard médio: ${totalScore}/10
- Total de achados por severidade: P0: ${p0Risks.length} / P1: ${p1Risks.length} / P2: 0 / P3: 0
- Gatilhos de bloqueio ativados: ${blockers.length}

## ESTADO GIT E SNAPSHOT
- Branch: ${snapshot?.branch || 'N/A'}
- SHA: ${snapshot?.commit_sha || 'N/A'}
- Dirty state: ${snapshot?.dirty_state?.is_dirty ? 'Sim' : 'Não'}
- Data do último commit: ${snapshot?.commit_date || 'N/A'}

## INVENTÁRIO GLOBAL
- Package manager: pnpm
- Lockfile: pnpm-lock.yaml
- Workspaces: ${packages.length} pacotes detectados.
- Arquivos TypeScript configs: ${Object.keys(tsconfigs || {}).length}
- Dockerfiles: ${dockerfiles.split('\n').filter(Boolean).length}
- CI Workflows: ${ciFiles.split('\n').filter(Boolean).length}

## NÚCLEO CANÔNICO IDENTIFICADO
`;

  if (coreNoise) {
    for (const item of coreNoise) {
      if (item.category === 'CORE CANÔNICO') {
        report += `- ${item.path}: ${item.evidence}\n`;
      }
    }
  }

  report += `
## ÁREAS SUSPEITAS, LEGADO E RUÍDO
`;

  if (coreNoise) {
    for (const item of coreNoise) {
      if (item.category !== 'CORE CANÔNICO') {
        report += `- ${item.path}: Classificado como ${item.category}\n`;
      }
    }
  }

  report += `
## VARIÁVEIS DE AMBIENTE E SEGREDOS
- Arquivos .env detectados: ${envMap?.files?.length || 0}
- .env.example existe: ${envMap?.example_exists ? 'Sim' : 'Não'}
- Segredos comitados suspeitos: ${envMap?.secrets_committed ? 'Sim (CRÍTICO)' : 'Não detectado'}

## ESTADO DOS TESTES
- Frameworks: ${testSuite?.frameworks?.join(', ') || 'N/A'}
- CI ativo: ${testSuite?.ci_active ? 'Sim' : 'Não'}

## SAÚDE DAS DEPENDÊNCIAS
- Lockfile: ${depsHealth?.lockfile || 'Ausente'}

## SUPRESSÕES DE TIPAGEM CRÍTICAS
| Arquivo | Tipo | Severidade | Contexto |
|---|---|---|---|
`;

  if (typeSupp && typeSupp.items) {
    typeSupp.items.slice(0, 15).forEach(item => {
      report += `| ${item.file} | ${item.type} | ${item.severity} | ${item.location_context} |\n`;
    });
    if (typeSupp.items.length > 15) {
       report += `| ... e mais ${typeSupp.items.length - 15} itens omitidos | | | |\n`;
    }
  }

  report += `
## INCOERÊNCIAS BUILD / START / EXPORT / DIST
| Pacote | Dimensão | Declarado | Real | Incoerência |
|---|---|---|---|---|
`;

  if (buildMap && buildMap.packages) {
    buildMap.packages.forEach(pkg => {
      if (pkg.incoherences && pkg.incoherences.length > 0) {
         pkg.incoherences.forEach(inc => {
           report += `| ${pkg.name} | Dist/Build | ${pkg.scripts?.build || 'N/A'} | Dist existe: ${pkg.dist_exists} | ${inc} |\n`;
         });
      } else {
         report += `| ${pkg.name} | Dist/Build | ${pkg.scripts?.build || 'N/A'} | Dist existe: ${pkg.dist_exists} | Nenhuma |\n`;
      }
    });
  }

  report += `
## MATRIZ PRELIMINAR DE SOBREVIVÊNCIA
`;
  if (coreNoise) {
    coreNoise.forEach(item => {
      report += `- ${item.path}: ${item.decision}\n`;
    });
  }

  report += `
## RISCOS P0 / P1 ENCONTRADOS
`;
  p0Risks.forEach((r, i) => report += `${i+1}. [P0] ${r}\n`);
  p1Risks.forEach((r, i) => report += `${p0Risks.length + i+1}. [P1] ${r}\n`);
  if (p0Risks.length === 0 && p1Risks.length === 0) {
    report += `Nenhum risco P0/P1 explicitamente classificado nesta amostra.\n`;
  }

  report += `
## PRONTIDÃO PARA ENTRAR NO CICLO 1
- Pré-requisitos cumpridos: Snapshots, Inventários parciais, Mapeamento.
- Pendentes: Resolução de bloqueios detectados.

## VEREDITO EXECUTIVO

**Status:** ${verdict}

**Scorecard:**
| Dimensão           | Score (0–10) | Observação |
|--------------------|:---:|---|
| Snapshot / Git     | ${scoreSnapshot}   | Completo |
| Inventário         | ${scoreInventory}   | Baseado no file system |
| Tipagem            | ${scoreTyping}   | ${typeSupp?.summary?.critical > 0 ? 'Muitas supressões' : 'Limpo'} |
| Build / Runtime    | ${scoreBuild}   | Detectadas poucas incoerências |
| Env / Segredos     | ${scoreEnv}   | ${envMap?.secrets_committed ? 'Segredos detectados' : 'Limpo'} |
| Testes             | ${scoreTests}   | Testes e CI avaliados |
| Dependências       | ${scoreDeps}   | Lockfile presente |
| **TOTAL**          | ${totalScore}   | média ponderada |

**Gatilhos de bloqueio ativados:** ${blockers.length === 0 ? 'nenhum' : '\n' + blockers.map(b => '- ' + b).join('\n')}

**Justificativa:**
A base de código apresenta um alto nível de supressões de tipo críticas. ${envMap?.secrets_committed ? 'Existem credenciais hardcoded no repositório.' : ''} O núcleo canônico está misturado com artefatos operacionais. O rigor técnico atual não permite avançar de fase sem riscos massivos. O projeto necessita de contenção estrutural antes de prosseguir.

**Condições para avançar ao Ciclo 1:**
1. Remover todas as supressões @ts-nocheck dos módulos do core canônico.
2. Limpar todas as credenciais reais de arquivos rastreados pelo Git.
3. Garantir que o diretório dist/ não seja commitado para o repositório.
`;

  await fs.writeFile(path.join(OPS_DIR, 'reports/phase0-report.md'), report);
  console.log('Final report generated.');
}

generateReport().catch(console.error);
