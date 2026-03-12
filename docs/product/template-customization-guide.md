# Guia de Customização de Template (< 30 min)

## Objetivo
O Gestor da Agência seleciona o Template "SDR Imobiliário" e deve ser capaz de colocá-lo no ar, com os dados e o tom de voz da *sua* construtora, em menos de meia hora.

## Passo a Passo (O Caminho Feliz na UI)

1. **Escolha do Template:** O usuário clica em "Usar Template SDR Imobiliário". O BirthHub clona as configurações base de prompt, ferramentas e comportamento.
2. **Injeção de Identidade (Personalização Rápida):**
   - A UI não joga o usuário no "System Prompt" complexo. Ela exibe formulários (Inputs):
     - *Nome do seu Agente:* [Assistente Virtual Bella]
     - *Nome da sua Empresa:* [Construtora XYZ]
     - *Qual seu produto principal:* [Edifício Bella Vista - Alto Padrão]
   - O Backend (Orchestrator/Agent_Parser) insere estas variáveis dinamicamente no prompt base do template invisível.
3. **Injeção de Base RAG (O Conhecimento):**
   - A UI exibe: "Faça o upload do material de vendas e FAQ do Bella Vista (PDF/Word)".
   - Opcional: "Conecte sua conta do Calendly para agendamentos automáticos."
4. **O Teste Interno:** "Simule uma conversa com a Bella agora mesmo."
5. **Deploy Simples:** "Copie este script e coloque no rodapé do seu site."
