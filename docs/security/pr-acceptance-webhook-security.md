# PR Acceptance Criteria: Webhook Security

This document details the security checks that must be passed for any Pull Request (PR) that adds, modifies, or deprecates functionality within the `webhook-receiver` application or the outbound webhook capabilities of the workflow engine.

The JULES agent and human security reviewers will enforce these criteria to prevent the introduction of SSRF, injection, or DoS vulnerabilities.

## 1. Inbound Webhooks (`webhook-receiver`)

Any PR modifying how we receive data from the public internet must satisfy:

*   [ ] **No Raw Payload Logging**: Ensure that `logger.info()` or similar calls do NOT include the raw HTTP `request.body`. Only log headers (excluding authorization/secrets), event IDs, and HTTP status codes.
*   [ ] **Strict Content-Type Validation**: The endpoint must explicitly reject requests that do not match the expected `Content-Type` (e.g., must enforce `application/json` to prevent parsing exploits via XML or multipart forms).
*   [ ] **Signature Verification Mandatory**: If adding support for a new native provider (e.g., Shopify), the PR *must* include the cryptographic verification logic (HMAC, RSA, etc.) specific to that provider. It cannot be merged as "unverified".
*   [ ] **Constant-Time Comparison**: All signature or token comparisons must use cryptographic constant-time string comparison functions (e.g., `hmac.compare_digest` in Python, `crypto.timingSafeEqual` in Node.js) to prevent timing attacks.
*   [ ] **Payload Size Limit**: Any new parsing logic must occur *after* or *behind* the middleware that enforces the maximum payload size (e.g., 1MB limit).

## 2. Outbound Webhooks (`ActionStep: Webhook`)

Any PR modifying how the workflow engine sends data to external systems must satisfy:

*   [ ] **SSRF Protection (Egress)**: If the PR modifies the HTTP client used to send webhooks, it must be verified that the client respects the global egress proxy or IP blocklist. The client must be incapable of resolving or routing to internal IP addresses (e.g., `10.0.0.0/8`, `169.254.169.254`, `localhost`).
*   [ ] **Timeout Enforcement**: The HTTP client configuration *must* possess a hard timeout (default maximum 30 seconds). Indefinite hanging connections must be impossible.
*   [ ] **Header Sanitization**: The system must not leak internal BirthHub360 routing headers or JWTs in the outbound request. Only headers explicitly defined in the `ActionStep` configuration should be sent.
*   [ ] **Redirect Handling**: The HTTP client must be configured to either **NOT** follow redirects (`301`, `302`), or to follow them strictly with SSRF checks applied to the *target* of the redirect, preventing an attacker from pointing an external URL to an internal resource.

## 3. General Reliability
*   [ ] **Idempotency Support**: Changes to the event queuing mechanism must maintain at-least-once delivery guarantees without risking infinite duplicate loops.
*   [ ] **Test Coverage**: The PR must include unit/integration tests that intentionally feed malformed payloads, invalid signatures, and oversized bodies to the receiver to assert that the system rejects them gracefully (returns `4xx`, does not crash).
