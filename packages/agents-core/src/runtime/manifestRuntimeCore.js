import { buildMemoryKey, buildPremiumLayersAssessment, buildSegmentKeywords, describeCapabilityIntent, inferCapabilityType, inferCollaborationTargets, inferSegmentProfile, readNumericSignals, readTextSignals, summarizeNumericSignals, summarizePremiumLayers } from "./intelligence.js";
export function readString(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}
export function uniqueStrings(values) {
    const seen = new Set();
    const result = [];
    for (const value of values.map((item) => item.trim()).filter(Boolean)) {
        const normalized = value.toLowerCase();
        if (seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        result.push(value);
    }
    return result;
}
export function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function readObjective(input) {
    const directCandidates = [
        input.objective,
        input.brief,
        input.prompt,
        input.task,
        input.goal,
        isRecord(input.context) ? input.context.objective : null
    ];
    for (const candidate of directCandidates) {
        const value = readString(candidate);
        if (value) {
            return value;
        }
    }
    return "Executar o agente com rastreabilidade, governanca e proximo passo claro.";
}
export function readPrimaryOwner(input) {
    const candidates = [
        input.owner,
        input.requestedBy,
        input.userId,
        isRecord(input.context) ? input.context.owner : null
    ];
    for (const candidate of candidates) {
        const value = readString(candidate);
        if (value) {
            return value;
        }
    }
    return "tenant-ops";
}
export function normalizeJsonValue(value) {
    if (value === null) {
        return null;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return value;
    }
    if (Array.isArray(value)) {
        return value
            .map((item) => normalizeJsonValue(item))
            .filter((item) => item !== undefined);
    }
    if (!isRecord(value)) {
        return null;
    }
    const objectValue = {};
    for (const [key, child] of Object.entries(value)) {
        const normalized = normalizeJsonValue(child);
        if (normalized !== undefined) {
            objectValue[key] = normalized;
        }
    }
    return objectValue;
}
function normalizePolicyAction(action) {
    const trimmed = action.trim();
    if (!trimmed) {
        return "";
    }
    if (trimmed === "tool:execute") {
        return "tool.*";
    }
    if (trimmed.startsWith("tool:")) {
        return `tool.${trimmed.slice("tool:".length)}`;
    }
    if (trimmed.startsWith("tool.")) {
        return trimmed;
    }
    return trimmed.replace(/:/g, ".");
}
function buildRuntimePolicyRulesFromManifest(manifest) {
    const rules = [];
    for (const policy of manifest.policies) {
        for (const action of policy.actions) {
            const normalizedAction = normalizePolicyAction(action);
            if (!normalizedAction) {
                continue;
            }
            rules.push({
                action: normalizedAction,
                effect: policy.effect,
                id: `${policy.id}:${normalizedAction}`
            });
        }
    }
    return rules;
}
function buildRuntimePolicyRulesFromManagedPolicies(managedPolicies = []) {
    const rules = [];
    for (const policy of managedPolicies) {
        if ((policy.enabled ?? true) === false) {
            continue;
        }
        for (const action of policy.actions) {
            const normalizedAction = normalizePolicyAction(action);
            if (!normalizedAction) {
                continue;
            }
            rules.push({
                action: normalizedAction,
                effect: policy.effect,
                id: `${policy.id}:${normalizedAction}`
            });
        }
    }
    return rules;
}
export function summarizeLearning(records = []) {
    return records.slice(0, 5).map((record) => ({
        confidence: record.confidence,
        id: record.id,
        summary: record.summary
    }));
}
export function deriveSpecialistDeliverables(manifest) {
    return uniqueStrings([
        ...manifest.skills.map((skill) => skill.name),
        ...manifest.tags["use-case"].map((tag) => tag.replace(/-/g, " ")),
        ...manifest.tags.domain.map((domain) => `${domain} recommendation`)
    ]).slice(0, 6);
}
export function readTriggerSource(input) {
    const directCandidates = [
        input.sourceSystem,
        input.triggerSource,
        input.source,
        isRecord(input.trigger) ? input.trigger.sourceSystem : null,
        isRecord(input.trigger) ? input.trigger.source : null
    ];
    for (const candidate of directCandidates) {
        const value = readString(candidate);
        if (value) {
            return value;
        }
    }
    return null;
}
export function hasWorkflowContext(input) {
    return Boolean(readString(input.workflowContextSummary) ||
        readString(input.contextSummary) ||
        (isRecord(input.trigger) && readString(input.trigger.type)));
}
export function buildStatus(input) {
    if (input.governance.requireApproval && input.numericOutliers > 0) {
        return "critical";
    }
    if (input.governance.requireApproval ||
        input.numericOutliers > 0 ||
        input.segmentConfidence === "low") {
        return "watch";
    }
    return input.sharedLearningCount > 0 ? "stable" : "watch";
}
export function toolIsSensitive(toolId) {
    const normalized = toolId.toLowerCase();
    return (normalized.includes("approval") ||
        normalized.includes("audit") ||
        normalized.includes("notification") ||
        normalized.includes("sync") ||
        normalized.includes("write") ||
        normalized.includes("adapter"));
}
function buildToolCalls(input) {
    const objective = readObjective(input.input);
    const sharedLearning = input.sharedLearning ?? [];
    const segmentProfile = inferSegmentProfile(input.input, input.manifest.tags);
    const numericSummary = summarizeNumericSignals(readNumericSignals(input.input));
    const textSignals = readTextSignals(input.input, 10);
    const collaborationTargets = inferCollaborationTargets(input.manifest);
    const premiumLayers = buildPremiumLayersAssessment({
        collaborationTargets,
        governanceRequired: input.manifest.tools.some((tool) => toolIsSensitive(tool.id)),
        hasMemoryWriteback: true,
        numericSummary,
        objective,
        segmentProfile,
        sharedLearningCount: sharedLearning.length,
        textSignals,
        triggerSource: readTriggerSource(input.input),
        workflowReady: hasWorkflowContext(input.input)
    });
    const premiumOverview = summarizePremiumLayers(premiumLayers);
    return input.manifest.tools.map((tool, index) => {
        const capabilityType = inferCapabilityType(tool);
        return {
            input: {
                collaborationTargets,
                contextSummary: input.contextSummary ?? null,
                dataSummary: numericSummary,
                memoryHints: {
                    memoryKey: buildMemoryKey(input.manifest.agent.id, segmentProfile, tool.name),
                    saveSummary: capabilityType === "memory" || index === input.manifest.tools.length - 1
                },
                objective,
                premiumLayers,
                premiumOperatingModel: {
                    needsAttention: premiumOverview.needsAttention,
                    overallScore: premiumOverview.overallScore,
                    standoutLayers: premiumOverview.standoutLayers,
                    tier: "market-premium-10"
                },
                segmentProfile,
                sequence: index + 1,
                sharedLearning: summarizeLearning(sharedLearning),
                sourcePayload: input.input,
                textSignals,
                toolDescription: tool.description,
                toolIntent: describeCapabilityIntent(capabilityType),
                toolName: tool.name
            },
            rationale: `Executar ${tool.name} para ${describeCapabilityIntent(capabilityType)} dentro do objetivo '${objective}'.`,
            tool: tool.id
        };
    });
}
export function buildOutputConfidence(segmentProfile, sharedLearningCount, numericSignalCount) {
    if (segmentProfile.confidence === "high" && sharedLearningCount > 0) {
        return "high";
    }
    if (numericSignalCount > 0) {
        return "medium";
    }
    return "low";
}
export function buildEmergingRisks(input) {
    return uniqueStrings([
        input.governance.requireApproval
            ? "O output envolve acao ou artefato sensivel que pede dupla checagem."
            : "",
        input.numericOutliers > 0
            ? `Foram detectados ${input.numericOutliers} outlier(s) relevantes nos sinais avaliados.`
            : "",
        input.premiumNeedsAttention.length > 0
            ? `Camadas premium pedindo reforco: ${input.premiumNeedsAttention.join(", ")}.`
            : "",
        input.segmentConfidence === "low"
            ? "O perfil de segmento foi inferido com baixa confianca e pode precisar de refinamento manual."
            : ""
    ]);
}
export function buildLeadingIndicators(input) {
    return uniqueStrings([
        ...input.plan.toolCalls.map((call) => `tool-ready:${call.tool}`),
        ...(input.orchestrationPlan?.focus_domains.map((domain) => `domain:${domain}`) ?? []),
        `premium-score:${input.overallScore}`,
        `segment:${input.segmentProfile.clientSegment}`,
        `industry:${input.segmentProfile.industry}`,
        `trend:${input.trend}`,
        input.signalCount > 0 ? `signal-count:${input.signalCount}` : ""
    ]).slice(0, 8);
}
export function buildPreventiveActionPlan(owner, recommendedActions) {
    return recommendedActions.map((item, index) => ({
        action: item.action,
        checkpoint: index === 0 ? "30m" : "2h",
        deadline: new Date(Date.now() + (index + 1) * 2 * 60 * 60 * 1000).toISOString(),
        expected_impact: item.priority === "now"
            ? "Reduzir risco e acelerar decisao com alto impacto."
            : "Aumentar qualidade da execucao e preservar continuidade.",
        owner
    }));
}
export function buildRuntimePolicyRules(manifest, managedPolicies = []) {
    const merged = new Map();
    for (const rule of [
        ...buildRuntimePolicyRulesFromManifest(manifest),
        ...buildRuntimePolicyRulesFromManagedPolicies(managedPolicies)
    ]) {
        merged.set(rule.id, rule);
    }
    return Array.from(merged.values());
}
export function buildAgentRuntimePlan(input) {
    const toolCalls = buildToolCalls(input);
    const objective = readObjective(input.input);
    const sharedLearning = input.sharedLearning ?? [];
    const segmentProfile = inferSegmentProfile(input.input, input.manifest.tags);
    const numericSummary = summarizeNumericSignals(readNumericSignals(input.input));
    const textSignals = readTextSignals(input.input, 10);
    const premiumLayers = buildPremiumLayersAssessment({
        collaborationTargets: inferCollaborationTargets(input.manifest),
        governanceRequired: input.manifest.tools.some((tool) => toolIsSensitive(tool.id)),
        hasMemoryWriteback: true,
        numericSummary,
        objective,
        segmentProfile,
        sharedLearningCount: sharedLearning.length,
        textSignals,
        triggerSource: readTriggerSource(input.input),
        workflowReady: hasWorkflowContext(input.input)
    });
    const premiumOverview = summarizePremiumLayers(premiumLayers);
    return {
        logs: [
            `Resolved manifest ${input.manifest.agent.id}@${input.manifest.agent.version}.`,
            `Planning live execution for tenant ${input.tenantId}.`,
            `Loaded ${sharedLearning.length} shared learning record(s).`,
            `Segment profile inferred: ${buildSegmentKeywords(segmentProfile).join(", ")}.`,
            `Prepared ${numericSummary.count} numeric signal(s) and ${textSignals.length} text signal(s) for execution.`,
            `Premium operating model scored ${premiumOverview.overallScore}/100 across ${premiumLayers.length} shared layers.`,
            `Built ${toolCalls.length} market-grade tool call(s).`
        ],
        toolCalls
    };
}
export function inferOutputGovernance(input) {
    const requiresApprovalByTool = input.plan.toolCalls.some((call) => toolIsSensitive(call.tool));
    const requiresApprovalByUseCase = input.manifest.tags["use-case"].some((tag) => ["autonomous-monitoring", "commercial-operations", "multi-agent-execution"].includes(tag));
    const requireApproval = requiresApprovalByTool || requiresApprovalByUseCase;
    return {
        reason: requireApproval
            ? "Sensitive toolchain or governed use-case detected."
            : "Execution remained within non-sensitive reporting scope.",
        requireApproval,
        type: requireApproval ? "executive-report" : "technical-log"
    };
}
