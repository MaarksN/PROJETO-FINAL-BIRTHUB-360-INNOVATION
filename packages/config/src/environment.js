import { deploymentEnvironmentSchema, nodeEnvSchema } from "./shared.js";
export function getEnvironmentSource(env = process.env) {
    return env;
}
export function readEnvironmentValue(key, env = process.env) {
    const value = getEnvironmentSource(env)[key];
    return typeof value === "string" ? value : undefined;
}
export function readTrimmedEnvironmentValue(key, env = process.env) {
    const value = readEnvironmentValue(key, env);
    const trimmedValue = value?.trim();
    return trimmedValue ? trimmedValue : undefined;
}
export function resolveNodeEnvironment(env = process.env) {
    return nodeEnvSchema.parse(readEnvironmentValue("NODE_ENV", env));
}
export function resolveDeploymentEnvironment(env = process.env) {
    return deploymentEnvironmentSchema.parse(readEnvironmentValue("DEPLOYMENT_ENVIRONMENT", env));
}
export function isProductionEnvironment(env = process.env) {
    return resolveNodeEnvironment(env) === "production";
}
