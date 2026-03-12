# Análise de UX: Pontos de Abandono no Wizard - BirthHub 360

## Contexto
O Wizard de configuração inicial (Onboarding) do BirthHub 360 apresenta diferentes etapas para personalizar a experiência do usuário. A análise abaixo identifica onde os usuários desistem de configurar a plataforma.

## Funil de Conversão do Wizard (Por Etapa)

1. **Início (100%)**
2. **Perfil & Setor (92% de retenção)**
3. **Conexão de Dados/CRM (60% de retenção - *Ponto Crítico*)**
4. **Configuração de Agente IA (52% de retenção)**
5. **Conclusão/Dashboard (48% de conclusão total)**

## Análise de Causas de Abandono e Hipóteses de Solução

### 1. Ponto de Abandono: Conexão de Dados/CRM (Queda de 32%)
- **Problema Observado:** Usuários travam na tela de integração do Salesforce/HubSpot ou de contas de e-mail institucionais. Eles fecham a janela ou ficam inativos na mesma aba por mais de 5 minutos.
- **Hipótese 1 (Falta de Permissão):** Especialmente para Executivos e Gestores não-técnicos, falta a permissão de Super Admin para aprovar o OAuth.
  - *Solução Proposta:* "Skip Step" ou "Convidar um Admin de TI", oferecendo um conjunto de dados fake (Demo Data) para avançar e ver o produto.
- **Hipótese 2 (Preocupações de Segurança):** O usuário lê as permissões amplas solicitadas pela API e hesita.
  - *Solução Proposta:* Inserir um card explicativo de "Segurança" ao lado do botão de integração, detalhando (em linguagem simples) como o BirthHub 360 protege os dados.

### 2. Ponto de Abandono: Configuração de Agente IA (Queda de 8%)
- **Problema Observado:** Usuários selecionam um agente da lista, mas não finalizam a customização do prompt inicial (tom de voz, cadência).
- **Hipótese 1 (Ansiedade de Desempenho):** O usuário se depara com configurações detalhadas (como agressividade do SDR) e teme que a IA comece a enviar mensagens erradas em seu nome automaticamente.
  - *Solução Proposta:* Padrão "Safe Mode" ativado: Exibir claramente que o agente ficará em modo "Sugestão apenas" (Draft) até que o usuário revise os primeiros outputs e mude manualmente para "Piloto Automático".

## Conclusões
O foco da Engenharia e UX no curto prazo deve ser **facilitar o pulo (skip) da etapa de CRM** utilizando dados de demonstração (sandbox), o que tem potencial para recuperar até 20 pontos percentuais de conclusão no topo de funil.
