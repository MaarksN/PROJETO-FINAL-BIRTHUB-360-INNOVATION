# Plano de Disaster Recovery (DR) Completo

## Cenários e RTO/RPO Alvo

| Cenário de Desastre | Responsável Principal | RTO (Tempo de Recup.) | RPO (Ponto de Recup.) | Ação Imediata (Resumo) |
| :--- | :--- | :--- | :--- | :--- |
| **Queda Completa da Região AWS (ex: us-east-1)** | Liderança de Infraestrutura | < 4 horas | < 1 hora (BD) | Promover réplica de BD cross-region (us-west-2), provisionar ECS/Load Balancer via Terraform/CDK na nova região. |
| **Corrupção Massiva de Dados (Ransomware/Bug)** | DBA / Eng. de Dados | < 8 horas | < 1 hora (PITR) | Isolar ambiente, restaurar snapshot de horas antes do evento via RDS PITR, aplicar scripts de expurgo se necessário. |
| **Ataque DDoS Severo (Exaustão de Recursos)** | Eng. de Segurança / Redes | < 1 hora (Mitigação) | 0 (Sem perda de dados) | Ativar AWS Shield Advanced/WAF com rate limiting estrito; bloquear IPs/ASNs; escalar CDN. |
| **Falha de Serviços de Terceiros Críticos (ex: OpenAI, Stripe)** | Liderança de Produto/Backend | N/A (Degradação) | N/A | Ativar fallback de LLMs (ex: Anthropic via API Gateway); enfileirar eventos de pagamento e degradar UI gracefully. |

## Comunicação Interna e Fluxo de Escalada
1. **Detecção e Alarme (Minuto 0):** Monitoramento dispara para PagerDuty/Opsgenie. Canal do Slack `#incidents-p0` é criado automaticamente.
2. **Triagem (Minuto 0-15):** On-call engineer avalia a severidade. Se o RTO projetado for violado ou houver risco de perda de dados, o Gerente de Engenharia e o CTO são acionados (Incidente Major).
3. **Sala de Guerra (Minuto 15+):** Uma call de emergência (Zoom/Meet/Slack Huddle) é iniciada. Um **Incident Commander** é nomeado (foca na coordenação, não digita comandos). Um **Comunicador** foca em atualizações internas e status page. Os **Executores** analisam logs e executam os runbooks de mitigação.
4. **Resolução e Post-Mortem (Pós-Incidente):** Serviços normalizados. A causa raiz e as ações corretivas (action items) devem ser documentadas em até 72 horas úteis.
