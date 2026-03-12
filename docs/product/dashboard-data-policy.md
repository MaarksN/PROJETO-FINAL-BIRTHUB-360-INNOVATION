# Política de Dados no Dashboard

## Objetivo
Definir como os dados analíticos são apresentados, armazenados e protegidos no painel principal do cliente (Tenant) no BirthHub 360.

## 1. Granularidade e Agrupamento
- **Filtros de Tempo:** Os dados devem ser agrupados primariamente por "Últimos 7 dias", "Últimos 30 dias" (Padrão) e "Este Mês".
- **Filtro por Agente:** Se o cliente tiver 3 agentes diferentes (Vendas, Suporte, Financeiro), o dashboard deve permitir ver as métricas de forma consolidada ou isolada por Agente.

## 2. Frequência de Atualização
- **Métricas Críticas (Chats Ativos, Leads do Dia):** Em tempo real (Latência máxima de < 10 segundos). Implementação via WebSocket ou Polling curto na UI.
- **Métricas Analíticas Pesadas (Horas Economizadas Mensais, ROI):** Atualização em background a cada hora (Batch processing / Views Materializadas no banco). Não travar o banco principal com `COUNT(*)` em milhões de mensagens a cada F5 do usuário.

## 3. Privacidade e LGPD
- **Ocultação de PII no Analytics Geral:** Os gráficos devem mostrar números e tendências, NUNCA nomes, e-mails ou conteúdo de chat na camada de Dashboard analítico.
- **Acesso ao "Raw Data":** Ao clicar para ver "Quem foram esses 45 leads?", o usuário é redirecionado para a tabela restrita de Contatos, que exige login ativo e loga a visualização na trilha de auditoria (Compliance B2B).
