import type { AgentManifest } from "../manifest/schema";
import type {
  CapabilityType,
  NumericSignalSummary,
  PremiumLayerAssessment,
  PremiumLayerAssessmentInput,
  PremiumLayerOverview,
  PremiumLayerStatus,
  RecommendedAction,
  SegmentProfile
} from "./intelligence";

type PremiumLayerContext = {
  collaborationTargets: string[];
  governanceRequired: boolean;
  hasMemoryWriteback: boolean;
  objective: string;
  opportunitySignalsDetected: boolean;
  recommendationSignals: number;
  regulatedBonus: number;
  riskSignalsDetected: boolean;
  segmentConfidenceScore: number;
  sharedLearningCount: number;
  textSignals: string[];
  workflowReady: boolean;
};

type PremiumLayerDraft = Omit<PremiumLayerAssessment, "status">;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
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

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function toPremiumLayerStatus(score: number): PremiumLayerStatus {
  if (score >= 85) {
    return "elite";
  }

  if (score >= 70) {
    return "strong";
  }

  return "watch";
}

function containsOpportunitySignal(signals: string[]): boolean {
  return signals.some((signal) =>
    /(upsell|cross[- ]sell|expansion|pipeline|lead|roi|growth|efficien|win|upgrade|adoption|campaign)/i.test(
      signal
    )
  );
}

function containsRiskSignal(signals: string[]): boolean {
  return signals.some((signal) =>
    /(risk|churn|incident|critical|breach|drop|delay|blocked|escalat|fraud|complaint|ticket|outage)/i.test(
      signal
    )
  );
}

function getSegmentConfidenceScore(confidence: SegmentProfile["confidence"]): number {
  if (confidence === "high") {
    return 94;
  }

  if (confidence === "medium") {
    return 82;
  }

  return 68;
}

function createPremiumLayerContext(input: PremiumLayerAssessmentInput): PremiumLayerContext {
  const textSignals = input.textSignals ?? [];

  return {
    collaborationTargets: input.collaborationTargets ?? [],
    governanceRequired: input.governanceRequired ?? false,
    hasMemoryWriteback: input.hasMemoryWriteback ?? false,
    objective: input.objective?.trim() ?? "",
    opportunitySignalsDetected:
      containsOpportunitySignal(textSignals) || input.numericSummary.trend === "up",
    recommendationSignals: input.numericSummary.count + textSignals.length,
    regulatedBonus: /regulated/.test(input.segmentProfile.regulation) ? 6 : 0,
    riskSignalsDetected: containsRiskSignal(textSignals) || input.numericSummary.outlierCount > 0,
    segmentConfidenceScore: getSegmentConfidenceScore(input.segmentProfile.confidence),
    sharedLearningCount: input.sharedLearningCount ?? 0,
    textSignals,
    workflowReady: input.workflowReady ?? false
  };
}

function buildSignalFusionLayer(
  input: PremiumLayerAssessmentInput,
  context: PremiumLayerContext
): PremiumLayerDraft {
  return {
    id: "signal-fusion",
    name: "Signal Fusion",
    nextAction: "Cruzar mais sinais textuais e numericos antes da proxima decisao sensivel.",
    score: clampScore(
      58 +
        Math.min(input.numericSummary.count * 7, 21) +
        Math.min(context.textSignals.length * 4, 16) +
        (input.numericSummary.outlierCount > 0 ? 5 : 0)
    ),
    summary: `Une ${input.numericSummary.count} sinal(is) numerico(s) e ${context.textSignals.length} evidencia(s) textual(is) para separar ruido de sinal.`
  };
}

function buildSegmentModelingLayer(
  input: PremiumLayerAssessmentInput,
  context: PremiumLayerContext
): PremiumLayerDraft {
  return {
    id: "segment-modeling",
    name: "Segment Modeling",
    nextAction:
      "Refinar ainda mais o ICP, maturidade e geografia do cliente para respostas mais precisas.",
    score: clampScore(context.segmentConfidenceScore + context.regulatedBonus),
    summary: `Modela a execucao para ${input.segmentProfile.industry}/${input.segmentProfile.clientSegment} com confianca ${input.segmentProfile.confidence}.`
  };
}

function buildMemoryGridLayer(context: PremiumLayerContext): PremiumLayerDraft {
  return {
    id: "memory-grid",
    name: "Memory Grid",
    nextAction: "Persistir mais contexto reutilizavel de decisoes, checkpoints e excecoes criticas.",
    score: clampScore(
      56 +
        (context.hasMemoryWriteback ? 22 : 0) +
        Math.min(context.sharedLearningCount * 6, 18)
    ),
    summary:
      "Preserva memoria operacional, reaproveita contexto e reduz perda de continuidade entre ciclos."
  };
}

function buildRecommendationEngineLayer(context: PremiumLayerContext): PremiumLayerDraft {
  return {
    id: "recommendation-engine",
    name: "Recommendation Engine",
    nextAction:
      "Continuar elevando a qualidade prescritiva com razao, prioridade e checkpoint por acao.",
    score: clampScore(
      60 + (context.objective ? 12 : 0) + Math.min(context.recommendationSignals * 3, 24)
    ),
    summary:
      "Transforma diagnostico em recomendacoes acionaveis, priorizadas e contextualizadas."
  };
}

function buildRiskRadarLayer(
  input: PremiumLayerAssessmentInput,
  context: PremiumLayerContext
): PremiumLayerDraft {
  return {
    id: "risk-radar",
    name: "Risk Radar",
    nextAction:
      "Aprofundar sinais lideres e thresholds para antecipar degradacoes antes do impacto material.",
    score: clampScore(
      57 +
        (context.riskSignalsDetected ? 18 : 8) +
        Math.min(input.numericSummary.outlierCount * 9, 18) +
        (context.governanceRequired ? 7 : 0)
    ),
    summary: "Monitora anomalias, escalacoes e sinais lideres de perda, falha ou incidente."
  };
}

function buildOpportunityRadarLayer(
  input: PremiumLayerAssessmentInput,
  context: PremiumLayerContext
): PremiumLayerDraft {
  return {
    id: "opportunity-radar",
    name: "Opportunity Radar",
    nextAction:
      "Expandir leitura de sinais comerciais e de adocao para capturar crescimento mais cedo.",
    score: clampScore(
      54 +
        (context.opportunitySignalsDetected ? 20 : 10) +
        (input.numericSummary.trend === "up" ? 10 : 0)
    ),
    summary: "Procura janela de ganho, expansao, eficiencia ou upside antes que ela feche."
  };
}

function buildCollaborationGraphLayer(context: PremiumLayerContext): PremiumLayerDraft {
  return {
    id: "collaboration-graph",
    name: "Collaboration Graph",
    nextAction:
      "Aumentar handoffs estruturados entre especialistas sempre que houver ganho real de velocidade ou qualidade.",
    score: clampScore(
      55 + Math.min(context.collaborationTargets.length * 10, 30) + (context.workflowReady ? 10 : 0)
    ),
    summary: `Coordena ${Math.max(context.collaborationTargets.length, 1)} rota(s) de colaboracao e reduz perda de contexto multiagente.`
  };
}

function buildGovernanceShieldLayer(context: PremiumLayerContext): PremiumLayerDraft {
  return {
    id: "governance-shield",
    name: "Governance Shield",
    nextAction:
      "Manter dupla checagem humana e politicas fortes em decisoes com risco financeiro, legal ou reputacional.",
    score: clampScore(72 + (context.governanceRequired ? 16 : 6) + context.regulatedBonus),
    summary: "Controla aprovacoes, politicas sensiveis, rastreabilidade e limites de execucao."
  };
}

function buildWorkflowAutomationLayer(
  input: PremiumLayerAssessmentInput,
  context: PremiumLayerContext
): PremiumLayerDraft {
  return {
    id: "workflow-automation",
    name: "Workflow Automation",
    nextAction:
      "Conectar mais entradas operacionais a workflows e checkpoints automaticos reutilizaveis.",
    score: clampScore(55 + (context.workflowReady ? 24 : 8) + (input.triggerSource ? 10 : 0)),
    summary:
      "Converte sinais operacionais em acionamento estruturado, repetivel e pronto para orquestracao."
  };
}

function buildAdaptiveLearningLayer(context: PremiumLayerContext): PremiumLayerDraft {
  return {
    id: "adaptive-learning-loop",
    name: "Adaptive Learning Loop",
    nextAction:
      "Publicar e reutilizar mais aprendizado validado por tenant para elevar a qualidade dos proximos ciclos.",
    score: clampScore(
      56 +
        Math.min(context.sharedLearningCount * 9, 27) +
        (context.segmentConfidenceScore >= 82 ? 8 : 0)
    ),
    summary:
      "Fecha o ciclo entre memoria, aprendizado compartilhado e ajuste continuo da execucao."
  };
}

export function buildPremiumLayersAssessment(
  input: PremiumLayerAssessmentInput
): PremiumLayerAssessment[] {
  const context = createPremiumLayerContext(input);
  const layers: PremiumLayerDraft[] = [
    buildSignalFusionLayer(input, context),
    buildSegmentModelingLayer(input, context),
    buildMemoryGridLayer(context),
    buildRecommendationEngineLayer(context),
    buildRiskRadarLayer(input, context),
    buildOpportunityRadarLayer(input, context),
    buildCollaborationGraphLayer(context),
    buildGovernanceShieldLayer(context),
    buildWorkflowAutomationLayer(input, context),
    buildAdaptiveLearningLayer(context)
  ];

  return layers.map((layer) => ({
    ...layer,
    status: toPremiumLayerStatus(layer.score)
  }));
}

export function summarizePremiumLayers(layers: PremiumLayerAssessment[]): PremiumLayerOverview {
  if (layers.length === 0) {
    return {
      needsAttention: [],
      overallScore: 0,
      standoutLayers: []
    };
  }

  const overallScore =
    layers.reduce((total, layer) => total + layer.score, 0) / Math.max(layers.length, 1);

  return {
    needsAttention: layers
      .filter((layer) => layer.status === "watch")
      .map((layer) => layer.name)
      .slice(0, 4),
    overallScore: clampScore(overallScore),
    standoutLayers: layers
      .filter((layer) => layer.status === "elite")
      .map((layer) => layer.name)
      .slice(0, 4)
  };
}

export function inferCapabilityType(input: {
  description?: string;
  id?: string;
  name?: string;
}): CapabilityType {
  const corpus = `${input.id ?? ""} ${input.name ?? ""} ${input.description ?? ""}`.toLowerCase();

  if (/(handoff|delegate|agent|collab|partner|thread)/.test(corpus)) {
    return "collaboration";
  }

  if (/(memory|history|knowledge|vault|save|store|context)/.test(corpus)) {
    return "memory";
  }

  if (/(segment|persona|vertical|industry|tier|localiz|adapt)/.test(corpus)) {
    return "segment-adaptation";
  }

  if (/(data|sql|anal|detect|monitor|model|aggreg|process|validator|mapper|estimator)/.test(corpus)) {
    return "data-processing";
  }

  if (/(recommend|optimi|advisor|allocator|score|forecast|priorit|next best)/.test(corpus)) {
    return "recommendation";
  }

  return "execution";
}

export function describeCapabilityIntent(capabilityType: CapabilityType): string {
  switch (capabilityType) {
    case "collaboration":
      return "alinhar especialistas, transferir contexto e coordenar a proxima etapa";
    case "data-processing":
      return "processar sinais quantitativos e qualitativos para achar padroes acionaveis";
    case "memory":
      return "registrar contexto reutilizavel e preservar continuidade operacional";
    case "recommendation":
      return "priorizar a melhor decisao ou acao para o contexto atual";
    case "segment-adaptation":
      return "ajustar linguagem, sugestao e plano ao segmento do cliente";
    default:
      return "executar a etapa operacional com governanca e rastreabilidade";
  }
}

export function inferCollaborationTargets(manifest: AgentManifest): string[] {
  const targets = [
    ...manifest.keywords.filter((keyword) =>
      /(planner|implementer|reviewer|analyst|manager|architect|engineer|concierge)/i.test(keyword)
    ),
    ...manifest.tags.domain.map((domain) => `${domain}-specialist`)
  ];

  const normalized = targets.map((target) => slugify(target).replace(/-/g, " "));
  return uniqueStrings(normalized).slice(0, 5);
}

export function buildRecommendedActions(input: {
  capabilityType: CapabilityType;
  collaborationTargets?: string[];
  numericSummary: NumericSignalSummary;
  objective?: string | null;
  segmentProfile: SegmentProfile;
  textSignals?: string[];
}): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const objective = input.objective?.trim() || "avancar o objetivo principal";
  const topEvidence = input.textSignals?.[0] ?? "contexto operacional atual";

  actions.push({
    action: `Priorizar uma recomendacao para ${objective} considerando o segmento ${input.segmentProfile.clientSegment}.`,
    priority: "now",
    reason: `O agente deve agir com contexto moldado para ${input.segmentProfile.industry} e ${input.segmentProfile.geography}.`
  });

  if (input.numericSummary.count > 0) {
    actions.push({
      action: `Usar ${input.numericSummary.count} sinais numericos para validar tendencia ${input.numericSummary.trend}.`,
      priority: input.numericSummary.outlierCount > 0 ? "now" : "next",
      reason:
        input.numericSummary.outlierCount > 0
          ? `Existem ${input.numericSummary.outlierCount} outlier(s) que podem esconder risco ou oportunidade.`
          : `A base numerica sustenta a recomendacao com media ${input.numericSummary.average}.`
    });
  }

  if (input.capabilityType === "memory") {
    actions.push({
      action: "Salvar memoria operacional reutilizavel com contexto, decisao e proximo checkpoint.",
      priority: "next",
      reason: "Persistencia aumenta continuidade, reaproveitamento e qualidade do proximo ciclo."
    });
  }

  if (input.capabilityType === "collaboration" || (input.collaborationTargets?.length ?? 0) > 0) {
    actions.push({
      action: `Preparar handoff estruturado para ${input.collaborationTargets?.[0] ?? "outro especialista"}.`,
      priority: "next",
      reason: `A colaboracao multiagente acelera resolucao e reduz perda de contexto sobre '${topEvidence}'.`
    });
  }

  if (input.capabilityType === "segment-adaptation") {
    actions.push({
      action: "Reescrever a recomendacao na linguagem, objecoes e maturidade do cliente alvo.",
      priority: "now",
      reason: "Adaptacao ao segmento aumenta aderencia, conversao e qualidade da decisao."
    });
  }

  return actions.slice(0, 4);
}

export function buildMemoryKey(
  agentId: string,
  segmentProfile: SegmentProfile,
  suffix: string
): string {
  return uniqueStrings([
    "memory",
    slugify(agentId),
    slugify(segmentProfile.industry),
    slugify(segmentProfile.clientSegment),
    slugify(suffix)
  ]).join(":");
}
