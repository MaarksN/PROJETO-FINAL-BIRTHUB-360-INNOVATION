# Workflow Engine: Chaos Testing Scenarios

This document outlines the chaos engineering experiments designed to validate the resilience, error handling, and recovery mechanisms of the BirthHub360 stateful workflow engine. These scenarios simulate real-world infrastructure failures, edge cases in user configurations, and unexpected behaviors from external dependencies.

## 1. Stuck Step: The Indefinite API Call
*   **Scenario**: A workflow executes an `ActionStep` that calls a third-party API. The API accepts the connection but never returns a response (network partition or backend hang), keeping the HTTP socket open indefinitely.
*   **Hypothesis**: The worker executing the step will be blocked, tying up an execution thread.
*   **Expected Behavior**:
    1.  The step-level timeout (e.g., 30 seconds) defined in the workflow or globally enforced by the orchestrator must trigger.
    2.  The HTTP connection must be forcefully terminated by the worker.
    3.  The workflow engine transitions the step to a `FAILED_TIMEOUT` state.
    4.  If configured, the `OnFailure` branch is executed; otherwise, the workflow is marked `FAILED` and sent to the DLQ.
    5.  The worker thread must be released and returned to the pool.
*   **Validation**: Monitor worker thread utilization metrics during the test to ensure no slow leaks occur.

## 2. Unresolving Condition: The Infinite Loop
*   **Scenario**: A user configures a workflow with a `ConditionStep` that loops back on itself (e.g., Step A -> Step B -> Step A) where the exit condition evaluates to `false` indefinitely due to a misconfigured variable comparison.
*   **Hypothesis**: The workflow will run endlessly, consuming database I/O and worker CPU cycles.
*   **Expected Behavior**:
    1.  The orchestrator's static cycle detection (pre-flight validation) should prevent the workflow from being saved.
    2.  If bypassed (e.g., via API or dynamic state), the runtime loop counter must increment on each iteration.
    3.  Once the `Max Loops/Iterations` limit for the tenant's plan (e.g., 100 for Professional) is reached, the workflow must be forcefully terminated and transitioned to a `FAILED_LIMIT_EXCEEDED` state in the DLQ.
*   **Validation**: Confirm the loop stops exactly at the predefined limit and that the DLQ entry contains the iteration count and the variable state at the time of termination.

## 3. Out of Memory (OOM): Worker Node Crash
*   **Scenario**: A worker node is processing a computationally expensive `AgentStep` or parsing an unusually large payload in an `ActionStep`, causing the operating system to send a `SIGKILL` (OOM) to the worker process. The worker dies instantly without cleanly updating the database state.
*   **Hypothesis**: The workflow run will remain in a "phantom" `RUNNING` state indefinitely, as no process is actively executing it or tracking its completion.
*   **Expected Behavior**:
    1.  The orchestrator employs a heartbeat or "stale task" sweeper process.
    2.  The sweeper detects that a task assigned to worker `node_123` has not received a heartbeat or status update within the configured timeout window (e.g., 5 minutes).
    3.  The orchestrator identifies that `node_123` is dead or unreachable.
    4.  The workflow run is transitioned from `RUNNING` to `FAILED_WORKER_CRASH` and moved to the DLQ.
    5.  The UI displays a clear "System Error" state for the run.
*   **Validation**: Introduce a synthetic OOM event (e.g., `kill -9 <worker_pid>`) during active workflow processing. Verify the stale task sweeper recovers the orphaned runs within the expected SLA.

## 4. Database Partition: The Disconnected Orchestrator
*   **Scenario**: The connection between the workflow orchestrator nodes and the primary PostgreSQL database is severed for 60 seconds (simulating a failover or network partition).
*   **Hypothesis**: Workers attempting to persist state (ADR-022) will fail, leading to dropped state transitions.
*   **Expected Behavior**:
    1.  Workers must utilize connection pooling with robust retry and backoff mechanisms.
    2.  If a state transition cannot be persisted after the retry window (e.g., 10 seconds), the worker must halt execution of the current step.
    3.  Once the database connection is restored, the orchestrator must reconcile the in-memory state with the database state. Runs that failed to persist their progress must be safely restarted from their last known committed state in the database, ensuring at-least-once processing semantics without corrupting intermediate data.
*   **Validation**: Use a network proxy (e.g., Toxiproxy) to drop database connections during a load test. Verify no workflows are lost and that execution resumes cleanly from the last valid checkpoint upon reconnection.
