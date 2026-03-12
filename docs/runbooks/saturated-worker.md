# Runbook: Workers de Agente Saturados

Este documento orienta a equipe de operações e plantão (On-Call) na resolução de incidentes relacionados a filas do Agent Core excessivamente longas ou workers travados/lentos, impactando o SLO de latência ou a disponibilidade da plataforma.

**ID:** `RB-011`
**Severidade Potencial:** SEV-1 (Total Paralisação) a SEV-3 (Alta Latência).
**Sintomas:**
*   Alerta Datadog/Grafana: `AgentQueueLatencyHigh` (> 60s em p95).
*   Alerta Datadog/Grafana: `WorkerCPUUtilizationHigh` (Constante > 90%).
*   Alerta Datadog/Grafana: `QueueDepthSpike` (> 10k mensagens paradas na fila do RabbitMQ/SQS).
*   Logs do orquestrador registrando "Timeout waiting for Agent Worker response".

---

## 1. Diagnóstico Inicial (Em < 5 Minutos)

O objetivo principal é entender *por que* a fila está cheia. As causas comuns são:
A.  Um tenant abusivo mandou uma carga excessiva repentina (Ataque DDoS ou Spike Genuíno).
B.  Os workers estão falhando ao processar uma tool específica (Erro lógico ou de rede), fazendo com que os jobs entrem em loop de retry e entupam a fila (Poison Pill).
C.  O LLM provider (OpenAI/Anthropic) está degradado, fazendo com que as chamadas normais de 2s passem a demorar 20s (Gargalo Externo).
D.  Falta de capacidade de processamento subjacente (Cluster Kubernetes cheio, sem nós para escalar).

### Passos de Investigação:
1.  **Verifique as Métricas do Provider de LLM:**
    *   Vá ao dashboard de *External API Latency*. A latência média para a API da OpenAI/Anthropic aumentou significativamente? A taxa de erros 429/5xx aumentou?
    *   Se sim: **A causa é externa.** (Siga para Escalonamento -> Gargalo Externo).
2.  **Examine a Profundidade da Fila (Queue Depth) e Throughput:**
    *   No painel do SQS/RabbitMQ, os workers estão consumindo mensagens, ou o consumo (Ack Rate) zerou?
    *   Se o consumo zerou, os workers estão *deadlocked* ou perdendo conexão. Verifique logs dos Pods de Worker por `OOMKilled` ou exceptions de thread no Celery/Keda.
3.  **Identifique o Ofensor (Tenant/Agente):**
    *   Execute uma query nos logs do orquestrador ou no Datadog APM: `sum by (tenant_id, agent_name) (agent_job_queued)`.
    *   Há um único tenant responsável por 90% da fila? (Spike de Carga).
4.  **Verifique a Ferramenta Que Falha (Error Rate Spike):**
    *   Há um aumento de erros do tipo `AgentToolError` ou timeouts específicos? Exemplo: A tool `fetch_salesforce_data` está travando.

---

## 2. Ações de Mitigação Imediata

Dependendo do diagnóstico do Passo 1, execute a ação correspondente para estabilizar a plataforma.

### Cenário A: Spike Genuíno de Um Único Tenant (Noisy Neighbor)
O Tenant X decidiu disparar 50.000 requisições simultâneas e travou a fila "Standard".
*   **Ação:** Ative o Rate Limiting Dinâmico para o Tenant X.
    ```bash
    birthhub-cli rate-limit apply --tenant-id X --limit 5 --unit seconds
    ```
    Isso forçará a API do orquestrador a devolver HTTP 429 para requisições *novas* dele, preservando a fila para os demais. O Fair Queuing (ADR-015) deveria cuidar do resto na fila atual.
*   **Recuperação Opcional:** Se a fila estiver inaceitavelmente longa e o SLA dos outros clientes estiver sendo ferido agora, considere mover as mensagens novas para uma fila de overflow ou purge parcial (ver abaixo).

### Cenário B: Gargalo Externo (Provider de LLM ou API de Terceiros Degradada)
A OpenAI está muito lenta e nossos workers ficam presos esperando respostas HTTP, bloqueando as threads.
*   **Ação (Autoscaling):**
    *   Aumente imediatamente a concorrência dos workers. Como eles estão ociosos esperando I/O, o cluster aguenta mais processos concorrentes.
    *   Escalone horizontalmente o deployment do Kubernetes: `kubectl scale deploy agent-worker --replicas=30` (Aumente em 100% ou 200%).
*   **Ação (Circuit Breaking / Degradação):**
    *   Se a API não se recuperar, mude temporariamente o fallback model no Policy Engine (ex: rotear tarefas menos complexas de `gpt-4o` para `gpt-3.5-turbo` ou `claude-3-haiku` via Feature Flag de emergência).

### Cenário C: Bug na Aplicação (Poison Pill ou Loop Infinito)
Um deploy recente de um agente introduziu um bug: a tool entra num loop (retry infinito não mapeado) ou sofre OOM instantâneo.
*   **Ação:** Pare o sangramento efetuando Rollback do manifesto do agente problemático para a última versão estável.
*   **Limpeza (Shedding):** Descarte jobs "presos" em retry infinito movendo-os para a DLQ.

---

## 3. Descarte de Jobs Velhos (Load Shedding / TTL)

Quando a plataforma sofre uma interrupção prolongada (> 30 min), a fila de execução se enche de centenas de milhares de jobs "antigos" que talvez não tenham mais valor para o usuário final (ex: o usuário da UI já desistiu e fechou a página). Processá-los quando a plataforma voltar gerará um desperdício enorme de recursos e prolongará a indisponibilidade.

**Quando descartar (Purge) mensagens antigas?**
*   Se o tempo na fila (`message_age`) de jobs prioritários (High/Sync) ultrapassar **5 minutos**.
*   Se o tempo na fila de jobs normais (Async) ultrapassar **2 horas**.

**Como descartar:**
1.  **Jobs Síncronos (UI):** Estes geralmente têm um Time-To-Live (TTL) curto na mensagem do SQS/RabbitMQ. Eles evaporarão sozinhos (expiração).
2.  **Jobs Assíncronos (Ex: Ingestão em Lote):**
    *   Abra a interface de administração do broker de mensagens.
    *   **Não dê "Purge All"** na fila.
    *   Utilize o script de DLQ Shift para mover mensagens velhas para um S3 Bucket (arquivamento de falhas).
    ```bash
    python scripts/infra/shed_queue_load.py --queue standard-queue-1 --max-age 7200 --dest s3://birthhub-archive/dead-jobs/
    ```
    *   Notifique a equipe de Customer Success de que jobs de ingestão entre a hora X e Y foram cancelados por força maior.

## 4. Escalonamento Pós-Incidente
Após a estabilização (fila vazia, latência normalizada):
*   Abra um ticket Jira (Post-Mortem / RCA).
*   Desative o rate-limiting emergencial (se aplicado e não mais necessário).
*   Desfaça os escalonamentos manuais de HPA (Kubernetes) para retornar ao Autoscaler dinâmico.
*   Revise os logs dos jobs rejeitados e avalie a necessidade de script de compensação.
