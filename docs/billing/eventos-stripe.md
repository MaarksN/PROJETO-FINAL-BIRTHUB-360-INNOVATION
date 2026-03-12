# Eventos e Ações de Webhooks do Stripe

A integração de faturamento do BirthHub360 depende da escuta ativa de eventos assíncronos enviados pelo Stripe. Somente eventos mapeados nesta lista devem acionar rotinas complexas no backend. Quaisquer outros eventos devem ser ignorados ou descartados passivamente.

## Ciclo de Vida do Cliente e Faturamento (Customer & Invoice)

| Evento | Causa Típica | Ação Esperada do Sistema | Criticidade |
|--------|--------------|--------------------------|-------------|
| `customer.created` | Criação de conta no painel do BirthHub360 via portal/checkout. | Atualiza o registro do *Tenant* no banco de dados com o `stripe_customer_id` retornado. | **Média** |
| `customer.deleted` | Cancelamento ou mescla de clientes pelo suporte ou via API do Stripe. | Altera o status de faturamento do cliente para "Nenhum" e pausa todas as automações de faturamento recorrente. | **Alta** |
| `customer.updated` | Cliente altera endereço, e-mail de faturamento ou detalhes fiscais. | Sincroniza as mudanças cadastrais relevantes (como NIF/CNPJ) com o sistema de notas fiscais locais. | **Baixa** |
| `invoice.created` | Uma nova fatura mensal/anual é gerada pelo Stripe. | O sistema deve capturar a fatura e opcionalmente alertar o financeiro se o valor (por conta de overage) exceder as previsões. | **Média** |
| `invoice.paid` | O banco/operadora processou com sucesso a renovação. | O sistema deve estender o prazo de validade (ciclo) da assinatura no banco, destravando eventuais limitações impostas por faturas vencidas. | **Crítica** |
| `invoice.payment_failed` | Recusa do cartão na cobrança de uma assinatura. | Envia um email ao cliente (D+1), marca a assinatura como `past_due` e inicia a contagem do Grace Period. | **Crítica** |
| `invoice.payment_action_required` | O banco requer autenticação 3D Secure do cliente. | Dispara notificação imediata in-app ou por email contendo o link da *Invoice* para que o usuário complete a autenticação. | **Alta** |

## Ciclo de Vida da Assinatura (Subscription)

| Evento | Causa Típica | Ação Esperada do Sistema | Criticidade |
|--------|--------------|--------------------------|-------------|
| `customer.subscription.created` | Cliente assina um novo plano (Upgrade ou Nova Conta). | Ativa os recursos associados ao `price_id` no Tenant. Inicia o provimento de limites (seats, quota de IA). | **Crítica** |
| `customer.subscription.updated` | Mudança de quantidade, downgrade/upgrade programado, ou alteração de *Grace Period*. | Sincroniza os novos limites com o banco de dados (ex: reduz *seats* para downgrade). Reage ativando/desativando *Feature Flags*. | **Crítica** |
| `customer.subscription.deleted` | Cliente cancela o plano ou ocorre inadimplência terminal. | Revoga imediatamente o acesso pago e migra o cliente para o nível Gratuito/Trial, mantendo apenas retenção básica de dados. | **Crítica** |
| `customer.subscription.trial_will_end` | Faltam X dias para o trial expirar (Stripe notifica). | O sistema (ou Agente de Vendas) envia comunicação alertando sobre a cobrança iminente ou oferecendo opções de upgrade. | **Média** |

## Disputas e Reembolsos (Disputes & Refunds)

| Evento | Causa Típica | Ação Esperada do Sistema | Criticidade |
|--------|--------------|--------------------------|-------------|
| `charge.refunded` | Suporte autorizou e processou um estorno parcial ou total. | Atualiza os registros contábeis. Reverte limites (overage ou *seats*) que haviam sido temporariamente concedidos na cobrança original. | **Média** |
| `charge.dispute.created` | Cliente não reconheceu a compra e abriu disputa bancária (*Chargeback*). | Suspensão IMEDIATA do serviço para proteção. Bloqueio de novos *Charges* para o cartão (Fraud Prevention) e alerta no Slack do Financeiro. | **Alta** |
| `charge.dispute.funds_withdrawn` | Disputa perdida. O banco retirou os fundos do Stripe. | Confirma o prejuízo financeiro no banco de dados. Opcionalmente encerra a conta definitivamente em caso de fraude clara. | **Média** |

*(Eventos listados refletem o fluxo principal SaaS do BirthHub360 focado em assinaturas. Outros eventos pontuais podem ser adicionados conforme a infraestrutura exigir).*