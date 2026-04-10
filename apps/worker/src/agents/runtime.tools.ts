// @ts-nocheck
//
import type { AgentManifest } from "@birthub/agents-core";
import {
  buildMemoryKey,
  buildRecommendedActions,
  inferCapabilityType,
  inferSegmentProfile,
  readNumericSignals,
  readTextSignals,
  summarizeNumericSignals
} from "@birthub/agents-core";
import { PolicyEngine } from "@birthub/agents-core/policy/engine";
import { BaseTool, DbReadTool, DbWriteTool, HttpTool, SendEmailTool } from "@birthub/agents-core/tools";
import { createLogger } from "@birthub/logger";
import { z } from "zod";

import { buildToolCostTable } from "./runtime.budget.js";

const logger = createLogger("agent-runtime");
const TENANT_SCOPE_COMMENT_PREFIX = "-- tenant_scope:";

type DbReadQueryTemplate = {
  strings: string[];
  values: unknown[];
};

function stripSyntheticTenantScopeComment(query: string): string {
  return query
    .split("\n")
    .filter((line) => !line.trimStart().startsWith(TENANT_SCOPE_COMMENT_PREFIX))
    .join("\n")
    .trim();
}

function validateDbReadQuery(query: string): void {
  if (query.includes("/*") || query.includes("*/")) {
    throw new Error("db-read does not allow block comments.");
  }

  if (/[;](?=\s*\S)/.test(query)) {
    throw new Error("db-read does not allow multiple SQL statements.");
  }
}

function readCollaborationTargets(input: Record<string, unknown>): string[] {
  if (!Array.isArray(input.collaborationTargets)) {
    return [];
  }

  return input.collaborationTargets.filter((item): item is string => typeof item === "string").slice(0, 4);
}

export function buildDbReadQueryTemplate(
  query: string,
  params: unknown[],
  tenantId: string
): DbReadQueryTemplate {
  const sanitizedQuery = stripSyntheticTenantScopeComment(query);
  validateDbReadQuery(sanitizedQuery);

  const placeholderPattern = /\$(\d+)/g;
  const referencedIndexes: number[] = [];

  for (const match of sanitizedQuery.matchAll(placeholderPattern)) {
    referencedIndexes.push(Number.parseInt(match[1] ?? "", 10));
  }

  const uniqueIndexes = Array.from(new Set(referencedIndexes)).sort((left, right) => left - right);
  const highestIndex = uniqueIndexes.at(-1) ?? 0;

  for (let expectedIndex = 1; expectedIndex <= highestIndex; expectedIndex += 1) {
    if (!uniqueIndexes.includes(expectedIndex)) {
      throw new Error("db-read placeholders must be contiguous and start at $1.");
    }
  }

  if (highestIndex > params.length) {
    throw new Error("db-read placeholders reference more parameters than were provided.");
  }

  if (params.length > highestIndex) {
    const extraParams = params.slice(highestIndex);
    const hasOnlySyntheticTenantParam =
      extraParams.length === 1 && typeof extraParams[0] === "string" && extraParams[0] === tenantId;

    if (!hasOnlySyntheticTenantParam) {
      throw new Error("db-read received unexpected unused parameters.");
    }
  }

  const strings: string[] = [];
  const values: unknown[] = [];
  let lastIndex = 0;

  for (const match of sanitizedQuery.matchAll(placeholderPattern)) {
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;
    const placeholderIndex = Number.parseInt(match[1] ?? "", 10) - 1;

    strings.push(sanitizedQuery.slice(lastIndex, matchIndex));
    values.push(params[placeholderIndex]);
    lastIndex = matchIndex + fullMatch.length;
  }

  strings.push(sanitizedQuery.slice(lastIndex));

  return {
    strings,
    values
  };
}

function toTemplateStringsArray(strings: string[]): TemplateStringsArray {
  const template = [...strings] as string[] & TemplateStringsArray;
  Object.defineProperty(template, "raw", {
    value: [...strings]
  });
  return template;
}

class ManifestCapabilityTool extends BaseTool<Record<string, unknown>, Record<string, unknown>> {
  constructor(
    private readonly capability: {
      description: string;
      id: string;
      name: string;
    },
    private readonly tags: AgentManifest["tags"] | undefined,
    options?: {
      policyEngine?: PolicyEngine;
      timeoutMs?: number;
    }
  ) {
    super({
      description: capability.description,
      inputSchema: z.object({}).catchall(z.unknown()),
      name: capability.id,
      outputSchema: z.object({}).catchall(z.unknown()),
      ...(options?.timeoutMs ? { timeoutMs: options.timeoutMs } : {})
    }, options?.policyEngine ? { policyEngine: options.policyEngine } : {});
  }

  protected execute(
    input: Record<string, unknown>,
    context: {
      agentId: string;
      policyContext?: Record<string, unknown>;
      tenantId: string;
      traceId: string;
    }
  ): Promise<Record<string, unknown>> {
    const sourcePayload = (input.sourcePayload as Record<string, unknown> | undefined) ?? input;
    const flattenedNumbers = readNumericSignals(sourcePayload);
    const flattenedStrings = readTextSignals(sourcePayload, 8);
    const numericSummary = summarizeNumericSignals(flattenedNumbers);
    const segmentProfile = inferSegmentProfile(sourcePayload, this.tags);
    const collaborationTargets = readCollaborationTargets(input);
    const capabilityType = inferCapabilityType(this.capability);
    const recommendedActions = buildRecommendedActions({
      capabilityType,
      collaborationTargets,
      numericSummary,
      objective: typeof input.objective === "string" ? input.objective : null,
      segmentProfile,
      textSignals: flattenedStrings
    });
    const memoryWriteback = {
      key: buildMemoryKey(context.agentId, segmentProfile, this.capability.name),
      summary: `${this.capability.name} preservou contexto operacional reutilizavel.`,
      ttlHours: 24 * 14
    };
    const suggestedHandoffs = collaborationTargets.slice(0, 2).map((target) => ({
      payloadFocus: `${segmentProfile.industry} ${segmentProfile.clientSegment}`.trim(),
      reason: `${this.capability.name} pode acelerar a resolucao com contexto estruturado.`,
      target
    }));
    const confidence =
      flattenedNumbers.length > 0
        ? segmentProfile.confidence === "high"
          ? "high"
          : "medium"
        : flattenedStrings.length > 0
          ? "medium"
          : "low";

    return Promise.resolve({
      agentId: context.agentId,
      capability: this.capability.name,
      capabilityId: this.capability.id,
      capabilityType,
      confidence,
      evidence: flattenedStrings,
      memoryWriteback,
      numericSummary,
      observedAverage: numericSummary.average,
      recommendedActions,
      segmentProfile,
      suggestedHandoffs,
      summary: `${this.capability.name} executada com ${numericSummary.count} sinal(is) numerico(s), ${flattenedStrings.length} evidencia(s) textual(is) e adaptacao para ${segmentProfile.industry}/${segmentProfile.clientSegment}.`,
      tenantId: context.tenantId,
      traceId: context.traceId
    });
  }
}

export function createRuntimeTools(
  manifest: AgentManifest,
  policyEngine: PolicyEngine,
  defaultToolCostBrl: number,
  options: {
    sendEmailApiKey?: string;
    sendEmailFromEmail?: string;
  } = {}
): {
  costs: Record<string, number>;
  tools: Record<string, BaseTool<unknown, unknown>>;
} {
  const costs = buildToolCostTable({
    defaultToolCostBrl,
    manifest
  });
  const tools: Record<string, BaseTool<unknown, unknown>> = {
    "db-read": new DbReadTool({
      executor: async ({ query, params, tenantId }) => {
        const { Prisma, prisma } = await import("@birthub/database");
        const template = buildDbReadQueryTemplate(query, params, tenantId);
        const results = await prisma.$queryRaw(
          Prisma.sql(toTemplateStringsArray(template.strings), ...template.values)
        );
        return (Array.isArray(results) ? results : Array.from(results as Iterable<unknown>)) as Record<string, unknown>[];
      },
      policyEngine
    }) as BaseTool<unknown, unknown>,
    "db-write": new DbWriteTool({
      auditPublisher: (event) => {
        logger.info({ event }, "agent-runtime db-write audit");
        return Promise.resolve();
      },
      executor: () => Promise.resolve(1),
      policyEngine
    }) as BaseTool<unknown, unknown>,
    http: new HttpTool({ policyEngine }) as BaseTool<unknown, unknown>,
    "send-email": new SendEmailTool({
      apiKey: options.sendEmailApiKey,
      fromEmail: options.sendEmailFromEmail,
      policyEngine
    }) as BaseTool<unknown, unknown>,
    handoff: new ManifestCapabilityTool(
      {
        description: "Delega a execucao para outro especialista ou transfere o controle.",
        id: "handoff",
        name: "Handoff"
      },
      manifest.tags,
      { policyEngine }
    ) as BaseTool<unknown, unknown>
  };

  for (const tool of manifest.tools) {
    tools[tool.id] = new ManifestCapabilityTool(
      {
        description: tool.description,
        id: tool.id,
        name: tool.name
      },
      manifest.tags,
      {
        policyEngine,
        timeoutMs: tool.timeoutMs
      }
    ) as BaseTool<unknown, unknown>;
  }

  return {
    costs,
    tools
  };
}
