import { ZodError } from "zod";
import { agentManifestSchema, SUPPORTED_AGENT_API_VERSION } from "../schemas/manifest.schema.js";
export class AgentManifestParseError extends Error {
    issues;
    constructor(issues) {
        super(`Manifesto de agente inválido: ${issues.join("; ")}`);
        this.name = "AgentManifestParseError";
        this.issues = issues;
    }
}
function compareSemverVersions(left, right) {
    const [leftCore = "0.0.0"] = left.split("-");
    const [rightCore = "0.0.0"] = right.split("-");
    const leftParts = leftCore.split(".").map((value) => Number.parseInt(value, 10));
    const rightParts = rightCore.split(".").map((value) => Number.parseInt(value, 10));
    for (let index = 0; index < 3; index += 1) {
        const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
        if (delta !== 0) {
            return delta;
        }
    }
    return 0;
}
function formatIssue(issue) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "manifest";
    if (path === "tools" && issue.code === "invalid_type" && issue.expected === "array") {
        return `O campo 'tools' precisa ser um array.`;
    }
    if (path === "skills" && issue.code === "invalid_type" && issue.expected === "array") {
        return `O campo 'skills' precisa ser um array.`;
    }
    return `${path}: ${issue.message}`;
}
export function parseAgentManifest(input, options) {
    const supportedApiVersion = options?.supportedApiVersion ?? SUPPORTED_AGENT_API_VERSION;
    try {
        const manifest = agentManifestSchema.parse(input);
        if (compareSemverVersions(manifest.apiVersion, supportedApiVersion) > 0) {
            throw new AgentManifestParseError([
                `apiVersion: versão '${manifest.apiVersion}' não suportada. Versão máxima suportada: '${supportedApiVersion}'.`
            ]);
        }
        return manifest;
    }
    catch (error) {
        if (error instanceof AgentManifestParseError) {
            throw error;
        }
        if (error instanceof ZodError) {
            const issues = error.issues.map(formatIssue);
            throw new AgentManifestParseError(issues);
        }
        throw error;
    }
}
