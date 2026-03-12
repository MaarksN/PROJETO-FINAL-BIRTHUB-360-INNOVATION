# Política de Grandfathering

## 1. Visão Geral

À medida que o BirthHub360 evolui seu modelo de preços, pacotes ou limites podem ser alterados ou descontinuados. Esta política descreve as regras para o **Grandfathering** (manutenção das condições antigas) de clientes atuais que estavam vinculados a planos, preços ou limites antigos.

## 2. Condições para Grandfathering

- **Elegibilidade:** Qualquer cliente com assinatura ativa no momento do lançamento de um novo preço ou pacote.
- **Duração do Benefício:**
  - Para alterações de Preços: Os clientes retêm o preço antigo por **12 meses (1 ano)** a partir da data oficial de mudança (ou pelo restante do contrato anual vigente, o que for maior).
  - Para alterações de Funcionalidades (Features movidas de plano): Os clientes não perdem funcionalidades de seu plano existente, contanto que não façam downgrade ou cancelem e renovem posteriormente.

## 3. Regras de Perda de Grandfathering

O benefício de Grandfathering será perdido imediata e permanentemente nas seguintes condições:

- **Cancelamento:** Se a conta for cancelada e posteriormente reativada.
- **Inadimplência:** Se a conta for suspensa ou cancelada devido à falta de pagamento (após o *Grace Period* aplicável).
- **Mudança Voluntária de Plano:** Se o cliente fizer um upgrade ou downgrade, ele migra para os novos preços, limites e funcionalidades do portfólio de planos atualizados, abandonando de vez o plano *grandfathered*.
- **Expiração do Período:** Após o prazo estipulado (ex: 12 meses), a conta passa a ser cobrada conforme o modelo de preços mais recente, mediante comunicação prévia.

## 4. Overage e Uso Variável

As métricas e tarifas de *Overage* (cobrança por uso excedente de IA ou chamadas) não estão protegidas pelo Grandfathering, a menos que estipulado explicitamente no contrato Enterprise do cliente. Alterações no custo por interação excedente entrarão em vigor no ciclo de cobrança seguinte, mediante aviso de pelo menos 30 dias.

## 5. Implementação Técnica

- Planos descontinuados são marcados como `archived` ou `legacy` no Stripe, e novos clientes não podem assiná-los.
- O sistema da aplicação deve interpretar esses planos descontinuados normalmente, permitindo acesso às funcionalidades concedidas inicialmente (Feature Flags em planos customizados ou *legacy*).
- Durante o período de Grandfathering, eventuais novos assentos (seats) adicionados pelo cliente seguem o valor acordado no plano original (*legacy*), não o valor do plano novo, para evitar faturamento híbrido.

## 6. Comunicação

Qualquer cliente que perca ou receba o status de Grandfathering deve ser notificado através dos canais oficias de Billing conforme descrito em "Comunicação de Mudança de Preço".
