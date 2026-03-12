# Runbook: Diagnosing and Resolving a Stuck Workflow Run

This runbook provides the procedure for diagnosing and resolving a BirthHub360 workflow run that is "stuck" in an intermediate state (e.g., `RUNNING` but not making progress, or hung on a specific step) and has not timed out or moved to the Dead Letter Queue (DLQ).

## 1. Incident Indication
*   **Alerts**: A tenant reports a workflow that hasn't completed within expected SLAs.
*   **Metrics**: High "Run Duration" percentiles for a specific workflow template, or a growing queue of tasks in a "Pending" state in the database without corresponding worker activity.
*   **UI Status**: A workflow run in the dashboard shows a status of `RUNNING` for an abnormally long time (e.g., hours for a step that usually takes seconds).

## 2. Initial Triage and Information Gathering
Before taking any destructive action, gather the following details:
1.  **Run ID**: Obtain the UUID of the stuck workflow run.
2.  **Tenant ID**: Identify the customer affected.
3.  **Current Step**: Check the UI or query the database to determine exactly which step the run is stuck on (e.g., `ActionStep_SendEmail`, `ApprovalStep_Manager`).
4.  **Worker Logs**: Search the centralized logging system (e.g., Datadog, CloudWatch) using the `run_id` to find the last emitted log line.
5.  **Database State**: Query the `workflow_runs` table in PostgreSQL to verify the `status` and `last_updated_at` timestamp.

## 3. Diagnosing the Root Cause

### Scenario A: The Step is Legitimately Waiting (Not Actually Stuck)
*   **Check**: Is the current step an `ApprovalStep`, a `WaitStep`, or an `AgentStep`?
*   **Action**: If yes, the workflow might simply be waiting for human input, a timer to expire, or an external webhook callback.
*   **Resolution**: Verify if the wait condition (e.g., the approval link) was sent correctly. If an `AgentStep` is taking a long time, check the agent's specific logs for slow execution or provider rate limits.

### Scenario B: Worker Crash (Phantom Run)
*   **Check**: Does the `last_updated_at` timestamp show no activity for > 5 minutes, but the status is still `RUNNING`?
*   **Cause**: The worker node executing the step crashed (e.g., OOM kill) before it could update the database state to `FAILED`.
*   **Resolution**:
    1.  The "stale task sweeper" background job should automatically detect this and move the run to the DLQ.
    2.  If the sweeper failed, manually update the run status to `FAILED_WORKER_CRASH` in the database.
    3.  Investigate the worker logs around the `last_updated_at` time to find the cause of the crash (e.g., a massive payload causing OOM).

### Scenario C: Infinite Loop or Unhandled Exception in Custom Code
*   **Check**: Are worker logs for this `run_id` continuously scrolling with the exact same output, or did they suddenly stop after an error stack trace that wasn't caught by the orchestrator?
*   **Cause**: A logical bug in a `ConditionStep` loop, or a fatal bug in the engine itself that bypassed standard error handling.
*   **Resolution**:
    1.  Identify the specific worker node currently processing the task.
    2.  If the worker is spinning in an infinite loop, restart the worker pod/container to kill the process.
    3.  Manually move the run to the DLQ with status `FAILED_SYSTEM_ERROR`.

### Scenario D: Deadlock on External Resource
*   **Check**: Is the step an `ActionStep` making an HTTP request or a database query, and the worker logs show it started the request but never received a response or a timeout error?
*   **Cause**: The step-level timeout configuration is missing or malformed, and the underlying HTTP client or database driver is waiting infinitely on a dropped connection.
*   **Resolution**:
    1.  Manually terminate the stuck worker process.
    2.  Update the workflow template to explicitly enforce a hard timeout on the offending step.
    3.  Mark the stuck run as `FAILED_TIMEOUT` and move it to the DLQ.

## 4. Resolution and Remediation

### Option 1: Move to DLQ (Safest)
If the run cannot be safely resumed, force it into the Dead Letter Queue.
```sql
UPDATE workflow_runs
SET status = 'DLQ', error_details = '{"reason": "Manually moved to DLQ due to stuck state", "stuck_step": "Step_XYZ"}'
WHERE id = '<run_id>';
```

### Option 2: Manual Reprocessing (If Idempotent)
If the stuck step is known to be idempotent (e.g., reading data), and the root cause was a temporary worker crash:
1.  Move the run to the DLQ (Option 1).
2.  Use the Admin UI to "Reprocess" the run from the failed step. The orchestrator will pick it up as a new task.

### Option 3: Force Completion (Advanced)
If the business process was completed manually out-of-band (e.g., the email was sent via a different system), you can force the run to completion.
*Warning: This requires extreme caution as it bypasses downstream logic.*
```sql
UPDATE workflow_runs
SET status = 'COMPLETED', payload = '{"manual_override": true, "original_payload": ...}'
WHERE id = '<run_id>';
```

## 5. Post-Mortem Actions
After resolving a stuck run, file an engineering ticket to address the root cause:
*   Add missing timeouts to HTTP clients.
*   Fix infinite loop detection algorithms.
*   Ensure the stale task sweeper is running correctly.
