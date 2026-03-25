# Commercial Agents (runtime legacy controlado)

This directory contains operational and compatibility agents while canonical growth moves to `packages/agent-packs`.

## Agents List

1.  **BDR (Business Development Representative)** (`agents/bdr`)
    *   **Role**: Outbound prospecting and lead qualification.
    *   **Tools**: Lead finding, email verification, outreach sequencing.
    *   **Port**: 8009

2.  **Closer** (`agents/closer`)
    *   **Role**: Closing deals and negotiation.
    *   **Tools**: Objection analysis, discount approval, contract drafting.
    *   **Port**: 8010

3.  **Sales Ops** (`agents/sales_ops`)
    *   **Role**: Sales operations, data hygiene, and forecasting.
    *   **Tools**: CRM cleaning, revenue forecasting, lead assignment.
    *   **Port**: 8011

4.  **Enablement** (`agents/enablement`)
    *   **Role**: Sales training and coaching.
    *   **Tools**: Call analysis, coaching cards, training quizzes.
    *   **Port**: 8012

5.  **KAM (Key Account Manager)** (`agents/kam`)
    *   **Role**: Account management and expansion.
    *   **Tools**: Account planning, stakeholder mapping, QBR scheduling.
    *   **Port**: 8013

6.  **Parcerias (canonical)** (`agents/parcerias`)
    *   **Role**: Channel and partner management.
    *   **Tools**: Partner fit scoring, plan, pipeline and enablement.
    *   **Port**: 8014
    *   **Compatibility**: `agents/partners` is legacy compatibility.

7.  **Field** (`agents/field`)
    *   **Role**: Field sales and territory management.
    *   **Tools**: Route optimization, visit reporting, inventory checking.
    *   **Port**: 8015

8.  **Pre-vendas (canonical)** (`agents/pre_vendas`)
    *   **Role**: Discovery qualification and next-step planning.
    *   **Tools**: Qualification scoring, fit risk and plan generation.
    *   **Port**: 8016
    *   **Compatibility**: `agents/pre_sales` is legacy compatibility.

9.  **Copywriter** (`agents/copywriter`)
    *   **Role**: Sales content generation.
    *   **Tools**: Script generation, email rewriting, social posts.
    *   **Port**: 8017

10. **Social** (`agents/social`)
    *   **Role**: Social selling and engagement.
    *   **Tools**: Profile finding, post commenting, connection requests.
    *   **Port**: 8018

## Shared Infrastructure

*   **Queues**: All agents have dedicated queues defined in `@birthub/shared-types` and configured in `packages/queue`.
*   **Base Agent**: All agents inherit from `BaseAgent` in `agents/shared`, ensuring consistent logging, rate limiting, and observability.

## Canonical families and deprecation map

See `docs/agent-packs/canonical-agent-line.md` for canonical families, duplicate consolidation and guardrails.
