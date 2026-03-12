# Limites por Endpoint (Rate Limiting)

Para proteger a infraestrutura e os custos, definimos limites estritos baseados na criticidade e custo da operação por IP/Tenant. Implementação primária via API Gateway (Redis/Memcached).

## 1. Endpoints de Autenticação (Maior Risco)
- **`/api/v1/auth/login` e `/api/v1/auth/reset-password`**
  - **Limite:** 5 requisições por IP a cada 15 minutos.
  - **Justificativa:** Prevenir brute-force e credential stuffing.

## 2. Endpoints de Interação com LLMs (Maior Custo)
- **`/api/v1/agents/{id}/chat` ou `/api/v1/agents/{id}/execute`**
  - **Limite:** 30 requisições por Tenant (token) a cada 1 minuto (Tier Básico). 120 requisições (Tier Pro/Enterprise).
  - **Justificativa:** Evitar loops infinitos acidentais ou abusivos que drenem o orçamento da OpenAI rapidamente. Protege contra DoS L7.

## 3. Endpoints de Gestão (CRUD Padrão)
- **`/api/v1/tenants/*`, `/api/v1/users/*`, `/api/v1/billing/*`**
  - **Limite:** 100 requisições por IP/Tenant por minuto.
  - **Justificativa:** São operações leves de banco de dados, mas não devem ser alvos fáceis de scraping agressivo ou sobrecarga do backend (RDS).

## Resposta ao Ultrapassar Limite (HTTP 429)
O sistema deve retornar `429 Too Many Requests` com o header `Retry-After: {segundos}` e o motivo no corpo da resposta para debug legítimo.
