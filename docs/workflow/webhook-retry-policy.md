# Webhook Delivery & Retry Policy

This document outlines the policy and mechanisms for delivering outbound webhooks from BirthHub360 (e.g., a workflow `ActionStep` that pushes data to an external customer system) and how the system handles delivery failures.

## 1. The Delivery Mechanism
When a workflow executes an outbound webhook step:
1.  The orchestrator worker formats the HTTP request (URL, Headers, Payload).
2.  The worker attempts a synchronous HTTP POST to the destination URL.
3.  The success or failure of the delivery is determined by the HTTP status code returned by the destination server within the configured timeout window (default: 30 seconds).

## 2. Success Criteria
A webhook delivery is considered **successful** if the destination server returns an HTTP status code in the `2xx` range (e.g., 200 OK, 201 Created, 202 Accepted, 204 No Content).
If successful, the workflow step is marked `COMPLETED` and the execution continues.

## 3. Failure Criteria and Retry Logic
A delivery is considered **failed** if:
*   The destination server returns a `4xx` (Client Error) or `5xx` (Server Error) status code.
*   The connection times out before a response is received.
*   A network error occurs (e.g., DNS resolution failure, connection refused).

### 3.1 The Retry Strategy (Exponential Backoff)
BirthHub360 implements an automatic retry mechanism for failed webhook deliveries to handle transient network issues or temporary downtime at the destination.

*   **Maximum Attempts**: The system will attempt delivery a maximum of **3 times** (1 initial attempt + 2 retries).
*   **Backoff Schedule**: Retries are scheduled using an exponential backoff formula with jitter to prevent thundering herd problems.
    *   *Attempt 1 (Initial)*: Immediate execution.
    *   *Attempt 2 (Retry 1)*: Scheduled ~5 seconds after the first failure.
    *   *Attempt 3 (Retry 2)*: Scheduled ~15 seconds after the second failure.

### 3.2 Non-Retryable Errors
To prevent wasting resources on guaranteed failures, certain HTTP status codes are deemed **non-retryable**. If received, the system immediately marks the step as failed without attempting further retries:
*   `400 Bad Request`: The payload is malformed.
*   `401 Unauthorized`: Invalid credentials.
*   `403 Forbidden`: Insufficient permissions.
*   `404 Not Found`: The endpoint does not exist.
*   `410 Gone`: The resource was deleted.
*   `413 Payload Too Large`: The request body exceeds the destination's limits.

*(Note: `429 Too Many Requests` is considered retryable, as it implies a temporary rate limit).*

## 4. Dead Letter Queue (DLQ) Routing
If all 3 delivery attempts fail (or a non-retryable error is encountered immediately):
1.  The specific workflow step is marked `FAILED_WEBHOOK_DELIVERY`.
2.  If the workflow does not have an explicit `OnFailure` branch configured to handle this error gracefully, the entire Workflow Run is marked `FAILED`.
3.  The workflow run is subsequently moved to the **Dead Letter Queue (DLQ)**.
4.  The payload, the destination URL, and the final HTTP error response (status code and body) are preserved in the DLQ entry to allow administrators to diagnose the issue and manually reprocess the step once the external system is restored.
