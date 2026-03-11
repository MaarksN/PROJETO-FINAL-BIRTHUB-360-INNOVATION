# Workflow Complexity Limits by Plan

To ensure fair use, system stability, and predictable performance, BirthHub360 enforces complexity limits on workflow templates based on the tenant's subscription plan. These limits are validated at design time (when saving a template) and at runtime.

## 1. Free/Basic Plan
Designed for simple, linear automations.
*   **Max Steps per Workflow**: 10
*   **Max Conditional Branches (If/Else)**: 2
*   **Max Loops/Iterations per Run**: 10
*   **Allowed Step Types**: `ActionStep` (Internal APIs only), `ConditionStep`, `WaitStep` (Max 7 days).
*   **AgentSteps Allowed**: No
*   **Max Execution Time (Global)**: 7 days

## 2. Professional Plan
Designed for standard business processes with moderate complexity.
*   **Max Steps per Workflow**: 50
*   **Max Conditional Branches (If/Else)**: 10
*   **Max Loops/Iterations per Run**: 100
*   **Allowed Step Types**: All Basic types + `ActionStep` (External Webhooks), `ApprovalStep`.
*   **AgentSteps Allowed**: Yes (Max 2 per workflow)
*   **Max Execution Time (Global)**: 30 days

## 3. Enterprise Plan
Designed for complex, mission-critical orchestrations.
*   **Max Steps per Workflow**: 200
*   **Max Conditional Branches (If/Else)**: 50
*   **Max Loops/Iterations per Run**: 1000
*   **Allowed Step Types**: All Professional types + Custom Sandboxed Code Execution.
*   **AgentSteps Allowed**: Yes (Unlimited)
*   **Max Execution Time (Global)**: 365 days

## 4. Enforcement and Upgrades
*   **UI Enforcement**: The workflow builder will visually block the addition of steps or branches once the plan limit is reached, prompting an upgrade.
*   **API Enforcement**: The backend API will return a `422 Unprocessable Entity` error if a tenant attempts to save a workflow definition exceeding their plan's complexity limits.
*   **Runtime Enforcement**: If a loop exceeds its maximum iteration count, the workflow run is forcefully transitioned to a `FAILED_LIMIT_EXCEEDED` state and moved to the DLQ.