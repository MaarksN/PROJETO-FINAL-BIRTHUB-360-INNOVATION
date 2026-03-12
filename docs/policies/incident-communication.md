# Comunicação de Incidente para Clientes

## Objetivo
Transparência com os Tenants do BirthHub 360 durante interrupções.

## Canais Oficiais
1. **Status Page:** `status.birthhub360.com` (atualização automática ou manual por PagerDuty/Incident Commander).
2. **Dashboard (In-App):** Banners na interface de usuário (`/apps/dashboard/components/realtime-banner.tsx`).
3. **E-mail (Major Incidents):** Apenas para falhas críticas (SLA violado, corrupção de dados) ou atualizações agendadas demoradas.

## SLAs de Primeira Resposta
O Incident Commander (ou designado) deve postar a primeira atualização pública nos seguintes prazos:
- **P0 (Crítico - Indisponibilidade Total):** < 15 minutos do alerta inicial.
- **P1 (Alta - Degradação Severa/Agentes Falhando):** < 30 minutos.
- **P2/P3 (Média/Baixa - Lentidão, UI Parcial):** < 2 horas ou no próximo horário comercial.

## Formato (Template Inicial da Status Page)
- **Status:** Investigando
- **Mensagem:** "Estamos cientes de um problema afetando [Serviço/Agentes] no BirthHub 360 e nossa equipe de engenharia está investigando no momento. Forneceremos uma atualização em breve."
