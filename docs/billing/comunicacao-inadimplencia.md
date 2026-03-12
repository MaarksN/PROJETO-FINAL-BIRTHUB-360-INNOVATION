# Comunicação de Inadimplência (Dunning Process)

A inadimplência no BirthHub360 é tratada através de um sistema estruturado de cobrança, focado na recuperação e no relacionamento de longo prazo. O "Dunning Process" (processo de cobrança de inadimplentes) deve equilibrar a necessidade de receber os valores devidos com a manutenção da experiência do cliente B2B.

## 1. Princípios de Comunicação

A cobrança de assinaturas não deve ser agressiva inicialmente. Na maioria dos casos B2B, a falha é estrutural (cartão expirou, funcionário responsável saiu da empresa, ou troca de banco) e não falta de fundos.

- **Tom de Voz Amigável (Dias 0 a 3):** Presumimos boa fé. Mensagens do tipo "Identificamos um problema com o pagamento" em vez de "Você está nos devendo".
- **Senso de Urgência (Dias 5 a 7):** O tom passa a destacar os impactos operacionais da perda de acesso ao ecossistema RevOps ("Atenção: Seus Agentes serão pausados no dia [X] por falta de pagamento").
- **Fatores Finais (Cancelamento):** Aviso formal e final de desligamento ("Cancelamos sua assinatura por falta de pagamento contínua").

## 2. Frequência e Canais de Aviso

A cadência de mensagens deve respeitar limites para não configurar assédio (spam) ou causar bloqueios em servidores de e-mail corporativos.

**Canal Principal: E-mail**
- **Dia 0 (Falha Inicial):** "O pagamento da sua fatura [X] falhou." (Contém o link da fatura do Stripe para atualização do cartão).
- **Dia 3 (Lembrete Suave):** "Continuamos sem conseguir processar o pagamento da sua assinatura. Precisamos que atualize os dados em até 4 dias para não interromper seus agentes de venda."
- **Dia 5 (Aviso de Bloqueio Iminente):** "Aviso final antes da suspensão do serviço. Seus Agentes serão desativados em 48h. Seu negócio pode perder reuniões."
- **Dia 7 (Suspensão Efetivada):** "Sua conta do BirthHub360 foi suspensa. Reative-a atualizando seus dados de pagamento no painel."

**Canais Secundários:**
- **In-App (Banners):** Notificações vermelhas destacadas, visíveis a todos os "Admins" (não aos usuários normais/vendedores), persistentes durante o Grace Period, que os levam direto à página de "Billing Settings".
- **Gerente de Contas (Para Enterprise):** Os processos automáticos podem falhar com grandes corporações onde faturas vão para departamentos separados. Para contas Scale/Enterprise, o Agente Financeiro notifica o *Customer Success Manager* (via Slack/Jira) no Dia 3, que ligará pessoalmente para o Financeiro daquele cliente antes do bloqueio (White-glove dunning).

## 3. Opt-out e Responsabilidades Legais
- E-mails de Dunning (cobrança transacional atrelada a prestação de serviços essenciais) **NÃO DEVEM** conter o link padrão de "Unsubscribe" para marketing, pois o cliente é legalmente obrigado a recebê-los enquanto mantiver vínculo contratual em dívida, sob pena de perda imediata do acesso se optar por não ler notificações fiscais.
- O único jeito de o cliente parar de receber e-mails de cobrança é (a) regularizando a situação ou (b) o sistema cancelando a conta dele (Cancelamento Automático após 30 dias de *past_due*). A partir do encerramento oficial do contrato, a comunicação cessa.