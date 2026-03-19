// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CrisisNavigator
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import {
  type CrisisEvent,
  type CrisisFailureMode,
  type CrisisMetrics,
  type CrisisNavigatorContract,
  CrisisNavigatorContractSchema,
  type CrisisNavigatorInput,
  CrisisNavigatorInputSchema,
  type CrisisNavigatorOutput,
  CrisisNavigatorOutputSchema,
  DEFAULT_CRISISNAVIGATOR_CONTRACT
} from "./schemas.js";
import {
  CommsDraftSnapshotSchema,
  CRISISNAVIGATOR_TOOL_IDS,
  type CrisisNavigatorToolAdapters,
  type CrisisToolId,
  type CrisisToolInput,
  IncidentSignalSnapshotSchema,
  StakeholderImpactSnapshotSchema,
  createDefaultCrisisNavigatorToolAdapters,
  normalizeCrisisToolId
} from "./tools.js";

const DEFAULT_AUDIT_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "audit",
  "pending_review",
  "ciclo1_crisisnavigator",
  "contract.yaml"
);
const DEFAULT_AUDIT_CONTRACT_PATH_FROM_PACKAGE = path.resolve(
  process.cwd(),
  "..",
  "..",
  "audit",
  "pending_review",
  "ciclo1_crisisnavigator",
  "contract.yaml"
);
const DEFAULT_PACKAGE_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "packages",
  "agents",
  "executives",
  "CrisisNavigator",
  "contract.yaml"
);
const DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE = path.resolve(
  process.cwd(),
  "executives",
  "CrisisNavigator",
  "contract.yaml"
);
const DEFAULT_CONTRACT_PATHS = [
  DEFAULT_AUDIT_CONTRACT_PATH,
  DEFAULT_AUDIT_CONTRACT_PATH_FROM_PACKAGE,
  DEFAULT_PACKAGE_CONTRACT_PATH,
  DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE
] as const;

interface CrisisNavigatorAgentOptions {
  contractPath?: string;
  now?: () => Date;
  sleep?: (delayMs: number) => Promise<void>;
  toolAdapters?: CrisisNavigatorToolAdapters;
}

interface LoadedContract {
  contract: CrisisNavigatorContract;
  source: "audit_file" | "custom_file" | "default" | "package_file";
}

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter(
    (entry): entry is string => typeof entry === "string" && entry.trim().length > 0
  );
  return items.length > 0 ? items : undefined;
}

function toFailureMode(rawValue: string | undefined): CrisisFailureMode | undefined {
  if (!rawValue) {
    return undefined;
  }
  const normalized = rawValue.trim().toLowerCase();
  if (normalized.includes("degrad")) {
    return "degraded_report";
  }
  if (normalized.includes("human")) {
    return "human_handoff";
  }
  if (normalized.includes("hard") || normalized.includes("fail")) {
    return "hard_fail";
  }
  return undefined;
}

function extractYamlArray(text: string, acceptedKeys: string[]): string[] | undefined {
  const lines = text.split(/\r?\n/);
  const normalizedKeys = new Set(acceptedKeys.map((entry) => entry.toLowerCase()));
  const items: string[] = [];
  let collecting = false;
  let collectorIndent = 0;

  for (const line of lines) {
    const keyMatch = line.match(/^(\s*)([A-Za-z0-9_-]+)\s*:\s*$/);
    if (keyMatch) {
      const key = keyMatch[2]?.toLowerCase();
      if (key && normalizedKeys.has(key)) {
        collecting = true;
        collectorIndent = keyMatch[1]?.length ?? 0;
        continue;
      }
      collecting = false;
    }

    if (!collecting) {
      continue;
    }

    const lineIndent = line.match(/^(\s*)/)?.[1]?.length ?? 0;
    const itemMatch = line.match(/^\s*-\s*(.+)\s*$/);
    if (!itemMatch && line.trim().length > 0 && lineIndent <= collectorIndent) {
      collecting = false;
      continue;
    }
    if (!itemMatch) {
      continue;
    }

    const cleaned = (itemMatch[1] ?? "")
      .trim()
      .replace(/^['"]/, "")
      .replace(/['"]$/, "");
    if (cleaned.length > 0) {
      items.push(cleaned);
    }
  }

  return items.length > 0 ? items : undefined;
}

function extractFirstNumber(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match?.[1]) {
      continue;
    }
    const parsed = Number.parseInt(match[1], 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function clampMaxAttempts(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_CRISISNAVIGATOR_CONTRACT.retry.maxAttempts;
  }
  return Math.min(3, Math.max(1, Math.trunc(value)));
}

function classifyContractSource(contractPath: string): LoadedContract["source"] {
  const normalized = path.normalize(contractPath).toLowerCase();
  if (
    normalized.endsWith(
      path
        .join("audit", "pending_review", "ciclo1_crisisnavigator", "contract.yaml")
        .toLowerCase()
    )
  ) {
    return "audit_file";
  }
  if (
    normalized.endsWith(
      path.join("executives", "CrisisNavigator", "contract.yaml").toLowerCase()
    )
  ) {
    return "package_file";
  }
  return "custom_file";
}

function parseContractOverridesFromObject(
  value: Record<string, unknown>
): Partial<CrisisNavigatorContract> {
  const overrides: Partial<CrisisNavigatorContract> = {};

  const toolIds =
    toStringArray(value.toolIds) ??
    toStringArray(value.tools) ??
    toStringArray(value.required_tools);
  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const retry = toRecord(value.retry);
  if (retry) {
    const retryOverride: Partial<CrisisNavigatorContract["retry"]> = {};
    if (typeof retry.maxAttempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(retry.maxAttempts);
    }
    if (typeof retry.baseDelayMs === "number") {
      retryOverride.baseDelayMs = retry.baseDelayMs;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = retryOverride as CrisisNavigatorContract["retry"];
    }
  }

  if (typeof value.failureMode === "string") {
    const mode = toFailureMode(value.failureMode);
    if (mode) {
      overrides.failureMode = mode;
    }
  }

  const fallbackBehavior = toRecord(value.fallback_behavior);
  if (fallbackBehavior) {
    const toolUnavailable = toRecord(fallbackBehavior.tool_unavailable);
    const exhausted = toRecord(fallbackBehavior.exhausted);
    const retryOverride: Partial<CrisisNavigatorContract["retry"]> = {};

    if (toolUnavailable && typeof toolUnavailable.retry_attempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(toolUnavailable.retry_attempts);
    }
    if (toolUnavailable && typeof toolUnavailable.base_delay_ms === "number") {
      retryOverride.baseDelayMs = toolUnavailable.base_delay_ms;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = {
        ...DEFAULT_CRISISNAVIGATOR_CONTRACT.retry,
        ...retryOverride
      };
    }
    if (exhausted && exhausted.notify_human === true) {
      overrides.failureMode = "human_handoff";
    }
  }

  if (typeof value.failure_behavior === "string") {
    const mode = toFailureMode(value.failure_behavior);
    if (mode) {
      overrides.failureMode = mode;
    }
  }
  if (typeof value.fallback === "string") {
    const mode = toFailureMode(value.fallback);
    if (mode) {
      overrides.failureMode = mode;
    }
  }

  const observability = toRecord(value.observability);
  if (observability) {
    const events =
      toStringArray(observability.events_to_log) ??
      toStringArray(observability.events);
    const metrics = toStringArray(observability.metrics);
    if (events || metrics) {
      const filteredEvents = events?.filter(
        (entry): entry is CrisisNavigatorContract["observability"]["events"][number] =>
          DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.events.includes(
            entry as CrisisNavigatorContract["observability"]["events"][number]
          )
      );
      const filteredMetrics = metrics?.filter(
        (entry): entry is CrisisNavigatorContract["observability"]["metrics"][number] =>
          DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.metrics.includes(
            entry as CrisisNavigatorContract["observability"]["metrics"][number]
          )
      );
      overrides.observability = {
        events:
          filteredEvents && filteredEvents.length > 0
            ? filteredEvents
            : DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.events,
        metrics:
          filteredMetrics && filteredMetrics.length > 0
            ? filteredMetrics
            : DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.metrics
      };
    }
  }

  return overrides;
}

function parseContractOverrides(rawText: string): Partial<CrisisNavigatorContract> {
  const trimmed = rawText.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const asRecord = toRecord(parsed);
      if (asRecord) {
        return parseContractOverridesFromObject(asRecord);
      }
    } catch {
      // keep fallback parsing
    }
  }

  const overrides: Partial<CrisisNavigatorContract> = {};
  const maxAttempts = extractFirstNumber(rawText, [
    /retry_attempts\s*:\s*(\d+)/i,
    /maxAttempts\s*:\s*(\d+)/i,
    /max_attempts\s*:\s*(\d+)/i,
    /attempts\s*:\s*(\d+)/i
  ]);
  const baseDelayMs = extractFirstNumber(rawText, [
    /base_delay_ms\s*:\s*(\d+)/i,
    /baseDelayMs\s*:\s*(\d+)/i,
    /backoff_ms\s*:\s*(\d+)/i,
    /wait_ms\s*:\s*(\d+)/i
  ]);

  if (maxAttempts !== undefined || baseDelayMs !== undefined) {
    overrides.retry = {
      ...DEFAULT_CRISISNAVIGATOR_CONTRACT.retry,
      ...(maxAttempts !== undefined
        ? { maxAttempts: clampMaxAttempts(maxAttempts) }
        : {}),
      ...(baseDelayMs !== undefined ? { baseDelayMs } : {})
    };
  }

  const modeMatch = rawText.match(
    /(?:failureMode|failure_mode|fallback_mode|failure_behavior|fallback|mode)\s*:\s*["']?([a-zA-Z_-]+)["']?/i
  );
  if (modeMatch?.[1]) {
    const mapped = toFailureMode(modeMatch[1]);
    if (mapped) {
      overrides.failureMode = mapped;
    }
  }
  if (/notify_human\s*:\s*true/i.test(rawText)) {
    overrides.failureMode = "human_handoff";
  }
  if (/notificar|human|analyst|chief of staff/i.test(rawText)) {
    overrides.failureMode = overrides.failureMode ?? "human_handoff";
  }

  const toolIds =
    extractYamlArray(rawText, ["toolIds", "tools", "required_tools"]) ??
    (() => {
      const inline = rawText.match(
        /(?:toolIds|tools|required_tools)\s*:\s*\[([^\]]+)\]/i
      );
      if (!inline?.[1]) {
        return undefined;
      }
      const list = inline[1]
        .split(",")
        .map((entry) => entry.trim().replace(/^['"]/, "").replace(/['"]$/, ""))
        .filter((entry) => entry.length > 0);
      return list.length > 0 ? list : undefined;
    })();
  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const events = extractYamlArray(rawText, ["events_to_log", "events"]);
  const metrics = extractYamlArray(rawText, ["metrics"]);
  if (events || metrics) {
    const filteredEvents = events?.filter(
      (entry): entry is CrisisNavigatorContract["observability"]["events"][number] =>
        DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.events.includes(
          entry as CrisisNavigatorContract["observability"]["events"][number]
        )
    );
    const filteredMetrics = metrics?.filter(
      (entry): entry is CrisisNavigatorContract["observability"]["metrics"][number] =>
        DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.metrics.includes(
          entry as CrisisNavigatorContract["observability"]["metrics"][number]
        )
    );
    overrides.observability = {
      events:
        filteredEvents && filteredEvents.length > 0
          ? filteredEvents
          : DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.events,
      metrics:
        filteredMetrics && filteredMetrics.length > 0
          ? filteredMetrics
          : DEFAULT_CRISISNAVIGATOR_CONTRACT.observability.metrics
    };
  }

  return overrides;
}

function mergeContract(
  overrides: Partial<CrisisNavigatorContract>,
  fallback: CrisisNavigatorContract
): CrisisNavigatorContract {
  return CrisisNavigatorContractSchema.parse({
    ...fallback,
    ...overrides,
    observability: {
      ...fallback.observability,
      ...overrides.observability
    },
    retry: {
      ...fallback.retry,
      ...overrides.retry
    },
    toolIds: overrides.toolIds ?? fallback.toolIds
  });
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function toPriority(value: number): "critical" | "high" | "medium" | "low" {
  if (value >= 80) {
    return "critical";
  }
  if (value >= 60) {
    return "high";
  }
  if (value >= 35) {
    return "medium";
  }
  return "low";
}

export class CrisisNavigatorAgent {
  private readonly contractPaths: string[];

  private readonly now: () => Date;

  private readonly sleepFn: (delayMs: number) => Promise<void>;

  private readonly toolAdapters: CrisisNavigatorToolAdapters;

  private lastMetrics: CrisisMetrics = {
    durationMs: 0,
    retries: 0,
    toolCalls: 0,
    toolFailures: 0
  };

  constructor(options: CrisisNavigatorAgentOptions = {}) {
    this.contractPaths = options.contractPath
      ? [options.contractPath]
      : [...DEFAULT_CONTRACT_PATHS];
    this.now = options.now ?? (() => new Date());
    this.sleepFn = options.sleep ?? sleep;
    this.toolAdapters =
      options.toolAdapters ?? createDefaultCrisisNavigatorToolAdapters();
  }

  getMetricsSnapshot(): CrisisMetrics {
    return {
      ...this.lastMetrics
    };
  }

  async run(input: CrisisNavigatorInput): Promise<CrisisNavigatorOutput> {
    const parsedInput = CrisisNavigatorInputSchema.parse(input);
    const startedAt = this.now();
    const events: CrisisEvent[] = [];
    const metrics: CrisisMetrics = {
      durationMs: 0,
      retries: 0,
      toolCalls: 0,
      toolFailures: 0
    };
    const fallbackReasons: string[] = [];

    const emitEvent = (
      event: Omit<CrisisEvent, "timestamp"> & { timestamp?: string }
    ): void => {
      const normalized: CrisisEvent = {
        ...event,
        timestamp: event.timestamp ?? this.now().toISOString()
      };
      events.push(normalized);
      const payload = JSON.stringify({
        level: normalized.level,
        message: normalized.message,
        name: normalized.name
      });
      if (normalized.level === "error") {
        console.error(payload);
      } else if (normalized.level === "warning") {
        console.warn(payload);
      } else {
        console.log(payload);
      }
    };

    emitEvent({
      details: {
        source: "request",
        toolId: "crisisnavigator"
      },
      level: "info",
      message: "CrisisNavigator request accepted.",
      name: "crisisnavigator.request.received"
    });

    const loadedContract = await this.loadContract();
    emitEvent({
      details: {
        source: loadedContract.source
      },
      level: "info",
      message: `Contract loaded from ${loadedContract.source}.`,
      name: "crisisnavigator.contract.loaded"
    });

    const mappedTools = this.resolveToolIds(loadedContract.contract.toolIds);
    const effectiveTools =
      mappedTools.length > 0 ? mappedTools : [...CRISISNAVIGATOR_TOOL_IDS];

    const runWithRetry = async <T>(
      toolId: CrisisToolId,
      operation: () => Promise<T>
    ): Promise<T> => {
      const maxAttempts = loadedContract.contract.retry.maxAttempts;
      const baseDelayMs = loadedContract.contract.retry.baseDelayMs;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        emitEvent({
          details: {
            attempt,
            maxAttempts,
            toolId
          },
          level: "info",
          message: `Running ${toolId} (attempt ${attempt}/${maxAttempts}).`,
          name: "crisisnavigator.tool.call.started"
        });

        try {
          metrics.toolCalls += 1;
          const result = await operation();
          emitEvent({
            details: {
              attempt,
              toolId
            },
            level: "info",
            message: `${toolId} completed.`,
            name: "crisisnavigator.tool.call.succeeded"
          });
          return result;
        } catch (error) {
          const asError =
            error instanceof Error ? error : new Error("Unknown tool failure.");
          lastError = asError;
          emitEvent({
            details: {
              attempt,
              errorCode: asError.message,
              maxAttempts,
              toolId
            },
            level: "warning",
            message: `${toolId} failed at attempt ${attempt}.`,
            name: "crisisnavigator.tool.call.failed"
          });
          if (attempt >= maxAttempts) {
            break;
          }
          metrics.retries += 1;
          const delay = baseDelayMs * 2 ** (attempt - 1);
          emitEvent({
            details: {
              attempt,
              maxAttempts,
              toolId
            },
            level: "info",
            message: `${toolId} retry scheduled after ${delay}ms.`,
            name: "crisisnavigator.retry.scheduled"
          });
          await this.sleepFn(delay);
        }
      }

      metrics.toolFailures += 1;
      throw lastError ?? new Error(`${toolId} failed with no details.`);
    };

    const toolInput: CrisisToolInput = {
      endDate: parsedInput.window.endDate,
      regions: parsedInput.regions,
      scenario: parsedInput.scenario,
      severity: parsedInput.severity,
      startDate: parsedInput.window.startDate,
      tenantId: parsedInput.tenantId
    };

    let comms = null;
    let incident = null;
    let impact = null;

    if (effectiveTools.includes("comms-draft-assistant")) {
      try {
        comms = CommsDraftSnapshotSchema.parse(
          await runWithRetry("comms-draft-assistant", () =>
            this.toolAdapters.fetchCommsDraft(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "comms-draft-assistant failed.";
        fallbackReasons.push(`comms-draft-assistant: ${message}`);
      }
    }

    if (effectiveTools.includes("incident-signal-feed")) {
      try {
        incident = IncidentSignalSnapshotSchema.parse(
          await runWithRetry("incident-signal-feed", () =>
            this.toolAdapters.fetchIncidentSignal(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "incident-signal-feed failed.";
        fallbackReasons.push(`incident-signal-feed: ${message}`);
      }
    }

    if (effectiveTools.includes("stakeholder-impact-engine")) {
      try {
        impact = StakeholderImpactSnapshotSchema.parse(
          await runWithRetry("stakeholder-impact-engine", () =>
            this.toolAdapters.fetchStakeholderImpact(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "stakeholder-impact-engine failed.";
        fallbackReasons.push(`stakeholder-impact-engine: ${message}`);
      }
    }

    const fallbackApplied = fallbackReasons.length > 0;
    const fallbackMode: CrisisFailureMode | null = fallbackApplied
      ? loadedContract.contract.failureMode
      : null;

    if (fallbackApplied) {
      emitEvent({
        details: {
          fallbackMode: fallbackMode ?? undefined,
          source: "failure_behavior"
        },
        level: "warning",
        message: "Fallback behavior applied for CrisisNavigator output.",
        name: "crisisnavigator.fallback.applied"
      });
    }

    const safeComms = comms ?? {
      externalTone: "neutral" as const,
      internalTone: "directive" as const,
      keyMessage: "Primary communication feed unavailable. Human response required."
    };
    const safeIncident = incident ?? {
      confidencePct: 0,
      incidentVelocity: 0,
      topSignal: "incident signal unavailable"
    };
    const safeImpact = impact ?? {
      boardImpact: "board impact unavailable",
      customerImpact: "customer impact unavailable",
      regulatoryExposurePct: 0
    };

    const status: CrisisNavigatorOutput["status"] =
      fallbackApplied && fallbackMode === "hard_fail"
        ? "error"
        : fallbackApplied
          ? "fallback"
          : "success";

    metrics.durationMs = Math.max(0, this.now().getTime() - startedAt.getTime());
    emitEvent({
      details: {
        source: "response"
      },
      level: status === "error" ? "error" : "info",
      message: "CrisisNavigator response generated.",
      name: "crisisnavigator.response.generated"
    });

    const severityWeight =
      parsedInput.severity === "sev1"
        ? 90
        : parsedInput.severity === "sev2"
          ? 70
          : parsedInput.severity === "sev3"
            ? 45
            : 25;
    const incidentScore = (severityWeight + safeIncident.incidentVelocity) / 2;
    const maxActions = parsedInput.constraints.maxActions;

    const output = CrisisNavigatorOutputSchema.parse({
      agent: "CrisisNavigator",
      crisisBrief: {
        communications: {
          externalHoldingStatement: `We are actively managing the ${parsedInput.scenario} scenario with ${safeComms.externalTone} communication and structured updates.`,
          internalMessage: `${safeComms.keyMessage} Internal tone: ${safeComms.internalTone}.`,
          mediaQATopics: [
            "Timeline of incident acknowledgement and response actions",
            "Customer impact scope and service continuity commitments",
            "Governance and executive accountability measures in place"
          ]
        },
        headline: `Crisis readiness: score ${incidentScore.toFixed(1)} for ${parsedInput.scenario} (${parsedInput.severity}).`,
        impactMatrix: [
          {
            impact: safeImpact.boardImpact,
            severity: toPriority(incidentScore),
            stakeholder: "Board"
          },
          {
            impact: safeImpact.customerImpact,
            severity: toPriority(safeImpact.regulatoryExposurePct + 20),
            stakeholder: "Customers"
          },
          {
            impact: `Regulatory exposure estimated at ${safeImpact.regulatoryExposurePct.toFixed(
              1
            )}%.`,
            severity: toPriority(safeImpact.regulatoryExposurePct),
            stakeholder: "Regulators"
          }
        ].slice(0, maxActions),
        responseTimeline: [
          {
            owner: "CEO",
            priority: toPriority(incidentScore),
            step: "Convene crisis command cell and confirm decision rights.",
            targetDate: addDays(parsedInput.window.endDate, 0)
          },
          {
            owner: "COO",
            priority: toPriority(safeIncident.incidentVelocity),
            step: "Activate operational containment and publish hourly status cadence.",
            targetDate: addDays(parsedInput.window.endDate, 1)
          },
          {
            owner: "GC",
            priority: toPriority(safeImpact.regulatoryExposurePct),
            step: "Validate disclosure and regulator-notification obligations.",
            targetDate: addDays(parsedInput.window.endDate, 1)
          },
          {
            owner: "CCO",
            priority: "high",
            step: "Release aligned internal and external holding statements.",
            targetDate: addDays(parsedInput.window.endDate, 1)
          }
        ].slice(0, maxActions),
        riskSignals: [
          {
            mitigation:
              "Maintain synchronized executive message map and single source of truth for updates.",
            severity: toPriority(safeIncident.incidentVelocity),
            signal: safeIncident.topSignal
          },
          {
            mitigation:
              "Coordinate legal and compliance review before each public milestone.",
            severity: toPriority(safeImpact.regulatoryExposurePct),
            signal: `Regulatory exposure trend at ${safeImpact.regulatoryExposurePct.toFixed(
              1
            )}%`
          }
        ].slice(0, maxActions),
        situationAssessment: `Incident confidence ${safeIncident.confidencePct.toFixed(
          1
        )}% with velocity ${safeIncident.incidentVelocity.toFixed(
          1
        )}. Scenario requires ${parsedInput.constraints.requireHumanApproval ? "mandatory" : "conditional"} human approval.`
      },
      domain: "executivos",
      fallback: {
        applied: fallbackApplied,
        mode: fallbackMode,
        reasons: fallbackReasons
      },
      generatedAt: this.now().toISOString(),
      observability: {
        events,
        metrics
      },
      status,
      summary: fallbackApplied
        ? "CrisisNavigator generated under fallback mode due to tool failures."
        : "CrisisNavigator generated with complete crisis intelligence coverage."
    });

    this.lastMetrics = {
      ...output.observability.metrics
    };
    return output;
  }

  private resolveToolIds(toolIds: string[]): CrisisToolId[] {
    const mapped = toolIds
      .map((toolId) => normalizeCrisisToolId(toolId))
      .filter((toolId): toolId is CrisisToolId => toolId !== null);
    return Array.from(new Set(mapped));
  }

  private async loadContract(): Promise<LoadedContract> {
    for (const contractPath of this.contractPaths) {
      try {
        await access(contractPath);
      } catch {
        continue;
      }

      try {
        const content = await readFile(contractPath, "utf8");
        const merged = mergeContract(
          parseContractOverrides(content),
          DEFAULT_CRISISNAVIGATOR_CONTRACT
        );
        return {
          contract: merged,
          source: classifyContractSource(contractPath)
        };
      } catch {
        continue;
      }
    }

    return {
      contract: DEFAULT_CRISISNAVIGATOR_CONTRACT,
      source: "default"
    };
  }
}
