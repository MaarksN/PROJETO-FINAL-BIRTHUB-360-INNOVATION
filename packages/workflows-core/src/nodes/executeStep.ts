import { executeAgentNode, type AgentExecutor } from "./agentExecute.js";
import {
  executeAgentHandoffNode,
  type HandoffExecutor
} from "./agentHandoff.js";
import { executeAiTextExtractNode } from "./aiTextExtract.js";
import { executeCodeNode } from "./code.js";
import { executeConditionNode } from "./condition.js";
import {
  executeConnectorActionNode,
  type ConnectorExecutor
} from "./connectorAction.js";
import { executeDelayNode } from "./delay.js";
import { executeHttpRequestNode } from "./httpRequest.js";
import {
  executeNotificationNode,
  type NotificationDispatcher
} from "./notification.js";
import { executeTransformerNode } from "./transformer.js";
import type { StepDefinition } from "../schemas/step.schema.js";
import type { WorkflowRuntimeContext } from "../types.js";

export interface StepExecutionDependencies {
  agentExecutor?: AgentExecutor;
  connectorExecutor?: ConnectorExecutor;
  handoffExecutor?: HandoffExecutor;
  notificationDispatcher?: NotificationDispatcher;
  httpRequestRateLimiter?: { consume: (key: string, limit: number, windowSeconds: number) => Promise<void> };
}

type StepType = StepDefinition["type"];
type StepOf<TType extends StepType> = Extract<StepDefinition, { type: TType }>;
type StepHandler<TType extends StepType> = (
  step: StepOf<TType>,
  context: WorkflowRuntimeContext,
  dependencies: StepExecutionDependencies
) => Promise<unknown>;

function requireAgentExecutor(dependencies: StepExecutionDependencies): AgentExecutor {
  if (!dependencies.agentExecutor) {
    throw new Error("AGENT_EXECUTOR_NOT_CONFIGURED");
  }

  return dependencies.agentExecutor;
}

function requireHandoffExecutor(dependencies: StepExecutionDependencies): HandoffExecutor {
  if (!dependencies.handoffExecutor) {
    throw new Error("HANDOFF_EXECUTOR_NOT_CONFIGURED");
  }

  return dependencies.handoffExecutor;
}

function requireConnectorExecutor(dependencies: StepExecutionDependencies): ConnectorExecutor {
  if (!dependencies.connectorExecutor) {
    throw new Error("CONNECTOR_EXECUTOR_NOT_CONFIGURED");
  }

  return dependencies.connectorExecutor;
}

function withConnectorAccountId(connectorAccountId?: string): { connectorAccountId?: string } {
  return connectorAccountId ? { connectorAccountId } : {};
}

function withOptionalString<TKey extends string>(
  key: TKey,
  value?: string
): Partial<Record<TKey, string>> {
  return value ? { [key]: value } as Record<TKey, string> : {};
}

function buildHandoffConfig(config: StepOf<"AGENT_HANDOFF">["config"]) {
  return {
    context: config.context,
    ...withOptionalString("correlationId", config.correlationId),
    sourceAgentId: config.sourceAgentId,
    summary: config.summary,
    targetAgentId: config.targetAgentId,
    ...withOptionalString("threadId", config.threadId)
  };
}

function buildCrmUpsertConfig(config: StepOf<"CRM_UPSERT">["config"]) {
  return {
    kind: "CRM_UPSERT" as const,
    ...withConnectorAccountId(config.connectorAccountId),
    objectType: config.objectType,
    operation: config.operation,
    payload: config.payload,
    provider: config.provider,
    ...withOptionalString("scope", config.scope)
  };
}

function buildWhatsappSendConfig(config: StepOf<"WHATSAPP_SEND">["config"]) {
  return {
    kind: "WHATSAPP_SEND" as const,
    ...withConnectorAccountId(config.connectorAccountId),
    message: config.message,
    ...withOptionalString("template", config.template),
    ...withOptionalString("threadId", config.threadId),
    to: config.to
  };
}

function buildCalendarEventConfig<TType extends "GOOGLE_EVENT" | "MS_EVENT">(
  kind: TType,
  config: StepOf<TType>["config"]
) {
  return {
    kind,
    attendees: config.attendees,
    ...withOptionalString("calendarId", config.calendarId),
    ...withConnectorAccountId(config.connectorAccountId),
    ...withOptionalString("description", config.description),
    end: config.end,
    start: config.start,
    title: config.title
  };
}

const stepHandlers = {
  AGENT_EXECUTE: async (step, context, dependencies) =>
    executeAgentNode(step.config, context, requireAgentExecutor(dependencies)),
  AGENT_HANDOFF: async (step, context, dependencies) =>
    executeAgentHandoffNode(
      buildHandoffConfig(step.config),
      context,
      requireHandoffExecutor(dependencies)
    ),
  AI_TEXT_EXTRACT: async (step, context) => {
    return Promise.resolve(executeAiTextExtractNode(step.config, context));
  },
  CODE: async (step, context) => {
    return Promise.resolve(executeCodeNode(step.config, context.steps, context));
  },
  CONDITION: async (step, context) => {
    return Promise.resolve(executeConditionNode(step.config, context));
  },
  CRM_UPSERT: async (step, context, dependencies) =>
    executeConnectorActionNode(
      buildCrmUpsertConfig(step.config),
      context,
      requireConnectorExecutor(dependencies)
    ),
  DELAY: async (step) => {
    return Promise.resolve(executeDelayNode(step.config));
  },
  GOOGLE_EVENT: async (step, context, dependencies) =>
    executeConnectorActionNode(
      buildCalendarEventConfig("GOOGLE_EVENT", step.config),
      context,
      requireConnectorExecutor(dependencies)
    ),
  HTTP_REQUEST: async (step, context, dependencies) =>
    executeHttpRequestNode(step.config, context, dependencies.httpRequestRateLimiter),
  MS_EVENT: async (step, context, dependencies) =>
    executeConnectorActionNode(
      buildCalendarEventConfig("MS_EVENT", step.config),
      context,
      requireConnectorExecutor(dependencies)
    ),
  SEND_NOTIFICATION: async (step, context, dependencies) =>
    executeNotificationNode(step.config, context, dependencies.notificationDispatcher),
  TRANSFORMER: async (step, context) => {
    return Promise.resolve(executeTransformerNode(step.config, context));
  },
  TRIGGER_CRON: async (_step, context) => {
    return Promise.resolve(context.trigger.output);
  },
  TRIGGER_EVENT: async (_step, context) => {
    return Promise.resolve(context.trigger.output);
  },
  TRIGGER_WEBHOOK: async (_step, context) => {
    return Promise.resolve(context.trigger.output);
  },
  WHATSAPP_SEND: async (step, context, dependencies) =>
    executeConnectorActionNode(
      buildWhatsappSendConfig(step.config),
      context,
      requireConnectorExecutor(dependencies)
    )
} satisfies { [TType in StepType]: StepHandler<TType> };

export async function executeStep(
  step: StepDefinition,
  context: WorkflowRuntimeContext,
  dependencies: StepExecutionDependencies = {}
): Promise<unknown> {
  const handler = stepHandlers[step.type] as StepHandler<typeof step.type>;
  return handler(step as StepOf<typeof step.type>, context, dependencies);
}
