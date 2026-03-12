# Failure Analysis: Downstream Behavior on Upstream Step Failure

## Overview
This document analyzes the behavior and cascading effects on downstream steps when an upstream step in a BirthHub360 workflow encounters an unrecoverable failure. Given our stateful engine architecture (ADR-022), it is critical to handle failures deterministically to prevent partial state corruption or phantom executions.

## Problem Statement
When `Step A` fails (e.g., an external API returns a 500 error after all retries are exhausted, or an AgentStep crashes), what happens to `Step B` and `Step C` that depend on it?

## 1. Default Behavior (Strict Dependency)
By default, all downstream steps in a linear execution path have a **strict dependency** on their immediate upstream predecessor.
*   **Action**: If `Step A` fails, the workflow engine immediately marks the entire Workflow Run as `FAILED`.
*   **Downstream Impact**: `Step B`, `Step C`, and any subsequent steps are **aborted**. They are never enqueued for execution.
*   **State Persistence**: The final state of the workflow is recorded as `FAILED_AT_STEP_A`. The payload remains at the state it was in right before `Step A` executed.
*   **Justification**: This prevents downstream steps from executing with missing or corrupted payload data that they expect `Step A` to have populated.

## 2. Conditional Failure Handling (Try/Catch Pattern)
To build resilient workflows, designers can configure failure branches.
*   **Configuration**: `Step A` can be configured with a specific `OnFailure` transition pointing to an alternative path (e.g., `Step A_ErrorHandler`).
*   **Behavior**:
    1.  `Step A` fails.
    2.  The engine catches the failure, suppresses the global `FAILED` status, and routes execution to `Step A_ErrorHandler`.
    3.  The payload is augmented with a `_system.last_error` object containing the failure details.
*   **Downstream Impact**: The original downstream path (`Step B`) is bypassed. The workflow continues down the error handling path. If the error handling path eventually rejoins the main path, downstream steps must be designed to handle the potentially altered payload structure.

## 3. Parallel Branches and Failure
When a workflow splits into parallel execution paths (e.g., `Path 1` and `Path 2` executing simultaneously):
*   **Scenario**: `Step A` (on `Path 1`) fails, while `Step X` (on `Path 2`) is still running.
*   **Behavior**:
    *   The engine marks `Path 1` as failed.
    *   `Path 2` is allowed to continue execution until it reaches a "Wait/Join" step.
    *   If the workflow requires a Join (waiting for all parallel paths to complete), the overall workflow will fail at the Join step because one of the prerequisite paths failed.
    *   If the workflow does not require a Join, the overall run status will be marked as `PARTIALLY_FAILED`.

## 4. Rollback and Compensation
BirthHub360 workflows do **not** support automatic rollbacks (e.g., automatically undoing an API call made in `Step -1` if `Step A` fails).
*   **Mitigation**: Workflow designers must implement the **Saga Pattern** explicitly. If a failure occurs, the `OnFailure` branch must contain compensating steps (e.g., an API call to refund a payment if the subsequent provisioning step fails).

## 5. Security and Data Integrity
*   A failed step must never leak sensitive error payloads (e.g., raw SQL exceptions or stack traces from external APIs) into downstream steps or UI notifications unless explicitly configured to do so for administrative debugging.
*   The payload context must be frozen at the exact moment of failure to allow for accurate debugging and potential replay via the DLQ.
