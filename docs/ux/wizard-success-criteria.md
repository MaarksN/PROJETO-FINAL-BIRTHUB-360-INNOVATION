# Critérios de Sucesso do Wizard (Completude)

## Definição da Meta
O usuário "Gestor" (Persona Core) é o foco de otimização primário para as melhorias de UX no fluxo de Setup. Este usuário tem poder de compra, mas baixa tolerância técnica.

## Meta Principal (Target Completion Rate)
- **80% de Completude para o Usuário Gestor.**
  - *(O funil é medido da Etapa 1 do Wizard até a primeira mensagem trocada no Simulador interno)*.

## Sub-Metas (Métricas de Saúde do Funil)
1. **Tempo Médio de Conclusão (TTC - Time to Complete):** Menos de 3 minutos para usuários que usam Templates (Pulando integrações complexas).
2. **Taxa de Pulos (Skip Rate):** Se a Etapa de "Upload de PDF" (Tornada opcional após a Análise de Drop-off) for pulada por mais de 50% dos usuários, devemos reavaliar seu posicionamento no Wizard.
3. **Erros Fatais (Fatal Errors):** 0% de ocorrência de erros 500 ou bloqueios de tela sem mensagem amigável e botões de "Tentar Novamente". A infraestrutura (RAG, banco de dados) deve ser resiliente a uploads pesados ou falhas pontuais do LLM da OpenAI (Circuit Breaking no backend, gracefully handled no Frontend).
