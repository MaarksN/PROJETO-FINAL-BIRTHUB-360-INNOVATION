import type { AgentManifest } from "../manifest/schema.js";
import type { AgentLearningRecord, JsonValue } from "../types/index.js";
import {
  buildMemoryKey,
  buildPremiumLayersAssessment,
  buildRecommendedActions,
  buildSegmentKeywords,
  describeCapabilityIntent,
  inferCapabilityType,
  inferCollaborationTargets,
  inferSegmentProfile,
  readNumericSignals,
  readTextSignals,
  summarizePremiumLayers,
  summarizeNumericSignals,
  type PremiumLayerAssessment,
  type SegmentProfile
} from "./intelligence.js";

export interface ManagedAgentPolicy {
  actions: string[];
  effect: "allow" | "deny";
  enabled?: boolean;
  id: string;
  name: string;
  reason?: string;
}

export interface RuntimePolicyRule {
  action: string;
  effect: "allow" | "deny";
  id: string;
}

export interface RuntimePlannedToolCall {
  input: Record<string, unknown>;
  rationale: string;
  tool: string;
}

export interface AgentRuntimePlanInput {
  contextSummary?: string;
  input: Record<string, unknown>;
  manifest: AgentManifest;
  sharedLearning?: AgentLearningRecord[];
  tenantId: string;
}

export interface AgentRuntimePlan {
  logs: string[];
  toolCalls: RuntimePlannedToolCall[];
}

export interface AgentRuntimeOutputInput {
  input: Record<string, unknown>;
  logs: string[];
  manifest: AgentManifest;
  plan: AgentRuntimePlan;
  sharedLearning?: AgentLearningRecord[];
  steps: Array<{
    call: {
      input: unknown;
      tool: string;
    };
    finishedAt: string;
    output: unknown;
    startedAt: string;
  }>;
}

export interface AgentRuntimeOutput {
  agent_id: string;
  approvals_or_dependencies: string[];
  confidence: "high" | "low" | "medium";
  decisions_to_anticipate: Array<{
    decision: string;
    due_window: string;
    owner: string;
    recommended_action: string;
    why_now: string;
  }>;
  emerging_risks: string[];
  executionMode: "LIVE";
  leading_indicators: string[];
  learning_used: Array<{
    confidence: number;
    id: string;
    summary: string;
  }>;
  memory_writeback: {
    key: string;
    reason: string;
    ttlHours: number;
    value_preview: string;
  };
  next_checkpoint: string;
  orchestration_plan: null | {
    approval_reason: string;
    approval_required: boolean;
    focus_domains: string[];
    recommended_agents: Array<{
      agent_id: string;
      domain: string;
      name: string;
      reason: string;
      use_case: string;
    }>;
    workflow_steps: Array<{
      agent_id: string;
      expected_outcome: string;
      order: number;
      reason: string;
    }>;
  };
  opportunities_to_capture: string[];
  premium_layers: PremiumLayerAssessment[];
  premium_score: number;
  preventive_action_plan: Array<{
    action: string;
    checkpoint: string;
    deadline: string;
    expected_impact: string;
    owner: string;
  }>;
  segment_profile: SegmentProfile;
  sharedLearningCount: number;
  specialist_deliverables: string[];
  status: "critical" | "stable" | "watch";
  suggested_handoffs: Array<{
    payload_focus: string;
    reason: string;
    target: string;
  }>;
  summary: string;
  tool_results: Array<{
    finishedAt: string;
    output: JsonValue | null;
    startedAt: string;
    tool: string;
  }>;
}

export interface OutputGovernanceDecision {
  reason: string;
  requireApproval: boolean;
  type: "executive-report" | "technical-log";
}

type AgentOrchestrationPlan = NonNullable<AgentRuntimeOutput["orchestration_plan"]>;

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

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

function readObjective(input: Record<string, unknown>): string {
  const directCandidates = [
    input.objective,
    input.brief,
    input.prompt,
    input.task,
    input.goal,
    typeof input.context === "object" && input.context !== null
      ? (input.context as Record<string, unknown>).objective
      : null
  ];

  for (const candidate of directCandidates) {
    const value = readString(candidate);
    if (value) {
      return value;
    }
  }

  return "Executar o agente com rastreabilidade, governanca e proximo passo claro.";
}

function readPrimaryOwner(input: Record<string, unknown>): string {
  const candidates = [
    input.owner,
    input.requestedBy,
    input.userId,
    typeof input.context === "object" && input.context !== null
      ? (input.context as Record<string, unknown>).owner
      : null
  ];

  for (const candidate of candidates) {
    const value = readString(candidate);
    if (value) {
      return value;
    }
  }

  return "tenant-ops";
}

function normalizeJsonValue(value: unknown): JsonValue | null {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeJsonValue(item))
      .filter((item): item is JsonValue => item !== undefined);
  }

  if (typeof value === "object") {
    const objectValue: Record<string, JsonValue> = {};

    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const normalized = normalizeJsonValue(child);
      if (normalized !== undefined) {
        objectValue[key] = normalized;
      }
    }

    return objectValue;
  }

  return null;
}

function normalizePolicyAction(action: string): string {
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

function buildRuntimePolicyRulesFromManifest(manifest: AgentManifest): RuntimePolicyRule[] {
  const rules: RuntimePolicyRule[] = [];

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

function buildRuntimePolicyRulesFromManagedPolicies(
  managedPolicies: ManagedAgentPolicy[] = []
): RuntimePolicyRule[] {
  const rules: RuntimePolicyRule[] = [];

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

function summarizeLearning(records: AgentLearningRecord[] = []): Array<{
  confidence: number;
  id: string;
  summary: string;
}> {
  return records.slice(0, 5).map((record) => ({
    confidence: record.confidence,
    id: record.id,
    summary: record.summary
  }));
}

function deriveSpecialistDeliverables(manifest: AgentManifest): string[] {
  return uniqueStrings([
    ...manifest.skills.map((skill) => skill.name),
    ...manifest.tags["use-case"].map((tag) => tag.replace(/-/g, " ")),
    ...manifest.tags.domain.map((domain) => `${domain} recommendation`)
  ]).slice(0, 6);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readTriggerSource(input: Record<string, unknown>): string | null {
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

function hasWorkflowContext(input: Record<string, unknown>): boolean {
  return Boolean(
    readString(input.workflowContextSummary) ||
      readString(input.contextSummary) ||
      (isRecord(input.trigger) && readString(input.trigger.type))
  );
}

function readMeshBlueprint(
  steps: AgentRuntimeOutputInput["steps"]
): AgentRuntimeOutput["orchestration_plan"] {
  const focusDomains: string[] = [];
  const recommendedAgents: AgentOrchestrationPlan["recommended_agents"] = [];
  const workflowSteps: AgentOrchestrationPlan["workflow_steps"] = [];
  let approvalRequired = false;
  let approvalReason = "";

  for (const step of steps) {
    if (!isRecord(step.output)) {
      continue;
    }

    if (Array.isArray(step.output.focusDomains)) {
      for (const value of step.output.focusDomains) {
        if (typeof value === "string") {
          focusDomains.push(value);
        }
      }
    }

    if (Array.isArray(step.output.specialistLineup)) {
      for (const value of step.output.specialistLineup) {
        if (!isRecord(value)) {
          continue;
        }

        if (
          typeof value.agentId === "string" &&
          typeof value.name === "string" &&
          typeof value.reason === "string"
        ) {
          recommendedAgents.push({
            agent_id: value.agentId,
            domain: typeof value.domain === "string" ? value.domain : "unknown",
            name: value.name,
            reason: value.reason,
            use_case: typeof value.useCase === "string" ? value.useCase : "general"
          });
        }
      }
    }

    if (Array.isArray(step.output.workflowPlan)) {
      for (const value of step.output.workflowPlan) {
        if (!isRecord(value) || typeof value.agentId !== "string") {
          continue;
        }

        workflowSteps.push({
          agent_id: value.agentId,
          expected_outcome:
            typeof value.expectedOutcome === "string"
              ? value.expectedOutcome
              : "Executar a etapa especializada.",
          order: typeof value.order === "number" ? value.order : workflowSteps.length + 1,
          reason: typeof value.reason === "string" ? value.reason : "Etapa sugerida pelo agent mesh."
        });
      }
    }

    if (isRecord(step.output.approvalRecommendation)) {
      approvalRequired =
        approvalRequired || Boolean(step.output.approvalRecommendation.required);
      if (!approvalReason && typeof step.output.approvalRecommendation.reason === "string") {
        approvalReason = step.output.approvalRecommendation.reason;
      }
    }
  }

  if (recommendedAgents.length === 0 && workflowSteps.length === 0) {
    return null;
  }

  return {
    approval_reason: approvalReason || "Fluxo multiagente sem necessidade adicional de aprovacao.",
    approval_required: approvalRequired,
    focus_domains: uniqueStrings(focusDomains).slice(0, 5),
    recommended_agents: uniqueStrings(
      recommendedAgents.map((item: AgentOrchestrationPlan["recommended_agents"][number]) => `${item.agent_id}:${item.name}`)
    )
      .map((key) => {
        const [agentId] = key.split(":");
        return recommendedAgents.find(
          (item: AgentOrchestrationPlan["recommended_agents"][number]) => item.agent_id === agentId
        )!;
      })
      .slice(0, 5),
    workflow_steps: workflowSteps
      .sort(
        (
          left: AgentOrchestrationPlan["workflow_steps"][number],
          right: AgentOrchestrationPlan["workflow_steps"][number]
        ) => left.order - right.order
      )
      .slice(0, 5)
  };
}

function buildSuggestedHandoffs(
  manifest: AgentManifest,
  collaborationTargets: string[],
  segmentProfile: SegmentProfile
): AgentRuntimeOutput["suggested_handoffs"] {
  const manifestSupportsHandoff = manifest.tools.some((tool) =>
    /(agent|handoff|delegate)/i.test(`${tool.id} ${tool.name}`)
  );

  if (!manifestSupportsHandoff && collaborationTargets.length === 0) {
    return [];
  }

  const targets = collaborationTargets.length > 0
    ? collaborationTargets
    : manifest.tags.domain.map((domain) => `${domain}-specialist`);

  return uniqueStrings(targets).slice(0, 3).map((target) => ({
    payload_focus: `${segmentProfile.industry} ${segmentProfile.clientSegment}`.trim(),
    reason: `Compartilhar contexto do segmento ${segmentProfile.clientSegment} e preservar continuidade da execucao.`,
    target
  }));
}

function buildStatus(input: {
  governance: OutputGovernanceDecision;
  numericOutliers: number;
  segmentConfidence: SegmentProfile["confidence"];
  sharedLearningCount: number;
}): AgentRuntimeOutput["status"] {
  if (input.governance.requireApproval && input.numericOutliers > 0) {
    return "critical";
  }

  if (
    input.governance.requireApproval ||
    input.numericOutliers > 0 ||
    input.segmentConfidence === "low"
  ) {
    return "watch";
  }

  return input.sharedLearningCount > 0 ? "stable" : "watch";
}

function toolIsSensitive(toolId: string): boolean {
  const normalized = toolId.toLowerCase();
  return (
    normalized.includes("approval") ||
    normalized.includes("audit") ||
    normalized.includes("notification") ||
    normalized.includes("sync") ||
    normalized.includes("write") ||
    normalized.includes("adapter")
  );
}

export function buildRuntimePolicyRules(
  manifest: AgentManifest,
  managedPolicies: ManagedAgentPolicy[] = []
): RuntimePolicyRule[] {
  const merged = new Map<string, RuntimePolicyRule>();

  for (const rule of [
    ...buildRuntimePolicyRulesFromManifest(manifest),
    ...buildRuntimePolicyRulesFromManagedPolicies(managedPolicies)
  ]) {
    merged.set(rule.id, rule);
  }

  return Array.from(merged.values());
}

export function buildAgentRuntimePlan(input: AgentRuntimePlanInput): AgentRuntimePlan {
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
  const logs = [
    `Resolved manifest ${input.manifest.agent.id}@${input.manifest.agent.version}.`,
    `Planning live execution for tenant ${input.tenantId}.`,
    `Loaded ${sharedLearning.length} shared learning record(s).`,
    `Segment profile inferred: ${buildSegmentKeywords(segmentProfile).join(", ")}.`,
    `Prepared ${numericSummary.count} numeric signal(s) and ${textSignals.length} text signal(s) for execution.`,
    `Premium operating model scored ${premiumOverview.overallScore}/100 across ${premiumLayers.length} shared layers.`
  ];

  const toolCalls = input.manifest.tools.map((tool, index) => {
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

  logs.push(`Built ${toolCalls.length} market-grade tool call(s).`);

  return {
    logs,
    toolCalls
  };
}

export function inferOutputGovernance(input: {
  manifest: AgentManifest;
  plan: AgentRuntimePlan;
}): OutputGovernanceDecision {
  const requiresApprovalByTool = input.plan.toolCalls.some((call) => toolIsSensitive(call.tool));
  const requiresApprovalByUseCase = input.manifest.tags["use-case"].some((tag) =>
    ["autonomous-monitoring", "commercial-operations", "multi-agent-execution"].includes(tag)
  );

  const requireApproval = requiresApprovalByTool || requiresApprovalByUseCase;

  return {
    reason: requireApproval
      ? "Sensitive toolchain or governed use-case detected."
      : "Execution remained within non-sensitive reporting scope.",
    requireApproval,
    type: requireApproval ? "executive-report" : "technical-log"
  };
}

export function buildAgentRuntimeOutput(input: AgentRuntimeOutputInput): AgentRuntimeOutput {
  const owner = readPrimaryOwner(input.input);
  const objective = readObjective(input.input);
  const sharedLearning = input.sharedLearning ?? [];
  const governance = inferOutputGovernance({
    manifest: input.manifest,
    plan: input.plan
  });
  const segmentProfile = inferSegmentProfile(input.input, input.manifest.tags);
  const combinedNumericSignals = readNumericSignals([input.input, ...input.steps.map((step) => step.output)]);
  const combinedTextSignals = readTextSignals([input.input, ...input.steps.map((step) => step.output)], 12);
  const numericSummary = summarizeNumericSignals(combinedNumericSignals);
  const collaborationTargets = inferCollaborationTargets(input.manifest);
  const orchestrationPlan = readMeshBlueprint(input.steps);
  const suggestedHandoffs = buildSuggestedHandoffs(
    input.manifest,
    collaborationTargets,
    segmentProfile
  );
  const specialistDeliverables =
    orchestrationPlan?.workflow_steps.length
      ? uniqueStrings([
          ...orchestrationPlan.workflow_steps.map((step) => `${step.order}. ${step.agent_id}`),
          ...deriveSpecialistDeliverables(input.manifest)
        ]).slice(0, 6)
      : deriveSpecialistDeliverables(input.manifest);
  const recommendedActions = buildRecommendedActions({
    capabilityType: "recommendation",
    collaborationTargets,
    numericSummary,
    objective,
    segmentProfile,
    textSignals: combinedTextSignals
  });
  const premiumLayers = buildPremiumLayersAssessment({
    collaborationTargets,
    governanceRequired: governance.requireApproval || Boolean(orchestrationPlan?.approval_required),
    hasMemoryWriteback: true,
    numericSummary,
    objective,
    segmentProfile,
    sharedLearningCount: sharedLearning.length,
    textSignals: combinedTextSignals,
    triggerSource: readTriggerSource(input.input),
    workflowReady:
      Boolean(orchestrationPlan?.workflow_steps.length) || hasWorkflowContext(input.input)
  });
  const premiumOverview = summarizePremiumLayers(premiumLayers);
  const status = buildStatus({
    governance,
    numericOutliers: numericSummary.outlierCount,
    segmentConfidence: segmentProfile.confidence,
    sharedLearningCount: sharedLearning.length
  });
  const tool_results = input.steps.map((step) => ({
    finishedAt: step.finishedAt,
    output: normalizeJsonValue(step.output),
    startedAt: step.startedAt,
    tool: step.call.tool
  }));
  const summary = `${input.manifest.agent.name} concluiu a execucao live para ${segmentProfile.industry}/${segmentProfile.clientSegment}, processou ${numericSummary.count} sinal(is) numerico(s), capturou ${combinedTextSignals.length} evidencia(s) textual(is), deixou memoria pronta para reutilizacao e ativou um operating score premium de ${premiumOverview.overallScore}/100.`;
  const nextCheckpoint = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const memoryWriteback = {
    key: buildMemoryKey(input.manifest.agent.id, segmentProfile, "latest-output"),
    reason: "Persistir resumo executivo, perfil de segmento e proximo checkpoint para continuidade entre agentes.",
    ttlHours: 24 * 30,
    value_preview: summary.slice(0, 220)
  };

  return {
    agent_id: input.manifest.agent.id,
    approvals_or_dependencies: governance.requireApproval
      ? ["Aprovacao humana recomendada antes de compartilhar externamente."]
      : [],
    confidence:
      segmentProfile.confidence === "high" && sharedLearning.length > 0
        ? "high"
        : numericSummary.count > 0
          ? "medium"
          : "low",
    decisions_to_anticipate: [
      {
        decision: "Publicar ou acionar o proximo passo recomendado",
        due_window: "Proxima janela operacional",
        owner,
        recommended_action: recommendedActions[0]?.action ?? "Executar o proximo passo priorizado pelo agente.",
        why_now: "A execucao terminou com sinais suficientes para uma decisao operacional."
      },
      ...(suggestedHandoffs[0]
        ? [
            {
              decision: `Definir se o fluxo deve seguir para ${suggestedHandoffs[0].target}`,
              due_window: "Ainda neste ciclo",
              owner,
              recommended_action: `Enviar handoff com foco em ${suggestedHandoffs[0].payload_focus}.`,
              why_now: suggestedHandoffs[0].reason
            }
          ]
        : [])
    ],
    emerging_risks: uniqueStrings([
      governance.requireApproval ? "O output envolve acao ou artefato sensivel que pede dupla checagem." : "",
      numericSummary.outlierCount > 0
        ? `Foram detectados ${numericSummary.outlierCount} outlier(s) relevantes nos sinais avaliados.`
        : "",
      premiumOverview.needsAttention.length > 0
        ? `Camadas premium pedindo reforco: ${premiumOverview.needsAttention.join(", ")}.`
        : "",
      segmentProfile.confidence === "low"
        ? "O perfil de segmento foi inferido com baixa confianca e pode precisar de refinamento manual."
        : ""
    ]),
    executionMode: "LIVE",
    leading_indicators: uniqueStrings([
      ...input.plan.toolCalls.map((call) => `tool-ready:${call.tool}`),
      ...(orchestrationPlan?.focus_domains.map((domain) => `domain:${domain}`) ?? []),
      `premium-score:${premiumOverview.overallScore}`,
      `segment:${segmentProfile.clientSegment}`,
      `industry:${segmentProfile.industry}`,
      `trend:${numericSummary.trend}`,
      numericSummary.count > 0 ? `signal-count:${numericSummary.count}` : ""
    ]).slice(0, 8),
    learning_used: summarizeLearning(sharedLearning),
    memory_writeback: memoryWriteback,
    next_checkpoint: nextCheckpoint,
    orchestration_plan: orchestrationPlan,
    opportunities_to_capture: uniqueStrings([
      `Adaptar o plano para ${segmentProfile.industry} com linguagem especifica de ${segmentProfile.clientSegment}.`,
      suggestedHandoffs.length > 0
        ? `Acelerar resolucao com handoff para ${suggestedHandoffs[0]?.target}.`
        : "",
      premiumOverview.standoutLayers.length > 0
        ? `Escalar as camadas premium mais fortes: ${premiumOverview.standoutLayers.join(", ")}.`
        : "",
      sharedLearning.length > 0
        ? "Reaproveitar aprendizado compartilhado validado no mesmo tenant."
        : "Registrar aprendizado novo para fortalecer os proximos ciclos.",
      numericSummary.trend === "up"
        ? "Capturar a tendencia positiva antes que a janela competitiva feche."
        : ""
    ]).slice(0, 4),
    premium_layers: premiumLayers,
    premium_score: premiumOverview.overallScore,
    preventive_action_plan: recommendedActions.map((item, index) => ({
      action: item.action,
      checkpoint: index === 0 ? "30m" : "2h",
      deadline: new Date(Date.now() + (index + 1) * 2 * 60 * 60 * 1000).toISOString(),
      expected_impact:
        item.priority === "now"
          ? "Reduzir risco e acelerar decisao com alto impacto."
          : "Aumentar qualidade da execucao e preservar continuidade.",
      owner
    })),
    segment_profile: segmentProfile,
    sharedLearningCount: sharedLearning.length,
    specialist_deliverables: specialistDeliverables,
    status,
    suggested_handoffs: suggestedHandoffs,
    summary,
    tool_results
  };
}
