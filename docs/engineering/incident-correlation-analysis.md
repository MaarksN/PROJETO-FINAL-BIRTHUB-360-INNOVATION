# Análise de Correlação de Incidentes

- **Tenant Único:** Sintoma frequentemente atrelado a erro na parametrização específica do cliente (templates mal formados, dados quebrados na própria base, tokens externos expirados do tenant).
- **Múltiplos Tenants:** O incidente está no core (Downtime no RDS geral, credenciais API Gateway comprometidas, timeout com Provedor do LLM).
O Trace Id/Tenant ID e dashboards baseados em facetas logicas de observability facilitam o isolamento instantâneo.
