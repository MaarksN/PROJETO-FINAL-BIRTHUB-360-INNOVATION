# Análise de Risco de Race Condition em Webhooks do Stripe

Quando eventos independentes e rápidos do Stripe chegam quase simultaneamente para o mesmo recurso (por exemplo, `Customer` ou `Subscription`), o processamento em paralelo por diferentes *Workers* pode resultar em uma "Condição de Corrida" (Race Condition). O estado final no banco de dados pode se tornar inconsistente dependendo de qual *Worker* salvar o dado por último.

## 1. O Problema (Cenários Críticos)

### A. Criação Simultânea
Quando um cliente realiza o pagamento via Stripe Checkout, o Stripe dispara vários webhooks simultaneamente, geralmente em paralelo:
1. `checkout.session.completed`
2. `customer.created`
3. `customer.subscription.created`
4. `invoice.created`
5. `invoice.paid`

Se o *Worker A* estiver processando `checkout.session.completed` e o *Worker B* o evento `customer.subscription.created` ao mesmo tempo, ambos podem tentar "criar" ou "atualizar" o `Tenant` com as informações da assinatura.

**Risco:** Se o `Tenant` ainda não existe no banco, ou se ambos os eventos leem o mesmo estado do banco, aplicam uma lógica em memória, e depois salvam, um pode sobrescrever os dados críticos inseridos pelo outro. O resultado é o cliente não ter a assinatura ativa, ou perder permissões recém-adquiridas no segundo milissegundo.

### B. O Update "Antigo" Vencendo
Como analisado no Threat Model (Eventos Fora de Ordem - Out-of-order), um webhook gerado em `T=1` pode chegar em `T=3`, enquanto um webhook gerado em `T=2` chegou em `T=2`. Se ambos os eventos modificam o mesmo campo (ex: `subscription_status`), o estado ficará travado no evento antigo (`T=1`), perdendo a atualização mais recente (`T=2`).

## 2. Abordagens de Mitigação (Nível de Engenharia)

Para garantir a robustez do sistema frente a condições de corrida assíncronas do Stripe, o BirthHub360 utiliza as seguintes estratégias:

### I. Enfileiramento Serial por Chave (FIFO Message Queue com Hash)
- O broker de mensagens (ex: Kafka ou um Redis Queue bem configurado) roteia **todos** os eventos relacionados ao mesmo `customer_id` ou `subscription_id` do Stripe para o **mesmo Worker ou partição**.
- Se for enfileiramento padrão (como SQS/BullMQ), implementar a configuração `concurrency=1` para um dado grupo (ex: *FIFO queues no SQS com `MessageGroupId` sendo o `customer_id`*).
- Dessa forma, os eventos do Cliente A nunca rodam em paralelo; eles esperam na fila até que o evento anterior do mesmo Cliente A termine de gravar no banco.

### II. Lock Otimista / Oculto no Banco de Dados (Database Row Locks)
Se a infraestrutura de fila não garantir a ordem ou a serialização perfeita, o banco de dados (PostgreSQL) deve atuar como fonte da verdade.
- **Transações `SELECT ... FOR UPDATE`:** O Worker, ao começar a processar um evento da Assinatura `sub_123`, obtém um *lock* na linha correspondente na tabela de `subscriptions`.
- Qualquer outro Worker tentando ler a mesma Assinatura ficará esperando (bloqueado) até a primeira transação fazer o `COMMIT`.
- Essa abordagem resolve o problema "Read-Modify-Write" da condição de corrida.

### III. Timestamp como Ouro (Event Ordering via `created` timestamp)
- Todo evento do Stripe tem um timestamp interno de criação (`created`).
- Cada registro no banco de dados que é alimentado por webhooks do Stripe deve possuir uma coluna como `stripe_updated_at`.
- Ao processar qualquer evento, o Worker deve fazer o `UPDATE` condicionado: `UPDATE subscriptions SET status = 'active', stripe_updated_at = :event_created WHERE id = :sub_id AND stripe_updated_at < :event_created`.
- Se o evento atual (no Worker) for *mais velho* que o registro do banco, o `UPDATE` afeta 0 linhas. O Worker simplesmente entende que o evento perdeu a corrida temporal e descarta o processamento (stale event ignore), protegendo a integridade.

## Conclusão
O modelo de segurança assíncrona do BirthHub360 se baseia na junção de Filas ordenadas por `Customer ID` e Locks no Banco de Dados (Pessimistas com `FOR UPDATE` ou condicionados temporalmente) para anular o risco de Race Conditions em eventos paralelos de faturamento.