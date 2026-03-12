import { z } from 'zod';

export const MANIFEST_VERSION = '1.0.0';

const skillSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    inputSchema: z.record(z.string(), z.unknown()),
    outputSchema: z.record(z.string(), z.unknown()),
  })
  .strict();

const toolSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    timeoutMs: z.number().int().positive(),
    inputSchema: z.record(z.string(), z.unknown()),
    outputSchema: z.record(z.string(), z.unknown()),
    cost: z
      .object({
        unit: z.enum(['calls', 'tokens', 'seconds']),
        value: z.number().nonnegative(),
      })
      .strict()
      .optional(),
  })
  .strict();

const policySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    effect: z.enum(['allow', 'deny']),
    actions: z.array(z.string().min(1)).min(1),
    resources: z.array(z.string().min(1)).optional(),
    conditions: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const agentManifestSchema = z
  .object({
    manifestVersion: z.literal(MANIFEST_VERSION),
    agent: z
      .object({
        id: z.string().min(1),
        tenantId: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        version: z.string().min(1),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
      .strict(),
    skills: z.array(skillSchema),
    tools: z.array(toolSchema),
    policies: z.array(policySchema),
  })
  .strict();

export type AgentManifest = z.infer<typeof agentManifestSchema>;
