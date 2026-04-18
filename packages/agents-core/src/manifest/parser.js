import { agentManifestSchema, MANIFEST_VERSION } from "./schema.js";
export class AgentManifestParseError extends Error {
    issues;
    constructor(issues) {
        super(`Agent manifest invalido: ${issues.join("; ")}`);
        this.name = "AgentManifestParseError";
        this.issues = issues;
    }
}
function formatIssue(issue) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    return `${path}: ${issue.message}`;
}
export function parseAgentManifest(input) {
    const result = agentManifestSchema.safeParse(input);
    if (!result.success) {
        const issues = result.error.issues.map(formatIssue);
        const version = typeof input === "object" && input !== null && "manifestVersion" in input
            ? input.manifestVersion
            : undefined;
        if (typeof version === "string" && version !== MANIFEST_VERSION) {
            issues.unshift(`manifestVersion: versao incompativel (${version}). Esperado ${MANIFEST_VERSION}.`);
        }
        throw new AgentManifestParseError(issues);
    }
    return result.data;
}
