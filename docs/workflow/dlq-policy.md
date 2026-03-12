# Dead Letter Queue (DLQ) Policy for Workflow Runs

This document defines the policy for managing the Dead Letter Queue (DLQ) for workflow runs in BirthHub360. A workflow run is moved to the DLQ when it repeatedly fails to process a step despite automatic retries or encounters a fatal, unrecoverable error.

## 1. Definition and Purpose
The DLQ is a specialized storage and management mechanism for workflow runs that have entered a `FAILED` or `STUCK` state and cannot be advanced automatically by the orchestrator. Its primary purpose is to prevent data loss, allow for manual inspection, and provide a path for targeted reprocessing once the root cause (e.g., a broken API, malformed data, or engine bug) is resolved.

## 2. DLQ Entry Conditions
A workflow run is moved to the DLQ under the following conditions:
*   **Max Retries Exhausted**: An `ActionStep` or `WebhookStep` has failed repeatedly and reached its configured `max_retries` limit (default: 3).
*   **Fatal Errors**: The engine encounters a fundamental error parsing the workflow definition (e.g., a missing required field not caught by pre-flight validation).
*   **Timeouts**: A step (e.g., an `ApprovalStep` or `AgentStep`) exceeds its defined timeout duration and no `OnTimeout` fallback path is configured.
*   **Complexity Limit Exceeded**: A `ConditionStep` loop exceeds the maximum allowed iterations for the tenant's plan (e.g., infinite loop detection).
*   **System Crashes (OOM)**: A worker node crashes while processing a step, and the orchestrator detects the orphaned task upon restart, moving it to the DLQ for safety.

## 3. Retention Policy
*   **Retention Period**: Workflows in the DLQ are retained for a maximum of **30 days** from the date they entered the queue.
*   **Expiration**: After 30 days, the run is permanently marked as `EXPIRED_IN_DLQ` and is no longer available for reprocessing. The run's metadata and payload are archived for auditing purposes according to standard data retention policies, but it cannot be restarted.

## 4. Reprocessing (Replay) Rules
Administrators and authorized users can manually reprocess runs from the DLQ.
*   **Resume Point**: Reprocessing attempts to resume the workflow from the **exact step that failed**. It does *not* restart the workflow from the beginning.
*   **Payload Modification**: Before reprocessing, a user can manually edit the workflow payload associated with the failed step (e.g., correcting a malformed email address that caused an API to reject the request).
*   **Idempotency Warning**: The UI must explicitly warn the user that reprocessing a step may not be idempotent if the step partially completed before failing (e.g., it charged a credit card but failed to update the database).
*   **Bulk Actions**: The UI supports bulk selection and reprocessing of multiple runs in the DLQ simultaneously.

## 5. Alerts and Notifications
*   **Tenant Notification**: When a run enters the DLQ, an event `workflow.run.dlq_entered` is emitted. Tenants can subscribe to this event via webhooks or configure email alerts.
*   **Threshold Alerts**: System administrators receive critical alerts if the global DLQ size exceeds predefined thresholds (e.g., > 1000 items in 1 hour), indicating a systemic failure or widespread API outage.
*   **Summary Reports**: A daily summary email is sent to tenant administrators listing the number of new runs added to their DLQ in the past 24 hours.

## 6. Max Retries Default Configuration
*   **Default**: 3 attempts.
*   **Backoff Strategy**: Exponential backoff (e.g., wait 5s, 15s, 45s).
*   **Customization**: Workflow designers can override the default `max_retries` per step, but a hard global limit (e.g., max 10 retries) is enforced to prevent resource starvation.
