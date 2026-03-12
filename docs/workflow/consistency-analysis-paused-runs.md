# Consistency Analysis: Paused Workflow Runs

## Context
BirthHub360's stateful workflow engine (ADR-022) allows workflows to be explicitly paused—either manually by an administrator or programmatically via a `WaitStep` or `ApprovalStep`. This document analyzes the consistency of the workflow state and payload when a run is paused for an extended period (e.g., 1 hour) and subsequently resumed.

## 1. State Persistence Mechanism
When a workflow enters a paused state (e.g., waiting for an HTTP callback or a human approval), the orchestrator performs the following actions:
*   **Checkpointing**: The complete execution state, including the current variable payload, execution history, and the ID of the step to be executed next, is serialized (typically as JSON) and committed to the primary PostgreSQL database.
*   **Worker Release**: The worker thread executing the workflow is immediately released back to the pool, ensuring that long-running paused workflows consume zero active compute resources.

## 2. The 1-Hour Pause Scenario
Consider a scenario where a workflow is paused for exactly 1 hour. During this time, the following external factors may change:
*   **External Data Mutation**: Data in external systems (e.g., a CRM record, a Stripe customer) referenced in the workflow payload may be updated by other processes or users.
*   **Workflow Template Update**: The underlying workflow definition (template) might be modified and saved as a new version by an administrator.
*   **System Deployments**: The BirthHub360 platform itself might undergo a rolling deployment, restarting the orchestrator or worker nodes.

## 3. Consistency Analysis and Behavior

### 3.1 Payload Staleness (Data Consistency)
*   **Risk**: If the workflow relies on data fetched in `Step A` (e.g., a customer's account balance), pauses for 1 hour, and then uses that same data in `Step C`, the data might be stale.
*   **Behavior**: The workflow engine **does not** automatically refresh the payload variables upon resumption. The payload remains exactly as it was when the workflow was paused.
*   **Mitigation**: Workflow designers must explicitly model data freshness. If `Step C` requires up-to-date data after a long pause, the designer must insert a new `ActionStep` immediately after the pause to re-fetch the necessary data before executing critical actions. The engine provides the mechanism to pause; it is the designer's responsibility to ensure the logic accounts for elapsed time.

### 3.2 Template Versioning (Execution Consistency)
*   **Risk**: If an administrator edits the workflow template (e.g., changes `Step C` to call a different API endpoint) while a run is paused between `Step B` and `Step C`, what version of `Step C` executes upon resumption?
*   **Behavior**: A paused workflow run is bound to the **specific version of the template** that was active when the run was initially triggered.
*   **Mitigation**: The orchestrator will resume the run using the immutable, snapshotted definition of the workflow. Updates to the template only affect new runs triggered after the update is published. This ensures deterministic execution and prevents mid-flight logic corruption.

### 3.3 System Restarts (Infrastructure Consistency)
*   **Risk**: A deployment restarts all worker nodes during the 1-hour pause.
*   **Behavior**: Because the state is fully persisted in the database (Checkpointing), the restart has zero impact on the paused run.
*   **Mitigation**: When the pause condition is met (e.g., the 1-hour timer expires, or a webhook callback is received), any available worker node in the new deployment can claim the task, deserialize the state from the database, and seamlessly continue execution from the next step.

## 4. Conclusion
The stateful design ensures high consistency for paused runs by treating the payload and execution definition as immutable snapshots during the pause. However, it places the burden of handling "stale data" squarely on the workflow designer, requiring explicit re-fetching steps for long-duration pauses where external data volatility is high.
