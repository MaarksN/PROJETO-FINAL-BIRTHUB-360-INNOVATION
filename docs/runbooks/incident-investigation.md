# Runbook de Investigação de Incidente

1. **Alerta Disparado**: Verifique a notificação no PagerDuty/Slack.
2. **Logs**: Busque o erro associado filtrando pelo `service` afetado.
3. **Trace**: Identifique o `trace_id` no log do erro e procure o rastro completo para ver onde ocorreu o gargalo ou falha.
4. **Causa Raiz**: Analise a stack trace ou o tempo de resposta no trace para determinar a falha de componente.
5. **Mitigação**: Aplique rollback, reinicie serviços ou corrija o código (hotfix).
