# End-to-End Example: Agent Analysis → Agent Report → Human Approval

This document outlines a complete, documented example of a complex workflow in BirthHub360 that orchestrates an AI agent to analyze data, generate a report, and subsequently require a human approval before proceeding with a critical action. This scenario demonstrates the power of combining intelligent agents with human-in-the-loop oversight.

## 1. Workflow Objective: High-Risk Refund Request

A customer submits a refund request for an Enterprise subscription plan. This workflow automatically analyzes the customer's usage, determines the risk of churn, summarizes the findings in a report, and routes it to a Sales Manager for a final decision.

## 2. Trigger Event
*   **Source**: Inbound Webhook (e.g., from Zendesk or a custom portal).
*   **Payload structure**:
```json
{
  "customer_id": "cust_9876",
  "reason": "Service not meeting expectations",
  "amount_requested": 5000.00
}
```

## 3. Workflow Steps Definition

### 3.1 Step 1: Agent Analysis (`AgentStep`)
*   **Agent Assigned**: `Churn Analyst` (Account Manager Pack)
*   **Inputs**: The webhook payload (`$.trigger.customer_id`, `$.trigger.reason`, `$.trigger.amount_requested`).
*   **Tools Provided to Agent**:
    1.  `get_customer_usage(customer_id)`: Retrieves API usage and login frequency over the last 90 days.
    2.  `get_support_tickets(customer_id)`: Fetches recent Zendesk tickets and their resolution status.
    3.  `calculate_churn_risk_score(...)`: An internal heuristic model.
*   **Expected Output Variable**: `$.steps.agent_analysis.output` (a structured JSON containing the risk score, a summary string, and a recommendation boolean).

### 3.2 Step 2: Generate Report (`ActionStep` - Internal API)
*   **Action**: Generate a Markdown report string.
*   **Inputs**: `$.steps.agent_analysis.output`
*   **Logic**: The engine takes the JSON output from the agent and formats it into a readable markdown summary, appending it to the payload as `$.payload.formatted_report`.
*   **Purpose**: To prepare the data for the human approver.

### 3.3 Step 3: Human Approval (`ApprovalStep`)
*   **Policy**: "Sales Manager Approval Required" (Requires a user with the `ROLE_SALES_MANAGER` assigned).
*   **Timeout**: 48 hours.
*   **Context Provided to Approver UI**:
    *   **Title**: High-Risk Refund Request for Customer: `{{$.trigger.customer_id}}`
    *   **Description**: `{{$.payload.formatted_report}}`
    *   **Agent Recommendation**: `{{$.steps.agent_analysis.output.recommendation}}`
*   **Possible Outcomes**:
    *   `APPROVED`: The workflow proceeds to Step 4 (Process Refund).
    *   `REJECTED`: The workflow proceeds to Step 5 (Send Rejection Email).
    *   `TIMEOUT`: The workflow proceeds to Step 6 (Escalate to Director).

### 3.4 Step 4: Process Refund (`ActionStep` - External Webhook)
*   **Condition**: Execute only if `$.steps.approval.outcome == 'APPROVED'`
*   **Action**: Call Stripe API to issue the refund for `{{$.trigger.amount_requested}}`.

### 3.5 Step 5: Send Rejection Email (`ActionStep` - Internal API)
*   **Condition**: Execute only if `$.steps.approval.outcome == 'REJECTED'`
*   **Action**: Send a template email to the customer explaining the policy.

### 3.6 Step 6: Escalate (`ActionStep` - Notification)
*   **Condition**: Execute only if `$.steps.approval.outcome == 'TIMEOUT'`
*   **Action**: Send a Slack alert to the `#urgent-escalations` channel.

## 4. Execution Flow and State Transitions (Engine View)

1.  **Triggered**: Webhook received. Workflow run instantiated in the database. State = `RUNNING`.
2.  **Step 1 Starts**: Orchestrator invokes the `Churn Analyst` agent. State = `RUNNING (Agent Analysis)`.
3.  **Step 1 Completes**: Agent returns a JSON summary. Orchestrator checkpoints the payload to DB.
4.  **Step 2 Starts/Completes**: Synchronous formatting step. Payload updated. Checkpointed.
5.  **Step 3 Starts**: The orchestrator sends a notification to the Sales Manager and immediately transitions the run state to `PAUSED (Awaiting Approval)`. The worker thread is released.
6.  **Pause**: The run sits idle in the database for 12 hours.
7.  **Human Action**: The Sales Manager clicks "Approve" in the BirthHub360 UI.
8.  **Step 3 Completes**: The UI API call wakes up the orchestrator, appending the `APPROVED` outcome to the payload. State = `RUNNING`.
9.  **Step 4 Starts**: The condition (`APPROVED`) is met. Orchestrator calls Stripe.
10. **Workflow Complete**: Stripe call succeeds. Run state transitioned to `COMPLETED`.

## 5. Security and Governance Notes
*   **Immutable Context**: The agent's output is immutable once the `ApprovalStep` begins. The human approver sees exactly what the agent analyzed, without interference.
*   **Audit Trail**: The orchestrator database records:
    1.  The exact prompt sent to the agent.
    2.  The raw output from the agent.
    3.  The ID and timestamp of the human user who approved the request, satisfying compliance requirements (irrefutability).
