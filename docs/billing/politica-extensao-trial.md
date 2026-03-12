# Política de Extensão de Período de Testes (Trial Extension)

No modelo SaaS B2B, grandes empresas ou clientes com processos morosos de aprovação de software podem solicitar mais tempo antes de se comprometerem com um plano pago (como o Scale ou Enterprise). O BirthHub360 adota a política de conceder extensões de Trial, desde que regras estritas sejam seguidas para evitar abusos e prolongamentos sem intenção de compra real.

## 1. Critérios de Elegibilidade
A extensão de Trial **não é automática**. O cliente deve solicitá-la ativamente (ex: respondendo aos emails D+13 ou por chamado de Suporte) ou um Executivo de Vendas (Account Executive - AE) pode oferecê-la ativamente em negociações maiores.

- **Cliente Ativo:** O cliente deve ter feito setup mínimo na plataforma (conectar integrações, configurar pelo menos um agente ou convidar membros da equipe). Contas inativas por 14 dias sem uso não recebem extensão, salvo se comprovarem problema técnico impeditivo durante o trial original.
- **Porte do Cliente (ICP):** A prioridade é para empresas que se encaixam no nosso Ideal Customer Profile (mid-market ou Enterprise). Pequenas empresas e consultores individuais geralmente não devem receber extensões repetitivas.

## 2. Limites e Aprovação
A política estabelece limites para o número de vezes e duração da extensão.

- **Prazo Máximo da Extensão:** O período máximo concedido de uma só vez é de **14 dias adicionais**.
- **Limite de Vezes:** O Trial pode ser estendido no máximo **uma (1) vez** pela equipe de Atendimento/SDR. Ou seja, o máximo de dias não faturados chega a **28 dias totais**.
- **Exceções Enterprise:** Apenas a Diretoria ou Gerentes de Vendas podem aprovar um trial que passe dos 28 dias totais (geralmente por conta de homologação complexa ou aprovações orçamentárias corporativas documentadas).

## 3. Registro e Execução (Técnica)
As extensões devem ser executadas no Painel Administrativo ou diretamente via Stripe.

- **Stripe:** O suporte pode estender o Trial alterando a data `trial_end` da Subscription no Stripe. O sistema (através do webhook `customer.subscription.updated`) refletirá a nova data para o Tenant no banco de dados.
- **Auditoria Interna:** Cada solicitação de extensão deve conter uma anotação breve (ex: "Aguardando orçamento de TI ser aprovado na Reunião de Terça") registrada no CRM ou sistema de Suporte, vinculada ao `tenant_id`. Se um cancelamento ou novo pedido ocorrer depois de um longo processo, há histórico.

## 4. Retirada de Extensão (Revogação)
A equipe comercial pode revogar a extensão imediatamente se houver violação dos Termos de Serviço ou suspeita de "Trial Abuse" (uso excessivo e massivo de IA e requisições apenas para processar uma base temporária, caracterizando esgotamento de *overage* de graça).