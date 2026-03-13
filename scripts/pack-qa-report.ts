import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  isInstallableManifest,
  loadManifestCatalog,
  runAgentDryRun
} from "@birthub/agents-core";

const REQUIRED_PROMPT_SECTIONS = [
  "IDENTIDADE E MISSAO",
  "QUANDO ACIONAR",
  "ENTRADAS OBRIGATORIAS",
  "RACIOCINIO OPERACIONAL ESPERADO",
  "OBJETIVOS PRIORITARIOS",
  "FERRAMENTAS ESPERADAS",
  "SAIDAS OBRIGATORIAS",
  "GUARDRAILS",
  "CHECKLIST DE QUALIDADE",
  "APRENDIZADO COMPARTILHADO",
  "FORMATO DE SAIDA"
] as const;
const SHARED_LEARNING_CLAUSE = "Todo agente aprende com todo agente.";

function toDocSlug(agentId: string): string {
  return agentId.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

function countCoveredSections(prompt: string): number {
  return REQUIRED_PROMPT_SECTIONS.filter((section) => prompt.includes(section)).length;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(scriptsDir, "..");
  const catalog = await loadManifestCatalog(path.join(root, "packages", "agent-packs"));
  const installableCatalog = catalog.filter((entry) => isInstallableManifest(entry.manifest));
  const catalogDescriptors = catalog.filter((entry) => !isInstallableManifest(entry.manifest));

  const dryRunResults = await Promise.all(
    catalog.map(async (entry) => ({
      agentId: entry.manifest.agent.id,
      dryRun: await runAgentDryRun(entry.manifest)
    }))
  );

  const docsCoverage = await Promise.all(
    catalog.map(async (entry) => {
      const docPath = path.join(root, "docs", "agent-packs", `${toDocSlug(entry.manifest.agent.id)}.mdx`);
      return {
        agentId: entry.manifest.agent.id,
        exists: await fileExists(docPath)
      };
    })
  );

  const allDryRunsOk = dryRunResults.every((result) => result.dryRun.logs.length > 0);
  const docsOkCount = docsCoverage.filter((item) => item.exists).length;
  const promptRichness = installableCatalog.map((entry) => ({
    agentId: entry.manifest.agent.id,
    coveredSections: countCoveredSections(entry.manifest.agent.prompt),
    hasLearningClause: entry.manifest.agent.prompt.includes(SHARED_LEARNING_CLAUSE),
    keywordCount: entry.manifest.keywords.length,
    promptLength: entry.manifest.agent.prompt.length
  }));
  const perAgentScores = promptRichness.map((row) => {
    const docsExists = docsCoverage.find((item) => item.agentId === row.agentId)?.exists ?? false;
    const dryRun = dryRunResults.find((item) => item.agentId === row.agentId)?.dryRun;

    const sectionScore = Math.round((row.coveredSections / REQUIRED_PROMPT_SECTIONS.length) * 30);
    const keywordScore = Math.min(20, row.keywordCount * 2);
    const learningScore = row.hasLearningClause ? 20 : 0;
    const dryRunScore = dryRun?.logs.length ? 20 : 0;
    const docsScore = docsExists ? 10 : 0;

    return {
      agentId: row.agentId,
      score: sectionScore + keywordScore + learningScore + dryRunScore + docsScore
    };
  });
  const domainDistribution = installableCatalog.reduce<Record<string, number>>((bucket, entry) => {
    for (const domain of entry.manifest.tags.domain) {
      bucket[domain] = (bucket[domain] ?? 0) + 1;
    }
    return bucket;
  }, {});
  const levelDistribution = installableCatalog.reduce<Record<string, number>>((bucket, entry) => {
    for (const level of entry.manifest.tags.level) {
      bucket[level] = (bucket[level] ?? 0) + 1;
    }
    return bucket;
  }, {});

  console.log("=== Cycle 5 Pack QA Report ===");
  console.log(`Catalog agents: ${catalog.length}`);
  console.log(`Installable agents: ${installableCatalog.length}`);
  console.log(`Catalog descriptors: ${catalogDescriptors.length}`);
  console.log(`Dry-run success: ${allDryRunsOk ? "OK" : "FAIL"}`);
  console.log(`Docs coverage: ${docsOkCount}/${catalog.length}`);
  console.log(
    `Average prompt section coverage: ${average(promptRichness.map((item) => item.coveredSections)).toFixed(2)}/${REQUIRED_PROMPT_SECTIONS.length}`
  );
  console.log(`Average keyword count: ${average(promptRichness.map((item) => item.keywordCount)).toFixed(2)}`);
  console.log(
    `Shared learning clause coverage: ${
      promptRichness.filter((item) => item.hasLearningClause).length
    }/${installableCatalog.length}`
  );
  console.log(`Average prompt length: ${Math.round(average(promptRichness.map((item) => item.promptLength)))}`);
  console.log(`Domain distribution: ${JSON.stringify(domainDistribution)}`);
  console.log(`Level distribution: ${JSON.stringify(levelDistribution)}`);
  console.log(
    `Quality score leaderboard: ${perAgentScores
      .slice()
      .sort((left, right) => right.score - left.score)
      .slice(0, 5)
      .map((item) => `${item.agentId}:${item.score}`)
      .join(", ")}`
  );
}

void main();
