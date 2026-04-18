import { STEP_CATALOG } from "../catalog/stepCatalog.js";
const CONDITIONAL_ROUTES = new Set(["IF_TRUE", "IF_FALSE"]);
function addFinding(findings, summary, finding) {
    findings.push(finding);
    summary[finding.severity] += 1;
}
function hasOutgoingRoute(canvas, stepKey, route) {
    return canvas.transitions.some((transition) => transition.source === stepKey && transition.route === route);
}
function lintStepByConfig(step, canvas, findings, summary) {
    const baseRisk = STEP_CATALOG[step.type].riskWeight;
    if (STEP_CATALOG[step.type].lifecycle === "deprecated") {
        addFinding(findings, summary, {
            code: "LEGACY_STEP",
            message: STEP_CATALOG[step.type].replacement
                ? `Step type '${step.type}' is deprecated. Prefer '${STEP_CATALOG[step.type].replacement}'.`
                : `Step type '${step.type}' is deprecated and should be replaced.`,
            risk: baseRisk,
            severity: "warning",
            stepKey: step.key,
            stepType: step.type
        });
    }
    if (step.type === "HTTP_REQUEST" && step.config.url.startsWith("http://")) {
        addFinding(findings, summary, {
            code: "INSECURE_HTTP_URL",
            message: "HTTP_REQUEST uses insecure URL scheme. Use https:// whenever possible.",
            risk: baseRisk + 10,
            severity: "critical",
            stepKey: step.key,
            stepType: step.type
        });
    }
    if (step.type === "CODE" && step.config.timeout_ms > 750) {
        addFinding(findings, summary, {
            code: "RISKY_CODE_TIMEOUT",
            message: "CODE step timeout_ms is high and may block worker throughput.",
            risk: baseRisk + 6,
            severity: "warning",
            stepKey: step.key,
            stepType: step.type
        });
    }
    if ((step.type === "CRM_UPSERT" || step.type === "GOOGLE_EVENT" || step.type === "MS_EVENT" || step.type === "WHATSAPP_SEND") &&
        !step.config.connectorAccountId) {
        addFinding(findings, summary, {
            code: "UNSCOPED_CONNECTOR_ACCOUNT",
            message: `${step.type} should define connectorAccountId for deterministic tenant routing.`,
            risk: baseRisk,
            severity: "warning",
            stepKey: step.key,
            stepType: step.type
        });
    }
    if ((step.type === "HTTP_REQUEST" || step.type === "AGENT_EXECUTE") && !hasOutgoingRoute(canvas, step.key, "ON_FAILURE")) {
        addFinding(findings, summary, {
            code: "MISSING_FAILURE_PATH",
            message: `${step.type} has no ON_FAILURE transition and may stop execution without explicit fallback.`,
            risk: baseRisk + 4,
            severity: "info",
            stepKey: step.key,
            stepType: step.type
        });
    }
}
function lintTransitions(canvas, stepsByKey) {
    const findings = [];
    for (const transition of canvas.transitions) {
        const sourceStep = stepsByKey.get(transition.source);
        if (!sourceStep) {
            continue;
        }
        const isConditional = sourceStep.type === "CONDITION";
        if (!isConditional && CONDITIONAL_ROUTES.has(transition.route)) {
            findings.push({
                code: "INCOMPATIBLE_ROUTE",
                message: `Route '${transition.route}' is only valid for CONDITION steps.`,
                risk: 12,
                severity: "critical",
                stepKey: sourceStep.key,
                stepType: sourceStep.type
            });
        }
    }
    return findings;
}
export function lintWorkflowSteps(canvas) {
    const findings = [];
    const summary = {
        critical: 0,
        info: 0,
        warning: 0
    };
    const stepsByKey = new Map(canvas.steps.map((step) => [step.key, step]));
    for (const step of canvas.steps) {
        lintStepByConfig(step, canvas, findings, summary);
    }
    const transitionFindings = lintTransitions(canvas, stepsByKey);
    for (const finding of transitionFindings) {
        addFinding(findings, summary, finding);
    }
    const score = Math.min(100, findings.reduce((total, finding) => total + finding.risk, 0));
    return {
        findings,
        score,
        summary
    };
}
