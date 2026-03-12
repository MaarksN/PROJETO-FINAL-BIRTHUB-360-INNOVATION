# Runbook: Discrepância de Billing (Assinatura Ativa vs Bloqueada)

## Descrição do Incidente
Este runbook é acionado quando um cliente relata que sua conta está suspensa ou recursos do plano pago (ex: Agentes Avançados) estão indisponíveis no BirthHub360, **mesmo com a assinatura constando como "Ativa" e faturada com sucesso no painel do Stripe.**

## Impacto
- **Experiência do Cliente:** Crítico. O cliente pagou e não está recebendo o serviço (quebra de confiança, risco de chargeback imediato).
- **Operacional:** Múltiplos tickets de suporte. Risco de perda de credibilidade do motor de faturamento.

## Causas Mais Comuns
1. **Falha Silenciosa de Webhook:** O Stripe enviou o `invoice.paid`, mas o servidor do BirthHub360 estava fora do ar, gerou erro 500, ou o evento foi parar na Dead Letter Queue (DLQ).
2. **Race Condition/Out-of-Order:** O webhook `customer.subscription.updated` (ativo) chegou *antes* de um webhook tardio de falha `invoice.payment_failed` (que na verdade era antigo). O sistema processou o evento de falha por último e bloqueou o acesso incorretamente.
3. **Erro de Sincronização do Banco:** O webhook foi processado com sucesso (HTTP 200 pro Stripe), mas o Worker assíncrono falhou ao fazer commit no banco de dados (ex: timeout de conexão).

---

## Passos para Resolução Imediata (Triage & Mitigação)

### 1. Confirmar o Status no Stripe
- Acesse o painel do Stripe (Dashboard).
- Busque o email do usuário ou o ID da assinatura (ex: `sub_1...`).
- Verifique o **Status** da assinatura (deve estar `active`) e as faturas recentes (devem estar `paid`).
- Verifique a aba **Events and webhooks** na página do Customer para ver se há falhas de entrega de eventos para o BirthHub360.

### 2. Sincronização Manual (Admin Panel / API Interna)
- **Não** edite o banco de dados diretamente via SQL (risco de violar constraints, logs de auditoria).
- Se houver uma ferramenta de sincronização manual, acesse o painel Admin do BirthHub360 e use a função `Sincronizar Billing do Cliente`. Essa função deve fazer um GET na API do Stripe (`stripe.subscriptions.retrieve('sub_1...')`) e forçar a atualização (Overriding) do status do Tenant no banco de dados local.
- Confirme com o cliente que o acesso foi restabelecido e peça desculpas pela inconveniência.

---

## Investigação Root Cause (Engenharia)

### 3. Verificar Logs e Fila (Workers/DLQ)
- Busque nos logs do Kibana/DataDog ou Cloud Logging usando o ID do evento do Stripe (ex: `evt_...`) listado na Dashboard do Stripe para aquele `invoice.paid` que não funcionou.
- Verifique a **Dead Letter Queue (DLQ)** do sistema. Se o evento estiver lá, analise o motivo da falha (Stack Trace). Corrija o bug no código e re-enfileire a mensagem da DLQ para processamento.

### 4. Avaliar Timestamps e Race Conditions
- Consulte a tabela de registro de webhooks (`stripe_webhook_inbox` ou similar) no banco de dados.
- Verifique a ordem cronológica real em que o sistema aplicou as mudanças de estado para aquele `tenant_id`. Se o sistema aplicou a lógica `past_due` (inadimplente) *após* a lógica de ativação (devido a eventos fora de ordem), considere revisar o código do Worker conforme definido na política de mitigação de Race Conditions.

---

## Pós-Incidente (Postmortem)

- **O que falhou:** Relacionar os webhooks problemáticos ou os bloqueios no banco.
- **Prevenção:** Se o erro for recorrente, criar um *Cron Job* de auditoria (Sync Checker) diário que compara ativamente (GET API Stripe) o status de clientes críticos com o banco local, reportando inconsistências silenciosas antes do cliente notar.