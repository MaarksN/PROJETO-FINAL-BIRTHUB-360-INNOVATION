# Falso Positivo de Inadimplência (Falso Bloqueio)

No fluxo de pagamentos, a confirmação de que um cliente efetivamente pagou sua assinatura pode ser atrasada por vários fatores sistêmicos ou bancários. Quando o sistema marca um cliente como inadimplente (`past_due`) enquanto o pagamento *já foi processado ou está em trânsito* no banco, temos um "Falso Positivo de Inadimplência".

## 1. Cenários de Falso Positivo e Suas Causas

### A. Atraso de Webhooks (A Causa Principal)
- O cliente visualiza a notificação de fatura vencida e realiza o pagamento no portal do Stripe.
- O cartão aprova a transação, porém o Stripe sofre uma lentidão no seu barramento de eventos ou a rede do nosso Cloud Provider perde o pacote.
- Nosso Worker assíncrono não processa o webhook `invoice.paid` antes do gatilho interno do sistema (ex: Cronjob que roda à meia-noite verificando inadimplências do Dia 7) rodar e suspender a conta do cliente.
- O cliente, que acabou de pagar e recebeu o SMS do banco, perde acesso ao software ("Eu acabei de pagar!").

### B. Métodos de Pagamento Assíncronos (Boleto/Pix ou ACH/SEPA)
- Clientes corporativos podem utilizar pagamentos que não liquidam em tempo real. Uma transferência bancária, ACH ou Boleto pode levar até 3 dias úteis para compensar.
- A Invoice no Stripe fica em estado `open` aguardando liquidação. O cronjob do BirthHub360 não pode assumir inadimplência de má-fé se um método assíncrono estiver pendente (o cliente já iniciou o pagamento).

## 2. Estratégias de Prevenção e Conciliação Ativa

### 1. Tolerar Webhooks com Janela de Sincronização
Em vez de depender *apenas* do webhook para determinar se um bloqueio deve ocorrer naquele milissegundo, a rotina de suspensão (Cronjob do Dia 8) deve executar um **Active Fetch (Pull)** na API do Stripe imediatamente antes de alterar o status da conta para `suspended`.

```python
# Pseudo-código de Prevenção
tenant = get_tenant(id)
if tenant.status == 'past_due' and days_late >= 7:
    stripe_sub = stripe.Subscription.retrieve(tenant.stripe_sub_id)
    if stripe_sub.status == 'active':
        # Falso positivo detectado! O webhook 'invoice.paid' foi perdido ou está atrasado.
        update_tenant_status(tenant.id, 'active') # Corrige o banco local
        log_discrepancy("Falso positivo evitado para " + tenant.id)
    else:
        # Realmente inadimplente no Stripe
        suspend_tenant(tenant.id)
```

### 2. Tratando Métodos Assíncronos ("Pending")
O sistema deve reconhecer o status intermediário.
- Se a fatura no Stripe estiver associada a um método assíncrono e aguardando compensação, o *Grace Period* do cliente deve ser **pausado ou estendido** para acomodar o tempo de liquidação bancária.
- Um banner específico no painel deve informar: "Identificamos o seu pagamento por [Boleto/Transferência]. O acesso está liberado enquanto aguardamos a compensação pelo banco (até 3 dias úteis)."

### 3. Recuperação Silenciosa (Self-Healing)
Caso um webhook `invoice.paid` finalmente chegue para um cliente que *já foi suspenso* erroneamente (ou com razão e pagou depois), o Worker deve ter lógica para "desfazer" a suspensão instantaneamente (reativar os Agentes pausados, remover restrições de API e limpar a mensagem de erro da Dashboard) sem exigir intervenção do suporte. O sistema se cura sozinho e envia um e-mail de "Pagamento Confirmado. Serviços restabelecidos".