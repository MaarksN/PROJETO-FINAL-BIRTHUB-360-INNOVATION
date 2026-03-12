# Runbook de Investigação de Incidente

No ecossistema BirthHub 360, a complexidade arquitetônica (API Gateway, LangGraph Orchestrator, Fila BullMQ e microserviços em Python) exige um fluxo padrão eficiente para tratar incidentes de produção. Este runbook detalha os passos para investigar alertas desde a notificação inicial (via Slack/PagerDuty) até a causa raiz, utilizando nossa stack de observabilidade.

## Fases da Investigação

### 1. Detecção do Alerta (O Ponto de Partida)

- **Ação:** Identifique a natureza do alerta no canal do Slack (`#alerts-prod`) ou via PagerDuty/Opsgenie.
- **Contexto:** Alertas são baseados em _Métricas_. Exemplo: "SLO Alert: Taxa de Erro HTTP > 1% no API Gateway" ou "High Latency: Duração P95 > 120s no Agent Orchestrator".
- **Decisão Inicial:** O sistema está totalmente indisponível (P0) ou ocorrem erros intermitentes (P1/P2)? Confirme o impacto real.

### 2. Painel de Métricas e Observabilidade (Grafana / Cloud Ops)

- **Ação:** Acesse o painel principal (ex: Grafana Dashboard ou Cloud Monitoring Dashboard do projeto).
- **Passos:**
  - Verifique gráficos de uso de CPU/Memória, latência média (P95/P99), e taxa de erros (HTTP 5xx).
  - Observe se há um pico visível recente associado ao horário do alerta.
  - Identifique **qual** serviço ou rota específica está causando a falha. Exemplo: "Pico de erros no `/v1/webhooks/stripe`".

### 3. Mergulho nos Logs Estruturados (Logs Explorer)

- **Ação:** Acesse a plataforma de busca de logs (ex: Google Cloud Logging ou Kibana).
- **Busca:**
  - Filtre os logs utilizando queries como `resource.type="cloud_run_revision" AND severity>="ERROR"`.
  - Se um tenant específico foi relatado, adicione: `jsonPayload.tenant_id="org_XYZ"`.
- **Passos:**
  - Inspecione a mensagem de erro ("Stack trace" original em Python ou erro não tratado do Express.js no Node).
  - Extraia o valor exato do `trace_id` de um evento de log do erro crítico.

### 4. Rastreamento (Distributed Tracing / OpenTelemetry)

- **Ação:** Com o `trace_id` copiado, acesse a interface de Tracing (Google Cloud Trace ou Jaeger/Datadog).
- **Passos:**
  - Cole o `trace_id` para carregar a cascata da requisição.
  - O gráfico de Spans vai revelar a jornada completa do evento. Por exemplo:
    1. Span: API Gateway (recebeu a chamada HTTP, gerou o erro ou passou adiante).
    2. Span: LangGraph Workflow (chamada RPC do Gateway para o Worker Python).
    3. Span: Agent Execution (LLM call ou query no DB).
  - Identifique em qual desses "saltos" (spans) ocorreu a maior latência ou a marcação em vermelho de erro (`span.status = ERROR`). Este é o exato microserviço onde a execução falhou.

### 5. Determinação da Causa Raiz e Mitigação

- **Ação:** Agora você sabe onde e quando falhou. Cruza-se o erro explícito (ex: "Timeout na API OpenAI" ou "Foreign Key Constraint error no Prisma") com o código fonte do repositório respectivo.
- **Passos:**
  - Avalie se o problema decorre de infraestrutura externa (ex: Integração fora do ar) ou código interno.
  - Se for código defeituoso recentemente adicionado, considere acionar o processo de **Rollback (Revert PR)** imediatamente (Stop The Bleeding).
  - Se for de terceiros (Stripe, HubSpot, LLM), analise e acione mitigação se aplicável (circuit breaker, degradação graciosa ou notificação de status para o cliente via Dashboard).

### 6. Post-Mortem e Melhoria

- Uma vez resolvido e a estabilidade re-estabelecida (Métricas voltam a verde, Alerta se auto-resolve), conduza a reunião pós-incidente se aplicável e descreva como melhorar a cobertura de testes para prevenir a reincidência. Preencha o `docs/runbooks/post-mortem-template.md`.
