# Cálculo de Horas Economizadas

## Objetivo
Estabelecer um método honesto, realista e auditável para calcular e exibir no Dashboard do BirthHub 360 o "Tempo Economizado" por cada Tenant B2B devido ao uso dos Agentes de IA.

## Fórmula Base
O tempo economizado não pode ser um número mágico infundado. É calculado evento a evento.

**Tempo Total Economizado = Σ (Tempo Médio Humano por Tarefa * Quantidade de Tarefas Executadas com Sucesso pela IA)**

## Tempos Médios Estimados (Benchmarks B2B)
Estes valores são usados como multiplicadores padrão, mas o Tenant pode editá-los em "Configurações de Analytics" se desejar mais precisão para sua operação.

1. **Agente SDR (Qualificação de Leads):**
   - *Tarefa:* Responder à primeira mensagem, fazer 3 perguntas de qualificação e agendar na agenda (Calendly).
   - *Tempo Humano:* **15 minutos** por lead qualificado.
   - *Regra:* Só contabiliza se a IA chegar na etapa de "Lead Qualificado" ou "Reunião Agendada". Conversas abandonadas na primeira mensagem contam **0**.

2. **Agente de Suporte / CS:**
   - *Tarefa:* Responder a uma dúvida baseada na FAQ/PDF (Ticket Resolvido no primeiro contato - FCR).
   - *Tempo Humano:* **8 minutos** por ticket.
   - *Regra:* Contabiliza apenas se o usuário não solicitar "Falar com Humano" (Human Handoff) ao final da conversa.

3. **Agente Financeiro (Cobrança):**
   - *Tarefa:* Enviar 2 via de boleto ou negociar data de pagamento.
   - *Tempo Humano:* **10 minutos**.

## Validação e Auditoria (Transparência)
Ao lado do número gigante de "142 Horas Economizadas este mês", haverá um ícone de informação (`i`).
Ao passar o mouse, o tooltip mostrará a quebra exata:
- *Ex: 400 Leads Qualificados x 15 min = 100 horas.*
- *Ex: 315 Tickets Resolvidos x 8 min = 42 horas.*

**Nota de Produto:** Evitar exibir valores hiper inflacionados (ex: "Você economizou 10.000 horas hoje"), pois quebra a confiança do Gestor no Analytics da plataforma.
