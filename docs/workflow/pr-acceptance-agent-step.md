# PR Acceptance Criteria: AgentStep Integrations

This document outlines the mandatory checks performed by the JULES agent (and human reviewers) for any Pull Request (PR) that introduces or modifies an `AgentStep` within the BirthHub360 workflow engine. These criteria ensure that AI agents operate securely, predictably, and transparently within the stateful orchestrator.

## 1. Security and Scoping (CRITICAL)
Every PR adding an agent to a workflow must mathematically guarantee that the agent cannot exceed its authorized context.

*   [ ] **JWT Context Binding**: The code must demonstrate that the agent's execution environment is initialized with a short-lived, workflow-run-specific JWT (as per the Principle of Least Privilege).
*   [ ] **Tool Scoping**: All tools provided to the agent must explicitly accept and enforce the `run_id` or `tenant_id` from the secure context, rejecting any parameters that attempt to manipulate resources outside that boundary.
*   [ ] **No Global State**: The agent implementation must not rely on or modify any global application state. All inputs and outputs must flow exclusively through the workflow payload.

## 2. Resource Constraints and Timeouts
Agents are non-deterministic; the engine must constrain them to prevent runaway costs or hung processes.

*   [ ] **Iteration Limits (LangGraph)**: The `StateGraph` configuration for the agent *must* define a hard `recursion_limit` (e.g., max 15 steps) to prevent infinite loops during reasoning or tool use.
*   [ ] **Step Timeout**: The `AgentStep` definition must include a configurable `timeout` property (e.g., 5 minutes) that correctly hooks into the worker's context cancellation mechanism.
*   [ ] **Token Limits**: The underlying LLM call configuration must specify a `max_tokens` limit to bound the output size and prevent unbounded billing costs.

## 3. Observability and State Persistence
The stateful engine (ADR-022) requires complete visibility into the agent's internal reasoning.

*   [ ] **Intermediate State Checkpointing**: The agent's progress (e.g., tool calls made, intermediate LLM responses) must be serialized and persisted to the workflow database at each node transition within the LangGraph.
*   [ ] **Structured Output Guarantee**: The agent's final output must conform to a strongly typed Pydantic schema defined in the `AgentStep` configuration, ensuring predictable downstream processing.
*   [ ] **Audit Logging**: Every prompt sent to the LLM and its raw response must be logged (with PII redacted) for debugging and compliance (e.g., satisfying irrefutability requirements).

## 4. Error Handling and DLQ Integration
Agent execution can fail due to provider outages, malformed prompts, or internal timeouts.

*   [ ] **Graceful Degradation**: The `AgentStep` must catch exceptions (e.g., `openai.RateLimitError`, `TimeoutError`) and map them to standard BirthHub360 workflow error codes.
*   [ ] **DLQ Readiness**: The agent's state at the moment of failure must be fully serializable so the orchestrator can cleanly move the run to the Dead Letter Queue (DLQ) for manual inspection or retry.
*   [ ] **Retry Idempotency**: If the step is configured for automatic retries, the PR must prove that re-running the agent is safe and will not cause unintended side effects (e.g., duplicating tool actions).

## 5. Cost Estimation (Billing)
*   [ ] **UE Telemetry**: The code must correctly aggregate the token usage (prompt and completion) reported by the LLM provider and emit an event to the billing service to decrement the tenant's Unidades de Execução (UE) balance.
*   [ ] **Estimation Data**: The PR must include baseline metrics (average tokens, expected tool calls) required by the UI to generate a pre-run cost estimate for the new agent.
