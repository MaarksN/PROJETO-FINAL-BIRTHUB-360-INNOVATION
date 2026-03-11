# Análise de Risco: Rate Limit Muito Restritivo

## Risco: Falsos Positivos em Produção
- Um limite agressivo (ex: 30 requests/minuto) em endpoints de chat com LLMs pode punir clientes B2B que possuem fluxos de trabalho legítimos muito rápidos (ex: importação em lote de mensagens de suporte para processamento).
- O limite em IPs pode penalizar grandes escritórios (NAT gateway único) bloqueando todos os usuários de uma empresa inteira (Tenant) porque um usuário bateu o limite.

## Mitigações
1. **Limites Baseados em Tokens (Identidade) vs IPs:** O `rate-limit` de clientes autenticados (Tenants) deve ser priorizado pela identidade (API Key / JWT) para evitar o problema do IP compartilhado corporativo. O bloqueio por IP (WAF) deve focar em picos massivos de tráfego não autenticado ou em rotas como login.
2. **Whitelist Temporário (Processo):** Clientes com integrações robustas (Enterprise) podem solicitar (via suporte) um aumento justificado do limite (Quota Increase) no API Gateway, ajustando o perfil no banco de dados (`tenant.rate_limit_multiplier = 5.0`).
3. **Observabilidade (Soft Limits):** Antes de aplicar um "Hard Drop" (429) agressivo no WAF, operar em modo "Count/Log" por 7 dias para analisar o percentual de clientes reais afetados e calibrar os números da política.
