import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { AgentManifest } from "@birthub/agents-core";

import {
  FOUNDATION_AGENT_OVERRIDES,
  type FoundationAgentOverride
} from "../packages/agent-packs/corporate-v1/source/foundation-agent-overrides.js";

interface HtmlAgentRecord {
  code: string;
  category: string;
  title: string;
  mission: string;
  whenToUse: string[];
  expectedTools: string[];
  inputs: string[];
  outputs: string[];
  guardrails: string[];
  promptBase: string;
  promptSections: {
    mission: string;
    objectives: string[];
    rules: string[];
    outputFormat: string;
  };
}

interface GeneratedAgentSource {
  id: string;
  name: string;
  origin: "birthhub-html" | "foundation";
  category: string;
  description: string;
  mission: string;
  whenToUse: string[];
  inputs: string[];
  outputs: string[];
  guardrails: string[];
  qualityChecklist: string[];
  keywords: string[];
  skills: Array<{ name: string; description: string }>;
  tools: Array<{ name: string; description: string }>;
  tags: AgentManifest["tags"];
  outputFormat: string;
  prompt: string;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\r/g, "").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").trim();
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values.map((item) => item.trim()).filter(Boolean)) {
    const normalized = value.toLowerCase();
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(value);
  }

  return result;
}

function toManifestPath(rootDir: string, agentId: string): string {
  return path.join(rootDir, agentId, "manifest.json");
}

async function readCurrentManifest(rootDir: string, agentId: string): Promise<AgentManifest> {
  const manifestPath = toManifestPath(rootDir, agentId);
  const raw = await readFile(manifestPath, "utf8");
  return JSON.parse(raw) as AgentManifest;
}

function inferHtmlAgentId(record: HtmlAgentRecord): string {
  if (record.code === "A01") {
    return "maestro-orchestrator-pack";
  }

  const titleSlug = slugify(record.title).replace(/-bot$/, "");
  return `${titleSlug}-pack`;
}

function inferHtmlTags(record: HtmlAgentRecord, agentId: string): AgentManifest["tags"] {
  const category = normalizeWhitespace(record.category).toLowerCase();
  const persona = slugify(record.title).replace(/-bot$/, "");
  const useCase = agentId.replace(/-pack$/, "");

  if (category.includes("comando")) {
    return {
      domain: ["operations", "governance"],
      industry: ["sales"],
      level: ["suite"],
      persona: [persona],
      "use-case": [useCase, "multi-agent-execution"]
    };
  }

  if (category.includes("prospec")) {
    return {
      domain: ["sales", "prospecting"],
      industry: ["sales"],
      level: ["specialist"],
      persona: [persona],
      "use-case": [useCase, "pipeline-generation"]
    };
  }

  if (category.includes("fechamento") || category.includes("receita")) {
    return {
      domain: ["sales", "revenue"],
      industry: ["sales"],
      level: ["specialist"],
      persona: [persona],
      "use-case": [useCase, "revenue-execution"]
    };
  }

  if (category.includes("retenc") || category.includes("treinamento")) {
    return {
      domain: ["customer-success", "enablement"],
      industry: ["sales"],
      level: ["specialist"],
      persona: [persona],
      "use-case": [useCase, "retention-and-growth"]
    };
  }

  return {
    domain: ["operations", "enablement"],
    industry: ["sales"],
    level: ["specialist"],
    persona: [persona],
    "use-case": [useCase, "commercial-operations"]
  };
}

function buildKeywordSet(input: {
  title: string;
  category: string;
  expectedTools: string[];
  inputs: string[];
  outputs: string[];
  extra?: string[];
}): string[] {
  const tokens = [
    input.title,
    input.category,
    ...input.expectedTools,
    ...input.inputs,
    ...input.outputs,
    ...(input.extra ?? [])
  ]
    .flatMap((value) =>
      normalizeWhitespace(value)
        .split(/[,/()\-]| e | and /i)
        .map((item) => item.trim())
        .filter((item) => item.length >= 3)
    )
    .map((item) => item.toLowerCase());

  return uniqueStrings(tokens).slice(0, 14);
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function buildSkillEntries(
  agentId: string,
  items: Array<{ description: string; name: string }>
): AgentManifest["skills"] {
  return items.slice(0, 5).map((item, index) => ({
    description: item.description,
    id: `${agentId}.skill.${slugify(item.name || `skill-${index + 1}`)}`,
    inputSchema: { type: "object" },
    name: item.name,
    outputSchema: { type: "object" }
  }));
}

function buildToolEntries(
  agentId: string,
  items: Array<{ description: string; name: string }>
): AgentManifest["tools"] {
  return items.slice(0, 6).map((item, index) => ({
    description: item.description,
    id: `${agentId}.tool.${slugify(item.name || `tool-${index + 1}`)}`,
    inputSchema: { type: "object" },
    name: item.name,
    outputSchema: { type: "object" },
    timeoutMs: 15000
  }));
}

function buildPolicy(agentId: string, guardrails: string[], toolNames: string[]): AgentManifest["policies"][number] {
  const needsApproval =
    guardrails.some((item) => /aprova|approval|autoriz/i.test(item)) ||
    toolNames.some((item) => /email|whatsapp|calendar|crm|sync|notification/i.test(item));

  const actions = uniqueStrings([
    "tool:execute",
    "memory:read",
    "memory:write",
    "learning:read",
    "learning:write",
    "audit:write",
    "report:read",
    ...(needsApproval ? ["approval:request"] : [])
  ]);

  return {
    actions,
    effect: "allow",
    id: `${agentId}.policy.standard`,
    name: needsApproval ? "Default governed execution policy" : "Default governed operating policy"
  };
}

function buildLearningClause(): string {
  return [
    "APRENDIZADO COMPARTILHADO",
    "- Todo agente aprende com todo agente.",
    "- Antes de responder, consulte aprendizados compartilhados relevantes do mesmo tenant.",
    "- Depois de concluir, publique um aprendizado estruturado com summary, evidence, confidence, keywords, appliesTo e approved.",
    "- Nunca reutilize aprendizado de outro tenant.",
    "- Nunca altere seu proprio prompt ou policy automaticamente em producao."
  ].join("\n");
}

function buildCompiledPrompt(input: {
  name: string;
  category: string;
  mission: string;
  whenToUse: string[];
  inputs: string[];
  outputs: string[];
  objectives: string[];
  rules: string[];
  tools: string[];
  guardrails: string[];
  qualityChecklist: string[];
  outputFormat: string;
}): string {
  const sections = [
    `Voce e o ${input.name} da BirthHub 360 Official Collection.`,
    "",
    "IDENTIDADE E MISSAO",
    input.mission,
    "",
    "QUANDO ACIONAR",
    ...input.whenToUse.map((item) => `- ${item}`),
    "",
    "ENTRADAS OBRIGATORIAS",
    ...input.inputs.map((item) => `- ${item}`),
    "",
    "RACIOCINIO OPERACIONAL ESPERADO",
    "- interpretar o contexto, o tenant, as restricoes e o objetivo real antes de agir",
    "- consultar memoria contextual e aprendizados compartilhados relevantes antes de responder",
    "- priorizar qualidade, rastreabilidade e proximo passo claro",
    "- distinguir fato, inferencia e ausencia de informacao",
    "- agir somente dentro de ferramentas, politicas e aprovacoes permitidas",
    "",
    "OBJETIVOS PRIORITARIOS",
    ...input.objectives.map((item) => `- ${item}`),
    "",
    "FERRAMENTAS ESPERADAS",
    ...input.tools.map((item) => `- ${item}`),
    "",
    "SAIDAS OBRIGATORIAS",
    ...input.outputs.map((item) => `- ${item}`),
    "",
    "GUARDRAILS",
    ...uniqueStrings([
      ...input.rules,
      ...input.guardrails,
      "nunca misturar dados entre tenants",
      "nunca afirmar certeza quando a confianca for baixa",
      "sempre registrar motivo, proximo passo e risco relevante"
    ]).map((item) => `- ${item}`),
    "",
    "CHECKLIST DE QUALIDADE",
    ...input.qualityChecklist.map((item) => `- ${item}`),
    "",
    buildLearningClause(),
    "",
    "FORMATO DE SAIDA",
    input.outputFormat
  ];

  return sections.join("\n");
}

function buildDefaultOutputFormat(agentId: string, outputs: string[]): string {
  return JSON.stringify(
    {
      agent_id: agentId,
      summary: "",
      key_outputs: outputs.slice(0, 4),
      risks: [],
      next_step: "",
      confidence: "medium"
    },
    null,
    2
  );
}

function buildHtmlAgent(record: HtmlAgentRecord): GeneratedAgentSource {
  const agentId = inferHtmlAgentId(record);
  const objectiveLines = uniqueStrings(record.promptSections.objectives.length > 0 ? record.promptSections.objectives : record.outputs);
  const tools = record.expectedTools.map((tool) => ({
    description: `Ferramenta operacional ${tool} necessaria para ${record.title} funcionar com rastreabilidade e controle.`,
    name: titleCase(tool)
  }));
  const skills = objectiveLines.slice(0, 5).map((objective) => ({
    description: objective,
    name: titleCase(objective)
  }));
  const outputFormat = record.promptSections.outputFormat || buildDefaultOutputFormat(agentId, record.outputs);
  const qualityChecklist = [
    "separar fato, inferencia e ausencia de informacao",
    "deixar proximo passo e risco objetivo",
    "publicar aprendizado compartilhado relevante ao final"
  ];

  return {
    category: record.category,
    description: record.mission,
    guardrails: record.guardrails,
    id: agentId,
    inputs: record.inputs,
    keywords: buildKeywordSet({
      category: record.category,
      expectedTools: record.expectedTools,
      extra: [
        ...record.promptSections.objectives,
        ...record.guardrails
      ],
      inputs: record.inputs,
      outputs: record.outputs,
      title: record.title
    }),
    mission: record.promptSections.mission || record.mission,
    name: record.title,
    origin: "birthhub-html",
    outputFormat,
    outputs: record.outputs,
    prompt: buildCompiledPrompt({
      category: record.category,
      guardrails: record.guardrails,
      inputs: record.inputs,
      mission: record.promptSections.mission || record.mission,
      name: record.title,
      objectives: objectiveLines,
      outputFormat,
      outputs: record.outputs,
      qualityChecklist,
      rules: record.promptSections.rules,
      tools: record.expectedTools,
      whenToUse: record.whenToUse
    }),
    qualityChecklist,
    skills,
    tags: inferHtmlTags(record, agentId),
    tools,
    whenToUse: record.whenToUse
  };
}

function buildFoundationAgent(
  manifest: AgentManifest,
  override: FoundationAgentOverride
): GeneratedAgentSource {
  const outputFormat = buildDefaultOutputFormat(override.id, override.outputs);

  return {
    category: override.category,
    description: `${manifest.agent.description} Opera com padrao premium de governanca, qualidade e aprendizado cruzado.`,
    guardrails: override.guardrails,
    id: override.id,
    inputs: override.inputs,
    keywords: override.keywords,
    mission: override.mission,
    name: manifest.agent.name,
    origin: "foundation",
    outputFormat,
    outputs: override.outputs,
    prompt: buildCompiledPrompt({
      category: override.category,
      guardrails: override.guardrails,
      inputs: override.inputs,
      mission: override.mission,
      name: manifest.agent.name,
      objectives: manifest.skills.map((skill) => skill.description),
      outputFormat,
      outputs: override.outputs,
      qualityChecklist: override.qualityChecklist,
      rules: [
        "usar apenas ferramentas e politicas autorizadas",
        "manter rastreabilidade e contexto de negocio",
        "escalar para aprovacao humana quando o risco exigir"
      ],
      tools: manifest.tools.map((tool) => tool.name),
      whenToUse: override.whenToUse
    }),
    qualityChecklist: override.qualityChecklist,
    skills: manifest.skills.map((skill) => ({
      description: skill.description,
      name: skill.name
    })),
    tags: manifest.tags,
    tools: manifest.tools.map((tool) => ({
      description: tool.description,
      name: tool.name
    })),
    whenToUse: override.whenToUse
  };
}

function toManifest(source: GeneratedAgentSource): AgentManifest {
  return {
    agent: {
      changelog: [
        "2.0.0 - BirthHub 360 official collection refresh with governed shared learning, richer prompts and unified operating model"
      ],
      description: source.description,
      id: source.id,
      kind: "agent",
      name: source.name,
      prompt: source.prompt,
      tenantId: "catalog",
      version: "2.0.0"
    },
    keywords: source.keywords,
    manifestVersion: "1.0.0",
    policies: [buildPolicy(source.id, source.guardrails, source.tools.map((tool) => tool.name))],
    skills: buildSkillEntries(source.id, source.skills),
    tags: source.tags,
    tools: buildToolEntries(source.id, source.tools)
  };
}

function buildCollectionDescriptor(): AgentManifest {
  return {
    agent: {
      changelog: [
        "2.0.0 - BirthHub 360 official collection descriptor updated for the premium 42-agent lineup"
      ],
      description: "Collection descriptor for the unified BirthHub 360 official lineup of governed high-performance agents.",
      id: "corporate-v1-catalog",
      kind: "catalog",
      name: "BirthHub 360 Official Collection",
      prompt:
        "Coordinate and expose the full BirthHub 360 official collection, separating collection governance from installable agents.",
      tenantId: "catalog",
      version: "2.0.0"
    },
    keywords: [
      "birthhub 360",
      "official collection",
      "agent catalog",
      "marketplace governance",
      "collection descriptor"
    ],
    manifestVersion: "1.0.0",
    policies: [
      {
        actions: ["report:read", "audit:write"],
        effect: "allow",
        id: "corporate-v1-catalog.policy.standard",
        name: "Collection governance policy"
      }
    ],
    skills: [
      {
        description: "Expose catalog metadata and collection governance across the marketplace.",
        id: "corporate-v1-catalog.skill.collection-governance",
        inputSchema: { type: "object" },
        name: "Collection Governance",
        outputSchema: { type: "object" }
      },
      {
        description: "Support discovery, documentation and segmentation of the official lineup.",
        id: "corporate-v1-catalog.skill.collection-discovery",
        inputSchema: { type: "object" },
        name: "Collection Discovery",
        outputSchema: { type: "object" }
      }
    ],
    tags: {
      domain: ["management"],
      industry: ["sales"],
      level: ["suite"],
      persona: ["catalog-admin"],
      "use-case": ["discover", "governance"]
    },
    tools: [
      {
        description: "Expose official collection metadata for marketplace and documentation surfaces.",
        id: "corporate-v1-catalog.tool.collection-index",
        inputSchema: { type: "object" },
        name: "Collection Index",
        outputSchema: { type: "object" },
        timeoutMs: 15000
      }
    ]
  };
}

async function cleanGeneratedAgentDirs(rootDir: string, keepIds: Set<string>): Promise<void> {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const managedDirs = entries
    .filter((entry) => entry.isDirectory() && entry.name.endsWith("-pack"))
    .map((entry) => entry.name);

  await Promise.all(
    managedDirs
      .filter((dirName) => !keepIds.has(dirName))
      .map((dirName) => rm(path.join(rootDir, dirName), { force: true, recursive: true }))
  );
}

async function main(): Promise<void> {
  const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = path.resolve(scriptsDir, "..");
  const collectionRoot = path.join(workspaceRoot, "packages", "agent-packs", "corporate-v1");
  const sourceRoot = path.join(collectionRoot, "source");
  const htmlSourcePath = path.join(sourceRoot, "birthhub-html-agents.json");
  const officialSourcePath = path.join(sourceRoot, "official-collection.json");

  const htmlAgents = JSON.parse(await readFile(htmlSourcePath, "utf8")) as HtmlAgentRecord[];
  const foundationAgents = await Promise.all(
    FOUNDATION_AGENT_OVERRIDES.map(async (override) =>
      buildFoundationAgent(await readCurrentManifest(collectionRoot, override.id), override)
    )
  );
  const htmlGeneratedAgents = htmlAgents.map(buildHtmlAgent);
  const combinedAgents = [...foundationAgents, ...htmlGeneratedAgents].sort((left, right) =>
    left.name.localeCompare(right.name)
  );

  if (combinedAgents.length !== 42) {
    throw new Error(`Expected 42 installable agents, found ${combinedAgents.length}.`);
  }

  const keptIds = new Set<string>(combinedAgents.map((agent) => agent.id));
  keptIds.add("corporate-v1-catalog");
  keptIds.add("source");
  keptIds.add("config");
  keptIds.add("prompts");
  keptIds.add("tests");

  await cleanGeneratedAgentDirs(collectionRoot, keptIds);

  for (const agent of combinedAgents) {
    const manifest = toManifest(agent);
    const targetDir = path.join(collectionRoot, agent.id);
    await mkdir(targetDir, { recursive: true });
    await writeFile(path.join(targetDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  await writeFile(
    path.join(collectionRoot, "manifest.json"),
    `${JSON.stringify(buildCollectionDescriptor(), null, 2)}\n`,
    "utf8"
  );

  await writeFile(
    officialSourcePath,
    `${JSON.stringify(
      {
        collection: {
          id: "birthhub-360-official-collection",
          installableCount: combinedAgents.length,
          manifestDescriptorId: "corporate-v1-catalog",
          name: "BirthHub 360 Official Collection",
          version: "2.0.0"
        },
        generatedAt: new Date().toISOString(),
        agents: combinedAgents
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log(`Generated BirthHub 360 official collection with ${combinedAgents.length} installable agents.`);
}

void main();
