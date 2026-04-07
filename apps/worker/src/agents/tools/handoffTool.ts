import { BaseTool } from "@birthub/agents-core/tools";
import type { Redis } from "ioredis";
import { z } from "zod";

import { persistAgentHandoff } from "../handoffs.js";
import { AgentQueueRouter } from "../../queues/agentQueue.js";

export interface HandoffToolOptions {
  redis: Redis;
}

export class HandoffTool extends BaseTool<
  {
    context: Record<string, unknown>;
    contextSummary: string;
    reason: string;
    summary: string;
    targetAgentId: string;
    workflowId: string;
  },
  { message: string; status: string }
> {
  private readonly redis: Redis;

  constructor(options: HandoffToolOptions) {
    super({
      description: "Escala ou transfere a execução para outro agente especializado.",
      inputSchema: z.object({
        context: z.record(z.string(), z.unknown()),
        contextSummary: z.string(),
        reason: z.string(),
        summary: z.string(),
        targetAgentId: z.string(),
        workflowId: z.string()
      }),
      name: "handoff",
      outputSchema: z.object({
        message: z.string(),
        status: z.string()
      })
    });

    this.redis = options.redis;
  }

  protected async execute(
    input: {
      context: Record<string, unknown>;
      contextSummary: string;
      reason: string;
      summary: string;
      targetAgentId: string;
      workflowId: string;
    },
    context: {
      agentId: string;
      tenantId: string;
      traceId?: string;
    }
  ): Promise<{ message: string; status: string }> {
    const executionId = context.traceId ?? `handoff-${Date.now()}`;
    const correlationId = executionId;

    await persistAgentHandoff({
      context: input.context,
      contextSummary: input.contextSummary,
      correlationId,
      executionId,
      sourceAgentId: context.agentId,
      summary: input.summary,
      targetAgentId: input.targetAgentId,
      tenantId: context.tenantId,
      workflowId: input.workflowId
    });

    const router = new AgentQueueRouter(this.redis);

    await router.enqueue({
      agentId: input.targetAgentId,
      executionId: `${executionId}:handoff`,
      input: input.context,
      priority: "high",
      tenantId: context.tenantId
    });

    return {
      message: `Handoff realizado para o agente ${input.targetAgentId}. Execução enfileirada.`,
      status: "success"
    };
  }
}
