# Roteiro de Teste de Usabilidade (Wizard)

## Preparação (Apenas para o Facilitador)
- **Objetivo:** Avaliar cada nova versão iterada do Wizard de Configuração do BirthHub 360 e validar se as taxas de sucesso estão próximas do Alvo (80%).
- **Ferramentas:** Sessão remota (Google Meet/Zoom) com gravação de tela. Ambiente de Staging limpo (Conta nova para o participante).
- **Regra de Ouro:** Não ajude o usuário (a menos que seja um bug bloqueante do sistema). Apenas observe e peça para ele "pensar em voz alta" (Think Aloud Protocol).

## Introdução (5 min)
"Olá, [Nome]. Obrigado por participar. Hoje vamos testar um novo fluxo de configuração da nossa plataforma de Agentes de Inteligência Artificial para agências, o BirthHub 360. Não estamos avaliando suas habilidades, mas sim quão intuitivo é o nosso sistema. Se algo for difícil, a culpa é do nosso design, e é isso que queremos descobrir e consertar. Por favor, sempre que possível, narre o que você está lendo ou pensando."

## Tarefas do Teste (20 min)

**Cenário/Contexto dado ao Participante:**
"Imagine que você é o dono de uma agência de marketing (ou SaaS B2B) chamada *GrowthTech*. Você se cadastrou no BirthHub 360 porque quer colocar um Agente de Vendas (SDR) no site da sua empresa para qualificar leads 24/7. Você acabou de confirmar seu e-mail e foi redirecionado para a plataforma."

1. **Tarefa 1: Configuração Inicial**
   - "Crie o perfil da sua empresa na plataforma usando os dados básicos."
   - *(Observar se ele entende o jargão da área de atuação. Ele travou em alguma palavra?)*

2. **Tarefa 2: Treinamento da IA**
   - "Faça a IA aprender sobre os serviços da GrowthTech. Você pode usar este documento fictício em PDF que te enviei no chat, ou usar a URL do site da sua empresa."
   - *(Observar se o tempo de upload/processamento causa impaciência. Ele procura algum botão que não encontrou?)*

3. **Tarefa 3: O Teste Final (Aha Moment)**
   - "Sua IA está teoricamente pronta. Como você faria para ter certeza de que ela responde corretamente antes de colocar no seu site oficial?"
   - *(Observar se ele descobre o botão 'Simular Chat'. Pedir para ele mandar uma mensagem complexa, como "Quais serviços vocês oferecem e quanto custa?").*

## Fechamento (5 min)
1. Numa escala de 1 a 10, quão confiante você se sente em ativar este Agente publicamente agora?
2. O que você esperava que fosse acontecer que não aconteceu?
3. Houve algum jargão técnico ("Prompt", "Webhook", "RAG") que te causou confusão?

*(Documentar os resultados na plataforma de insights de UX para priorização no backlog de engenharia e produto).*
