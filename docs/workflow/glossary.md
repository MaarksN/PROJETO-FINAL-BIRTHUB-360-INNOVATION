# Workflow Glossary

This document serves as the single source of truth for workflow terminology across the BirthHub360 UI, codebase, and documentation.

*   **Workflow Template**: The definition of a workflow, containing the schema, steps, conditions, and triggers. It is the blueprint from which instances are created.
*   **Workflow Run (or Execution)**: A single instance of a Workflow Template that has been triggered and is actively executing or has completed.
*   **Step**: A single unit of work within a workflow. Types include Action, Condition, Wait, Approval, and Agent.
*   **Trigger**: The event that initiates a Workflow Run (e.g., "On Lead Created", "Webhook Received", "Scheduled Time").
*   **Orchestrator**: The backend component responsible for managing the state transitions of a Workflow Run, determining which Step to execute next.
*   **Worker (or Engine Node)**: The process or container responsible for executing the actual logic of a Step (e.g., making an HTTP request).
*   **Payload (or Context Variables)**: The data passed into a Workflow Run from the Trigger, and augmented by the outputs of subsequent Steps.
*   **Dead Letter Queue (DLQ)**: A storage mechanism for Workflow Runs that have failed repeatedly and cannot be processed further, awaiting manual intervention.
*   **Approval Policy**: The rules defining who can approve a specific ApprovalStep and under what conditions (e.g., requires manager role, expires in 24 hours).
*   **Tenant (or Subscription)**: The customer account under which workflows are defined and executed. Resources are isolated per tenant.
*   **Stateful Engine**: A workflow engine that persists the state of a run to a database at every step, allowing it to pause, resume, and survive system restarts.
