# Critérios de Escalonamento (KB -> Suporte Humano)

## A Filosofia de Self-Service
O BirthHub 360 é um SaaS B2B. A meta é que 80% das dúvidas sejam resolvidas via leitura da Base de Conhecimento (Self-Service) para manter os custos de Customer Success baixos. No entanto, esconder o suporte humano gera churn.

## Quando Escalonar para um Humano
O widget de Suporte (dentro do painel) usa um bot interno para sugerir artigos da KB. O escalonamento para um atendente humano real (via Intercom/Zendesk) é acionado nos seguintes critérios:

1. **Palavras-chave Críticas (Urgência Automática):**
   - "bug", "fora do ar", "caiu", "cobrança indevida", "cancelar".
2. **Ciclo de Frustração (Looping):**
   - O usuário digitou 3 perguntas diferentes no bot de suporte em menos de 5 minutos e clicou em "Isso não ajudou" em todos os artigos sugeridos.
3. **SLA do Plano (Tiering):**
   - **Plano Basic:** O botão "Falar com Atendente" só aparece após a 2ª tentativa falha do bot de suporte sugerir um artigo.
   - **Plano Pro/Enterprise:** O botão "Falar com Humano" é estático e sempre visível no menu lateral do painel.
4. **Erros de Sistema (Backend Triggered):**
   - Se o backend registrar mais de 5 erros HTTP 500 para um mesmo Tenant em 1 hora, um ticket proativo é aberto para a equipe de SRE/CS e o usuário é contatado humanamente.
