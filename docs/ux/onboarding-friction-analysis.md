# Análise de Fricção no Onboarding

## Objetivo
Identificar os gargalos e atritos na jornada do usuário que impedem que ele atinja o "Aha Moment" no tempo alvo (< 10 minutos) e traçar melhorias de UI/UX.

## Pontos de Fricção Identificados

1. **Upload de Base de Conhecimento Lento (Processamento Vector DB)**
   - **Problema:** Quando o usuário anexa um PDF grande (> 50 páginas), o processamento de embeddings bloqueia a tela e pode levar vários minutos, causando frustração. O usuário não sabe se o sistema travou.
   - **Solução de UX:** Mover o processamento para background. Liberar o usuário para terminar o setup visual do agente e usar notificações do tipo "brinde" ("Toasts") ou e-mails transacionais informando: "Seu documento foi processado e seu agente está 100% inteligente!".

2. **Engenharia de Prompt Assustadora para Leigos**
   - **Problema:** O campo "System Prompt" no wizard apresenta uma caixa de texto gigante e em branco. Clientes com perfil executivo (não-técnicos) não sabem o que escrever e travam.
   - **Solução de UX:** Oferecer templates pré-construídos por vertical de negócio (ex: "SDR para Imobiliária", "Atendimento para E-commerce") que pré-preenchem o campo de prompt. Trocar a linguagem de "System Prompt" para "Comportamento da IA".

3. **Excesso de Configurações Iniciais no Cadastro**
   - **Problema:** Pedir chaves de API da Stripe ou da OpenAI no primeiro login (antes de ver o agente funcionando).
   - **Solução de UX:** O BirthHub 360 deve subsidiar os primeiros US$ 2.00 de uso de LLM para permitir que o usuário teste o produto imediatamente (Freemium/Free Trial). A configuração de faturamento ou API Keys próprias só deve ser solicitada na hora do Deploy para produção.

## Próximos Passos
O time de Produto (PM) e Design (UX) deverão prototipar os "Templates de Prompt" e revisar as telas de bloqueio de processamento na próxima sprint.
