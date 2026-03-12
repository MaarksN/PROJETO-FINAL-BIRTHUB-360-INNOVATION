# Plano de Resposta a Ataque de Rate

## Detecção
O WAF (AWS WAF) ou o API Gateway (via Redis) disparam alertas no PagerDuty indicando picos maciços de requisições `429 Too Many Requests` em um endpoint específico (ex: Login ou Agentes), sugerindo ataque em andamento.

## Contenção (Táticas de Mitigação)
1. **Regras Dinâmicas (WAF):** Ativar mitigação automática L7 (AWS Shield Advanced ou regras gerenciadas WAF) para bloquear IPs com comportamento botnet.
2. **Desafios Temporários:** Habilitar CAPTCHA ou verificações JS para os endpoints sob ataque (caso o tráfego não venha de clientes de API legítimos).
3. **Bloqueio Hard (IP/ASN):** Se um AS (Autonomous System) inteiro estiver atacando (ex: rede de proxies residenciais), bloquear temporariamente o CIDR via infra (WAF).
4. **Isolamento de Tenant:** Se o ataque provém de credenciais válidas mas roubadas (EDoS), revogar os tokens temporariamente (`UPDATE tenants SET status = 'suspended' WHERE id = X`) para estancar custos de LLM.

## Comunicação e Escalonamento
- Comunique o cliente se seu token foi comprometido (Account Takeover).
- Notifique Engenharia de Segurança se o ataque transpor as defesas L7 (DDoS massivo).
