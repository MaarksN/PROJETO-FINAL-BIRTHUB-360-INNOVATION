# Workflow Engine Corner Cases

This document maps the corner cases identified during the design phase of the workflow engine. Addressing these scenarios prevents unexpected behavior, infinite execution, and deadlocks.

## 1. Zero Steps
**Scenario**: A workflow is created and triggered, but it contains zero actionable steps.
*   **Behavior**: The workflow engine must immediately mark the run as `COMPLETED`.
*   **Impact**: Wasted processing cycles if not handled early; potential for confusion if it remains in a `RUNNING` state indefinitely.
*   **Mitigation**: Pre-flight validation when a workflow is triggered should verify `steps.length > 0`. If false, bypass the execution queue entirely.

## 2. Circular Steps (Infinite Loops)
**Scenario**: A workflow contains a loop where Step A points to Step B, and Step B points back to Step A, with no terminating condition.
*   **Behavior**: The workflow runs endlessly, consuming resources until a timeout or stack overflow occurs.
*   **Impact**: Severe resource drain on the worker nodes, potentially affecting the execution of legitimate workflows.
*   **Mitigation**:
    *   **Static Analysis**: Prevent saving a workflow template if a cycle is detected using a directed acyclic graph (DAG) cycle-detection algorithm.
    *   **Runtime Limit**: Enforce a maximum execution count per step (e.g., maximum 100 iterations per loop).

## 3. Condition Always False
**Scenario**: A `ConditionStep` is configured with a rule that evaluates to false indefinitely, but no alternative path (e.g., an `Else` branch) is defined to handle it.
*   **Behavior**: The workflow reaches the condition, evaluates to false, and has no further instructions.
*   **Impact**: The workflow is stuck in an unresolved state, neither succeeded nor explicitly failed.
*   **Mitigation**: Require all conditional branches to either define a default/fallback path or implicitly transition the workflow state to `COMPLETED_WITH_NO_ACTION` if no subsequent steps are matched.

## 4. Timeouts (Global and Step-Level)
**Scenario**: An API call in an `ActionStep` hangs indefinitely without closing the connection, or a human `ApprovalStep` is ignored for weeks.
*   **Behavior**: The step remains active indefinitely, tying up worker threads or leaving the workflow in a perpetual pending state.
*   **Impact**: Degraded system performance and inaccurate status reporting.
*   **Mitigation**:
    *   **Step-Level Timeout**: Enforce strict timeouts on all external actions (e.g., maximum 30 seconds for HTTP requests).
    *   **Global Timeout**: Define a maximum overall runtime for any single workflow instance (e.g., 30 days for an approval workflow). If exceeded, mark the run as `TIMED_OUT`.
