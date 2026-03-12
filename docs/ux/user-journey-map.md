# Jornada Completa do Usuário (Time-to-Value)

## Objetivo
Mapear a jornada do usuário no BirthHub 360 desde o primeiro contato (Cadastro) até a percepção do primeiro valor real (Aha Moment) em menos de 10 minutos.

## Etapas da Jornada (Onboarding Expresso)

1. **Cadastro e Criação do Tenant (Minuto 0-1)**
   - Usuário acessa `/signup`.
   - Preenche dados básicos (Nome, Email B2B, Nome da Agência).
   - Validação via e-mail (Magic Link) ou Google OAuth para reduzir atrito.
   - *Sucesso:* Redirecionado para o Dashboard inicial vazio com um Call-to-Action (CTA) destacado.

2. **Setup do Perfil de Negócio (Minuto 1-3)**
   - Um modal "Welcome Wizard" solicita o segmento de atuação e o principal caso de uso (ex: "Qualificar Leads", "Agendar Reuniões").
   - *Sucesso:* O sistema pré-seleciona um template de Agente adequado.

3. **Criação do Primeiro Agente (Minuto 3-5)**
   - O usuário revisa o Agente (ex: Agente SDR) pré-configurado.
   - Insere um prompt base (ex: "Você representa a agência X, seja cordial").
   - Adiciona um documento simples (PDF institucional) ou a URL do site da empresa na Base de Conhecimento.
   - *Sucesso:* O agente muda o status para "Treinado e Pronto".

4. **Primeira Interação - O Teste (Minuto 5-7)**
   - O usuário abre o simulador de chat no painel.
   - Envia uma mensagem de teste atuando como um cliente hipotético.
   - O Agente responde instantaneamente baseando-se no PDF/URL fornecido.
   - *Aha Moment:* O usuário percebe a capacidade da IA de entender o contexto do seu negócio sem programação.

5. **Deploy e Entrega de Valor Contínuo (Minuto 7-10)**
   - O usuário gera um link de compartilhamento ou um snippet de código HTML (Widget).
   - Opcional: Conecta via webhook ao CRM existente.
   - *Sucesso Final:* O primeiro lead interage com a IA e é qualificado autonomamente.
