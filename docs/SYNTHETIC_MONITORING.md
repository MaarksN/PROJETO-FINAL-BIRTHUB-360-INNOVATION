# Synthetic Monitoring e Processos de Observabilidade

## Synthetic Monitoring
Configurado via Better Uptime e roteamento Datadog/Grafana Synthetics:
- **Login e Auth:** Fluxo de credenciais testado a cada 5 min.
- **Billing API:** Checkout process verificado periodicamente.
- **Execução de Agentes:** Um pipeline oracle simplificado é disparado a cada 15 min.

## Capacity Planning
A cada trimestre, as métricas de RPS e consumo de Storage (`birthub_tenant_storage_bytes`) são revisadas. Projeções de custo GCP / infraestrutura devem basear escalonamento (Auto-scaling K8s triggers on CPU 70% ou Mem 80%).
Ações de aumento de quotas da GCP ou novos nodes de banco seguem as regras desta métrica.

## Cost Anomaly Alerts
Um alerta P1 é gerado se o gasto na nuvem (GCP Billing) disparar com um delta > 20% do budget diário previsto (ex: um loop de chamadas caras de LLM).
- **Ação:** Verificar métricas `llm_latency` e `llm_tokens_total` nos workers e api-gateway.

## Incident Post-Mortems e Status Page
- **Template de Post-Mortem:** Deve seguir causa raiz (5 Whys), timeline de descoberta, impacto ao tenant (SLI), e ação corretiva com tickets JIRA linkados.
- **Status Page Pública:** Atualizada automaticamente via webhook do Better Uptime com histórico detalhado e mitigação manual para downtime.

## Retenção de Logs
- 30 dias quentes (Elasticsearch / Loki).
- 1 ano frio (GCS Storage em JSON estático).
- Sem PIIs ou segredos registrados no logger (strip no `@birthub/logger`).
