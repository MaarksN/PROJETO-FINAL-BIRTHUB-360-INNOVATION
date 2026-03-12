# Política de Retenção de Memória de Agentes (Alinhada à LGPD)

Para garantir a conformidade com a Lei Geral de Proteção de Dados (LGPD) e regulamentações globais de privacidade (ex: GDPR), o ecossistema de agentes do BirthHub360 deve tratar a "memória" (histórico de conversas, dados extraídos, documentos indexados) sob os princípios de **Finalidade** e **Minimização de Dados**.

Esta política define os prazos de retenção (Time-To-Live - TTL) para as diferentes camadas de memória descritas no ADR-016 e estabelece os procedimentos para exclusão de dados.

## 1. Princípios de Retenção

1.  **Minimização:** O agente só deve "lembrar" (armazenar) os dados estritamente necessários para cumprir sua função designada no workflow.
2.  **Finalidade:** Se um dado foi coletado pelo agente para a finalidade de "Triage de Suporte" (ex: número do pedido), ele não deve ser armazenado perpetuamente para finalidades não declaradas (ex: treinamento de modelo genérico) sem consentimento explícito.
3.  **Direito ao Esquecimento:** Todo dado associado a uma pessoa natural (titular dos dados) armazenado na memória do agente deve ser rastreável e passível de exclusão definitiva mediante solicitação (Data Subject Access Request - DSAR).

## 2. Prazos de Retenção (Time-To-Live - TTL)

Os dados armazenados pelos agentes são classificados em três categorias, cada uma com seu TTL padrão:

### A. Memória Efêmera (Working Memory / State)
Dados de transição, estado da execução atual do LangGraph, histórico da sessão de chat em andamento.
*   **Finalidade:** Permitir que o agente conclua a tarefa imediata ou mantenha o contexto da conversa atual com o usuário.
*   **TTL Padrão:** **30 Dias** após a conclusão do Job ou inatividade da sessão.
*   **Ação de Expiração:** Exclusão física (Hard Delete) automática do banco Chave-Valor (Redis) e do banco de estados do orquestrador. Apenas os metadados agregados e anonimizados do job (hora de início, fim, status de erro) são mantidos para auditoria de SLA.

### B. Memória Persistente (Long-Term Semantic Memory)
Conhecimento extraído de interações passadas, preferências do usuário, ou documentos vetorizados para RAG (Retrieval-Augmented Generation).
*   **Finalidade:** Personalizar interações futuras, acelerar a resolução de problemas recorrentes e fornecer contexto histórico ao agente.
*   **TTL Padrão:** **Período de Contrato do Tenant + 90 Dias** (após o encerramento do contrato), OU **2 Anos desde a última interação do usuário**, o que ocorrer primeiro.
*   **Ação de Expiração:** Exclusão lógica ou física dos vetores e metadados no Vector DB. Em caso de encerramento do contrato do tenant, aplica-se o Hard Delete em toda a partição do tenant.

### C. Logs de Auditoria (Audit Trails)
Registros de *quais* ferramentas o agente executou, *quando*, *quem* autorizou e as eventuais falhas.
*   **Finalidade:** Segurança, investigação de incidentes (SIEM), e compliance legal (ex: comprovar que o agente não vazou dados indevidamente).
*   **Regra de Redação:** PII (Dados Pessoalmente Identificáveis) **NÃO** deve ser escrito nos logs de auditoria em texto claro (ver Política de Redação de PII).
*   **TTL Padrão:** **5 Anos** (ou conforme exigência legal específica aplicável ao setor do tenant).
*   **Ação de Expiração:** Arquivamento em cold storage (S3 Glacier) após 1 ano e deleção física após o período legal de 5 anos.

## 3. Atendimento a Direitos dos Titulares (LGPD)

Quando um titular (cliente final de um tenant) exerce seu direito de exclusão de dados:

1.  **Exclusão na Camada 1 (Efêmera):** Qualquer sessão ativa do usuário é imediatamente encerrada e seu contexto é expurgado do banco Chave-Valor.
2.  **Exclusão na Camada 2 (Vetorial/Persistente):**
    *   O Agent Core fornece uma API de `Forget` (`DELETE /v1/memory/users/{user_id}`).
    *   O banco de dados vetorial deve ser capaz de localizar todos os fragmentos (chunks) e embeddings associados a esse `user_id` e realizar o **Hard Delete**.
    *   **Desafio Técnico:** Para viabilizar isso, todo dado inserido na memória de longo prazo (via RAG Ingestion ou ferramentas do agente) DEVE obrigatoriamente possuir um metadado `user_id` ou `entity_id` que vincule o vetor ao titular, além do `tenant_id`. Inserções sem vínculo de titularidade são consideradas "conhecimento geral da empresa" e não estão sujeitas à exclusão por requisição de usuário final.

## 4. Omissão e Sanitização (Data Masking)
Para reduzir o risco e facilitar a conformidade, os agentes são instruídos (via System Prompts e Middleware de Tools) a **não armazenar** informações financeiras sensíveis (PCI-DSS) ou dados de saúde (HIPAA/LGPD Dados Sensíveis) na memória de longo prazo, substituindo-os por placeholders genéricos (ex: `[CARTAO_CREDITO_OCULTO]`) antes da persistência.
