# Agent Step vs Global Workflow Timeouts: Precedence

This document outlines the behavior and priority rules when a timeout occurs during a workflow run, specifically addressing conflicts between an `AgentStep` timeout and the overall global workflow timeout.

## 1. Timeout Types

### 1.1 Global Workflow Timeout
*   **Definition**: The maximum permitted execution duration for an entire workflow run, from start to finish.
*   **Purpose**: Prevents resources from being locked indefinitely by stuck or abandoned workflows.
*   **Enforcement**: A background job (e.g., Stale Task Sweeper) monitors runs and transitions them to `FAILED_TIMEOUT_GLOBAL` if the total duration exceeds the global limit.

### 1.2 Step-Level Timeout (AgentStep)
*   **Definition**: The maximum permitted execution duration for a specific `AgentStep`.
*   **Purpose**: Protects the worker node from a hanging LLM API call, an infinite looping agent internal to the LangGraph execution, or an external tool taking too long.
*   **Enforcement**: The worker thread executing the step enforces this timeout via a local timer or a `context.WithTimeout` pattern.

## 2. Precedence and Behavior

**Rule 1: The earliest timeout ALWAYS wins.**

### Scenario A: Step Timeout occurs first
*   **Context**: Global Timeout = 24 hours. `AgentStep` Timeout = 5 minutes.
*   **Event**: The agent execution hangs for 5 minutes.
*   **Outcome**: The `AgentStep` timeout is triggered. The step is marked `FAILED_TIMEOUT_STEP`. The workflow *does not* necessarily fail globally; it proceeds to the `OnFailure` branch if configured. If not configured, the workflow run is marked `FAILED`.

### Scenario B: Global Timeout occurs first
*   **Context**: Global Timeout = 1 hour. `WaitStep` = 55 minutes. Subsequent `AgentStep` = 10 minutes.
*   **Event**: The workflow waits 55 minutes, then starts the `AgentStep`. Five minutes into the `AgentStep` execution, the total workflow duration hits 1 hour.
*   **Outcome**: The Global Timeout is triggered. The active `AgentStep` is forcefully interrupted (e.g., via SIGINT or context cancellation) and immediately terminated. The entire workflow run is marked `FAILED_TIMEOUT_GLOBAL`. The step's specific `OnFailure` branch is **not** executed, as the global constraint overrides all local logic.

## 3. Configuration Best Practices
*   **Validation**: The workflow designer UI must prevent users from configuring an `AgentStep` timeout that is greater than the Global Workflow Timeout. A warning or error must be displayed.
*   **Agent Limits**: Agent executions (LangGraph state graphs) should be primarily limited by *maximum iterations/steps* rather than just time. Relying solely on time can lead to non-deterministic behavior depending on external API latency (e.g., OpenAI API slowness).
*   **Default Values**:
    *   Global Workflow Timeout (Default): 7 Days.
    *   AgentStep Timeout (Default): 5 Minutes.
