# Runbook de Mitigação P1

Este runbook consolida passos de mitigação rápida para incidentes P1 e alertas críticos definidos no projeto de SLOs de Observabilidade.

## 1. SLO Burn Rate Alert (> 5% em 1h)
**Impacto:** O serviço está queimando orçamento de erros rápido demais.
**Mitigação:**
- Inspecionar Grafana/Datadog (logs de erro da última hora agrupados por `route`/`tenant_id`).
- Verificar se houve deploy recente via CI/CD. Se sim, **rollback imediato**.
- Identificar se é uma anomalia em banco (ex: timeout de query) via tracing OTLP.

## 2. Dead Man's Switch (Worker Inativo)
**Condição:** Worker processando 0 jobs em 5 minutos enquanto existem jobs pending.
**Mitigação:**
- Checar health do container do worker: `docker ps` ou Kubernetes pods.
- Verificar logs do Worker para OOM (Out of Memory) ou panic em loops infinitos.
- Escalar novos pods ou reiniciar o worker afetado via `kubectl delete pod -l app=worker`.
- Checar conexão com o Redis do BullMQ (`connection reset by peer`).

## 3. Alerta de DLQ (Dead Letter Queue) Crescendo
**Condição:** Qualquer job entrando na DLQ deve soar alerta imediato.
**Mitigação:**
- Inspecionar os jobs na DLQ via UI ou scripts locais (`pnpm run:dlq-inspect`).
- Verificar se o motivo é bug no código do job (`TypeError`, timeout de integração de terceiros).
- Em caso de API de terceiros indisponível, atrasar o retry backoff.
- Se o bug já foi corrigido, rodar `pnpm run:dlq-retry-all`.

## Alert Routing (On-Call)
Os alertas no PagerDuty e Slack são roteados por domínio baseados no pacote/módulo (`service_name` no logger estruturado):
- `billing-*` -> #alerts-billing, rota PagerDuty: Equipe de Faturamento
- `auth-*` -> #alerts-security, rota PagerDuty: Equipe de Identidade
- `worker-*` -> #alerts-platform, rota PagerDuty: SRE

## Alert Fatigue
Alertas com mais de 5% de falsos-positivos na última revisão mensal foram silenciados para revisão técnica.
