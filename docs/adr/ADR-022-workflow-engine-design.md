# ADR 022: Workflow Engine Design — Stateless vs Stateful and Step Types

## Status
Proposed

## Context
The BirthHub360 platform needs a robust workflow engine to handle automation steps. The primary design decision revolves around whether the workflow execution engine should be stateless or stateful, and how to define the various types of steps that can occur during a workflow. The engine must scale effectively and recover gracefully from failures without losing track of a workflow's state.

## Decision
We will adopt a **stateful** workflow engine design, where the state of each workflow execution (run) is persisted in a database.

1.  **State Management**:
    *   The orchestrator will save the output and state of each step before transitioning to the next.
    *   This allows workflows to be paused, resumed, and retried from the exact point of failure.
    *   Long-running steps (e.g., human approvals or agent analysis) require a persistent state since they cannot be held in memory.

2.  **Step Types**:
    *   `ActionStep`: A standard execution step that performs a defined API call, database operation, or external integration.
    *   `ConditionStep`: Evaluates variables and determines the branching path (If/Else, Switch).
    *   `WaitStep`: Pauses the workflow execution for a specified duration or until a specific date/time.
    *   `ApprovalStep`: A human-in-the-loop step that suspends execution until an authorized user approves or rejects it.
    *   `AgentStep`: delegates a task to an AI agent (e.g., CODEX, JULES), which operates asynchronously and reports back upon completion.

## Consequences
*   **Pros**:
    *   High resilience to system crashes; workflows can resume seamlessly.
    *   Support for long-running workflows spanning days or weeks.
    *   Auditable history of every step execution and its outcome.
*   **Cons**:
    *   Increased database load due to constant state updates.
    *   More complex orchestration logic compared to a simple stateless pipeline.

## Validation
CODEX will validate this ADR to ensure it aligns with the overall platform architecture and scalability goals.