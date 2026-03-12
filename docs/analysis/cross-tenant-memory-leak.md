# Análise de Risco: Vazamento de Memória Cross-Tenant (Memory Leak)

No BirthHub360, a arquitetura multi-tenant significa que dados de múltiplos clientes residem fisicamente nas mesmas instâncias de banco de dados (Vetorial e Chave-Valor). O risco mais crítico de segurança nesse modelo é o "Cross-Tenant Memory Leak" — quando o Agente do Tenant A consulta ou utiliza dados (memória) que pertencem ao Tenant B.

Esta análise descreve como um vazamento pode ocorrer nas camadas de memória (ADR-016) e os controles implementados para prevenção e detecção.

## 1. Vetores de Ataque e Falha Sistêmica

### A. Vazamento na Camada 1 (Memória Efêmera / Redis)
*   **A Falha:** O orquestrador de agentes usa uma chave estática ou previsível no Redis para salvar o estado do LangGraph (ex: `state:active_thread`). O Tenant A e o Tenant B executam jobs simultaneamente. A execução de B sobrescreve o estado de A, e o agente de A lê a resposta destinada a B.
*   **O Impacto:** O usuário do Tenant A recebe no chat a resposta gerada para o usuário do Tenant B (contendo PII do Tenant B).
*   **Mitigação (Prevenção):**
    *   **Namespacing Obrigatório:** Todas as chaves no K-V store DEVEM ser prefixadas com o ID do tenant (ex: `tenant_{id}:thread_{id}`).
    *   O código das *Tools* não deve ter acesso direto à API bruta do Redis. Elas devem usar um wrapper SDK fornecido pelo Agent Core que aplica o prefixo do `tenant_id` automaticamente usando o contexto injetado pelo orquestrador.

### B. Vazamento na Camada 2 (Memória Persistente / Vector DB)
*   **A Falha:** Um agente do Tenant A, operando de forma autônoma ou induzido por um *Prompt Injection* de um usuário malicioso, solicita uma busca na memória vetorial (RAG) ampla: `"Busque todos os documentos que contenham a palavra 'senha'"`. A engine de busca no Vector DB ignora ou permite burlar o filtro de tenant.
*   **O Impacto:** O Vector DB retorna chunks de documentos do Tenant B (ex: um manual de integração de API contendo tokens) para o prompt do agente do Tenant A. O LLM do Tenant A usa essa informação na sua resposta. O atacante exfiltra segredos corporativos de B.
*   **Mitigação (Prevenção):**
    *   **Hard RLS (Row-Level Security):** O filtro de `tenant_id` na query vetorial (metadata filtering) nunca deve ser um parâmetro passado pela Tool ou pelo Agente. A injeção do filtro `WHERE tenant_id = 'X'` deve ocorrer na camada de infraestrutura (Database Proxy ou ORM) que recebe o contexto diretamente do JWT de autenticação do job.
    *   Mesmo que o LLM do Tenant A ordene à Tool `search_memory` que busque "dados do tenant B", a camada de infraestrutura reescreverá a query forçando `tenant_id = A`, resultando em 0 documentos encontrados de B.

### C. Vazamento via Fine-Tuning de Modelos (Memory Bleed no LLM)
*   **A Falha:** A equipe do BirthHub360 decide treinar/fine-tunar um modelo próprio (open-source) usando os logs de interação (memória) de *todos* os tenants para melhorar a performance geral.
*   **O Impacto:** O LLM "decora" (memoriza) dados específicos de um cliente (ex: números de cartão, nomes de projetos sigilosos). Durante uma interação com o Tenant C, o modelo alucina ou vomita os dados memorizados do Tenant A.
*   **Mitigação (Prevenção):**
    *   **Proibição de Fine-Tuning Misto com PII:** É estritamente proibido usar dados não-anonimizados de clientes para fine-tuning de modelos globais da plataforma.
    *   O fine-tuning só deve ser feito com datasets curados internamente, gerados sinteticamente, ou sob permissão expressa (Opt-In) e após agressiva anonimização e redação (ver `docs/policies/pii-redaction.md`). Modelos fine-tunados para um tenant específico devem ser isolados (dedicados).

## 2. Como Detectar Vazamentos Ativos (Monitoring)

Mesmo com prevenções rígidas, precisamos de mecanismos de detecção em tempo real para identificar falhas lógicas imprevistas.

*   **DLP (Data Loss Prevention) no Output dos Agentes:**
    *   O Agent Core deve inspecionar as respostas geradas pelos agentes (antes de retorná-las aos usuários ou serviços externos) usando heurísticas ou um modelo secundário pequeno.
    *   Se a resposta destinada ao Tenant A contiver identificadores conhecidos do Tenant B (ex: o domínio de email `@empresaB.com` ou um ID de cliente que sabidamente pertence a B), a mensagem é bloqueada, e um alerta crítico (P0) é disparado para a equipe de AppSec.
*   **Auditoria de Acesso (Access Logs no DB):**
    *   O Vector DB e o PostgreSQL devem logar todas as queries. Ferramentas de SIEM analisam as queries e alertam se um *Worker Role* associado ao processamento de um tenant fizer `SELECT` retornando linhas onde `tenant_id` não bate com o contexto da thread.

## 3. Conclusão

Vazamentos de memória cross-tenant em plataformas baseadas em RAG e agentes autônomos são destrutivos para a confiança e violam fatalmente a LGPD/GDPR. A mitigação baseia-se na **desconfiança total do LLM**: o agente nunca deve ser responsável por passar seu próprio "crachá" (tenant_id) para o banco de dados. A infraestrutura abaixo dele deve impor o isolamento.
