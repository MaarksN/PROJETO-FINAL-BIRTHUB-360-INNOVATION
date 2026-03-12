# Documento de SLO por Serviço

## Objetivo
Definir os Service Level Objectives (SLOs) para o BirthHub 360, alinhados com a expectativa do cliente B2B (Agências e Empresas) e a capacidade da infraestrutura (AWS ECS/RDS/LLMs).

## SLOs por Domínio

1. **API Gateway & Roteamento Core (O "Coração")**
   - **Disponibilidade (Uptime):** 99.9% (Tolerância de ~43 min/mês de falha 5xx não planejada).
   - **Latência (p95):** < 200ms para requisições de cache/roteamento básico (sem LLM).
   - **Janela de Medição:** Mensal rotativa (30 dias).
   - **Exceções:** Manutenções programadas anunciadas com 48h de antecedência (janela de 2h/mês não conta contra o SLO).

2. **Serviços de Agentes IA (Processamento Síncrono LLM)**
   - **Disponibilidade:** 99.5% (Tolerância maior devido à dependência externa de APIs da OpenAI/Anthropic). Erros 5xx por falha do LLM contam contra nosso SLO se não tivermos fallback funcional.
   - **Latência (p90):** < 8 segundos (Geração de texto inicial - Time to First Token). < 25 segundos (Completude da resposta média).
   - **Janela e Exceções:** Falhas globais documentadas do provedor LLM (ex: status.openai.com) são marcadas como exceções e excluídas da contagem de disponibilidade principal perante clientes Enterprise, caso previsto em contrato.

3. **Painel B2B / Dashboard Frontend**
   - **Disponibilidade:** 99.9%.
   - **Latência (p90):** < 1.5s para carregamento inicial da UI (Static + Dados Básicos).

## Error Budget
- O Budget mensal do API Gateway é de **0.1%** de todas as requisições legítimas falhando ou fora da latência.
- Se o budget se esgotar (Error Budget < 10% restante no mês), ações corretivas devem ser tomadas conforme a Política de Error Budget.
