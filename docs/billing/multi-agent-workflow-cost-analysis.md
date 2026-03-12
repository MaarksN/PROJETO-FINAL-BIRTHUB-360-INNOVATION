# Multi-Agent Workflow Cost Analysis & Estimation

## 1. The Cost Challenge
Workflows that incorporate multiple AI agents (`AgentSteps`) present a unique billing challenge in BirthHub360. Unlike deterministic steps (e.g., sending an email or making a static API call), agent steps exhibit highly variable resource consumption.
*   **Token Variability**: An agent's response length and the number of tools it decides to invoke dictate the underlying LLM token usage (prompt and completion tokens).
*   **Execution Time**: Agents that execute multiple iterations in a LangGraph state graph consume significantly more worker CPU time and memory than simple actions.
*   **Chained Volatility**: In a multi-agent workflow (e.g., Agent A's output feeds into Agent B's prompt), the token usage of Agent B is entirely dependent on the unpredictable output length of Agent A.

## 2. Cost Components
The total cost of executing a workflow run containing $N$ agent steps is defined as:

$$ C_{run} = \sum_{i=1}^{N} (C_{LLM, i} + C_{compute, i} + C_{tools, i}) $$

Where:
*   $C_{LLM, i}$: Cost of LLM tokens (e.g., OpenAI API charges per 1K tokens) for agent step $i$. This is the primary driver of volatility.
*   $C_{compute, i}$: The BirthHub360 platform markup for the compute time (seconds the worker thread is occupied) spent executing the agent's graph.
*   $C_{tools, i}$: The cost of invoking premium or metered tools provided to the agent (e.g., a third-party data enrichment API).

## 3. Pre-Run Cost Estimation (The Estimation Heuristic)
Because exact token usage is unknowable *a priori*, the workflow builder UI must provide users with an estimated "Cost per Run" during design time.

### 3.1 The Estimation Model
The estimation is based on historical execution profiles of similar agents and a configurable "Complexity Multiplier".

**Estimated Cost ($E$) per Agent Step:**
$E = (P_{base} \times M_{provider}) + (T_{avg} \times M_{tools}) + (I_{avg} \times M_{compute})$

*   $P_{base}$: Base prompt size (number of tokens in the static agent persona and instructions).
*   $M_{provider}$: Multiplier based on the selected LLM provider (e.g., GPT-4 is historically ~10x more expensive than GPT-3.5).
*   $T_{avg}$: Average number of tool invocations for this specific agent type (derived from platform-wide telemetry).
*   $M_{tools}$: Average cost per tool invocation.
*   $I_{avg}$: Average number of iterations (graph steps) for this agent.
*   $M_{compute}$: Fixed platform markup per iteration.

### 3.2 Displaying the Estimate
The UI presents this as a **Range** (e.g., "Estimated cost per run: 0.5 to 1.2 UE").
*   **Low End**: Assuming minimum viable iterations and short outputs.
*   **High End**: Assuming the agent hits its iteration limit or generates maximum permitted tokens.

## 4. Cost Controls and Protections
To prevent billing shocks for tenants deploying multi-agent workflows:

### 4.1 Strict Token and Iteration Limits
*   Every `AgentStep` must enforce a hard limit on `max_tokens` (output) and `max_iterations` (LangGraph depth).
*   These limits act as an absolute ceiling on $C_{LLM, i}$ and $C_{compute, i}$.

### 4.2 Run-Level Budget Caps (Circuit Breakers)
*   A tenant can configure a "Max Spend per Run" on a workflow template.
*   During execution, the orchestrator tracks cumulative UE (Unidades de Execução) consumed.
*   If $C_{run}$ exceeds the budget cap before completion, the workflow immediately transitions to `FAILED_BUDGET_EXCEEDED` and enters the DLQ.

### 4.3 Billing Transparency
*   The final, exact UE cost is written to the workflow run's metadata upon completion and is immediately visible in the tenant's execution logs and billing dashboard.
