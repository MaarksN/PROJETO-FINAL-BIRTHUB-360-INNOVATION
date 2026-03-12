# Análise de Risco: Exfiltração de Prompts via "Pack Export" por Admin Malicioso (Insider Threat)

## 1. Contexto e Definição da Ameaça (O "Roubo de Propriedade Intelectual")
O BirthHub360 permite que Tenants criem, testem e executem *Agentes Customizados* em seus próprios Workspaces (ambientes isolados). O valor central desses agentes frequentemente reside na "Engenharia de Prompt Avançada" (instruções sistêmicas altamente refinadas) desenvolvida ao longo de meses de tentativa e erro, além da lógica de negócio das ferramentas (*Tools*) escritas em Python/Node integradas ao LLM. Isso é Propriedade Intelectual (PI) valiosa do Tenant (ex: a "Receita Secreta" do atendimento de uma FinTech).

Para facilitar o ciclo de vida (CI/CD) e o compartilhamento interno, o BirthHub360 oferece a funcionalidade **"Export Pack"** para contas com perfil de Administrador (`Tenant_Admin` ou `Tenant_Developer`). Essa ferramenta gera um arquivo ZIP contendo todo o código-fonte legível (`manifest.yaml`, `system_prompt.txt`, arquivos Python/Node) do agente.

**A Ameaça Principal (Insider Threat):** Um funcionário do Tenant, com altos privilégios (ex: Administrador, Desenvolvedor Sênior ou Operador de Plataforma) mas com intenções maliciosas (ex: funcionário insatisfeito, prestes a ser demitido ou subornado por um concorrente), abusa de seu acesso legítimo para executar o "Export Pack" e realizar o download da PI (Prompts + Código Fonte). Esse ex-funcionário leva consigo o arquivo ZIP e replica a funcionalidade exata do agente num concorrente ou o vende no mercado negro (fóruns).

**O Vetor de Ataque não é "Hacking" do BirthHub360**, mas sim o Abuso de Privilégios (Privilege Escalation Authorization) em um *recurso legítimo* da plataforma. O impacto cai diretamente sobre a vantagem competitiva do Tenant.

## 2. Cenários e Vetores Específicos do "Export"

### 2.1. O Download de Saída (Mass Exporting)
*   **Vetor:** O Administrador Malicioso faz login no painel do BirthHub360 a partir do seu dispositivo de trabalho (ou de casa, se permitido).
*   **Ataque:** Antes de se desligar da empresa, ele navega pelo catálogo completo de "Agentes Privados do Workspace" e clica sistematicamente no botão "Export Pack" de dezenas de projetos (inclusive aqueles em que não trabalhou diretamente, mas aos quais tem acesso como SuperAdmin). O resultado é uma cópia offline de toda a automação inteligente da companhia.
*   **Vulnerabilidade Ponto Cego:** A interface web (GUI) não exige confirmação adicional para exports frequentes (Rate Limiting falho) ou exportações de agentes de Nível de Sensibilidade Alto, assumindo a confiança no papel de "Admin".

### 2.2. A "Bomba Relógio" de Variáveis Hardcoded (PII/Secrets Leaking)
*   **Vetor:** Desenvolvedores descuidados frequentemente ignoram as boas práticas e "chumbam" (hardcode) senhas de banco de dados, chaves de API exclusivas do cliente (ex: Salesforce, AWS) ou tokens de serviço diretamente no arquivo de código Python da ferramenta (`salesforce_tool.py`) ou no `manifest.yaml`, ao invés de usar o Cofre de Segredos (Secrets Manager) da plataforma.
*   **Ataque:** O Insider Threat exporta o pack. Sem querer, ele não leva apenas a PI do Prompt, mas também a "Chave Mestra" (as credenciais hardcoded) que concedem acesso total à infraestrutura externa corporativa. O dano muda de "Roubo de PI" para um "Data Breach (Vazamento de Dados Crítico)" imediato.

### 2.3. Exfiltração via API Automatizada
*   **Vetor:** O atacante utiliza o *Token de API* corporativo do Tenant ou seu próprio Personal Access Token (PAT) com direitos administrativos.
*   **Ataque:** Ele executa um script malicioso que itera sobre a API REST `/api/v1/workspaces/{id}/packs/export` de forma invisível.
*   **Vulnerabilidade:** A auditoria visual (alguém olhando o log de acesso) não detecta a extração em massa, que ocorre via CLI ou script em horários inabituais.

## 4. Mitigações e Controles no Design (BirthHub360 Defenses)

### 4.1. Controle de Acesso Baseado em Atributos/Sensibilidade (ABAC + Data Classification)
*   A "Permissão de Exportação" (`pack:export`) deve ser separada da "Permissão de Edição" (`pack:edit`) no modelo IAM do BirthHub360.
*   **Classificação de Sensibilidade (Sensitivity Tiers):** Desenvolvedores podem marcar certos Packs como "Altamente Confidenciais" (ex: `Tier=Restricted`). Packs com essa tag têm a funcionalidade "Export Pack" completamente desativada na interface (Botão Cinza), ou seu export requer **Aprovação Dupla (Dual Control)** de outro Administrador de Segurança (`Tenant_Security_Admin`) aprovando ativamente o log gerado. A PI não pode sair livremente.

### 4.2. Auditoria e Telemetria em Tempo Real (O "Export Log")
*   Todo e qualquer evento de "Pack Export" (seja via UI ou API) **deve gerar um log de auditoria inalterável** de alta prioridade.
*   O Log deve conter: "Quem" (User ID, IP), "O Quê" (Pack ID, Version, Hash), "Onde/Quando" (Timestamp, Geolocation).
*   **Alertas de SIEM (Security Information and Event Management):** Picos de eventos de exportação fora do horário comercial (ex: Sexta-feira às 23:00) ou volume massivo (ex: usuário exportou 10 packs diferentes em 5 minutos) devem engatilhar o bloqueio automático da conta do usuário por "Comportamento Suspeito de Insider Threat" (Heurística UEBA) e gerar alertas imediatos via webhook/e-mail para os líderes do Tenant.

### 4.3. Prevenção de "Hardcoded Secrets" na Exportação (Data Loss Prevention - DLP)
*   **Scanner Estático na Rota de Download (Pre-Export SAST):** No momento exato em que o Admin clica em "Export", a API do BirthHub360 atrasa a entrega do ZIP por 5 segundos para rodar um analisador heurístico (Regex/Entropia) buscando por chaves AWS, tokens JWT, senhas de DB, ou chaves Stripe nos arquivos `system_prompt.txt` e `*.py` contidos no ZIP gerado. Se o sistema suspeitar de vazamento de credencial em código, ele aborta a exportação com erro ("Erro DLP: Credencial potencial detectada no código do arquivo X. Remova a credencial usando variáveis de ambiente antes de exportar o artefato").
*   **Por que funciona:** Força a conformidade e previne o vazamento do "Data Breach", embora o Insider Threat ainda possa exportar o prompt sanitizado (a PI).

### 4.4. Marcas d'Água e Rastreabilidade Invisível (Digital Watermarking)
*   Ao gerar o arquivo `system_prompt.txt` para download, o sistema de exportação injeta caracteres Unicode não-imprimíveis (ex: Zero-width spaces) específicos ou pequenas variações de sintaxe que identificam a "Conta de Usuário Específica e Timestamp" que realizou a exportação.
*   Se o prompt roubado aparecer publicamente em um fórum ou vazar, o Tenant (com apoio forense do BirthHub360) pode recuperar a string original, identificar a assinatura de água e provar criminalmente quem foi o funcionário que quebrou o NDA (Non-Disclosure Agreement) vazando a Propriedade Intelectual.
