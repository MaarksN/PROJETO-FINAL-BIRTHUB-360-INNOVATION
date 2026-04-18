import type { AgentManifest } from "./schema";
export declare class AgentManifestParseError extends Error {
    readonly issues: string[];
    constructor(issues: string[]);
}
export declare function parseAgentManifest(input: unknown): AgentManifest;
