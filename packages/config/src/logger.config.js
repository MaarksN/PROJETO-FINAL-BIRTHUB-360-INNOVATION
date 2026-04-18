import { z } from "zod";
import { getEnvironmentSource } from "./environment.js";
import { nodeEnvSchema, parseEnv } from "./shared.js";
const loggerLevelSchema = z.enum(["fatal", "error", "warn", "info", "debug", "trace"]);
export const loggerEnvSchema = z.object({
    LOG_LEVEL: loggerLevelSchema.default("info"),
    LOG_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),
    NODE_ENV: nodeEnvSchema
});
export function getLoggerConfig(env = getEnvironmentSource()) {
    return parseEnv("logger", loggerEnvSchema, getEnvironmentSource(env));
}
