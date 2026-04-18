// 
import { interpolateValue } from "../interpolation/interpolate.js";
function summarizeContext(context) {
    const stepCount = Object.keys(context.steps).length;
    return `workflow=${context.workflowId}; execution=${context.executionId}; tenant=${context.tenantId}; steps=${stepCount}`;
}
export async function executeAgentHandoffNode(config, context, executor) {
    const interpolated = interpolateValue(config, context);
    return executor.execute({
        context: interpolated.context ?? {},
        contextSummary: summarizeContext(context),
        correlationId: interpolated.correlationId ?? context.executionId,
        executionId: context.executionId,
        sourceAgentId: interpolated.sourceAgentId,
        summary: interpolated.summary,
        tenantId: context.tenantId,
        targetAgentId: interpolated.targetAgentId,
        ...(interpolated.threadId ? { threadId: interpolated.threadId } : {}),
        workflowId: context.workflowId
    });
}
