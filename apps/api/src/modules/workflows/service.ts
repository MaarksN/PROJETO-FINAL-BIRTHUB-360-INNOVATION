import { createHash, randomUUID } from "node:crypto";

import type { ApiConfig } from "@birthub/config";
import {
  prisma,
  WorkflowExecutionStatus,
  WorkflowStatus,
  WorkflowTriggerType
} from "@birthub/database";
import { validateDag, type WorkflowCanvas } from "@birthub/workflows-core";

import {
  enqueueWorkflowExecution,
  enqueueWorkflowTrigger,
  scheduleCronWorkflow
} from "./runnerQueue.js";
import type {
  WorkflowCreateInput,
  WorkflowRunInput,
  WorkflowUpdateInput
} from "./schemas.js";

export interface ScopedIdentity {
  organizationId: string;
  tenantId: string;
}

type PersistedWorkflow = Awaited<ReturnType<typeof getWorkflowById>>;

async function resolveScopedIdentity(organizationId: string): Promise<ScopedIdentity> {
  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId
    }
  });

  if (!organization) {
    throw new Error("ORGANIZATION_NOT_FOUND");
  }

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

function ensureCanvasIsDag(canvas: WorkflowCanvas): void {
  validateDag({
    edges: canvas.transitions.map((transition) => ({
      route: transition.route,
      source: transition.source,
      target: transition.target
    })),
    nodes: canvas.steps.map((step) => ({
      id: step.key,
      isTrigger: "isTrigger" in step ? step.isTrigger : false,
      type: step.type
    }))
  });
}

function getTriggerStepKey(canvas: WorkflowCanvas): string {
  const explicitTrigger = canvas.steps.find(
    (step) =>
      step.type === "TRIGGER_WEBHOOK" ||
      step.type === "TRIGGER_CRON" ||
      step.type === "TRIGGER_EVENT"
  );

  return explicitTrigger?.key ?? canvas.steps[0]!.key;
}

function createWebhookSecret(identity: ScopedIdentity, workflowName: string): string {
  return createHash("sha256")
    .update(`${identity.tenantId}:${workflowName}:${Date.now()}:${randomUUID()}`)
    .digest("hex");
}

async function persistCanvas(
  identity: ScopedIdentity,
  workflowId: string,
  canvas: WorkflowCanvas
): Promise<void> {
  const stepIdByKey = new Map<string, string>();

  for (const step of canvas.steps) {
    const created = await prisma.workflowStep.create({
      data: {
        config: step.config,
        isTrigger:
          step.type === "TRIGGER_WEBHOOK" ||
          step.type === "TRIGGER_CRON" ||
          step.type === "TRIGGER_EVENT",
        key: step.key,
        name: step.name,
        organizationId: identity.organizationId,
        tenantId: identity.tenantId,
        type: step.type,
        workflowId
      }
    });

    stepIdByKey.set(step.key, created.id);
  }

  for (const transition of canvas.transitions) {
    const sourceStepId = stepIdByKey.get(transition.source);
    const targetStepId = stepIdByKey.get(transition.target);

    if (!sourceStepId || !targetStepId) {
      throw new Error("WORKFLOW_TRANSITION_MISSING_ENDPOINT");
    }

    await prisma.workflowTransition.create({
      data: {
        organizationId: identity.organizationId,
        route: transition.route,
        sourceStepId,
        targetStepId,
        tenantId: identity.tenantId,
        workflowId
      }
    });
  }
}

async function upsertCronTrigger(config: ApiConfig, workflow: {
  cronExpression: string | null;
  id: string;
  organizationId: string;
  tenantId: string;
}): Promise<void> {
  if (!workflow.cronExpression) {
    return;
  }

  await scheduleCronWorkflow(config, {
    cron: workflow.cronExpression,
    organizationId: workflow.organizationId,
    tenantId: workflow.tenantId,
    triggerPayload: {},
    triggerType: WorkflowTriggerType.CRON,
    workflowId: workflow.id
  });
}

export async function getWorkflowById(
  workflowId: string,
  organizationId: string
) {
  return prisma.workflow.findFirst({
    include: {
      executions: {
        orderBy: {
          startedAt: "desc"
        },
        take: 25
      },
      steps: true,
      transitions: true
    },
    where: {
      id: workflowId,
      organizationId
    }
  });
}

export async function listWorkflows(organizationId: string) {
  return prisma.workflow.findMany({
    include: {
      _count: {
        select: {
          executions: true,
          steps: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    where: {
      organizationId
    }
  });
}

export async function createWorkflow(
  config: ApiConfig,
  organizationId: string,
  input: WorkflowCreateInput
): Promise<PersistedWorkflow> {
  const identity = await resolveScopedIdentity(organizationId);
  ensureCanvasIsDag(input.canvas);

  if (input.status === WorkflowStatus.PUBLISHED) {
    getTriggerStepKey(input.canvas);
  }

  const workflow = await prisma.$transaction(async (tx) => {
    const created = await tx.workflow.create({
      data: {
        archivedAt: input.status === WorkflowStatus.ARCHIVED ? new Date() : null,
        cronExpression: input.cronExpression,
        definition: input.canvas,
        description: input.description,
        eventTopic: input.eventTopic,
        maxDepth: input.maxDepth,
        name: input.name,
        organizationId: identity.organizationId,
        publishedAt: input.status === WorkflowStatus.PUBLISHED ? new Date() : null,
        status: input.status,
        tenantId: identity.tenantId,
        triggerConfig: input.triggerConfig,
        triggerType: input.triggerType,
        webhookSecret:
          input.triggerType === WorkflowTriggerType.WEBHOOK
            ? createWebhookSecret(identity, input.name)
            : null
      }
    });

    await persistCanvas(identity, created.id, input.canvas);
    return created;
  });

  if (input.triggerType === WorkflowTriggerType.CRON) {
    await upsertCronTrigger(config, {
      cronExpression: workflow.cronExpression,
      id: workflow.id,
      organizationId: workflow.organizationId,
      tenantId: workflow.tenantId
    });
  }

  const persisted = await getWorkflowById(workflow.id, organizationId);
  if (!persisted) {
    throw new Error("WORKFLOW_CREATE_FAILED");
  }

  return persisted;
}

export async function updateWorkflow(
  config: ApiConfig,
  workflowId: string,
  organizationId: string,
  input: WorkflowUpdateInput
): Promise<PersistedWorkflow> {
  const existing = await getWorkflowById(workflowId, organizationId);
  if (!existing) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }

  const identity = await resolveScopedIdentity(organizationId);
  if (input.canvas) {
    ensureCanvasIsDag(input.canvas);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const workflow = await tx.workflow.update({
      data: {
        archivedAt:
          input.status === WorkflowStatus.ARCHIVED
            ? new Date()
            : input.status
              ? null
              : undefined,
        cronExpression: input.cronExpression,
        definition: input.canvas,
        description: input.description,
        eventTopic: input.eventTopic,
        maxDepth: input.maxDepth,
        name: input.name,
        publishedAt:
          input.status === WorkflowStatus.PUBLISHED
            ? new Date()
            : input.status
              ? null
              : undefined,
        status: input.status,
        triggerConfig: input.triggerConfig,
        triggerType: input.triggerType
      },
      where: {
        id: workflowId
      }
    });

    if (input.canvas) {
      await tx.workflowTransition.deleteMany({
        where: {
          workflowId
        }
      });
      await tx.workflowStep.deleteMany({
        where: {
          workflowId
        }
      });
      await persistCanvas(identity, workflowId, input.canvas);
    }

    return workflow;
  });

  if ((input.triggerType ?? existing.triggerType) === WorkflowTriggerType.CRON) {
    await upsertCronTrigger(config, {
      cronExpression: updated.cronExpression,
      id: updated.id,
      organizationId: updated.organizationId,
      tenantId: updated.tenantId
    });
  }

  const persisted = await getWorkflowById(workflowId, organizationId);
  if (!persisted) {
    throw new Error("WORKFLOW_NOT_FOUND_AFTER_UPDATE");
  }

  return persisted;
}

export async function archiveWorkflow(
  workflowId: string,
  organizationId: string
): Promise<void> {
  await prisma.workflow.updateMany({
    data: {
      archivedAt: new Date(),
      status: WorkflowStatus.ARCHIVED
    },
    where: {
      id: workflowId,
      organizationId
    }
  });
}

export async function runWorkflowNow(
  config: ApiConfig,
  workflowId: string,
  organizationId: string,
  input: WorkflowRunInput,
  triggerType: WorkflowTriggerType = WorkflowTriggerType.MANUAL
): Promise<{
  executionId: string;
  mode: "async" | "sync";
  status: "accepted";
}> {
  const workflow = await getWorkflowById(workflowId, organizationId);
  if (!workflow) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("WORKFLOW_NOT_PUBLISHED");
  }

  const triggerStep = workflow.steps.find(
    (step) =>
      step.type === "TRIGGER_WEBHOOK" ||
      step.type === "TRIGGER_CRON" ||
      step.type === "TRIGGER_EVENT"
  );

  const execution = await prisma.workflowExecution.create({
    data: {
      organizationId: workflow.organizationId,
      status: WorkflowExecutionStatus.RUNNING,
      tenantId: workflow.tenantId,
      triggerPayload: input.payload,
      triggerType,
      workflowId: workflow.id
    }
  });

  if (triggerStep) {
    await enqueueWorkflowExecution(config, {
      attempt: 1,
      executionId: execution.id,
      organizationId: workflow.organizationId,
      stepKey: triggerStep.key,
      tenantId: workflow.tenantId,
      triggerPayload: input.payload,
      triggerType,
      workflowId: workflow.id
    });
  } else {
    await enqueueWorkflowTrigger(config, {
      organizationId: workflow.organizationId,
      tenantId: workflow.tenantId,
      triggerPayload: input.payload,
      triggerType,
      workflowId: workflow.id
    });
  }

  return {
    executionId: execution.id,
    mode: input.async ? "async" : "sync",
    status: "accepted"
  };
}

