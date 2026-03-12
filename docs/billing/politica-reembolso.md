# Política e Procedimento Técnico de Reembolso

## Visão Geral
A política de reembolso do BirthHub360 tem o objetivo de equilibrar a experiência do cliente com o rigor financeiro e a estabilidade da receita, principalmente porque os custos das interações de IA (LLMs) geram perdas não recuperáveis (custo com infraestrutura).

## Regras de Elegibilidade (SaaS B2B)

- **Direito de Arrependimento (Pro Rata):** Cancelamentos nos primeiros 7 dias após o faturamento inicial (assinatura nova) podem ser reembolsados integralmente.
- **Renovação Automática Esquecida:** Reembolsos são concedidos caso solicitados até 3 dias após a cobrança da renovação (apenas se não houver uso das ferramentas no período).
- **Consumo Excedente (Overage):** *Não há reembolso* sobre o custo variável (interações de IA). O custo da inferência foi incorrido pela infraestrutura; não podemos repassar as perdas. Exceções são analisadas apenas em caso de bugs confirmados do sistema que causaram loops infinitos ou medição incorreta.
- **Downgrades no Meio do Ciclo:** Ao fazer downgrade, não realizamos estorno do valor pago (dinheiro). O valor residual vira "Crédito" na conta (`customer_balance` no Stripe) a ser abatido nas faturas futuras.

## Tradução Técnica para Ações no Sistema

Quando a equipe financeira (ou o agente de suporte/SDR) aprova um reembolso, isso deve refletir no Stripe e no sistema interno simultaneamente, mantendo a consistência.

### Ação 1: Processando um Reembolso de Fatura (Refund)

- **Ferramenta do Stripe:** `stripe.refunds.create({ charge: 'ch_1...' })`
- **Impacto no Banco de Dados (BirthHub360):**
    - A fatura associada àquele pagamento passa a ter o status `Refunded` ou `Partially Refunded`.
    - Os direitos concedidos pela fatura (ex: aumento do limite da franquia do mês atual) precisam ser revertidos imediatamente (um webhook escuta `charge.refunded`).

### Ação 2: Tratando Créditos Prorrateados (Prorations)

Se o cliente muda de um plano Anual de $5000 para um plano Mensal de $500 logo após o 1º mês, ele não recebe um DOC/TED com $4500.
- **No Stripe:** O downgrade gera um crédito (balance) de ~$4500 na conta do cliente via *Prorations*.
- **No Sistema:** O faturamento dos meses seguintes usará o saldo positivo da conta e aparecerá na UI como *"Próxima fatura (estimada): $0.00 (Resta $4000 de crédito em conta)"*.

### Ação 3: Reversão Automática em Disputas (Chargebacks)

Quando o cliente abre disputa no cartão (fraude ou desconhecimento da compra), o banco estorna o valor compulsoriamente.
- **No Stripe:** Ocorre um evento `charge.dispute.created`.
- **No Sistema:**
    - Imediatamente suspende a assinatura (status `past_due` ou `unpaid`).
    - Bloqueia o uso de agentes para o Workspace, limitando danos de custo operacional até resolução do caso.
    - Notifica a equipe de suporte e financeiro para prover provas (ex: logs de login) ou contatar o cliente.