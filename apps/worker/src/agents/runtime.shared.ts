import { Prisma } from "@birthub/database";
import type { AgentLearningRecord } from "@birthub/agents-core";
import type { Redis } from "ioredis";

export interface RuntimeExecutionInput {
  agentId: string;
  catalogAgentId?: string | null;
  contextSummary?: string;
  executionId: string;
  input: Record<string, unknown>;
  organizationId?: string | null;
  redis: Redis;
  source: "MANUAL" | "WORKFLOW";
  tenantId: string;
  userId?: string | null;
}

export interface RuntimeExecutionResult {
  learningRecord: AgentLearningRecord;
  logs: string[];
  metadata: Record<string, unknown>;
  output: Record<string, unknown>;
  outputArtifactId: string;
  outputHash: string;
  status: "SUCCESS" | "WAITING_APPROVAL";
  toolCost: number;
}

export function readNumbers(value: unknown): number[] {
  if (typeof value === "number" && Number.isFinite(value)) {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => readNumbers(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => readNumbers(item));
  }

  return [];
}

export function readStrings(value: unknown): string[] {
  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => readStrings(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => readStrings(item));
  }

  return [];
}

export function toJsonValue(value: Record<string, unknown>): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function readSessionId(input: Record<string, unknown>): string | null {
  if (typeof input.sessionId === "string" && input.sessionId.trim().length > 0) {
    return input.sessionId.trim();
  }

  if (
    typeof input.context === "object" &&
    input.context !== null &&
    typeof (input.context as Record<string, unknown>).sessionId === "string"
  ) {
    const candidate = (input.context as Record<string, unknown>).sessionId as string;
    return candidate.trim().length > 0 ? candidate.trim() : null;
  }

  return null;
}
