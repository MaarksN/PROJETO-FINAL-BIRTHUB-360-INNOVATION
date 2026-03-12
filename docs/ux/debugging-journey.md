# User Journey: Debugging a Production Workflow Failure

This document maps out the intended User Experience (UX) for a tenant administrator attempting to diagnose and resolve a workflow failure in BirthHub360. The primary goal is to enable root cause identification in under 5 minutes, even for an operator lacking prior context on the specific workflow's design.

## 1. The Persona
*   **Role**: Support Operations / IT Admin
*   **Context**: They did not build the workflow. They received a Slack alert stating "Refund Workflow failed for Customer ABC." They have basic technical literacy (understands JSON, HTTP statuses).

## 2. The Journey (Target < 5 mins)

### Minute 0: Entry Point
1.  User clicks the direct link in the Slack alert.
2.  **UI State**: The user lands directly on the specific **Workflow Run Detail Page**.

### Minute 1: The High-Level Overview
1.  **Visual Graph**: A visual representation (DAG) of the workflow is displayed.
    *   Completed steps are green.
    *   Pending steps are grey.
    *   The failed step is pulsing **red**.
2.  **Summary Banner**: A human-readable summary is prominently displayed at the top:
    > "Run failed at Step 3 (`Process_Refund_Stripe`). Error: 400 Bad Request. Card expired."

### Minute 2-3: Inspecting the Point of Failure
1.  User clicks on the red node (`Process_Refund_Stripe`) in the graph.
2.  A side-panel opens showing the exact state of that step at the moment it crashed.
3.  **The "Before" State (Inputs)**:
    *   The UI shows the exact variables passed *into* the step.
    *   The user sees `amount: 5000` and `customer_id: cus_XYZ`.
4.  **The "Error" State (Outputs)**:
    *   The UI displays the raw response from the external provider (Stripe in this case).
    *   The JSON response clearly indicates `"code": "expired_card"`.

### Minute 4: Tracing the Origin (Backward Trace)
1.  The user asks: "Where did `cus_XYZ` come from?"
2.  The UI provides a "Data Lineage" feature. The user hovers over the `customer_id` variable in the input panel.
3.  The UI highlights the originating step in the graph (e.g., Step 1: `Zendesk_Webhook_Trigger`).
4.  The user now knows the root cause: Zendesk sent a refund request for a customer whose card is no longer valid in Stripe.

### Minute 5: Resolution Action
1.  The user selects an action from the "Resolution" dropdown:
    *   *Option A*: Manually correct the variable (e.g., input a new card ID) and click **"Retry from this step"**.
    *   *Option B*: Mark the workflow as **"Force Complete"** (because they handled the refund manually in Stripe's dashboard).
    *   *Option C*: Click **"Acknowledge & Route to DLQ"** to leave it for the engineering team.

## 3. Usability Assessment (No-Context Test)
To ensure this journey works for users without context, the UI design must adhere to these principles:
*   **No "Code Diving" Required**: The user must never need to look at the underlying workflow JSON definition or the application's Datadog logs. All necessary I/O is surfaced in the UI.
*   **Plain English Errors**: System errors (e.g., "Worker Timeout") must be translated into actionable explanations ("The step took longer than the 30-second limit and was aborted").
*   **Visual Locality**: The error, the inputs that caused the error, and the button to retry the step must all exist on the same screen without requiring navigation to different tabs.