// 
import { interpolateValue } from "../interpolation/interpolate.js";
function summarizeContext(context) {
    const stepCount = Object.keys(context.steps).length;
    return `workflow=${context.workflowId}; execution=${context.executionId}; tenant=${context.tenantId}; steps=${stepCount}`;
}
export async function executeConnectorActionNode(action, context, executor) {
    return executor.execute({
        action: interpolateValue(action, context),
        contextSummary: summarizeContext(context),
        executionId: context.executionId,
        tenantId: context.tenantId,
        workflowId: context.workflowId
    });
}
