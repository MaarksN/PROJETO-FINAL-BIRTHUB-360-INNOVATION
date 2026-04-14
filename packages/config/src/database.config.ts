import { z } from "zod";

import { getEnvironmentSource } from "./environment.js";
import { nodeEnvSchema, optionalUrlString, parseEnv } from "./shared.js";

export const databaseEnvSchema = z.object({
  DATABASE_CONNECTION_LIMIT: z.coerce.number().int().positive().optional(),
  DATABASE_URL: optionalUrlString,
  DB_SLOW_QUERY_MS: z.coerce.number().int().positive().default(750),
  NODE_ENV: nodeEnvSchema,
  PRISMA_QUERY_TIMEOUT_MS: z.coerce.number().int().positive().default(5_000)
});

export type DatabaseConfig = z.infer<typeof databaseEnvSchema>;

export function getDatabaseConfig(env: NodeJS.ProcessEnv = getEnvironmentSource()): DatabaseConfig {
  return parseEnv("database", databaseEnvSchema, getEnvironmentSource(env));
}
