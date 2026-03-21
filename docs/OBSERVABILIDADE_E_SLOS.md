# Observabilidade e SLOs

## Padrões
- Correlation ID ponta-a-ponta via `x-correlation-id` no BFF.
- Health endpoint deve refletir dependências reais (API upstream no gateway).

## SLOs base
- **apps/web:** disponibilidade >= 99.9%, LCP <= 2.5s
- **apps/api:** disponibilidade >= 99.95%, p99 <= 500ms
- **apps/worker:** job success rate >= 99.5%, latência p99 < 500ms
- Workflow enqueue p95 < 500ms
- Webhook processing sucesso >= 99.5%

## Error Budgets
- Error budgets são calculados baseados nos SLOs acima. Ex: Para apps/api (99.95%), o error budget mensal é de ~21 minutos de downtime.
- **SLO burn rate alerts:** Alerta quando 5% do budget é consumido em 1h.
- **Freeze de Mudanças:** Policy entra em vigor quando error budget está abaixo de 10%. Apenas hotfixes permitidos.
- **Dashboard:** Disponível em `https://grafana.birthhub360.com/d/slos` acessível para toda a engenharia.
- **Revisão:** Agendada revisão mensal de SLOs no time principal de SRE/Plataforma.

## Alertas
- Ver `docs/runbooks/P1_MITIGATION.md` para on-call, alert routing e runbooks.
- Dead man's switch habilitado no worker (alerta se 5 min sem jobs).
- Alerta para DLQ crescendo (job na DLQ = P1).