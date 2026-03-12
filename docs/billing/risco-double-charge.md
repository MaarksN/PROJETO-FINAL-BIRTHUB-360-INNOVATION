# Análise de Risco de Double Charge (Cobrança Duplicada)

## O Risco
Uma cobrança duplicada ocorre quando um cliente (ou sua empresa) é cobrado mais de uma vez pelo mesmo serviço/plano num intervalo indevido (normalmente no mesmo checkout). Esse erro gera imensa insatisfação, disputas bancárias (*chargebacks*) que prejudicam a métrica da conta Stripe, custos de taxas estornadas e sobrecarga ao suporte.

## Cenários Comuns e Medidas de Prevenção

### Cenário 1: Cliques Múltiplos no Botão de "Pagar" (Client-Side Race Condition)
O usuário, impaciente ou enfrentando latência da internet, clica repetidas vezes no botão "Finalizar Compra", engatilhando vários requests de criação de pagamento ao mesmo tempo.

**Medida Preventiva (Frontend e Backend):**
1. O botão deve mudar de estado para `disabled` (carregando) imediatamente após o primeiro clique.
2. Usar o recurso `Idempotency-Key` em **todas** as chamadas para a API do Stripe (criação de cliente, assinatura, pagamento). A key, gerada no backend, garante que se o mesmo request (repetido acidentalmente) for enviado, o Stripe apenas retornará o sucesso anterior sem cobrar novamente.

### Cenário 2: Concorrência ao Atualizar Planos (Upgrade Simultâneo)
Dois administradores de conta (ou o mesmo em abas distintas) disparam um upgrade (ex: Starter para Growth) quase no mesmo milissegundo. O backend pode disparar duas requisições diferentes sem que a primeira termine, gerando múltiplas assinaturas ativas para o mesmo *Tenant*.

**Medida Preventiva (Banco de Dados e Stripe):**
1. Bloqueios Otimistas (Optimistic Concurrency Control - OCC) no banco de dados, usando uma versão do plano (`version` column) no *Tenant*, rejeitando a segunda mudança se a versão for alterada.
2. Uma verificação antes do `stripe.subscriptions.create`: checar se o `Customer` já possui uma assinatura ativa do plano.

### Cenário 3: Webhooks Atrasados / Retries do Stripe
O pagamento é feito, mas o webhook de confirmação (`invoice.paid`) não chega ou falha ao processar no backend. A interface do usuário mostra "Pendente/Erro" e permite tentar o pagamento novamente (quando a cobrança já foi efetivada).

**Medida Preventiva (Conciliação):**
1. Ao invés de basear o sucesso apenas no webhook, consultar a API diretamente se o status não atualizar após a expiração de um timer no frontend.
2. Caso o usuário retorne à tela, garantir que o botão mude para "Assinatura Ativa" e redirecione, caso o banco detecte o pagamento via webhook tardio.

### Cenário 4: Falha Aparente na Captura do Cartão (Soft Declines / 3D Secure)
O banco exige a verificação 3D Secure e a UI não carrega o modal do Stripe; a transação fica como `requires_action` mas a API retorna erro (ou o usuário a abandona). O cliente acha que falhou e insere os dados novamente em uma nova intenção de compra.

**Medida Preventiva:**
Manter a `PaymentIntent` ou o `SetupIntent` já criada associada àquele *Checkout Session* em aberto no banco e retomá-la para o cliente caso ele falhe a autenticação 3D, ao invés de sempre criar um novo ID (novo carrinho).