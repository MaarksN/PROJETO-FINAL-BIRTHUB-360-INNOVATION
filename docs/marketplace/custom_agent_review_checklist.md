# Checklist de Revisão de Agente Customizado (Packs Nível 2)

## 1. Objetivo
Este documento serve como guia padronizado para os Engenheiros de Trust & Safety do BirthHub360 realizarem as revisões de Packs Nível 2 (que contêm código Python/Node customizado e integrações de rede). O objetivo é mitigar riscos à plataforma e garantir a qualidade dos artefatos publicados.

## 2. Instruções de Preenchimento
Cada item deste checklist (20 pontos obrigatórios) deve ser validado pelo revisor antes que o Pack possa ser aprovado e assinado pela CA Central (ver ADR-029).

Qualquer item marcado como "NÃO" que seja crítico (código vermelho) resulta em reprovação imediata. Itens marcados como "NÃO" não-críticos (amarelo) resultam em aprovação com ressalvas ("Awaiting Author Changes").

## 3. Checklist: 20 Pontos Obrigatórios

### 3.1. Identidade e Metadados (Qualidade)
*   **[1] Título e Descrição Claros:** O nome do pack, subtítulo e descrição refletem de forma precisa e não enganosa as funcionalidades reais do Agente.
*   **[2] Tags Corretas:** As categorias e tags (`marketing`, `sales`, `hr`) estão de acordo com o caso de uso e não são usadas como *spam tag*.
*   **[3] Instruções de Instalação (README):** O pacote inclui documentação clara de como instalar, quais credenciais externas são necessárias e exemplos de *prompts* que acionam o Agente de forma eficaz.
*   **[4] Transparência de Custos (Third-Party):** Se o pack requer assinaturas pagas em serviços externos (ex: Salesforce, OpenAI via API Key do usuário), isso está claramente e prominentemente avisado no topo da documentação.

### 3.2. Análise do Manifest.yaml (Estrutura)
*   **[5] Validação de Esquema:** O arquivo `manifest.yaml` (ou `.json`) do pacote valida corretamente contra o esquema SemVer e a versão de API do BirthHub360 declarada.
*   **[6] Declaração Explícita de Tools:** Todas as ferramentas invocáveis (tools) estão corretamente listadas com seus mapeamentos de entrada/saída no manifesto, sem chamadas de código "soltas" no inicializador do Agente.
*   **[7] Escopo de Permissões Mínimo:** As permissões solicitadas ao Orquestrador do BirthHub360 (`READ_DATALAKE`, `WRITE_KNOWLEDGEBASE`) são proporcionais e estritamente necessárias para o funcionamento descrito do Agente.

### 3.3. Inspeção de Código Customizado (Segurança - SAST/DAST)
*   **[8] Ausência de Execução Arbitrária (RCE):** O código (Python/Node) **não** utiliza chamadas perigosas do sistema operacional (ex: `os.system`, `subprocess.Popen`, `eval()`, `exec()`) que permitam escalonamento de privilégios ou fuga da *sandbox*.
*   **[9] Gestão Segura de Credenciais (Zero Hardcoding):** Não há *tokens*, *passwords*, *API Keys* embutidas (hardcoded) em texto plano no código-fonte, scripts ou *System Prompts* do pacote submetido. O Agente exige e consome credenciais passadas de forma segura (variáveis de ambiente, cofres do Tenant).
*   **[10] Controle Rigoroso de Rede (Egress Filtering):** O pacote declara explicitamente no `manifest.yaml` para quais domínios/URLs externos ele fará chamadas de rede (ex: `api.github.com`).
*   **[11] Prevenção de Exfiltração:** O revisor confirmou via análise estática que não há rotinas no código que leiam arquivos locais não autorizados ou estoquem dados sensíveis do contexto em *webhooks* obscuros.
*   **[12] Sanitização de Inputs:** As ferramentas (tools) validam o tipo e formato das entradas (*type hinting* forte em Pydantic ou equivalente) antes de passá-las para lógicas de negócio ou APIs de terceiros.
*   **[13] Dependências Confiáveis (Allowlist):** Se o pacote utiliza bibliotecas de terceiros (ex: PyPI, npm), elas estão restritas às dependências aprovadas pelo BirthHub360 ou foram verificadas em bancos de dados de vulnerabilidades (CVEs) sem criticidade pendente.

### 3.4. Análise Semântica e Qualidade do LLM (Prompts)
*   **[14] Prevenção de Prompt Injection (Autor):** O *System Prompt* do agente não contém instruções que incentivem o LLM a desobedecer *guardrails* padrão da plataforma ("ignore as regras de segurança anteriores...").
*   **[15] Alinhamento Comportamental (Toxicidade):** O agente não foi desenhado para contornar filtros éticos ou gerar discursos de ódio, conteúdo explícito ou facilitar crimes.
*   **[16] Robustez a Erros e Timeout:** Se uma *tool* falha (ex: a API externa do cliente cai), o agente captura a exceção de forma graciosa (`try/except`) e informa o usuário do erro de forma legível, sem expor a *stack trace* do sistema base ou travar a sessão inteira do orquestrador.
*   **[17] Prevenção de Loops Infinitos:** O design do fluxo conversacional e das invocações de ferramenta possui um mecanismo interno (no código da tool) para abortar e evitar chamadas recursivas infinitas caso a API responda com falhas contínuas (evitando *billing spikes* indesejados).

### 3.5. Governança Legal e Compliance (LGPD/Termos)
*   **[18] Tratamento de Dados Pessoais Claro:** Se o Agente processa informações de identificação pessoal (PII - ex: currículos, listas de e-mails), o autor declara expressamente no `README.md` qual o fluxo de vida desse dado fora da plataforma, se houver.
*   **[19] Propriedade Intelectual (Copyright):** O material submetido não parece infringir patentes, copyrights ou segredos comerciais evidentes de terceiros (ex: clonagem exata do código de outro Tenant sem licença open source aplicável).
*   **[20] Assinatura do Termo de Distribuidor:** O Tenant responsável pela submissão assinou digitalmente o Acordo de Distribuição de Packs e concorda em assumir a responsabilidade pela manutenção do código publicado.
