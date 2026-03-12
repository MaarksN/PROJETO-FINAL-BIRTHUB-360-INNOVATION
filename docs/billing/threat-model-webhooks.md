# Threat Model de Webhooks do Stripe

A integração via webhooks expõe endpoints públicos do BirthHub360 para a internet. Embora o remetente esperado seja o Stripe, atacantes podem tentar explorar essa porta de entrada para fraudar assinaturas ou causar interrupções (DDoS).

## 1. Event Injection (Spoofing)
**Ameaça:** Um atacante descobre o endpoint do webhook (ex: `https://api.birthhub360.com/webhooks/stripe`) e envia um payload JSON forjado imitando um evento `invoice.paid`, tentando forçar o sistema a liberar o acesso ao plano Enterprise para seu tenant sem pagar.
**Mitigação:**
- **Assinatura de Webhook (Obrigatório):** O Stripe envia um header `Stripe-Signature` em cada request. O backend deve validar essa assinatura usando a chave secreta do webhook (`STRIPE_WEBHOOK_SECRET`) configurada no painel do Stripe. Rejeitar HTTP 400 em falha.
- **Busca da Fonte da Verdade (Opcional/Reforço):** Em vez de confiar inteiramente nos dados contidos no payload do webhook forjado, usar apenas o ID do objeto (ex: `sub_123`) para fazer uma chamada de volta (GET) à API autenticada do Stripe e confirmar seu status real.

## 2. Replay Attacks
**Ameaça:** Um atacante intercepta um evento de webhook válido (ex: `customer.subscription.created` ou `charge.refunded`) e o reenvia horas ou dias depois repetidas vezes, tentando forçar o sistema a adicionar créditos falsos na conta do cliente, estornar o valor repetidas vezes ou corromper a máquina de estado da assinatura.
**Mitigação:**
- **Verificação de Timestamp:** A assinatura do Stripe inclui um timestamp. O backend do BirthHub360 deve rejeitar eventos cujo timestamp seja muito antigo (tolerância máxima configurável, ex: 5 minutos), evitando o replay de payloads velhos interceptados. O Stripe SDK faz isso automaticamente (`tolerance: 300`).
- **Idempotência (Banco de Dados):** O sistema deve registrar o `stripe_event_id` (ex: `evt_123`) no banco (tabela `processed_webhooks`). Se um ID já existe, retornar HTTP 200 imediatamente e não processar a lógica novamente.

## 3. Out-of-Order Events (Condição de Corrida de Estado)
**Ameaça:** O Stripe pode entregar webhooks fora de ordem. Por exemplo, o evento `customer.subscription.deleted` (cancelamento) chega *antes* do evento `customer.subscription.updated` (uma renovação tardia). Se o sistema processar o "update" por último, a assinatura será reativada incorretamente.
**Mitigação:**
- **Versionamento por Timestamp:** Todo modelo de Assinatura (`Subscription`) no banco deve ter um `stripe_updated_at`. Ao receber um webhook, o backend deve comparar o `created` (timestamp do evento Stripe) com o `stripe_updated_at` atual no banco. Se o evento for mais antigo que o estado atual, ele deve ser ignorado (descartado como *stale event*).
- **Enfileiramento FIFO:** Opcionalmente, webhooks de um mesmo `customer_id` podem ser enfileirados em tópicos sequenciais ou travados no banco (Row Lock) para garantir que alterações no mesmo tenant não corram em paralelo.

## 4. Resource Exhaustion / DDoS (Ping Flood)
**Ameaça:** Envio massivo de payloads malformados ou falsos para o endpoint do webhook para sobrecarregar a CPU (cálculo de HMAC na validação da assinatura) ou o banco de dados.
**Mitigação:**
- **Rate Limiting (API Gateway):** Aplicar WAF/Rate Limiting no endpoint do webhook, permitindo requisições apenas dos IPs conhecidos do Stripe (se estático) ou bloqueando surtos anômalos (spikes).
- **Retorno Rápido (Offloading):** O endpoint do webhook apenas valida a assinatura, salva o raw payload em um Message Broker (RabbitMQ/SQS/Redis) e retorna HTTP 200 imediatamente. Um worker background processa o evento de fato, protegendo o endpoint HTTP de *timeouts* e bloqueios de I/O.