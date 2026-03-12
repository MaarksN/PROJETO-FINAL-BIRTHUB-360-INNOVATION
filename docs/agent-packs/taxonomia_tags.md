# Taxonomia de Tags para Agent Packs

Este documento define a taxonomia padrão de tags a ser utilizada nos manifestos (`manifest.yaml`) de todos os Agent Packs do BirthHub360. O uso consistente de tags é essencial para a descoberta, filtragem e curadoria no Catálogo Oficial.

## Categorias de Tags

As tags devem seguir a convenção `categoria:valor`. Abaixo estão as categorias oficiais e exemplos de valores permitidos.

### 1. Domínio (`domain:`)
Indica a grande área funcional à qual o agente pertence.
*   `domain:sales` (Vendas e Pré-vendas)
*   `domain:marketing` (Marketing, Mídia, Conteúdo)
*   `domain:cs` (Sucesso do Cliente, Pós-venda, Suporte)
*   `domain:finance` (Faturamento, Cobrança, Controladoria)
*   `domain:legal` (Jurídico, Contratos, Compliance)
*   `domain:ops` (RevOps, Sales Ops, Data Ops)

### 2. Papel/Persona (`role:`)
Descreve a função específica que o agente emula ou para qual humano ele atua como copiloto.
*   `role:sdr` (Sales Development Rep)
*   `role:bdr` (Business Development Rep)
*   `role:ae` (Account Executive / Closer)
*   `role:am` (Account Manager)
*   `role:analyst` (Analista de Dados / Ops)
*   `role:manager` (Gerente / Coordenador)

### 3. Nível de Custo / Complexidade (`tier:`)
Indica o consumo esperado de recursos (LLM tokens, chamadas de tools).
*   `tier:low` (Tarefas rápidas, modelos mais baratos)
*   `tier:medium` (Análises moderadas, fluxo padrão)
*   `tier:high` (Raciocínio complexo, modelos caros, alto uso de tools)

### 4. Conformidade e Governança (`compliance:`)
Indica se o agente lida com dados que requerem tratamento regulatório específico.
*   `compliance:lgpd` (Processa PII/dados sensíveis sujeitos à LGPD)
*   `compliance:hitl_req` (Requer Human-In-The-Loop para ações de escrita/estado)
*   `compliance:internal` (Apenas para uso interno, sem dados de cliente final)

## Regras de Aplicação

1.  **Obrigatoriedade:** Todo manifest **deve** ter pelo menos uma tag `domain:` e uma tag `role:`. As tags `tier:` e `compliance:` são recomendadas, mas opcionais, dependendo da criticidade.
2.  **Múltiplas Tags:** Um agente pode ter múltiplas tags de uma mesma categoria se a função for hibrida (ex: `domain:sales`, `domain:ops`), embora a especialização seja preferida.
3.  **Tags Personalizadas:** Além destas prefixadas, tags livres curtas são permitidas para skills específicas (ex: `prospecting`, `contract-review`, `churn-prediction`), desde que não conflitem com as categorias oficiais.
