# SLA de Entrega de Notificações

## Objetivo
Garantir que as notificações (especialmente as de transição de status em tempo real) cheguem ao usuário no tempo correto para manter a percepção de responsividade do sistema.

## SLAs por Canal

1. **Notificações In-App (Painel Web / WebSocket)**
   - **Evento Crítico:** Lead solicita "Falar com Humano" (Human Handoff).
   - **SLA:** **< 5 Segundos**.
   - *Justificativa:* O usuário B2B está com o painel aberto esperando para intervir. Atrasos significam perder o lead que estava online no site.
   - *Implementação:* Via fila Redis Pub/Sub e WebSockets/Server-Sent Events.

2. **Notificações por E-mail (Transacionais)**
   - **Eventos:** Confirmação de Cadastro (Magic Link), Reset de Senha, Alerta de Faturamento, Resumo Diário.
   - **SLA:** **< 2 Minutos**.
   - *Justificativa:* O usuário aguarda ativamente o Magic Link para logar.
   - *Implementação:* Serviço de e-mail confiável (ex: AWS SES, SendGrid) desacoplado via RabbitMQ/SQS.

3. **Notificações Push (Mobile App - Futuro)**
   - **SLA:** **< 15 Segundos**.
   - *Justificativa:* Equilíbrio entre a rede APNs/FCM e a urgência do chamado de suporte.
