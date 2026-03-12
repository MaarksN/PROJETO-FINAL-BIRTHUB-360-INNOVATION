# Política de Redação de PII (Personally Identifiable Information)

No contexto dos agentes do BirthHub360, os modelos de linguagem (LLMs) frequentemente processam textos livres, e-mails, documentos e registros de banco de dados que contêm informações sensíveis de indivíduos. O armazenamento indefinido, o log não mascarado e o uso indiscriminado desses dados ferem a LGPD e o PCI-DSS.

Esta política define o que é considerado **PII (Personally Identifiable Information)** e os **Mecanismos de Redação** (Ocultação/Mascaramento) obrigatórios em três estágios: Ingestão, Processamento e Registro (Logging).

## 1. O que é PII para o Agent Core?

Qualquer informação que, isoladamente ou em conjunto, possa identificar uma pessoa física.

*   **Identificadores Diretos (Alta Sensibilidade - Redação Rigorosa):**
    *   CPF, RG, Passaporte, CNH.
    *   Números de Cartão de Crédito/Débito (PAN), CVV.
    *   Dados Bancários (Agência, Conta).
    *   Endereços Físicos Completos (Rua, Número, CEP residencial).
    *   Números de Telefone (Celular/Fixo pessoal).
    *   Endereços de E-mail (exceto e-mails de contato público/comercial, ex: `contato@empresa.com`).
    *   Biometria, Informações de Saúde ou Raça (Dados Sensíveis - Proibidos por padrão em contextos não específicos).
*   **Identificadores Indiretos (Sensibilidade Moderada - Avaliação Contextual):**
    *   Nomes Próprios.
    *   Títulos de Cargo e Empresa (quando combinados com outros dados).
    *   Endereços IP.

## 2. A Política de Redação e Mascaramento

### A. Estágio de Processamento (Prompt Injection)
Agentes *podem* precisar processar PII temporariamente na memória efêmera para cumprir sua tarefa (ex: "Enviar e-mail para [E-MAIL] informando recusa do [CARTÃO]").
*   O agente recebe a PII através de uma requisição segura (HTTPS/API interna).
*   **O LLM NUNCA deve ver o número do cartão inteiro ou CVV.** As ferramentas (`tools`) financeiras devem receber tokens (ex: Stripe `tok_xyz`) ou usar mascaramento (`**** **** **** 1234`) antes de injetar os dados de contexto no prompt do agente.
*   **Aviso no Prompt do Sistema:** O Agent Manifest deve instruir o LLM: *"Não inclua números completos de documentos em suas respostas, mascare-os."*

### B. Estágio de Registro e Auditoria (Logging)
*   **Logs de Sistema (STDOUT, Datadog):** **É estritamente proibido** logar identificadores diretos (itens listados em Alta Sensibilidade) em formato de texto claro. O Agent Core implementará um middleware de log que usa Regex ou um modelo NER (Named Entity Recognition) leve para varrer as cargas HTTP/gRPC e o texto do prompt trocando por placeholders (ex: `[REDACTED_CPF]`, `[REDACTED_EMAIL]`).
*   **Trace/Observabilidade:** O payload original enviado ao LLM, contendo PII, não deve ser salvo nas ferramentas de observabilidade de prompt (ex: LangSmith/Phoenix) sem mascaramento prévio.

### C. Estágio de Ingestão e Memória Longa (Vector DB / RAG)
O armazenamento de PII na memória semântica de longo prazo (Camada 2 do ADR-016) cria uma dívida massiva de compliance.
*   Antes de indexar documentos (ex: um contrato em PDF ou transcrição de call) ou chats passados na base vetorial do tenant, **o sistema executará um pipeline de anonimização (DLP).**
*   **Ação Obrigatória:** Substituir todos os CPFs, Números de Cartão, e Telefones por tokens identificadores (`[USUARIO_TELEFONE]`, `[CLIENTE_CPF]`) nos "chunks" de texto gerados.
*   Isso garante que se a base vetorial for comprometida, ou se houver um "vazamento cross-tenant" (Cross-Tenant Leak), o impacto de exfiltração de dados pessoais é quase nulo.

## 3. Lista de Regex de Bloqueio/Mascaramento (Para Implementação Core)

O Agent Core implementará bibliotecas padrão (ex: `presidio-analyzer` da Microsoft) para detecção de PII. Pelo menos os seguintes padrões devem ser mascarados proativamente antes do Logging:

*   **CPF/CNPJ:** `[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}`
*   **Cartões de Crédito:** `(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})` (Exemplos genéricos, não armazenar).
*   **E-mails:** `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}`

## 4. Exceções e Justificativa

*   **Necessidade Operacional Estrita:** Algumas tools (ex: "Criar Cliente no ERP") devem receber os dados em texto claro. O mascaramento ocorre na ida e volta da resposta do log e nas requisições do orquestrador para ferramentas analíticas, não na comunicação `Agent Worker -> API Externa`, que deve ser trafegada sobre TLS. A responsabilidade de proteção do dado em repouso nesses casos é do destino (o ERP ou Gateway Financeiro).
