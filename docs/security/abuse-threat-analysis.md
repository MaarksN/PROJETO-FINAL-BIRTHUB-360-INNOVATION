# Análise de Ameaças de Abuso

O modelo de negócios do BirthHub 360 (SaaS de Agentes IA para B2B) é altamente suscetível a abusos financeiros e técnicos devido ao uso de LLMs caros (OpenAI/Anthropic).

## 1. Abuso de APIs (DDoS Layer 7 e Scraping)
- **Scraping e Enumeration:** Bots tentam varrer endpoints (ex: `/api/v1/tenants/xyz/agents`) para extrair prompts proprietários ou listas de clientes (Lead Generation).
- **Ataques de Autenticação (Credential Stuffing):** Tentativas massivas de login (DDoS L7) em `/api/v1/auth/login` com senhas vazadas da internet para assumir contas de clientes (Account Takeover). O invasor pode usar os agentes do cliente de graça.

## 2. Abuso Financeiro (LLM / API Billing)
- **Injeção de Prompts Maliciosos (Prompt Injection):** Um usuário gratuito ou trial tenta burlar os agentes (ex: Pre-Sales ou Social) para fazer tarefas complexas não relacionadas ao negócio, gerando custos imensos em tokens OpenAI, esgotando o limite do tenant ou da plataforma.
- **Requisições Recursivas / Loops:** Scripts que ativam os agentes em loop infinito via API ou webhooks, estourando a cota de uso do mês em poucos minutos (Economic Denial of Sustainability - EDoS).
