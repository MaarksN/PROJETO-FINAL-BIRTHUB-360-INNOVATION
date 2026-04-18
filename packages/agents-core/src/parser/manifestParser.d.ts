import { type AgentManifest } from "../schemas/manifest.schema";
export declare class AgentManifestParseError extends Error {
    readonly issues: string[];
    constructor(issues: string[]);
}
export declare function parseAgentManifest(input: unknown, options?: {
    supportedApiVersion?: string;
}): AgentManifest;
