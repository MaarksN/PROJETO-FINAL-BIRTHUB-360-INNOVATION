# Supported Inbound Webhook Providers

BirthHub360 provides first-class support for receiving webhooks from several major SaaS providers. For these supported providers, BirthHub360 automatically handles cryptographic signature verification, payload extraction, and standardized event mapping, making it easier to build reliable workflow triggers.

## 1. Stripe
Used for triggering workflows based on subscription changes, failed payments, or new customer creation.
*   **Security Method**: HMAC SHA-256 signature verification via the `Stripe-Signature` header.
*   **Configuration**:
    1.  In the Stripe Dashboard, create a new Webhook Endpoint pointing to your BirthHub360 Webhook URL.
    2.  Select the desired events (e.g., `invoice.payment_succeeded`).
    3.  Copy the "Signing Secret" (starts with `whsec_`).
    4.  In BirthHub360, configure the Webhook Trigger, select "Stripe" as the provider, and paste the Signing Secret.
*   **Idempotency**: Handled automatically using the Stripe `id` field from the event payload.

## 2. GitHub
Used for triggering workflows based on PR creation, issue comments, or release tags (useful for DevOps automations).
*   **Security Method**: HMAC SHA-256 signature verification via the `X-Hub-Signature-256` header.
*   **Configuration**:
    1.  In the GitHub Repository Settings -> Webhooks, add your BirthHub360 Webhook URL.
    2.  Set Content type to `application/json`.
    3.  Generate a random, strong secret string and enter it in the "Secret" field.
    4.  In BirthHub360, configure the Webhook Trigger, select "GitHub" as the provider, and paste the identical secret string.
*   **Idempotency**: Handled via the `X-GitHub-Delivery` GUID header.

## 3. Zendesk
Used for triggering support-oriented workflows, such as agent-assisted triage on new high-priority tickets.
*   **Security Method**: Basic Authentication OR custom secret token in the URL path. (Zendesk webhook signing is supported via a custom verification step, but not natively in the generic receiver yet).
*   **Configuration**:
    1.  In BirthHub360, generate a Webhook URL with a secure, embedded token (e.g., `.../wh/zd_123abc`).
    2.  In Zendesk Admin Center, create a new Webhook, paste the URL, and select POST/JSON.
    3.  Configure Zendesk Triggers or Automations to fire the webhook based on ticket conditions.

## 4. Hubspot
Used for triggering sales and marketing workflows based on lead scoring, lifecycle stage changes, or form submissions.
*   **Security Method**: HMAC SHA-256 signature verification via the `X-HubSpot-Signature-v3` header.
*   **Configuration**:
    1.  Requires a private HubSpot app. Obtain the App Secret from the HubSpot developer portal.
    2.  In BirthHub360, select "HubSpot" as the provider and provide the App Secret.
    3.  Configure Webhook actions within HubSpot Workflows.

## 5. Generic (Custom JSON)
For systems not explicitly listed above, BirthHub360 supports a "Generic" provider.
*   **Security Method**:
    *   **Option A**: URL Path Secret (e.g., append `?token=YOUR_SECRET_STRING` to the URL).
    *   **Option B**: Basic Auth. Provide a username/password in BirthHub360, which must be sent by the provider in the `Authorization` header.
*   **Requirements**: The incoming request MUST have `Content-Type: application/json`.
*   **Limitations**: No automatic signature verification; users must implement custom signature checking within the workflow logic (`ConditionStep`) if required.
