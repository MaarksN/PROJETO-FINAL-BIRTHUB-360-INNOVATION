import { executeAgentNode } from "./agentExecute.js";
import { executeAgentHandoffNode } from "./agentHandoff.js";
import { executeAiTextExtractNode } from "./aiTextExtract.js";
import { executeCodeNode } from "./code.js";
import { executeConditionNode } from "./condition.js";
import { executeConnectorActionNode } from "./connectorAction.js";
import { executeDelayNode } from "./delay.js";
import { executeHttpRequestNode } from "./httpRequest.js";
import { executeNotificationNode } from "./notification.js";
import { executeTransformerNode } from "./transformer.js";
function requireAgentExecutor(dependencies) {
    if (!dependencies.agentExecutor) {
        throw new Error("AGENT_EXECUTOR_NOT_CONFIGURED");
    }
    return dependencies.agentExecutor;
}
function requireHandoffExecutor(dependencies) {
    if (!dependencies.handoffExecutor) {
        throw new Error("HANDOFF_EXECUTOR_NOT_CONFIGURED");
    }
    return dependencies.handoffExecutor;
}
function requireConnectorExecutor(dependencies) {
    if (!dependencies.connectorExecutor) {
        throw new Error("CONNECTOR_EXECUTOR_NOT_CONFIGURED");
    }
    return dependencies.connectorExecutor;
}
function withConnectorAccountId(connectorAccountId) {
    return connectorAccountId ? { connectorAccountId } : {};
}
function withOptionalString(key, value) {
    return value ? { [key]: value } : {};
}
function buildHandoffConfig(config) {
    return {
        context: config.context,
        ...withOptionalString("correlationId", config.correlationId),
        sourceAgentId: config.sourceAgentId,
        summary: config.summary,
        targetAgentId: config.targetAgentId,
        ...withOptionalString("threadId", config.threadId)
    };
}
function buildCrmUpsertConfig(config) {
    return {
        kind: "CRM_UPSERT",
        ...withConnectorAccountId(config.connectorAccountId),
        objectType: config.objectType,
        operation: config.operation,
        payload: config.payload,
        provider: config.provider,
        ...withOptionalString("scope", config.scope)
    };
}
function buildWhatsappSendConfig(config) {
    return {
        kind: "WHATSAPP_SEND",
        ...withConnectorAccountId(config.connectorAccountId),
        message: config.message,
        ...withOptionalString("template", config.template),
        ...withOptionalString("threadId", config.threadId),
        to: config.to
    };
}
function buildCalendarEventConfig(kind, config) {
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
async function executeAgentStep(step, context, dependencies) {
    return executeAgentNode(step.config, context, requireAgentExecutor(dependencies));
}
async function executeAgentHandoffStep(step, context, dependencies) {
    return executeAgentHandoffNode(buildHandoffConfig(step.config), context, requireHandoffExecutor(dependencies));
}
function executeAiTextExtractStep(step, context) {
    return Promise.resolve(executeAiTextExtractNode(step.config, context));
}
function executeCodeStep(step, context) {
    return Promise.resolve(executeCodeNode(step.config, context.steps, context));
}
function executeConditionStep(step, context) {
    return Promise.resolve(executeConditionNode({ ...step.config, value: step.config.value ?? "" }, context));
}
async function executeCrmUpsertStep(step, context, dependencies) {
    return executeConnectorActionNode(buildCrmUpsertConfig(step.config), context, requireConnectorExecutor(dependencies));
}
function executeDelayStep(step) {
    return Promise.resolve(executeDelayNode(step.config));
}
async function executeGoogleEventStep(step, context, dependencies) {
    return executeConnectorActionNode(buildCalendarEventConfig("GOOGLE_EVENT", step.config), context, requireConnectorExecutor(dependencies));
}
async function executeHttpRequestStep(step, context, dependencies) {
    return executeHttpRequestNode(step.config, context, dependencies.httpRequestRateLimiter);
}
async function executeMsEventStep(step, context, dependencies) {
    return executeConnectorActionNode(buildCalendarEventConfig("MS_EVENT", step.config), context, requireConnectorExecutor(dependencies));
}
async function executeNotificationStep(step, context, dependencies) {
    return executeNotificationNode(step.config, context, dependencies.notificationDispatcher);
}
function executeTransformerStep(step, context) {
    return Promise.resolve(executeTransformerNode(step.config, context));
}
function executeTriggerStep(_step, context) {
    return Promise.resolve(context.trigger.output);
}
async function executeWhatsappSendStep(step, context, dependencies) {
    return executeConnectorActionNode(buildWhatsappSendConfig(step.config), context, requireConnectorExecutor(dependencies));
}
const stepHandlers = {
    AGENT_EXECUTE: executeAgentStep,
    AGENT_HANDOFF: executeAgentHandoffStep,
    AI_TEXT_EXTRACT: executeAiTextExtractStep,
    CODE: executeCodeStep,
    CONDITION: executeConditionStep,
    CRM_UPSERT: executeCrmUpsertStep,
    DELAY: executeDelayStep,
    GOOGLE_EVENT: executeGoogleEventStep,
    HTTP_REQUEST: executeHttpRequestStep,
    MS_EVENT: executeMsEventStep,
    SEND_NOTIFICATION: executeNotificationStep,
    TRANSFORMER: executeTransformerStep,
    TRIGGER_CRON: executeTriggerStep,
    TRIGGER_EVENT: executeTriggerStep,
    TRIGGER_WEBHOOK: executeTriggerStep,
    WHATSAPP_SEND: executeWhatsappSendStep
};
import { createLogger } from "@birthub/logger";
const logger = createLogger("workflows-core:execute-step");
export async function executeStep(step, context, dependencies = {}) {
    const handler = stepHandlers[step.type];
    logger.info({ stepId: step.key, stepType: step.type, workflowId: context.workflowId }, "Executing workflow step");
    try {
        const result = await handler(step, context, dependencies);
        return result;
    }
    catch (error) {
        logger.error({ error, stepId: step.key, stepType: step.type, workflowId: context.workflowId }, "Workflow step execution failed");
        throw error;
    }
}
