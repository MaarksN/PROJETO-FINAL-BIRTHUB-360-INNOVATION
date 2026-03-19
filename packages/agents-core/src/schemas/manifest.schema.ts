import { z } from "zod";
// [SOURCE] checklist de Agent Pack publishing — GAP-004/M-002 items

const semanticVersionRegex =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

export const SUPPORTED_AGENT_API_VERSION = "1.0.0";

export const semanticVersionSchema = z
  .string()
  .regex(semanticVersionRegex, "Expected semantic version (major.minor.patch)");

const skillReferenceSchema = z
  .object({
    id: z.string().min(1),
    source: z.string().min(1).optional(),
    version: semanticVersionSchema
  })
  .strict();

const toolReferenceSchema = z
  .object({
    id: z.string().min(1),
    maxCalls: z.number().int().positive().max(1000).default(1),
    timeoutMs: z.number().int().positive().max(300_000).default(30_000)
  })
  .strict();

const restrictionPolicySchema = z
  .object({
    allowDomains: z.array(z.string().min(1)).default([]),
    allowTools: z.array(z.string().min(1)).default([]),
    denyTools: z.array(z.string().min(1)).default([]),
    maxSteps: z.number().int().positive().max(100).default(12),
    maxTokens: z.number().int().positive().max(1_000_000).default(8_000)
  })
  .strict();

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

export const agentManifestSchema = z
  .object({
    apiVersion: semanticVersionSchema.default(SUPPORTED_AGENT_API_VERSION),
    version: semanticVersionSchema,
    description: z.string().min(1).max(2_000).optional(),
    name: z.string().min(1).max(120),
    system_prompt: z.string().min(1).max(10_000),
    memory_ttl: z.number().int().positive().max(31536000).default(86400),
    restrictions: restrictionPolicySchema.default({
      allowDomains: [],
      allowTools: [],
      denyTools: [],
      maxSteps: 12,
      maxTokens: 8_000
    }),
    required_tools: z.array(z.string().min(1)).default([]),
    skills: z.array(skillReferenceSchema).min(1),
    tags: z.array(z.string().min(1)).default([]),
    tools: z.array(toolReferenceSchema),
    fallback_behavior: fallbackBehaviorSchema,
    metadata: z.record(z.string(), z.unknown()).optional()
  })
  .strict();

export type AgentManifest = z.infer<typeof agentManifestSchema>;
