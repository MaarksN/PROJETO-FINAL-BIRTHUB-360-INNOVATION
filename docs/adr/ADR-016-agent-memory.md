# ADR-016: Arquitetura de Memória de Agentes

## Status
Proposto

## Contexto
No modelo multi-agente do BirthHub360, os agentes operam muitas vezes de forma reativa, sem manter contexto persistente de interações passadas. Para suportar workflows complexos e experiências de usuário mais fluidas, os agentes precisam da capacidade de "lembrar" de informações em diferentes escalas de tempo e com diferentes finalidades (ex: reter as preferências do usuário, lembrar de conversas anteriores de suporte, ou consultar documentação extensa).

Precisamos definir a arquitetura dessa "Memória de Agente", decidindo entre abordagens Ephemerais (de curto prazo) vs Persistentes (de longo prazo), e as tecnologias de armazenamento subjacentes: bancos de dados Vetoriais (Vector DB) vs Chave-Valor (K-V). Além disso, a arquitetura deve garantir isolamento estrito entre tenants e suportar a exclusão de dados sob a LGPD (Lei Geral de Proteção de Dados).

## Decisão

Adotaremos uma **Arquitetura de Memória em Duas Camadas (Tiered Memory)**:

### Camada 1: Memória Efêmera (Working Memory / Short-Term)
*   **Finalidade:** Armazenar o contexto imediato da tarefa ou sessão atual (ex: histórico da thread de chat atual, rascunho de um e-mail sendo gerado, estado transitório do LangGraph).
*   **Tempo de Vida (TTL):** Atrelado ao ciclo de vida do *Job* ou da *Sessão UI* (geralmente horas ou dias). Quando o job termina ou a sessão expira, a memória é descartada (exceto pelos metadados de auditoria).
*   **Tecnologia Subjacente:** **Bancos Chave-Valor em Memória (ex: Redis)** e a própria estrutura de *State* persistida temporariamente pelo orquestrador.
*   **Modelo de Dados:** Estruturado (JSON). O agente pode atualizar o estado via tools específicas ou através do retorno estruturado do grafo.
*   **Características:** Leitura/Escrita extremamente rápida; limite de tokens gerido via janela de contexto (sliding window ou sumarização periódica) antes de enviar ao LLM.

### Camada 2: Memória Persistente (Long-Term Semantic Memory)
*   **Finalidade:** Armazenar conhecimentos gerais do tenant, histórico de longo prazo de clientes específicos, preferências, regras de negócio aprendidas e base de conhecimento.
*   **Tempo de Vida:** Persistente, governado por políticas de retenção específicas (ex: "Excluir dados após 5 anos" ou via pedidos explícitos de "Direito ao Esquecimento" - LGPD).
*   **Tecnologia Subjacente:** **Banco de Dados Vetorial (Vector DB)** (ex: pgvector no PostgreSQL ou um serviço gerenciado como Pinecone/Weaviate).
*   **Modelo de Dados:** Não-estruturado ou semi-estruturado, indexado semanticamente através de Embeddings (ex: OpenAI `text-embedding-3-small`).
*   **Integração com Agentes:**
    *   **Retrieval-Augmented Generation (RAG):** Os agentes usarão a tool `search_memory` (exposta apenas aos agentes autorizados) para consultar dinamicamente essa base. A query do usuário é convertida em um embedding e buscada no Vector DB via similaridade (Cosine/Euclidean).
    *   **Atualização (Write):** Apenas agentes com permissão específica (`write_memory` ou `learn`) poderão adicionar novos fragmentos (chunks) ao Vector DB.

### Isolamento de Tenants na Memória (Security Hardening)
O isolamento na Camada 2 (Vetorial) é o mais crítico, pois uma falha de "cross-tenant leak" exporia dados semânticos de uma empresa para outra.

*   **Implementação:** Adotaremos o isolamento no nível da consulta (Filtering) e da Partição.
    *   Todo registro vetorial (chunk) **DEVE** conter uma chave de metadados rígida: `tenant_id`.
    *   A Tool `search_memory` (que encapsula o acesso ao DB Vetorial) injetará compulsoriamente o `tenant_id` da sessão de execução (invisível ao LLM) na cláusula `WHERE` (ou equivalente no motor vetorial) da busca de similaridade (HNSW/IVFFlat). O LLM nunca poderá forjar o ID de outro tenant.
    *   Isso segue o modelo testado de Row-Level Security (RLS) aplicado a dados não-relacionais.

### Política de Redação (Data Masking & PII)
Como detalhado no item de PII, dados Pessoalmente Identificáveis (PII) críticos (ex: números de cartão, CPFs não essenciais) devem ser omitidos *antes* de serem transformados em Embeddings e salvos na Camada 2, reduzindo o escopo de conformidade do banco vetorial.

## Consequências

*   **Positivas:**
    *   Permite a criação de agentes com capacidades avançadas de RAG, reduzindo alucinações baseando-se em documentos reais do cliente.
    *   A separação em Camada 1 e 2 otimiza custos (o contexto imediato não paga "imposto de embedding" nem incha o banco de longo prazo desnecessariamente).
    *   O isolamento vetorial estrito baseado em filtros (metadata filtering) escala melhor e é mais barato que instanciar um Vector DB separado por Tenant.
*   **Negativas:**
    *   Gerenciar pipelines de Ingestão de Dados (transformar PDFs, e-mails ou logs passados em Embeddings) é complexo, exigindo estratégias de *Chunking*, *Overlapping* e invalidação de cache (quando o documento original muda).
    *   Bancos vetoriais podem se tornar gargalos de custo em escala (ver `docs/analysis/agent-memory-cost.md`).
    *   Exclusão sob demanda (LGPD) em bancos vetoriais pode ser desafiadora se não houver um mapeamento claro entre "Usuário X" e os IDs dos vetores a ele associados.

## Referências
*   Item 4.4.J1 do Ciclo 4 (JULES)
*   [ADR-015: Runtime de Agentes](./ADR-015-agent-runtime.md)
*   Política de LGPD (`docs/policies/memory-retention-lgpd.md`) e Custos (`docs/analysis/agent-memory-cost.md`)
