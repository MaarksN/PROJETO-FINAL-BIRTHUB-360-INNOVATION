import { createHash, randomUUID } from "node:crypto";

import type { ApiConfig } from "@birthub/config";
import {
  Prisma,
  prisma,
  WorkflowExecutionStatus,
  WorkflowStatus,
  WorkflowTriggerType
} from "@birthub/database";
import { validateDag, type WorkflowCanvas } from "@birthub/workflows-core";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { readNumericPlanLimit } from "../billing/plan.utils.js";
import { getBillingSnapshot } from "../billing/service.js";
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

export type WorkflowRevertInput = { version: number };

export interface ScopedIdentity {
  organizationId: string;
  tenantId: string;
}

const WORKFLOW_LIST_LIMIT = 100;
const WORKFLOW_EXECUTION_PAGE_LIMIT = 250;
const WORKFLOW_REVISION_PAGE_LIMIT = 100;
const STEP_RESULT_PAGE_LIMIT = 250;

type PersistedWorkflow = Awaited<ReturnType<typeof getWorkflowById>>;
type WorkflowWriteClient = Pick<typeof prisma, "workflowStep" | "workflowTransition">;
type WorkflowTransactionClient = Prisma.TransactionClient;
type StepResultWithStep = Prisma.StepResultGetPayload<{
  include: {
    step: true;
  };
}>;

export const workflowQueueAdapter = {
  enqueueWorkflowExecution,
  enqueueWorkflowTrigger
} as const;

async function listWorkflowRevisionsPage(
  tenantId: string,
  workflowId: string,
  cursorId?: string
) {
  return prisma.workflowRevision.findMany({
    ...(cursorId
      ? {
          cursor: {
            id: cursorId
          },
          skip: 1
        }
      : {}),
    orderBy: [
      {
        version: "desc"
      },
      {
        id: "desc"
      }
    ],
    take: WORKFLOW_REVISION_PAGE_LIMIT,
    where: {
      tenantId,
      workflowId
    }
  });
}

async function listWorkflowRevisions(tenantId: string, workflowId: string) {
  const revisions: Awaited<ReturnType<typeof listWorkflowRevisionsPage>> = [];
  let cursorId: string | undefined;

  while (true) {
    const page = await listWorkflowRevisionsPage(tenantId, workflowId, cursorId);
    revisions.push(...page);

    if (page.length < WORKFLOW_REVISION_PAGE_LIMIT) {
      return revisions;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function listWorkflowExecutionsPage(
  organizationId: string,
  tenantId: string,
  workflowId: string,
  cursorId?: string
) {
  return prisma.workflowExecution.findMany({
    ...(cursorId
      ? {
          cursor: {
            id: cursorId
          },
          skip: 1
        }
      : {}),
    orderBy: [
      {
        startedAt: "asc"
      },
      {
        id: "asc"
      }
    ],
    take: WORKFLOW_EXECUTION_PAGE_LIMIT,
    where: {
      organizationId,
      tenantId,
      workflowId
    }
  });
}

async function listWorkflowExecutions(
  organizationId: string,
  tenantId: string,
  workflowId: string
) {
  const executions: Awaited<ReturnType<typeof listWorkflowExecutionsPage>> = [];
  let cursorId: string | undefined;

  while (true) {
    const page = await listWorkflowExecutionsPage(organizationId, tenantId, workflowId, cursorId);
    executions.push(...page);

    if (page.length < WORKFLOW_EXECUTION_PAGE_LIMIT) {
      return executions;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function listExecutionStepResultsPage(
  executionId: string,
  workflowId: string,
  cursorId?: string
): Promise<StepResultWithStep[]> {
  return prisma.stepResult.findMany({
    ...(cursorId
      ? {
          cursor: {
            id: cursorId
          },
          skip: 1
        }
      : {}),
    include: {
      step: true
    },
    orderBy: [
      {
        createdAt: "asc"
      },
      {
        id: "asc"
      }
    ],
    take: STEP_RESULT_PAGE_LIMIT,
    where: {
      executionId,
      workflowId
    }
  });
}

async function listExecutionStepResults(executionId: string, workflowId: string) {
  const results: StepResultWithStep[] = [];
  let cursorId: string | undefined;

  while (true) {
    const page = await listExecutionStepResultsPage(executionId, workflowId, cursorId);
    results.push(...page);

    if (page.length < STEP_RESULT_PAGE_LIMIT) {
      return results;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function resolveScopedIdentity(tenantReference: string): Promise<ScopedIdentity> {
  const organization = await prisma.organization.findFirst({
    where: {
      OR: [{ id: tenantReference }, { tenantId: tenantReference }]
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

async function assertWorkflowLimit(identity: ScopedIdentity): Promise<void> {
  const snapshot = await getBillingSnapshot(identity.tenantId, 3);
  const limit = readNumericPlanLimit(snapshot.plan.limits, "workflows", 30);

  if (!Number.isFinite(limit)) {
    return;
  }

  const current = await prisma.workflow.count({
    where: {
      archivedAt: null,
      tenantId: identity.tenantId
    }
  });

  if (current >= limit) {
    throw new ProblemDetailsError({
      detail: `The active plan allows ${limit} workflows. Upgrade to create more.`,
      status: 402,
      title: "Payment Required"
    });
  }
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
  client: WorkflowWriteClient,
  identity: ScopedIdentity,
  workflowId: string,
  canvas: WorkflowCanvas
): Promise<void> {
  const stepIdByKey = new Map<string, string>();

  for (const step of canvas.steps) {
    const created = await client.workflowStep.create({
      data: {
        config: step.config as Prisma.InputJsonValue,
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

    await client.workflowTransition.create({
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
    triggerPayload: {} as Prisma.InputJsonValue as Record<string, unknown>,
    triggerType: WorkflowTriggerType.CRON,
    workflowId: workflow.id
  });
}

export async function getWorkflowById(
  workflowId: string,
  tenantId: string
) {
  return prisma.workflow.findFirst({
    include: {
      executions: {
        include: {
          stepResults: {
            include: {
              step: true
            },
            orderBy: {
              createdAt: "asc"
            }
          }
        },
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
      tenantId
    }
  });
}

export async function listWorkflows(tenantId: string) {
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
    take: WORKFLOW_LIST_LIMIT,
    where: {
      tenantId
    }
  });
}

export async function createWorkflow(
  config: ApiConfig,
  tenantReference: string,
  input: WorkflowCreateInput
): Promise<PersistedWorkflow> {
  const identity = await resolveScopedIdentity(tenantReference);
  await assertWorkflowLimit(identity);
  ensureCanvasIsDag(input.canvas);

  if (input.status === WorkflowStatus.PUBLISHED) {
    getTriggerStepKey(input.canvas);
  }

  const workflow = await prisma.$transaction(async (tx) => {
    const created = await tx.workflow.create({
      data: {
        archivedAt: input.status === WorkflowStatus.ARCHIVED ? new Date() : null,
        cronExpression: input.cronExpression ?? null,
        definition: input.canvas as Prisma.InputJsonValue,
        description: input.description ?? null,
        eventTopic: input.eventTopic ?? null,
        maxDepth: input.maxDepth,
        name: input.name,
        organizationId: identity.organizationId,
        publishedAt: input.status === WorkflowStatus.PUBLISHED ? new Date() : null,
        status: input.status,
        tenantId: identity.tenantId,
        triggerConfig: input.triggerConfig as Prisma.InputJsonValue,
        triggerType: input.triggerType,
        webhookSecret:
          input.triggerType === WorkflowTriggerType.WEBHOOK
            ? createWebhookSecret(identity, input.name)
            : null
      }
    });

    await tx.workflowRevision.create({
      data: {
        definition: input.canvas as Prisma.InputJsonValue,
        organizationId: identity.organizationId,
        tenantId: identity.tenantId,
        version: created.version,
        workflowId: created.id
      }
    });

    await persistCanvas(tx, identity, created.id, input.canvas);
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

  const persisted = await getWorkflowById(workflow.id, identity.tenantId);
  if (!persisted) {
    throw new Error("WORKFLOW_CREATE_FAILED");
  }

  return persisted;
}

export async function updateWorkflow(
  config: ApiConfig,
  workflowId: string,
  tenantReference: string,
  input: WorkflowUpdateInput
): Promise<PersistedWorkflow> {
  const identity = await resolveScopedIdentity(tenantReference);
  const existing = await getWorkflowById(workflowId, identity.tenantId);
  if (!existing) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }

  if (input.canvas) {
    ensureCanvasIsDag(input.canvas);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const workflowUpdateData: Prisma.WorkflowUpdateInput = {};

    if (input.status === WorkflowStatus.ARCHIVED) {
      workflowUpdateData.archivedAt = new Date();
      workflowUpdateData.publishedAt = null;
      workflowUpdateData.status = WorkflowStatus.ARCHIVED;
    } else if (input.status === WorkflowStatus.PUBLISHED) {
      workflowUpdateData.archivedAt = null;
      workflowUpdateData.publishedAt = new Date();
      workflowUpdateData.status = WorkflowStatus.PUBLISHED;
    } else if (input.status === WorkflowStatus.DRAFT) {
      workflowUpdateData.archivedAt = null;
      workflowUpdateData.publishedAt = null;
      workflowUpdateData.status = WorkflowStatus.DRAFT;
    }

    if (input.cronExpression !== undefined) {
      workflowUpdateData.cronExpression = input.cronExpression;
    }

    if (input.canvas !== undefined) {
      workflowUpdateData.definition = input.canvas as Prisma.InputJsonValue;
    }

    if (input.description !== undefined) {
      workflowUpdateData.description = input.description;
    }

    if (input.eventTopic !== undefined) {
      workflowUpdateData.eventTopic = input.eventTopic;
    }

    if (input.maxDepth !== undefined) {
      workflowUpdateData.maxDepth = input.maxDepth;
    }

    if (input.name !== undefined) {
      workflowUpdateData.name = input.name;
    }

    if (input.triggerConfig !== undefined) {
      workflowUpdateData.triggerConfig = input.triggerConfig as Prisma.InputJsonValue;
    }

    if (input.triggerType !== undefined) {
      workflowUpdateData.triggerType = input.triggerType;
    }

    if (input.canvas) {
      workflowUpdateData.version = { increment: 1 };
    }

    const workflow = await tx.workflow.update({
      data: workflowUpdateData,
      where: {
        id: workflowId
      }
    });

    if (input.canvas) {
      await tx.workflowRevision.create({
        data: {
          definition: input.canvas as Prisma.InputJsonValue,
          organizationId: identity.organizationId,
          tenantId: identity.tenantId,
          version: workflow.version,
          workflowId: workflow.id
        }
      });

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
      await persistCanvas(tx, identity, workflowId, input.canvas);
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

  const persisted = await getWorkflowById(workflowId, identity.tenantId);
  if (!persisted) {
    throw new Error("WORKFLOW_NOT_FOUND_AFTER_UPDATE");
  }

  return persisted;
}

export async function getWorkflowRevisions(workflowId: string, tenantReference: string) {
  const identity = await resolveScopedIdentity(tenantReference);

  return listWorkflowRevisions(identity.tenantId, workflowId);
}

export async function revertWorkflow(
  config: ApiConfig,
  workflowId: string,
  tenantReference: string,
  input: WorkflowRevertInput
): Promise<PersistedWorkflow> {
  const identity = await resolveScopedIdentity(tenantReference);
  const existing = await getWorkflowById(workflowId, identity.tenantId);
  if (!existing) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }

  const revision = await prisma.workflowRevision.findUnique({
    where: {
      workflowId_version: {
        version: input.version,
        workflowId
      }
    }
  });

  if (!revision || revision.tenantId !== identity.tenantId) {
    throw new Error("WORKFLOW_REVISION_NOT_FOUND");
  }

  const canvas = revision.definition as unknown as WorkflowCanvas;

  // We reuse updateWorkflow to bump version, persist canvas and create a NEW revision
  return updateWorkflow(config, workflowId, tenantReference, {
    canvas
  });
}

export async function archiveWorkflow(
  workflowId: string,
  tenantReference: string
): Promise<void> {
  const identity = await resolveScopedIdentity(tenantReference);
  await prisma.workflow.updateMany({
    data: {
      archivedAt: new Date(),
      status: WorkflowStatus.ARCHIVED
    },
    where: {
      id: workflowId,
      tenantId: identity.tenantId
    }
  });
}

type ResumeCheckpoint = {
  fromExecutionId: string;
  fromStepKey?: string | undefined;
};

async function resolveResumeStepKey(input: {
  execution: NonNullable<Awaited<ReturnType<typeof prisma.workflowExecution.findFirst>>>;
  requestedStepKey?: string | undefined;
  workflowId: string;
}): Promise<string> {
  if (input.requestedStepKey) {
    return input.requestedStepKey;
  }

  const latestFailedStep = await prisma.stepResult.findFirst({
    include: {
      step: true
    },
    orderBy: {
      createdAt: "desc"
    },
    where: {
      executionId: input.execution.id,
      status: "FAILED",
      workflowId: input.workflowId
    }
  });

  if (!latestFailedStep?.step.key) {
    throw new ProblemDetailsError({
      detail: "Execution has no failed step to resume from.",
      status: 409,
      title: "Conflict"
    });
  }

  return latestFailedStep.step.key;
}

async function buildResumeContext(input: {
  organizationId: string;
  resume: ResumeCheckpoint;
  tenantId: string;
  workflowId: string;
}): Promise<{
  depth: number;
  resumeStepKey: string;
  resumedFromExecutionId: string;
}> {
  const sourceExecution = await prisma.workflowExecution.findFirst({
    where: {
      id: input.resume.fromExecutionId,
      organizationId: input.organizationId,
      tenantId: input.tenantId,
      workflowId: input.workflowId
    }
  });

  if (!sourceExecution) {
    throw new ProblemDetailsError({
      detail: "Source execution for retry was not found.",
      status: 404,
      title: "Not Found"
    });
  }

  if (sourceExecution.status !== WorkflowExecutionStatus.FAILED) {
    throw new ProblemDetailsError({
      detail: "Only failed executions can be resumed from a checkpoint.",
      status: 409,
      title: "Conflict"
    });
  }

  const resumeStepKey = await resolveResumeStepKey({
    execution: sourceExecution,
    requestedStepKey: input.resume.fromStepKey,
    workflowId: input.workflowId
  });

  const resumeStep = await prisma.workflowStep.findFirst({
    where: {
      key: resumeStepKey,
      tenantId: input.tenantId,
      workflowId: input.workflowId
    }
  });

  if (!resumeStep) {
    throw new ProblemDetailsError({
      detail: "Retry checkpoint step was not found in this workflow version.",
      status: 404,
      title: "Not Found"
    });
  }

  const sourceResults = await listExecutionStepResults(sourceExecution.id, input.workflowId);

  const resumeIndex = sourceResults.findIndex((result) => result.step.key === resumeStepKey);
  if (resumeIndex < 0) {
    throw new ProblemDetailsError({
      detail: "Retry checkpoint was never executed in the source run.",
      status: 409,
      title: "Conflict"
    });
  }

  const checkpointResults = sourceResults.slice(0, resumeIndex);

  return {
    depth: checkpointResults.length,
    resumeStepKey,
    resumedFromExecutionId: sourceExecution.id
  };
}

async function cloneCheckpointResults(input: {
  client: Pick<WorkflowTransactionClient, "stepResult">;
  executionId: string;
  fromExecutionId: string;
  fromStepKey: string;
  organizationId: string;
  tenantId: string;
  workflowId: string;
}): Promise<number> {
  const sourceResults = await listExecutionStepResults(input.fromExecutionId, input.workflowId);

  const resumeIndex = sourceResults.findIndex((result) => result.step.key === input.fromStepKey);
  if (resumeIndex < 0) {
    return 0;
  }

  const checkpointResults = sourceResults.slice(0, resumeIndex);

  if (checkpointResults.length > 0) {
    await input.client.stepResult.createMany({
      data: checkpointResults.map((result) => ({
        attempt: result.attempt,
        errorMessage: result.errorMessage,
        executionId: input.executionId,
        externalPayloadUrl: result.externalPayloadUrl,
        finishedAt: result.finishedAt,
        input: result.input as Prisma.InputJsonValue,
        organizationId: input.organizationId,
        output: result.output as Prisma.InputJsonValue,
        outputPreview: result.outputPreview,
        outputSize: result.outputSize,
        startedAt: result.startedAt,
        status: result.status,
        stepId: result.stepId,
        tenantId: input.tenantId,
        workflowId: input.workflowId
      }))
    });
  }

  return checkpointResults.length;
}

export async function runWorkflowNow(
  config: ApiConfig,
  workflowId: string,
  tenantReference: string,
  input: WorkflowRunInput,
  triggerType: WorkflowTriggerType = WorkflowTriggerType.MANUAL
): Promise<{
  executionId: string;
  mode: "async" | "sync";
  status: "accepted";
}> {
  const identity = await resolveScopedIdentity(tenantReference);
  const workflow = await getWorkflowById(workflowId, identity.tenantId);
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

  const resumeContext = input.retry
    ? await buildResumeContext({
        organizationId: workflow.organizationId,
        resume: input.retry,
        tenantId: workflow.tenantId,
        workflowId: workflow.id
      })
    : null;

  const execution = await prisma.$transaction(async (tx) => {
    const createdExecution = await tx.workflowExecution.create({
      data: {
        depth: resumeContext?.depth ?? 0,
        organizationId: workflow.organizationId,
        resumedFromExecutionId: resumeContext?.resumedFromExecutionId ?? null,
        status: WorkflowExecutionStatus.RUNNING,
        tenantId: workflow.tenantId,
        triggerPayload: input.payload as Prisma.InputJsonValue,
        triggerType,
        workflowId: workflow.id
      }
    });

    if (resumeContext) {
      await cloneCheckpointResults({
        client: tx,
        executionId: createdExecution.id,
        fromExecutionId: resumeContext.resumedFromExecutionId,
        fromStepKey: resumeContext.resumeStepKey,
        organizationId: workflow.organizationId,
        tenantId: workflow.tenantId,
        workflowId: workflow.id
      });
    }

    return createdExecution;
  });

  if (resumeContext) {
    await workflowQueueAdapter.enqueueWorkflowExecution(config, {
      attempt: 1,
      executionId: execution.id,
      organizationId: workflow.organizationId,
      stepKey: resumeContext.resumeStepKey,
      tenantId: workflow.tenantId,
      triggerPayload: input.payload,
      triggerType,
      workflowId: workflow.id
    });
  } else if (triggerStep) {
    await workflowQueueAdapter.enqueueWorkflowExecution(config, {
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
    await workflowQueueAdapter.enqueueWorkflowTrigger(config, {
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

export type WorkflowExecutionLineageNode = {
  children: WorkflowExecutionLineageNode[];
  completedAt: Date | null;
  depth: number;
  durationMs: number | null;
  errorMessage: string | null;
  id: string;
  resumedFromExecutionId: string | null;
  startedAt: Date;
  status: WorkflowExecutionStatus;
};

export async function listWorkflowExecutionLineage(
  workflowId: string,
  tenantReference: string
): Promise<WorkflowExecutionLineageNode[]> {
  const identity = await resolveScopedIdentity(tenantReference);
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      tenantId: identity.tenantId
    }
  });

  if (!workflow) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }

  const executions = await listWorkflowExecutions(
    identity.organizationId,
    identity.tenantId,
    workflowId
  );

  const nodesById = new Map<string, WorkflowExecutionLineageNode>();
  for (const execution of executions) {
    nodesById.set(execution.id, {
      children: [],
      completedAt: execution.completedAt,
      depth: execution.depth,
      durationMs: execution.durationMs,
      errorMessage: execution.errorMessage,
      id: execution.id,
      resumedFromExecutionId: execution.resumedFromExecutionId,
      startedAt: execution.startedAt,
      status: execution.status
    });
  }

  const roots: WorkflowExecutionLineageNode[] = [];
  for (const node of nodesById.values()) {
    if (!node.resumedFromExecutionId) {
      roots.push(node);
      continue;
    }

    const parent = nodesById.get(node.resumedFromExecutionId);
    if (!parent) {
      roots.push(node);
      continue;
    }

    parent.children.push(node);
  }

  return roots;
}
