# Guia de Migração de Packs entre Ambientes (Dev → Staging → Prod)

## 1. Visão Geral
Este guia define o fluxo de trabalho seguro e rastreável para a migração de Packs (Agentes, Prompts, Tools) desenvolvidos internamente por Tenants Enterprise/Pro entre diferentes ambientes (Dev, Staging/QA, Produção). O objetivo é aplicar as melhores práticas de CI/CD ao ciclo de vida de desenvolvimento de Agentes de IA, minimizando riscos operacionais, interrupções no serviço e vazamento de prompts ou lógicas de negócio.

## 2. Conceitos Core (Orquestrador Multi-Ambiente)
O BirthHub360 permite que Tenants Enterprise configurem "Espaços de Trabalho" (Workspaces) ou "Ambientes" logicamente isolados.
*   **Development (Dev):** Onde engenheiros de prompt e desenvolvedores criam e testam agentes em tempo real (sandbox iterativa). Acesso a dados sintéticos (fictícios). Pode quebrar a qualquer momento.
*   **Staging/QA:** Um ambiente de pré-produção "espelho" do ambiente real. Testes de integração automatizados (ex: LangSmith, pytest) e homologação por usuários chave (UAT). Acesso a dados reais anonimizados ou *snapshots* do banco principal.
*   **Produção (Prod):** O ambiente *live* onde usuários finais (clientes ou funcionários do Tenant) interagem com os agentes. SLAs rigorosos, monitoramento ativo e acesso a dados reais/PII. Modificações diretas aqui são bloqueadas (ReadOnly via UI).

## 3. Fluxo de Promoção (O Caminho Seguro)

A migração nunca é um simples "copiar e colar" manual via painel do administrador. Ela deve seguir o modelo "Code as Config" (Infrastructure as Code - IaC).

### 3.1. Empacotamento em Dev (Exportação)
1.  O desenvolvedor finaliza a versão 1.2 do seu Agente no ambiente "Dev" do BirthHub360.
2.  Ele utiliza a CLI do BirthHub360 ou a interface "Export Pack" para gerar um arquivo ZIP imutável e assinado (se usar a PKI interna corporativa - ver Política BYOK).
3.  O pack gerado (artefato) contém o `manifest.yaml` (versão 1.2.0 declarada), os arquivos de prompt e o código das tools (Python/Node).
4.  Opcional (Recomendado): O artefato é comitado em um repositório Git corporativo (GitHub/GitLab) do próprio Tenant.

### 3.2. Deploy para Staging (Homologação)
1.  A pipeline de CI/CD do Tenant (ex: GitHub Actions) aciona a API do BirthHub360 para o ambiente `workspace=staging`.
2.  A API recebe o pack (importação).
3.  **Inspeção de Segurança Automática (SAST):** O Orquestrador do BirthHub360 varre o código customizado do pack contra vulnerabilidades conhecidas e ofuscações (ver Política de Importação).
4.  Se passar, o pack é "instalado" em Staging. O status muda para `INSTALLED_STAGING`.
5.  A equipe de QA do Tenant executa testes automatizados de fluxo (usando o *SDK de Teste de Agentes* do BirthHub360) para garantir que o LLM não está alucinando nos novos prompts e que as integrações externas (tools) estão respondendo corretamente.

### 3.3. Promoção para Produção (Go-Live)
A migração para Produção exige *Aprovação Manual* (Gatekeeper).
1.  Um Administrador de Segurança/Operações (`Tenant_Admin` ou `Tenant_Security_Admin`) acessa o painel de Governança do BirthHub360 do ambiente "Produção".
2.  Ele inicia a "Promoção de Versão", selecionando o pack já testado que está rodando em "Staging" (v1.2.0).
3.  O sistema exibe um *Diff* (diferença) claro entre a versão atual de Produção (ex: v1.1.0) e a nova versão (v1.2.0): "Quais prompts mudaram? Quais permissões de rede foram adicionadas? Quais variáveis de ambiente novas a versão 1.2.0 exige?".
4.  **Aprovação:** O Administrador aprova a promoção (Assinatura de Risco aceita no painel).
5.  **Rollout:** O Orquestrador atualiza o agente para a versão 1.2.0 em Produção (Zero-Downtime deployment). As novas conversas já usarão a versão nova; conversas ativas (em andamento) terminam seus turnos na versão antiga antes do upgrade forçado.

## 4. Checklist de Migração (Obrigatório antes de promover para PROD)

Este checklist deve ser validado pelo Administrador do Tenant antes de clicar em "Aprovar Promoção para Produção":

*   **[1] Controle de Versão (SemVer):** O número da versão no `manifest.yaml` foi incrementado corretamente (ex: `1.1.0 -> 1.2.0`)? É uma *breaking change* (Major) ou apenas *bugfix* (Patch)?
*   **[2] Auditoria de Permissões (Diff):** A nova versão solicita escopos de permissão adicionais que a versão anterior não solicitava (ex: a v1.1 só lia dados, a v1.2 agora pede `WRITE` no banco de dados)? Se sim, as contas de serviço (IAM Roles/API Keys) necessárias foram previamente provisionadas no ambiente de Produção?
*   **[3] Variáveis de Ambiente e Secrets:** O ambiente de Produção já contém os *Secrets* (Tokens, Senhas, Chaves de API) exigidos pelo novo código da versão 1.2.0? (O pack vai falhar imediatamente no primeiro uso se faltar uma chave de API que só existe em Dev).
*   **[4] Testes de Aceitação (UAT) Passaram:** Há registro formal no JIRA/GitLab de que os testes funcionais em Staging foram concluídos com sucesso e aprovados pelo Product Owner do fluxo?
*   **[5] Revisão de Código de Ferramentas (Security Review):** Se a nova versão alterou código Python/Node de ferramentas customizadas, um revisor de segurança sênior do Tenant analisou as mudanças (PR aprovado no repositório do cliente)?
*   **[6] Plano de Rollback Automático:** Caso a taxa de erro (*timeout*, exceções não tratadas no Python) dispare acima de 10% nos primeiros 15 minutos pós-deploy, o Administrador sabe onde clicar no painel do BirthHub360 para executar o "Rollback Imediato" para a versão anterior (1.1.0)?

## 5. Rollback (O Plano de Emergência)
*   **Como funciona:** O Orquestrador do BirthHub360 armazena versões históricas dos packs importados.
*   **Execução:** Na tela de Gerenciamento do Pack (Ambiente de Produção), o Administrador seleciona a versão anterior (v1.1.0) na aba "Histórico de Versões" e clica em "Restaurar Versão Ativa".
*   **Efeito:** Instantaneamente, todas as novas instâncias do agente passam a usar os prompts e o código da versão anterior. As variáveis de ambiente da versão nova são preservadas, mas não utilizadas pela versão velha.
