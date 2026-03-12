# Threat Model de Configuração

- **Vazamento de DB Credentials:** Impacto: Crítico. Mitigação: AWS Secrets Manager com IAM Roles restritas.
- **Vazamento de Stripe API Key:** Impacto: Crítico (Financeiro). Mitigação: Restringir acesso apenas ao worker de faturamento e usar chaves restritas no Stripe.
- **Vazamento de JWT Secret:** Impacto: Crítico (Account Takeover). Mitigação: Rotação regular e armazenamento seguro via AWS Secrets.
