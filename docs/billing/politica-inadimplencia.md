# Política Geral de Inadimplência (Dunning Process)

A inadimplência no BirthHub360 é tratada com uma série de processos progressivos (Dunning) em vez de cancelamentos sumários, considerando que falhas em cartões de crédito corporativos B2B são comuns.

## Fases da Inadimplência

### Fase 1: Recusa do Pagamento (Dia 0)
- **Ocorrência:** O Stripe tenta cobrar o cartão no dia do vencimento da assinatura (`invoice.payment_failed`) e falha (falta de limite, cartão expirado, ou bloqueio do banco).
- **Ação:** A assinatura no Stripe entra em `past_due`.
- **Comunicação:** Um email automático ("Ação Necessária: Atualize seu método de pagamento") é enviado imediatamente para o proprietário da conta com o link seguro do Stripe Hosted Invoice Page.
- **Impacto no Serviço:** **Nenhum.** O cliente continua tendo acesso total à plataforma. Inicia-se o *Grace Period* (Período de Tolerância).

### Fase 2: Período de Tolerância / Grace Period (Dias 1 a 7)
- **Ocorrência:** O cliente está usando o serviço sem ter pago a fatura do mês atual. O Stripe tenta realizar novas cobranças (Smart Retries) automaticamente nos dias 3, 5 e 7.
- **Ação:** O sistema mantém a assinatura como ativa na UI, mas adiciona um banner persistente vermelho ("Sua conta será suspensa em X dias. Atualize seus dados de pagamento.").
- **Comunicação:** O envio de lembretes ocorre a cada tentativa falha (D+3, D+5, D+7). O tom muda de informativo para urgente no D+7.
- **Impacto no Serviço:** Degradação Leve. Limites extras (overage) podem ser pausados temporariamente para evitar acúmulo de prejuízos irreversíveis com IA caso a dívida não seja paga. O plano base continua funcionando.

### Fase 3: Suspensão e Bloqueio (Dia 8)
- **Ocorrência:** O *Grace Period* termina sem sucesso de pagamento.
- **Ação:** A conta do Tenant e todos os seus usuários (`users` vinculados ao Workspace) são colocados em estado de suspensão (`suspended_past_due`).
- **Comunicação:** E-mail de suspensão confirmando que os agentes, fluxos e automações foram interrompidos e que os dados ficarão inacessíveis em breve.
- **Impacto no Serviço:** Bloqueio Total. Os usuários não podem acessar dados de CRM, pipelines ou relatórios. Todas as integrações (API, Webhooks de terceiros) são rejeitadas com erro 402 Payment Required. Automações de agentes são abortadas (cancelando campanhas e fluxos pendentes).

### Fase 4: Cancelamento Automático (Dia 30)
- **Ocorrência:** Mais de 30 dias de inadimplência contínua.
- **Ação:** A assinatura no Stripe é movida de `past_due` para `canceled`. O Tenant é marcado como cancelado.
- **Comunicação:** E-mail de Desligamento ("Sua assinatura do BirthHub360 foi cancelada devido à falta de pagamento.").
- **Impacto no Serviço:** Revogação final. A recuperação da conta passa a exigir uma nova assinatura manual e os dados podem entrar na fila de *purging* permanente (deleção LGPD), exceto pelos dados de transações financeiras arquivadas.
