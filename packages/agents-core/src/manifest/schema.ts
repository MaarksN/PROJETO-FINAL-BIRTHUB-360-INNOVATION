import { z } from "zod";
// [SOURCE] checklist de Agent Pack publishing — GAP-004/M-002 items

export const MANIFEST_VERSION = "1.0.0" as const;

const nonEmptyString = z.string().trim().min(1);
const jsonSchemaObject = z.record(z.string(), z.unknown()).default({ type: "object" });

const tagListSchema = z.array(nonEmptyString).min(1);
const keywordListSchema = z.array(nonEmptyString).min(5);

const canonicalFallbackBehavior = {
  tool_unavailable: {
    retry_attempts: 3,
    backoff_strategy: "exponential" as const,
    base_delay_ms: 500
  },
  http_429: {
    wait_ms: 1_000,
    retry_attempts: 1
  },
  exhausted: {
    notify_human: true as const,
    silence: false as const,
    loop: false as const
  }
};

const fallbackBehaviorSchema = z
  .object({
    tool_unavailable: z
      .object({
        retry_attempts: z.number().int().min(1).default(3),
        backoff_strategy: z.enum(["exponential"]).default("exponential"),
        base_delay_ms: z.number().int().positive().default(500)
      })
      .strict(),
    http_429: z
      .object({
        wait_ms: z.number().int().positive().default(1_000),
        retry_attempts: z.number().int().min(1).default(1)
      })
      .strict(),
    exhausted: z
      .object({
        notify_human: z.literal(true).default(true),
        silence: z.literal(false).default(false),
        loop: z.literal(false).default(false)
      })
      .strict()
  })
  .strict()
  .default(canonicalFallbackBehavior);

// Default-deny governance: every manifest object schema in this module is strict.

export const manifestTagsSchema = z
  .object({
    domain: tagListSchema,
    level: tagListSchema,
    persona: tagListSchema,
    "use-case": tagListSchema,
    industry: tagListSchema
  })
  .strict();

export const skillManifestSchema = z
  .object({
    description: nonEmptyString,
    id: nonEmptyString,
    inputSchema: jsonSchemaObject,
    name: nonEmptyString,
    outputSchema: jsonSchemaObject
  })
  .strict();

export const toolManifestSchema = z
  .object({
    description: nonEmptyString,
    id: nonEmptyString,
    inputSchema: jsonSchemaObject,
    name: nonEmptyString,
    outputSchema: jsonSchemaObject,
    timeoutMs: z.number().int().positive().default(15_000)
  })
  .strict();

export const policyManifestSchema = z
  .object({
    actions: z.array(nonEmptyString).min(1),
    effect: z.enum(["allow", "deny"]),
    id: nonEmptyString,
    name: nonEmptyString
  })
  .strict();

export const agentDescriptorSchema = z
  .object({
    changelog: z.array(nonEmptyString).default([]),
    description: nonEmptyString,
    id: nonEmptyString,
    kind: z.enum(["agent", "catalog"]).default("agent"),
    name: nonEmptyString,
    prompt: nonEmptyString,
    tenantId: nonEmptyString.default("catalog"),
    version: nonEmptyString
  })
  .strict();

export const agentManifestSchema = z
  .object({
    agent: agentDescriptorSchema,
    keywords: keywordListSchema,
    manifestVersion: z.literal(MANIFEST_VERSION),
    policies: z.array(policyManifestSchema).min(1),
    required_tools: z.array(nonEmptyString).default([]),
    skills: z.array(skillManifestSchema).min(1),
    tags: manifestTagsSchema,
    tools: z.array(toolManifestSchema).min(1),
    fallback_behavior: fallbackBehaviorSchema
  })
  .strict();

export type AgentManifest = z.infer<typeof agentManifestSchema>;
export type AgentManifestTags = z.infer<typeof manifestTagsSchema>;
export type AgentManifestKeywords = z.infer<typeof keywordListSchema>;
