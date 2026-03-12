# Runbook de Rollback (Blue-Green)

**Objetivo:** Reverter o tráfego para a versão anterior em < 5 minutos.

## Condições para Rollback
- Aumento de taxas de erro 5xx > 2% em 5 minutos.
- Latência no p99 acima do SLO acordado por mais de 5 minutos.
- Funcionalidade core indisponível confirmada por logs ou alertas.

## Passos (AWS ECS + ALB)
1. **Identificar Target Group Antigo (Blue):** No painel do AWS EC2, localizar o Target Group que serve a versão anterior (ainda ativa na janela de retenção).
2. **Atualizar Listener do ALB:**
   - Acesse o Application Load Balancer.
   - Edite as regras do Listener responsável pelo tráfego principal.
   - Altere a regra para encaminhar 100% do tráfego para o Target Group "Blue".
3. **Monitoramento:** Confirme pelo Grafana/Datadog/CloudWatch se os erros diminuíram e o tráfego está normalizado.
4. **Comunicação:** Avise os stakeholders e clientes (via status page) que o sistema retornou à normalidade.
5. **Post-mortem:** Inicie a investigação do root cause do ambiente "Green".

*Nota: Se houve migração destrutiva no banco de dados (o que deve ser evitado com expansão/contração em fases), o processo é mais complexo e requer restore pontual, o que prolonga o RTO.*
