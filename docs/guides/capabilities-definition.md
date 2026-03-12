# Definição de Capabilities de Agentes e Safety Rails

Este guia define as capacidades básicas que podem ser atribuídas a um agente no ecossistema BirthHub360, e os mecanismos de segurança (safety rails) associados a cada uma.

Essas capacidades devem ser declaradas explicitamente na seção `capabilities` do Agent Manifest (ver ADR-013).

## Princípios Básicos

1.  **Menor Privilégio:** Um agente só deve receber as permissões estritamente necessárias para sua função.
2.  **Explicit Consent (Consentimento Explícito):** Ações de alto impacto, como pagamentos ou e-mails em massa, não ocorrem silenciosamente.
3.  **Auditabilidade:** O uso de qualquer capacidade é logado.
4.  **Policy Engine:** As políticas podem restringir ainda mais uma capacidade (ex: pode ler, mas não de `tenant_B`).

## As Capacidades (Capabilities)

### 1. `read` (Leitura)
Permite ao agente consultar dados do sistema (bancos de dados, APIs internas, logs, etc) de forma não destrutiva e sem causar mutações.

*   **Exemplos de Tools associadas:** `sql_query_readonly`, `fetch_user_profile`, `get_metrics`.
*   **Safety Rails:**
    *   **Scope Restriction (Isolamento de Tenant):** Acesso estritamente limitado aos dados do tenant que iniciou a execução, reforçado pelo Policy Engine em nível de banco de dados/API.
    *   **PII Masking (Ocultação de Dados Pessoais):** O acesso a campos sensíveis (PII) é mascarado ou bloqueado no nível da ferramenta (Tool), a menos que o agente tenha uma sub-capacidade explícita (`read:pii`) e haja base legal (LGPD).
    *   **Rate Limiting e Timeouts:** Limites estritos no número de consultas e no tempo de execução para prevenir ataques de negação de serviço (DDoS) internos no banco.
    *   **Tamanho de Resposta (Payload Limits):** Truncamento de respostas longas para evitar exaustão de memória no worker e estouro de limite de tokens no LLM.

### 2. `write` (Escrita / Mutação de Dados)
Permite ao agente inserir, atualizar ou (raramente) deletar dados dentro do sistema.

*   **Exemplos de Tools associadas:** `update_customer_status`, `insert_invoice`, `create_ticket`.
*   **Safety Rails:**
    *   **Validação de Schema:** Toda mutação passa por um validador de schema estrito antes de atingir o banco de dados.
    *   **Human-in-the-Loop (HITL) Condicional:** Mutação de entidades críticas (ex: status de pagamento, exclusão de conta) é interrompida e enviada para aprovação humana antes do commit.
    *   **Idempotência:** As ferramentas de escrita devem ser projetadas para serem idempotentes. Em caso de retry devido a falhas de rede, a mesma escrita não deve duplicar o registro.
    *   **Auditoria Forte (Audit Trail):** Toda operação de escrita gera um evento imutável com o ID do agente, ID do Job, payload, timestamp e tenant.
    *   **Reversibilidade (Rollback):** Sempre que possível, manter versões do estado anterior para facilitar reversão em caso de alucinação do agente.

### 3. `execute` (Execução de Ações / Orquestração)
Permite ao agente iniciar processos de negócio, acionar sistemas externos via API (fora do domínio interno de dados), ou iniciar workflows em outros agentes.

*   **Exemplos de Tools associadas:** `trigger_payment_gateway`, `start_onboarding_workflow`, `call_external_webhook`.
*   **Safety Rails:**
    *   **Lista de Permissões (Allowlist) de Endpoints:** O agente só pode se comunicar com URLs ou serviços especificamente permitidos no seu manifesto e na configuração do tenant (Policy Engine).
    *   **Bloqueio de SSRF:** Prevenção contra Server-Side Request Forgery. Ferramentas HTTP usadas pela capacidade `execute` são proibidas de resolver para ranges de IP privados (ex: `10.x.x.x`, `127.0.0.1`, `169.254.169.254`), a menos que o destino seja explicitamente mapeado em uma rede isolada.
    *   **Isolamento de Credenciais:** As chaves de API externas não são passadas no prompt do agente. O agente passa parâmetros para a Tool, e a Tool injeta os secrets de forma segura usando um Vault.
    *   **Circuit Breakers:** Interrupção rápida (fail fast) se o serviço externo começar a falhar ou demorar excessivamente.
    *   **Limites de Gastos (Spend Limits):** Integrações pagas têm um teto orçamentário rígido (diário/mensal) por tenant/agente.

### 4. `notify` (Notificação e Comunicação)
Permite ao agente enviar mensagens diretamente para usuários humanos (clientes, gestores, equipe).

*   **Exemplos de Tools associadas:** `send_email`, `send_slack_message`, `send_sms`.
*   **Safety Rails:**
    *   **Filtro de Conteúdo e Anti-Spam:** Todo conteúdo gerado passa por um modelo secundário (ou heurística) para detectar linguagem imprópria, vazamento de dados sensíveis ou comportamento de spam antes do envio.
    *   **Templates Pré-Aprovados:** Em ambientes mais restritos, o agente não pode compor o texto livremente; ele só pode preencher variáveis em templates previamente aprovados.
    *   **Limites de Frequência (Rate Limits de Notificação):** Restrição severa na quantidade de mensagens que o agente pode enviar para um mesmo destinatário em um dado período (ex: max 1 email por hora por cliente).
    *   **Canal de Escalonamento (Fallback):** Se o agente falhar ao notificar, ou a confiança (confidence score) da mensagem for baixa, a tarefa é roteada para um humano.
    *   **Identificação Clara:** Toda notificação deve indicar claramente que foi gerada e enviada por uma IA/Agente.

## Revisões
A adição de novas capacidades requererá uma revisão da arquitetura de segurança (Security Review) e atualização deste guia.
