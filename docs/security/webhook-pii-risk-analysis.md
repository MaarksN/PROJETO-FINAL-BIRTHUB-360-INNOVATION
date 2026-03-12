# Risk Analysis: Webhooks Receiving PII from Third Parties

## 1. Context
BirthHub360 workflows are frequently triggered by external systems via webhooks (e.g., a lead form submission on Hubspot, a new user registration in an app). These inbound payloads often contain Personally Identifiable Information (PII) such as names, email addresses, phone numbers, or physical addresses belonging to the *tenant's* customers (third-party PII).

## 2. Threat Definition
Handling third-party PII introduces significant regulatory (GDPR, LGPD, CCPA) and security risks:
*   **Data Leakage in Logs**: PII might be accidentally written to centralized application logs (e.g., Datadog) when logging the raw HTTP request body for debugging.
*   **Data Leakage in the DLQ**: Failed workflows are moved to the Dead Letter Queue (DLQ). If the payload contains PII, the DLQ becomes a high-value target for attackers and broadens the scope of data access to any admin who can view the DLQ.
*   **Agent Data Exfiltration**: An `AgentStep` within the workflow might receive the PII and, through a hallucination or prompt injection, send that PII to an unauthorized external API or include it in an unencrypted email.
*   **Prolonged Retention**: Stateful workflow checkpoints (ADR-022) store the payload in the database. Without explicit lifecycle management, PII might be retained indefinitely in workflow history long after the business process has completed.

## 3. Mitigation Strategies in BirthHub360

### 3.1 Strict Data Minimization at Ingress
*   **Policy**: The `webhook-receiver` service should not log the raw HTTP request body to centralized logging systems. Only metadata (headers, event type, status code) should be logged.
*   **Implementation**: Use structured logging libraries configured to automatically redact or drop fields named `email`, `phone`, `password`, etc., before shipping logs.

### 3.2 Transient Payload Storage (Checkpointing)
*   **Policy**: PII stored within workflow state checkpoints must be treated as highly sensitive data.
*   **Implementation**:
    *   The `workflow_runs` table payload column is encrypted at rest using AWS KMS (RDS encryption).
    *   **Auto-Pruning**: Implement a hard retention policy for completed workflows. Once a run is `COMPLETED`, its payload is scrubbed or heavily masked after 7 days, retaining only execution metadata for billing and auditing.

### 3.3 DLQ Access Control
*   **Policy**: The Dead Letter Queue contains the full payload necessary for reprocessing, including potential PII.
*   **Implementation**: Access to view DLQ payloads in the UI must be restricted by strict Role-Based Access Control (RBAC). Only users with specific administrative privileges (e.g., `Tenant_Admin`, `Support_Escalation`) can view raw DLQ payloads.

### 3.4 Agent Output Sanitization
*   **Policy**: AI Agents should not propagate PII unnecessarily.
*   **Implementation**:
    *   When designing workflows, designers are encouraged to extract a unique ID (e.g., `customer_id`) from the webhook and pass *only* the ID to the agent, requiring the agent to use a secure internal tool to fetch PII just-in-time only if absolutely necessary for reasoning.
    *   Prompt guidelines for the BirthHub360 Marketplace mandate that agent outputs should reference IDs rather than raw PII whenever possible.

## 4. Tenant Responsibility
While BirthHub360 provides the secure infrastructure, the tenant is ultimately the Data Controller.
*   Tenants must ensure that the webhook payloads they configure their external systems to send are minimized (e.g., configuring Stripe to send only the `invoice_id` rather than the full customer object containing the address, if the address isn't needed by the workflow).
*   Tenants are responsible for honoring "Right to be Forgotten" (RTBF) requests by utilizing the BirthHub360 API to delete specific workflow run histories associated with a user.
