# Análise de Degradação Graceful

## O que acontece quando o sistema atinge a capacidade máxima?
Se o "Stress Test" se tornar realidade (ex: limite de conexões de BD estourar ou Rate Limit do LLM Provider falhar), o sistema **não deve cair completamente ou retornar erros não tratados (crash 500 ou telas em branco)**.

## Padrões de Degradação (Shedding Load)

1. **Interface do Usuário (Painel B2B):**
   - **Normal:** Exibe gráficos em tempo real, histórico completo de chats, notificações instantâneas.
   - **Degradado:**
     - Se o banco de Analytics estiver lento, os gráficos falham com um *timeout* controlado (ex: 3 segundos) e mostram: "Os dados de relatórios estão temporariamente atrasados. O sistema principal continua operando."
     - O chat dos agentes continua visível (pois usa a API Core).
     - Componentes não essenciais (ex: contagem de leads online) são desativados no Frontend via Feature Flags dinâmicas.

2. **Agentes de IA e Filas:**
   - **Normal:** Mensagens processadas síncronamente em < 8 segundos via WebSocket ou Polling.
   - **Degradado (API Gateway recusa conexões):**
     - O Rate Limiter atua: Retorna HTTP 429 (`Too Many Requests`) antes de atingir o banco ou o Orchestrator.
     - As requisições de agentes (webhooks de WhatsApp/CRM) não falham, mas são enfileiradas (DLQ ou Queue de Retry) com atrasos. O status no painel B2B muda para "Processando (Atraso na rede)".

3. **Circuit Breakers (Falha do Provedor OpenAI):**
   - Se a OpenAI cair (HTTP 500 contínuos) ou devolver "Quota Exceeded", o Circuit Breaker no `llm-client` "abre".
   - Todas as próximas requisições são negadas instantaneamente no backend para não saturar as threads (Fail Fast).
   - Opcional: O roteador muda para um LLM mais leve e barato (Fallback - Anthropic Haiku) para manter funcionalidades básicas operando.

## Princípio Fundamental
**É melhor rejeitar 10% do tráfego (Rate Limit/Load Shedding) e atender 90% perfeitamente, do que tentar processar 100% sob estresse e derrubar o banco de dados, resultando em 0% de sucesso.**
