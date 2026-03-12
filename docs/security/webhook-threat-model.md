# Threat Model: Inbound Webhooks

This document outlines the threat model for the BirthHub360 Webhook Receiver service, which acts as the primary ingress point for external systems to trigger workflows. Given its exposure to the public internet, it represents a high-priority attack surface.

## 1. System Context
The `webhook-receiver` is a lightweight API (e.g., FastAPI/Node.js) that listens on a public endpoint (e.g., `https://api.birthhub360.com/webhooks/{tenant_id}/{webhook_id}`). Its responsibilities are:
1.  Receive HTTP POST requests.
2.  Validate the payload and signature (if applicable).
3.  Enqueue a message to the internal orchestrator bus to trigger a workflow.

## 2. Identified Threats and Mitigations

### 2.1 Replay Attacks
*   **Threat**: An attacker intercepts a legitimate, valid webhook request (e.g., a "Payment Processed" event from Stripe) and repeatedly resends it to the BirthHub360 endpoint.
*   **Impact**: Multiple workflows are triggered erroneously, potentially leading to duplicate resource provisioning, redundant emails, or skewed analytics.
*   **Mitigation**:
    *   **Idempotency Keys**: Require providers to include a unique event ID in the header or payload. The receiver must maintain a high-speed cache (e.g., Redis) of recently processed event IDs and drop duplicates.
    *   **Timestamp Validation**: If the payload includes a timestamp, reject payloads older than a configured tolerance (e.g., 5 minutes), preventing long-term replay.

### 2.2 Server-Side Request Forgery (SSRF) via Callback URLs
*   **Threat**: Some poorly designed webhooks (or workflows triggered by them) might parse a URL from the incoming payload and attempt to make a subsequent outbound HTTP request to that URL (a callback). An attacker crafts a payload containing an internal URL (e.g., `http://169.254.169.254/latest/meta-data/` or `http://localhost:5432`).
*   **Impact**: The attacker forces the BirthHub360 infrastructure to scan internal networks, read cloud provider metadata, or access internal databases.
*   **Mitigation**:
    *   **Egress Filtering**: The `webhook-receiver` container must have strict egress network policies preventing it from accessing internal VPC subnets or localhost.
    *   **URL Validation**: Any URL parsed from an external payload intended for outbound requests must be validated against a strict allowlist or blocklist before the request is initiated.

### 2.3 Spoofing (Forged Requests)
*   **Threat**: An attacker discovers the URL of a tenant's webhook and crafts synthetic HTTP POST requests, pretending to be a trusted provider (e.g., pretending to be GitHub or Zendesk).
*   **Impact**: Workflows are triggered with malicious or garbage data, corrupting the tenant's system state or triggering unwarranted agent actions.
*   **Mitigation**:
    *   **Cryptographic Signatures (HMAC)**: Require providers to sign payloads using a shared secret. The receiver must verify the signature (e.g., `X-Hub-Signature`) before processing.
    *   **IP Allowlists**: For providers that publish their egress IP ranges, the receiver should reject requests originating from unauthorized IPs.
    *   **Secret Tokens**: At a minimum, URLs should contain a high-entropy, unpredictable secret token in the path (e.g., `/webhooks/hook_abc123...`).

### 2.4 Denial of Service (DoS) and Resource Exhaustion
*   **Threat**: An attacker floods the webhook endpoint with millions of requests.
*   **Impact**: The receiver process crashes, dropping legitimate events; or it successfully enqueues the malicious events, overwhelming the internal workflow orchestrator and workers.
*   **Mitigation**:
    *   **API Gateway Rate Limiting**: Implement strict rate limiting per tenant/webhook ID at the API Gateway layer (e.g., max 100 requests per second).
    *   **Payload Size Limits**: Enforce a hard maximum request body size (e.g., 1MB) to prevent memory exhaustion attacks.
    *   **Asynchronous Queuing**: The receiver must do minimal work (validate -> enqueue). Heavy processing must be offloaded to the async orchestrator to ensure the receiver remains responsive.

## 3. Residual Risk
Even with mitigations, "Zero-Day" exploits in the parsing libraries (e.g., a vulnerability in the JSON parser) represent a residual risk. Regular dependency scanning and WAF (Web Application Firewall) deployment are required.
