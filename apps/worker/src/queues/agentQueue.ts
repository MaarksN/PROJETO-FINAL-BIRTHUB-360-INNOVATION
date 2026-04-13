// @ts-nocheck
//
export { getAgentQueueName, type AgentQueuePriority } from "@birthub/queue";

export interface AgentQueuePayload {
  agentId: string;
  executionId: string;
  input: Record<string, unknown>;
  priority?: import("@birthub/queue").AgentQueuePriority;
  tenantId: string;
  toolCalls?: Array<{
    input: unknown;
    tool: string;
  }>;
}
