# Política de Falha e Retentativas de Webhooks

A arquitetura de faturamento e concessão de serviços do BirthHub360 é fortemente baseada em eventos do Stripe. Se um webhook falhar em ser processado ou a aplicação estiver indisponível, o sistema pode ficar inconsistente (ex: um cliente paga e não recebe o serviço, ou cancela e continua com acesso).

Para evitar isso, definimos uma política estrita de falha de webhooks, garantindo alta disponibilidade ou, no pior caso, recuperação manual.

## 1. Retry Automático (Stripe)
O Stripe possui um sistema interno de "Smart Retries" para webhooks não entregues com sucesso (qualquer retorno diferente de HTTP 2xx, como 500, 429 ou timeouts maiores que 10s).

**Nossa Política:**
- **Ambiente de Teste (`Test Mode`):** Webhooks não confirmados (timeout ou erro 500) serão retentados até **3 vezes** ao longo de algumas horas.
- **Ambiente de Produção (`Live Mode`):** O Stripe retentará webhooks por até **3 dias** com backoff exponencial (ex: imediatamente, 1h, 6h, 1 dia, etc.).
- **Endpoint Idempotente:** Como o mesmo payload pode chegar várias vezes (devido a falhas de rede antes da nossa resposta chegar ao Stripe), nosso endpoint HTTP deve verificar a tabela de eventos (verificação de Idempotency Key ou Event ID) antes de executar mutações no banco. Retornar HTTP 200 IMEDIATAMENTE caso o evento já conste como processado.

## 2. Enfileiramento e Processamento Background (Worker Queue)
Como descrito no *Threat Model*, para evitar timeouts (limite de 10s do Stripe) ou indisponibilidade por picos (DDoS):

- **Fase Síncrona:** O endpoint HTTP (`POST /webhooks/stripe`) apenas verifica a assinatura criptográfica, salva o JSON "cru" (raw) no banco de dados (`stripe_webhook_inbox` com status `PENDING`) ou Message Broker e retorna HTTP 200.
- **Fase Assíncrona:** Um Worker lê os itens `PENDING` e aplica a regra de negócios (atualizar permissões, renovar ciclos). Se houver erro de negócio (ex: usuário não encontrado), o status muda para `FAILED` internamente, e o Worker tenta de novo sem afetar a resposta HTTP (pois o Stripe já recebeu o 200).

## 3. Dead Letter Queue (DLQ)
Caso o processamento de negócio falhe permanentemente (ex: esquema do banco mudou, ou o dado do evento é malformado), não faz sentido o Worker tentar infinitamente.

**Processo:**
1. Após 5 retentativas no Worker (Backoff de 1min, 5min, 15min, 1h, 24h), o status do evento na fila interna passa para `DEAD_LETTER`.
2. Os eventos na DLQ param de ser processados automaticamente.

## 4. Alertas Manuais e Runbooks
A DLQ jamais deve acumular eventos críticos sem atenção.

- **Alerta (Slack/PagerDuty):** Qualquer evento marcado como `DEAD_LETTER` no banco de dados dispara um alerta crítico imediato no canal de Engenharia/Billing.
- **Auditoria de Eventos do Stripe:** O sistema rodará um cron diário para checar a API do Stripe em busca de discrepâncias. Se um cliente consta como `active` no Stripe mas `past_due` no banco de dados, o alerta é enviado.
- **Resolução Manual (Runbook):** A equipe de engenharia pode acionar uma rota interna (Admin) para re-injetar manualmente um ID de evento específico do Stripe diretamente da API (`GET /v1/events/evt_123`) na fila, caso um erro de código tenha sido corrigido (Deploy) e o evento precise ser processado de fato.