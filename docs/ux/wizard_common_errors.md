# Análise de Erros Comuns no Onboarding (UX e Configuração)

## Introdução
Este documento lista os erros mais frequentes cometidos pelos usuários durante a configuração inicial do BirthHub 360 e propõe soluções de UX para preveni-los ou mitigá-los.

## 1. Conexão Incompleta ou Falha de OAuth
- **Erro Frequente:** O usuário inicia a integração com um CRM (Salesforce/HubSpot) e abandona a janela pop-up do OAuth, ou o token expira antes que ele conclua o wizard.
- **Sintoma:** O sistema exibe um erro genérico "Falha de Conexão" ou um spinner infinito.
- **Prevenção UX:**
  - Substituir o timeout genérico por uma mensagem amigável: *"Parece que você fechou a janela de autenticação. Tudo bem! Quer tentar novamente ou usar dados de demonstração por enquanto?"*
  - Exibir o status da conexão em tempo real (check verde animado ao concluir).

## 2. Escolha do Agente IA Inadequado
- **Erro Frequente:** Um usuário com perfil técnico (ex: Admin) seleciona um "SDR Agent" focado em prospecção de e-mails em vez de um "Sales Ops Agent" focado em limpeza de CRM. Ele não entende as métricas geradas no primeiro dashboard.
- **Sintoma:** Baixo engajamento (NPS baixo no onboarding).
- **Prevenção UX:**
  - Ocultar ou mover agentes secundários para um menu "Avançado".
  - Pré-selecionar o "Melhor Agente para [Cargo do Usuário]" com base nas respostas da etapa 1.

## 3. Upload de Arquivos CSV Inválidos (Caso CRM seja ignorado)
- **Erro Frequente:** Se o usuário escolher subir dados iniciais por CSV (leads ou contas), ele envia um formato que a IA/parser não entende perfeitamente (falta de cabeçalhos, delimitadores errados).
- **Sintoma:** Tabela vazia ou nomes embaralhados no primeiro relatório.
- **Prevenção UX:**
  - Fornecer um "Template Modelo (CSV/Excel)" para download logo ao lado do botão de upload.
  - Apresentar um preview visual (Data Mapping Wizard) após o upload, onde a IA tenta advinhar as colunas: *"Identificamos a coluna 'Nome da Empresa'. Está correto? Sim / Não"*.

## 4. Falta de Feedback sobre Sincronização em Background
- **Erro Frequente:** O usuário conclui o wizard, cai no dashboard e os gráficos estão vazios, pois a sincronização inicial (sync) do CRM demora alguns minutos.
- **Sintoma:** Ele acha que o produto "não funcionou", reporta bug e abandona a plataforma.
- **Prevenção UX:**
  - Inserir um "Loading State" rico (Skeleton Dashboard) com textos rotativos educativos: *"A IA está lendo seus últimos 500 leads... Isso leva cerca de 2 minutos. Sabia que você pode configurar alertas?..."*.
  - Enviar um e-mail transacional (ou Push) quando o primeiro batch de dados estiver pronto.
