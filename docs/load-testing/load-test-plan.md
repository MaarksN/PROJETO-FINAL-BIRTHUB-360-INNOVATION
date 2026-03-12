# Plano de Load Test (BirthHub 360)

## Objetivo
Validar se a arquitetura atual (API Gateway -> Orchestrator -> Agentes -> LLMs/DB) suporta os picos de tráfego projetados para o go-live e o crescimento orgânico, identificando os gargalos antes que os clientes B2B sejam impactados.

## Ferramenta e Ambiente
- **Ferramenta:** k6 (escrito em Go/JS) ou Locust (Python). Recomendado k6 por facilidade de integração no CI e geração de tráfego pesado.
- **Ambiente:** Ambiente de Staging (idêntico à Produção em configuração, mas isolado). NUNCA rodar load test destrutivo em produção B2B a menos que seja um teste de caos controlado e agendado.
- **Mocking:** LLMs externos (OpenAI) DEVERÃO ser mockados na maioria dos testes para não esgotar orçamentos (~$1000/teste) e não sofrer rate limit deles. Um teste final *end-to-end* com a API real pode ser feito com volume muito restrito para confirmar integração.

## Cenários de Teste

### 1. Smoke Test (Sanity)
- **Usuários Virtuais (VUs):** 5-10
- **Duração:** 1 minuto
- **Objetivo:** Garantir que o script de teste funciona e o sistema não quebra com carga trivial.

### 2. Load Test (Carga Esperada / Dia a Dia)
- **Cenário:** 500 Tenants ativos simulando o uso matinal típico (Abertura do Dashboard, leitura de relatórios e ~10 chats por minuto por tenant).
- **VUs:** Escala linear até 1000 VUs.
- **Duração:** 15 minutos.
- **Objetivo:** Verificar se a latência p95 se mantém < 200ms (API) e < 8s (Agentes mockados).

### 3. Stress Test (Pico de Carga Extremo)
- **Cenário:** Disparo em massa de webhooks de um grande CRM (Black Friday), sobrecarregando a fila de ingestão.
- **VUs:** Escala rápida de 10 para 5000 VUs.
- **Duração:** 5 a 10 minutos ou até o sistema quebrar.
- **Objetivo:** Encontrar o *breaking point* (gargalo). Onde o sistema falha primeiro? (CPU do API Gateway, conexões do RDS, Memória do Orchestrator?). Como o sistema se recupera após a carga baixar?

### 4. Spike Test (Ataque ou Viralidade Súbita)
- **Cenário:** Salto quase instantâneo de 0 a 3000 requisições simultâneas em 10 segundos.
- **Objetivo:** Testar a resiliência do Auto-scaling e Rate Limiting (WAF).

## Métricas de Sucesso e Falha

| Métrica | Meta (Sucesso) | Falha (Alerta) |
| :--- | :--- | :--- |
| **Taxa de Erro HTTP 5xx** | < 0.1% | > 1% (Queda inaceitável) |
| **HTTP 429 (Rate Limit)** | < 1% (VUs bem comportados) | Esperado alto apenas em Spike Tests. |
| **Latência P95 (Core APIs)** | < 300ms | > 1000ms (Sinal de contenção de banco ou CPU) |
| **Uso de CPU/RAM (Containers)** | Auto-scaling mantém < 70% | OOM Kills (Crash) ou CPU > 95% sustentado |
| **Latência da Fila (SQS/RabbitMQ)** | Mensagens processadas < 5s | Backlog crescente interminável |

## O que será Monitorado
1. CloudWatch/Datadog APM para traces lentos e queries N+1 no banco.
2. RDS: Uso de CPU, Memória Livre, Read/Write IOPS e Conexões Ativas.
3. ECS: Contagem de tasks e OOM errors.
