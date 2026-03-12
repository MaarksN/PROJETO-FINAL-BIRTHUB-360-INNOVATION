# Impacto da Inadimplência em Workflows em Execução

Os Agentes do BirthHub360 executam fluxos de trabalho (Workflows) complexos e assíncronos. Um Workflow de prospecção do *Agente SDR*, por exemplo, pode enviar um email, aguardar 3 dias (estado `WAITING`), e enviar um follow-up.

A principal questão durante a suspensão por inadimplência é: **O que acontece com os fluxos (pipelines) que já foram iniciados, mas que ainda estão rodando no momento exato em que a conta é suspensa?**

## 1. Tratamento de Workflows Ativos (Suspensão e Congelamento)

A suspensão abrupta (abortando processos em execução) geraria dados corrompidos. Portanto, o sistema deve adotar uma abordagem de **Congelamento Seguro (Graceful Suspend)** para os fluxos da plataforma (LangGraph/Orquestrador):

- **Processos Síncronos (Sendo Processados Imediatamente):** Se um Agente está consumindo a API da OpenAI/Anthropic no milissegundo em que a assinatura do Tenant muda para `suspended_past_due`, a transação de banco de dados *não* é interrompida forçadamente. O agente termina sua inferência, salva o estado atual do *Node* no LangGraph, mas **não aciona o próximo passo do Workflow**.
- **Processos Assíncronos (Aguardando Retorno ou Agendados):** Workflows em estados de espera (ex: Cronjobs agendados para o dia seguinte, e-mails agendados na fila do SendGrid/RabbitMQ) devem ter uma verificação (`check_tenant_status()`) *antes* de executar sua lógica. Se o Tenant estiver suspenso, o Job/Workflow muda seu estado de `SCHEDULED` ou `WAITING` para **`PAUSED_DUE_TO_BILLING`**.
- O sistema não deve dropar as filas. Um cliente inadimplente que paga a conta 3 dias depois quer que seus follow-ups sejam retomados de onde pararam.

## 2. Inadimplência Transitória vs. Inadimplência Terminal

### A. Suspensão Reversível (Dias 8 a 30)
- Os Workflows e Agentes ficam no estado `PAUSED_DUE_TO_BILLING`.
- A API pública/Webhooks do cliente (ex: um webhook do Typeform que alimentava um Lead) retornarão o código HTTP `402 Payment Required` para os sistemas externos e droparão o *input* externo. A responsabilidade de retentativa passa a ser do sistema externo do cliente. O BirthHub360 **não armazena eventos** para clientes suspensos devido a custos de infraestrutura e sobrecarga na fila de mensagens.

### B. Inadimplência Terminal (Dia 30 - Cancelamento)
- Quando o *Grace Period* longo termina e a assinatura do Tenant é cancelada (`canceled`), os Workflows no estado `PAUSED_DUE_TO_BILLING` não têm mais esperança de serem retomados.
- Um Job de Limpeza (Garbage Collector) varrerá a base do Orquestrador:
    1. Muda o estado de todos os Workflows pausados para **`ABORTED`** ou **`CANCELED`**.
    2. Apaga as *Promises* pendentes em filas temporárias (RabbitMQ/Redis).
    3. Remove os *Webhooks* registrados nas plataformas externas (ex: desinscreve o webhook do Typeform do cliente via API), cortando completamente a conexão do BirthHub360 com o mundo externo do cliente para economizar tráfego inútil de API na infraestrutura da empresa.