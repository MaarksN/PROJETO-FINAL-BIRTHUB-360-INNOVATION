# Análise de Custos de Memória de Agentes (Modeling para Pricing)

No BirthHub360, a infraestrutura que suporta a arquitetura de memória em duas camadas (ADR-016) incorre em custos subjacentes que variam linearmente (ou exponencialmente) com o uso do Tenant. Para que a plataforma mantenha margens saudáveis, é imperativo que os custos de armazenamento e processamento da memória sejam modelados com precisão e repassados na estratégia de precificação (Pricing Model) do SaaS.

Esta análise detalha a estrutura de custos envolvida em manter "lembranças" para os agentes por tenant, considerando o processamento, armazenamento de embeddings e persistência.

## 1. Motores de Custo por Camada de Memória

### Camada 1: Memória Efêmera (Short-Term / Redis)
*   **O Que É:** Estado transitório, histórico da sessão ativa (Context Window).
*   **Armazenamento (Storage):** RAM em clusters in-memory (ex: Amazon ElastiCache / Redis).
*   **Custo Unitário Estimado:** Muito Baixo (~$0.01 por GB/mês, assumindo alta rotatividade e expiração rápida).
*   **Custo Oculto (Context Window LLM):** O verdadeiro custo da memória efêmera não é o armazenamento, mas o repasse do histórico para a API do LLM a cada turno.
    *   Exemplo: Se a thread tem 10.000 tokens e o usuário faz 5 perguntas, o agente repassa (10k + 12k + 14k...) tokens de *input* para a OpenAI/Anthropic.
    *   **Mitigação de Custo:** Summarização da janela de contexto (reduz a thread longa a um resumo de 500 tokens).

### Camada 2: Memória Persistente (Long-Term / Vector DB)
*   **O Que É:** Documentos ingeridos, histórico de longo prazo, regras de negócio vetorizadas (RAG).
*   **Custos Envolvidos (3 Fases):**
    1.  **Ingestão (Compute + Embedding Model):** Custo de extrair texto (OCR se PDF), fazer chunking e chamar a API de Embeddings (ex: `text-embedding-3-small`).
        *   *Custo:* ~$0.02 por 1 milhão de tokens indexados.
    2.  **Armazenamento (Vector Storage + Index RAM):** Para que a busca semântica seja rápida, a maioria dos Vector DBs (Pinecone, Qdrant, pgvector) mantém os índices HNSW na RAM. Armazenar milhões de vetores densos (ex: 1536 dimensões) requer infraestrutura cara.
        *   *Custo:* ~$0.10 a $0.50 por GB/mês em serviços gerenciados. (1 GB = ~3 milhões de vetores/chunks de 512 tokens).
    3.  **Recuperação / Query (Compute):** O custo de rodar a busca ANN (Approximate Nearest Neighbor) e o LLM para sintetizar a resposta.
        *   *Custo:* Baixo para o DB, alto para o LLM de geração.

## 2. Modelagem de Consumo Típico por Perfil de Tenant

Para formatar o Pricing, simulamos três cenários de uso:

### Cenário A: Startup / PME (Plano Free/Starter)
*   **Uso:** Agentes básicos (SDR, Triage de Suporte). Memória de longo prazo limitada a manuais de produto (100 MB de texto bruto).
*   **Armazenamento Vetorial:** ~300.000 chunks (~100 MB indexados).
*   **Custo Mensal (Infra):** ~$0.50 a $2.00 / tenant.
*   **Recomendação de Pricing:** Absorvido na taxa fixa mensal (Flat Fee) do plano. Limite rígido (Quota) de 500 MB de ingestão de documentos.

### Cenário B: Mid-Market (Plano Pro)
*   **Uso:** Agentes de Customer Success que precisam "lembrar" do histórico de tickets de milhares de clientes (10 GB de texto bruto estruturado e não-estruturado).
*   **Armazenamento Vetorial:** ~30 milhões de chunks (~10 GB indexados na RAM do Vector DB).
*   **Custo Mensal (Infra):** ~$20.00 a $50.00 / tenant (só pelo armazenamento vetorial).
*   **Recomendação de Pricing:** Cota base inclusa (ex: 5 GB). Cobrança de **Overage (Usage-Based)** de $X por GB adicional indexado por mês, além de repasse de custo da API de Embedding na ingestão.

### Cenário C: Enterprise (Bespoke)
*   **Uso:** Ingestão massiva de transcrições de chamadas de vendas diárias, PDFs corporativos, e base histórica de 10 anos (Terabytes de dados).
*   **Armazenamento Vetorial:** Cluster Dedicado de Vector DB (Isolamento total de infraestrutura).
*   **Custo Mensal (Infra):** $500.00+ / tenant.
*   **Recomendação de Pricing:** Cluster dedicado repassado integralmente no contrato Enterprise + Margem SaaS (Mark-up).

## 3. Alavancas de Otimização de Custos (Cost Engineering)

Para maximizar a margem (Gross Margin) do BirthHub360, a engenharia implementará as seguintes estratégias:

1.  **Modelo de Embeddings Mais Barato/Local:** Substituir a chamada para APIs proprietárias (OpenAI) na ingestão de RAG por modelos abertos e rápidos hospedados na própria infraestrutura (ex: `BGE-m3` ou `nomic-embed-text` rodando em instâncias de GPU Spot), reduzindo o custo de ingestão a quase zero.
2.  **Compressão Vetorial (Quantização):** Usar Quantização Escalar (SQ) ou Quantização de Produto (PQ) no Vector DB. Reduzir vetores de `float32` para `int8` diminui o uso de RAM (e os custos) em até 4x, com perda mínima de precisão na busca (Recall).
3.  **Tiering de Armazenamento Automático:**
    *   Manter índices "quentes" (acessados na última semana) na RAM (Pinecone/RAM-based).
    *   Fazer "offload" de vetores "frios" (arquivos de 2 anos atrás) para armazenamento em disco (S3/EBS) usando tecnologias como LanceDB ou índices baseados em disco do Milvus. Se o agente precisar de um dado velho, a query demora 2 segundos em vez de 50ms (aceitável para batch jobs).
4.  **Expurgo Agressivo (TTL):** Fazer cumprir rigorosamente as políticas de retenção da LGPD (`memory-retention-lgpd.md`) para deletar dados antigos do Vector DB automaticamente, contendo o inchaço dos custos.

## Conclusão

A funcionalidade de "Agentes que lembram de tudo" é um diferencial de vendas enorme (Killer Feature), mas pode corroer a rentabilidade do SaaS se oferecida ilimitadamente (All-You-Can-Eat). O modelo de Pricing deve incluir cotas explícitas de Armazenamento de Memória (Long-Term Storage Quotas) nos planos PME/Pro, complementadas com engenharia agressiva de quantização e modelos de embedding locais para manter a infraestrutura escalável e barata.
