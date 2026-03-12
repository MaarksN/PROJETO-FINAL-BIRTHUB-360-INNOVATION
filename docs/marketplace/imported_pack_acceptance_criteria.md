# Critérios de Aceite de Pack Importado (Checklist Pós-Quarentena)

## 1. Contexto (A Fase Final de Homologação)
Após um arquivo ZIP (Pack de origem externa, consultorias ou Sideloading) ter sido carregado no ambiente do Tenant (ver **Política de Importação de Packs**) e passado pela "Inspeção Automatizada" (Quarentena), ele entra no estado `IMPORTED_READY`.
Nesse ponto, o código não é mais considerado ativamente malicioso pelos scanners da plataforma BirthHub360, mas **ainda não está liberado para uso (Execução Ativa)**.

Para que o Administrador de TI/Segurança do Tenant (`Tenant_Security_Admin`) possa clicar no botão **"Aprovar e Ativar Pack"**, ele deve realizar uma auditoria manual baseada nestes Critérios de Aceite Obrigatórios (Acceptance Criteria). O BirthHub360 delega essa responsabilidade legal e operacional ao Tenant que escolheu contornar o Marketplace Público.

## 2. A "Assinatura de Risco" (Sign-Off)

A plataforma exibirá uma interface ("Tela de Homologação do Sideload") que resume os achados do scanner. O Administrador deve verificar e marcar explicitamente os seguintes critérios como **ACEITOS (YES)** antes que a UI permita a ativação do pacote no ambiente.

### 2.1. Revisão do Manifesto e Identidade (O "Quem" e "O Quê")
*   **[1] Origem Comprovada (Checksum/Hash):** O Administrador deve comparar o *hash SHA-256* do arquivo ZIP exibido no painel do BirthHub360 com o *hash* fornecido pelo fornecedor original (ex: via e-mail seguro, portal do cliente da agência) para garantir que o arquivo não foi corrompido ou interceptado em trânsito (ver MITM Analysis). Se os hashes divergirem, a importação deve ser cancelada.
*   **[2] Versionamento (SemVer) e Integridade:** O manifesto (`manifest.yaml`) declara uma versão lógica esperada (ex: `1.0.0` ou `2.1.3`)? Se for uma atualização de um pack importado anteriormente, o número da versão está correto e as quebras de compatibilidade (Major/Breaking Changes) foram documentadas pelo fornecedor?
*   **[3] Descrição do Escopo:** O manifesto descreve com precisão (em linguagem clara) o propósito exato do Agente de IA, quais ferramentas (Tools) ele inclui e que tipo de dados ele processa (PII/PHI)?

### 2.2. Revisão Crítica de Rede e Integrações (O "Acesso Externo")
*   O painel exibirá uma tabela extraída automaticamente do código Python/Node do pack importado: "Domínios de Rede Detectados".
*   **[4] Whitelisting de Egressos (Zero-Trust Network):** O Administrador **deve** ler a lista de URLs/IPs que o pacote tentou declarar. Ex: `api.salesforce.com`, `hooks.slack.com`.
    *   **Critério:** Todos os domínios listados são estritamente necessários para a função do pacote?
    *   **Ação Obrigatória:** Se houver um domínio desconhecido, suspeito (ex: `ngrok.io`, `pastebin.com`, ou um IP direto obscuro), a importação deve ser **Reprovada** imediatamente. A plataforma bloqueará qualquer chamada de rede não aprovada (Default Deny).
*   **[5] Revisão de Bibliotecas de Terceiros (Dependências):** O pacote importa dependências customizadas via `requirements.txt` ou `package.json`? A equipe do Tenant validou essas bibliotecas (ex: usando Snyk, Dependabot) para garantir que não introduzem vulnerabilidades conhecidas (CVEs) ou problemas de licenciamento (ex: GPLv3 forçando abertura do código do Tenant)?

### 2.3. Segurança de Segredos e IAM (O "Privilégio")
*   **[6] Inexistência de Hardcoded Secrets:** O Administrador deve realizar uma varredura visual (ou via IDE local antes do upload) nos arquivos `.py` e `system_prompt.txt` para confirmar que nenhuma chave de API, senha de banco de dados, token de serviço ou certificado foi "chumbado" acidentalmente no código pelo fornecedor (ver Prompt Exfiltration Risk Analysis). As credenciais devem ser solicitadas e injetadas através das Variáveis de Ambiente Seguras do BirthHub360.
*   **[7] Revisão do Princípio do Privilégio Mínimo:** O manifesto solicita escopos de permissão internos do BirthHub360 (RBAC)? Ex: acesso global de leitura a relatórios de outros Agentes (`READ_WORKFLOW_LOGS`), acesso irrestrito ao DataLake (`DATALAKE_FULL_ACCESS`).
    *   **Critério:** As permissões solicitadas são proporcionais? Se o pacote é apenas um "Agente de Correção Ortográfica", por que ele pediria acesso ao módulo de faturamento (Billing)? Solicitações excessivas de privilégio exigem rejeição ou refatoração por parte do fornecedor externo.

## 3. Ação Final e Termo de Isenção (Liability Waiver)

Se todos os 7 critérios forem avaliados positivamente, o Administrador de Segurança (CISO/SecOps do Tenant) prossegue com a ativação.

**O Click-Wrap Legal (Tela de Confirmação Final):**
A interface do BirthHub360 forçará a aceitação do seguinte termo antes de mudar o status do pack para `ACTIVE`:

> *"Declaro que a minha organização auditou o código, as permissões de rede e as dependências deste pacote de terceiros não-assinado ou importado manualmente. Nós aceitamos integralmente os riscos de segurança (incluindo possíveis exfiltrações de dados, bugs ou consumo excessivo de recursos de faturamento) associados à execução deste código customizado no nosso ambiente. Reconhecemos que o BirthHub360 não oferece garantias de funcionamento, curadoria de segurança ou suporte técnico (SLA) para pacotes instalados via Sideload/Importação Externa."*
>
> **[ X ] Eu concordo e Ativo o Pacote.**

Uma vez ativado, o pack fica disponível no catálogo interno do Tenant para que os usuários finais autorizados (RBAC) o executem ou o integrem em fluxos de trabalho (Workflows) do BirthHub360. A plataforma registrará um log de auditoria permanente (Audit Trail) constando: a data, a hora, o IP, o usuário Admin que aprovou a importação e o hash do arquivo aprovado.
