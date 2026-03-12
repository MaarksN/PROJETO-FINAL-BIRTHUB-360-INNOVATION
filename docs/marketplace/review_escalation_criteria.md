# Critérios de Escalação de Revisão (Nível 3)

## 1. Contexto e Definição
A escalação no processo de curadoria do Marketplace do BirthHub360 ocorre quando um Pack (Agente, Prompt, Ferramenta) inicialmente classificado como "Nível 1" (Agente Simples) ou "Nível 2" (Com Tools Externas) apresenta características, comportamentos ou estruturas que excedem a capacidade de análise padrão de Trust & Safety dentro do SLA normal.
Nesse cenário, a triagem "Vira" uma Revisão de Segurança Aprofundada (Nível 3), com SLA estendido (10 dias úteis) e envolvimento de especialistas (Engenharia de Segurança, Legal ou Arquitetos Core).

O objetivo desta política é proteger a infraestrutura do BirthHub360 e os dados dos Tenants finais contra vulnerabilidades complexas, ofuscação maliciosa ou riscos de compliance severos que um revisor júnior (Level 1/2) não conseguiria identificar com as ferramentas padrão.

## 2. Gatilhos de Escalação (Triggers)

Um analista de Trust & Safety de Nível 1 ou 2 **deve** escalar a revisão para o Nível 3 (Security/Engineering) imediatamente caso identifique um ou mais dos seguintes cenários:

### 2.1. Gatilhos de Código e Execução (Técnicos)
*   **Ofuscação de Código:** O código fonte customizado (Python/Node) submetido no pack está intencionalmente ofuscado, minificado de forma irreconhecível (sem fornecer o *source map*), ou criptografado (ex: uso de `eval(base64.b64decode(...))`), impedindo a análise estática (SAST) e a compreensão humana da lógica de negócio.
*   **Comportamento de Rede Anômalo na Sandbox:** Durante a execução dinâmica controlada (DAST), o agente tenta se conectar a IPs internos da rede AWS do BirthHub360 (ex: metadados do EC2 `169.254.169.254`), tenta varrer portas locais (`localhost/127.0.0.1`), ou realiza chamadas de rede para domínios *não declarados* no manifesto do pacote (bypass de controle de egresso).
*   **Exploração do Sandboxing (Fuga):** O código tenta acessar arquivos do sistema operacional fora do diretório efêmero alocado para ele, manipular variáveis de ambiente do *host* subjacente (e não da sessão), ou usar chamadas de sistema (syscalls) proibidas.
*   **Dependências Exóticas ou Compiladas:** O pack exige a instalação de pacotes C/C++ binários pré-compilados ou bibliotecas PyPI obscuras sem reputação na comunidade de desenvolvimento e que não estão na "Allowlist" pré-aprovada do BirthHub360.
*   **Assinaturas de Malware (Heurística):** As ferramentas automatizadas sinalizam que um trecho de código (ou um arquivo anexado ao pack) compartilha similaridade heurística com famílias de malwares conhecidos, *ransomware* ou mineradores de criptomoeda (cryptojackers).

### 2.2. Gatilhos de Modelos de Linguagem e Prompts (Comportamentais)
*   **Prompt Injection Altamente Sofisticado:** O *System Prompt* submetido tenta aplicar técnicas avançadas de evasão ou formatação multi-idioma obscura para contornar os *guardrails* do LLM raiz do BirthHub360 de forma persistente.
*   **Riscos de Geração em Escala (Abuso Automático):** O agente foi desenhado de forma a disparar requisições em massa não supervisionadas para APIs externas sem *rate limiting* adequado, ou o fluxo conversacional incentiva explicitamente o usuário a usar o agente para realizar *scraping* agressivo, ataques de negação de serviço (DDoS HTTP), ou envio massivo de *spam/phishing* sob a fachada de "campanhas de marketing automatizado".

### 2.3. Gatilhos de Compliance, Legal e Negócios
*   **Processamento Não Autorizado de Dados Sensíveis:** O pack lida explicitamente com dados PII (Informações de Identificação Pessoal), PHI (Informações de Saúde) ou PCI (Dados de Cartão de Crédito) sem a infraestrutura técnica mínima exigida pela LGPD/GDPR declarada e documentada (ex: o agente pega o CPF e envia para um banco de dados externo não criptografado pertencente a um terceiro desconhecido).
*   **Violação de Direitos Autorais / Propriedade Intelectual Relevante:** O pack clona de forma flagrante o código central, os prompts exatos ou a marca registrada de um concorrente de peso no Marketplace ou de uma empresa terceira (ex: um agente chamado "Oráculo Oficial da Empresa XYZ" quando o Tenant não é da empresa XYZ).
*   **Uso em Jurisdições ou Mercados Proibidos:** O agente se destina a setores explicitamente banidos pelos Termos de Serviço do BirthHub360 e de seus provedores LLM (ex: armamento bélico autônomo, geração de material explícito, triagem automatizada de perfis raciais/biométricos sem supervisão humana).

## 3. O Processo Após a Escalação

1.  **Mudança de Status:** O ticket de revisão do pack é reclassificado no sistema interno de `PENDING_REVIEW` (Nível 1/2) para `ESCALATED_SECURITY` ou `ESCALATED_LEGAL` (Nível 3).
2.  **Pausa de SLA Automática:** O SLA original de 48 horas ou 5 dias é pausado. O novo SLA "estendido" de **10 dias úteis** entra em vigor.
3.  **Notificação Cautelar:** O Tenant criador do pacote recebe um aviso automático indicando que seu pacote "requer uma análise técnica ou de segurança mais profunda" (sem expor detalhes operacionais que possam alertar um atacante de que ele foi descoberto).
4.  **Envolvimento do Comitê de Revisão (War Room):** O Eng. de Segurança Senior analisa as evidências.
5.  **Ação Final (Veredicto Nível 3):**
    *   **Falso Positivo:** Se o código não for malicioso (ex: a ofuscação era apenas um minificador de JavaScript padrão (Webpack)), o pack retorna para a fila normal e o SLA retoma.
    *   **Vulnerabilidade Involuntária:** Se a falha foi um erro grosseiro de arquitetura que expôs dados sem querer, o pacote recebe um "Aprovado com Ressalvas" amarelo severo e um feedback detalhado ao autor de como consertar.
    *   **Ataque Malicioso (Zero Tolerance):** Se for provado que o pack foi desenhado com intenção hostil ou abusiva, ele é **Reprovado sumariamente**, a conta do Tenant sofre um "Strike" de segurança (com cooldown de 7 dias) e a escalação pode resultar na suspensão permanente do acesso do desenvolvedor infrator à plataforma, a critério da liderança do BirthHub360.
