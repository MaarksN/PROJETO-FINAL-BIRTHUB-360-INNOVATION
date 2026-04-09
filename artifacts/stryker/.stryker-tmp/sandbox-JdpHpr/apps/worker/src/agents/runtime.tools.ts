// @ts-nocheck
// 
import type { AgentManifest } from "@birthub/agents-core";
import { PolicyEngine } from "@birthub/agents-core/policy/engine";
import { BaseTool, DbReadTool, DbWriteTool, HttpTool, SendEmailTool } from "@birthub/agents-core/tools";
import { createLogger } from "@birthub/logger";
import { z } from "zod";

import { buildToolCostTable } from "./runtime.budget.js";
import {
  readNumbers,
  readStrings
} from "./runtime.shared.js";

const logger = createLogger("agent-runtime");
const TENANT_SCOPE_MARKER = "\n-- tenant_scope:";

type DbReadDatabaseModule = Pick<
  typeof import("@birthub/database"),
  "Prisma" | "runWithTenantContext" | "withTenantDatabaseContext"
>;

type DbReadQueryTemplate = {
  strings: string[];
  values: unknown[];
};

function stripTenantScopeComment(query: string): string {
  const markerIndex = query.indexOf(TENANT_SCOPE_MARKER);
  return markerIndex >= 0 ? query.slice(0, markerIndex).trimEnd() : query.trimEnd();
}

function collectPlaceholderIndexes(query: string): number[] {
  return Array.from(query.matchAll(/\$(\d+)/g), ([, rawIndex]) => Number(rawIndex));
}

function normalizeDbReadParams(
  params: unknown[],
  tenantId: string,
  placeholderIndexes: number[]
): unknown[] {
  const normalizedParams = [...params];
  const highestPlaceholder = placeholderIndexes.length > 0 ? Math.max(...placeholderIndexes) : 0;

  if (
    normalizedParams.length > 0 &&
    normalizedParams.at(-1) === tenantId &&
    highestPlaceholder <= normalizedParams.length - 1
  ) {
    normalizedParams.pop();
  }

  return normalizedParams;
}

export function buildDbReadQueryTemplate(
  query: string,
  params: unknown[],
  tenantId: string
): DbReadQueryTemplate {
  const normalizedQuery = stripTenantScopeComment(query);
  const placeholderIndexes = collectPlaceholderIndexes(normalizedQuery);
  const normalizedParams = normalizeDbReadParams(params, tenantId, placeholderIndexes);
  const uniquePlaceholderIndexes = [...new Set(placeholderIndexes)].sort((left, right) => left - right);

  if (uniquePlaceholderIndexes.some((placeholderIndex, index) => placeholderIndex !== index + 1)) {
    throw new Error("db-read placeholders must be contiguous and start at $1.");
  }

  if (normalizedParams.length !== uniquePlaceholderIndexes.length) {
    throw new Error("db-read params must match the referenced placeholders.");
  }

  if (placeholderIndexes.length === 0) {
    return {
      strings: [normalizedQuery],
      values: []
    };
  }

  const strings: string[] = [];
  const values: unknown[] = [];
  let lastIndex = 0;

  for (const match of normalizedQuery.matchAll(/\$(\d+)/g)) {
    const rawMatch = match[0];
    const rawPlaceholderIndex = match[1];
    const matchIndex = match.index ?? -1;
    const placeholderIndex = Number(rawPlaceholderIndex);

    if (matchIndex < 0 || !Number.isInteger(placeholderIndex) || placeholderIndex < 1) {
      throw new Error("db-read query contains an invalid placeholder.");
    }

    strings.push(normalizedQuery.slice(lastIndex, matchIndex));
    values.push(normalizedParams[placeholderIndex - 1]);
    lastIndex = matchIndex + rawMatch.length;
  }

  strings.push(normalizedQuery.slice(lastIndex));

  return {
    strings,
    values
  };
}

function createDbReadSql(
  database: Pick<DbReadDatabaseModule, "Prisma">,
  template: DbReadQueryTemplate
) {
  return new database.Prisma.Sql(template.strings, template.values);
}

class ManifestCapabilityTool extends BaseTool<Record<string, unknown>, Record<string, unknown>> {
  constructor(
    private readonly capability: {
      description: string;
      id: string;
      name: string;
    },
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
    const flattenedNumbers = readNumbers(input.sourcePayload ?? input);
    const flattenedStrings = readStrings(input.sourcePayload ?? input).slice(0, 6);
    const average =
      flattenedNumbers.length > 0
        ? Math.round(
            (flattenedNumbers.reduce((total, value) => total + value, 0) /
              flattenedNumbers.length) *
              100
          ) / 100
        : 0;

    return Promise.resolve({
      agentId: context.agentId,
      capability: this.capability.name,
      capabilityId: this.capability.id,
      confidence: flattenedNumbers.length > 0 ? "medium" : "high",
      evidence: flattenedStrings,
      observedAverage: average,
      summary: `${this.capability.name} executada com ${flattenedNumbers.length} sinal(is) numerico(s) e ${flattenedStrings.length} evidencia(s) textual(is).`,
      tenantId: context.tenantId,
      traceId: context.traceId
    });
  }
}

export function createRuntimeTools(
  manifest: AgentManifest,
  policyEngine: PolicyEngine,
  defaultToolCostBrl: number
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
        const database = await import("@birthub/database");
        const template = buildDbReadQueryTemplate(query, params, tenantId);
        const sql = createDbReadSql(database, template);
        const results = await database.runWithTenantContext(
          {
            source: "system",
            tenantId
          },
          () =>
            database.withTenantDatabaseContext((tx) =>
              tx.$queryRaw<Record<string, unknown>[]>(sql)
            )
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
    "send-email": new SendEmailTool({ policyEngine }) as BaseTool<unknown, unknown>,
    "handoff": new ManifestCapabilityTool(
      {
        description: "Delega a execução para outro especialista ou transfere o controle.",
        id: "handoff",
        name: "Handoff"
      },
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
