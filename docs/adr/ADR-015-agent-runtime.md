# ADR-015: Runtime de Agentes - Arquitetura de Filas e Isolamento

## Status
Proposto

## Contexto
O Agent Core do BirthHub360 executa tarefas (Jobs) não-determinísticas que dependem de chamadas a LLMs externos. Essas tarefas podem ser longas (de segundos a minutos), sujeitas a rate limits de APIs de terceiros e intensivas em uso de memória local. À medida que o número de tenants cresce, precisamos definir a arquitetura do runtime: como os jobs são enfileirados, como garantir justiça (fairness) entre tenants, evitar problemas de "noisy neighbor" (vizinho barulhento) e gerenciar prioridades.

A principal questão é: devemos usar uma fila única compartilhada para todos os tenants, filas separadas por tenant, ou uma abordagem híbrida?

## Decisão
Adotaremos uma **Abordagem Híbrida (Filas Compartilhadas com Roteamento Estocástico e Filas Dedicadas por Tier)**.

1.  **Plano Free / Standard:**
    *   Compartilharão um pool global de Filas (ex: `standard-queue-1` a `standard-queue-N`).
    *   O enfileiramento usará um algoritmo de **Fair Queuing** (ou *Stochastic Fairness Queuing*) no momento do dispatch. Se um único tenant enviar 10.000 jobs, eles não bloquearão o tenant que enviou 1 job; o dispatcher fará round-robin baseado no `tenant_id`.

2.  **Plano Enterprise / VIP:**
    *   Terão a opção de **Filas Dedicadas** (Tenant-Specific Queues) e workers dedicados (com autoscaling independente).
    *   Isso garante latência previsível (SLO mais rígido) e isolamento total de performance contra picos de tráfego de outros tenants.

3.  **Filas de Prioridade (Priority Queues):**
    *   Independentemente do tenant, os jobs terão prioridades baseadas no gatilho:
        *   `HIGH`: Acionados via requisição síncrona do usuário (UI/API) esperando resposta rápida.
        *   `NORMAL`: Acionados por eventos assíncronos (ex: webhook de e-mail recebido).
        *   `LOW`: Tarefas de manutenção em lote (ex: sumarização noturna de base de conhecimento).

4.  **Isolamento no Worker (Runtime Level):**
    *   Um worker process (ex: Celery ou Temporal worker) processa **um job por vez por thread/processo**.
    *   O estado do job (variáveis, histórico de chamadas) existirá estritamente no escopo da função/classe e será limpo no encerramento (sucesso ou falha). Isso mitiga vazamentos de memória cross-tenant na camada de aplicação. (Análise detalhada em `docs/analysis/runtime-isolation.md`).

## Consequências

*   **Positivas:**
    *   Custo-efetividade maximizada para tenants menores (multiplexação de recursos).
    *   Garantia de isolamento de performance para contas Enterprise, viabilizando upsell.
    *   Prevenção do problema de *noisy neighbor* nas filas compartilhadas via algoritmo de fairness.
*   **Negativas:**
    *   Aumenta a complexidade da infraestrutura (gerenciamento dinâmico de filas para Enterprise e lógica de fairness no dispatcher).
    *   Risco de subutilização de workers dedicados no plano Enterprise (compensado pelo custo do plano).

## Referências
*   Item 4.3.J1 do Ciclo 4 (JULES)
*   Integração com runbooks de escalonamento (`docs/runbooks/saturated-worker.md`)
*   [ADR-016: Memória de Agente](./ADR-016-agent-memory.md)
