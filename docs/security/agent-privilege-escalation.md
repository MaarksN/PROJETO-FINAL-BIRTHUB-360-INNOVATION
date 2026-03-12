# Analysis: Agent Privilege Escalation in Workflows

This document analyzes the potential risk of an AI agent, executed as a step within a workflow (`AgentStep`), escalating its privileges beyond the intended scope of the workflow run.

## 1. Threat Definition
*Privilege Escalation* occurs if an agent gains access to data, APIs, or resources that are not explicitly authorized for the specific workflow instance it is executing within.
*   **Horizontal Escalation**: An agent accessing data belonging to a different tenant.
*   **Vertical Escalation**: An agent accessing administrative APIs (e.g., modifying workflow templates or billing settings) when it is only authorized to perform operational tasks (e.g., read a CRM record).

## 2. Attack Vectors
1.  **Prompt Injection (Confused Deputy)**: A malicious actor embeds instructions in the workflow payload (e.g., an inbound email trigger) that commands the agent to use its available tools to extract internal system data or modify records outside the workflow context.
2.  **Tool Over-Permissiveness**: A tool provided to the agent (e.g., `update_crm_record`) lacks fine-grained access control, allowing the agent to update *any* record, not just the one associated with the workflow payload.
3.  **Network SSRF**: An agent uses a generic `http_request` tool to query internal metadata services or adjacent pods on the internal network.

## 3. Mitigation Strategies (BirthHub360 Architecture)

### 3.1 Principle of Least Privilege (PoLP) per Step
*   **Dynamic Scoping**: An `AgentStep` does not execute with a static "Agent Identity". Instead, it executes with a dynamically generated **short-lived JWT** specific to the *current workflow run*.
*   **Token Claims**: This JWT contains claims that restrict access explicitly to:
    *   The specific Tenant ID.
    *   The specific Workflow ID.
    *   The specific subset of Tools defined in the `AgentStep` configuration.

### 3.2 Tool Execution Sandboxing
*   Tools (functions) are executed by the workflow worker, *not* by the LLM itself. The LLM only returns the intent to execute a tool.
*   The worker intercepts the tool execution request and validates the arguments against the workflow payload.
*   **Resource ID Binding**: If a workflow is processing "Lead ID 123", the worker can enforce that any tool calling a CRM update API is hardcoded to only accept `lead_id=123`.

### 3.3 Network Isolation
*   Agents do not have direct internet or intranet access. All external calls must go through predefined tools.
*   Generic HTTP request tools are heavily restricted (e.g., preventing access to `169.254.169.254`, `10.x.x.x`, `127.0.0.1`, `localhost`).

## 4. Conclusion
Can an agent escalate privileges beyond the workflow?
**In theory**: Yes, if tools are poorly designed and lack resource-level authorization.
**In practice (BirthHub360)**: No. The architecture prevents this by using dynamically scoped, short-lived execution tokens and strict, resource-bound tool implementations. An agent can only ever manipulate resources that the specific workflow run has been explicitly granted access to via its payload and configuration.
