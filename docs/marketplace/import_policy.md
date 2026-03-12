# Política de Importação de Packs (Fontes Externas)

## 1. Escopo e Propósito
Esta política define as regras e os procedimentos de segurança que os Tenants devem seguir ao importar Packs (arquivos ZIP contendo agentes, ferramentas e prompts) de fontes externas para dentro de seus ambientes no BirthHub360.
"Fontes Externas" (Sideloading) referem-se a qualquer método de instalação que não seja o download direto do Marketplace Público oficial do BirthHub360 (ex: upload manual de um arquivo ZIP via painel de administração, importação via CLI, ou URLs privadas de repositórios do cliente).

O objetivo é proteger a infraestrutura do Tenant e a plataforma como um todo contra a introdução de código não auditado, malicioso ou vulnerável (ver Análise de Risco de Packs Importados).

## 2. Regras de Importação por Fonte

A importação manual de pacotes é tratada com desconfiança por padrão (Zero Trust).

### 2.1. Fontes Confiáveis (Permitidas)
Tenants Enterprise e Pro podem definir uma "Allowlist" de fontes externas confiáveis em suas configurações de segurança (Governança do Tenant):
*   **Repositórios Privados (Git):** Integração segura via OAuth com GitHub/GitLab/Bitbucket corporativo do próprio Tenant. O código é puxado diretamente do repositório, garantindo rastreabilidade e controle de versão.
*   **Integração CI/CD:** Instalação via API do BirthHub360 autenticada por um *Service Account Token* gerado para o pipeline de CI/CD do Tenant (ex: Jenkins, GitHub Actions).
*   **Arquivos Assinados Internamente:** Uploads manuais (ZIPs) acompanhados de uma assinatura digital gerada pela Autoridade Certificadora (CA) interna do Tenant (ver Política de Packs Não Assinados - BYOK).

### 2.2. Fontes Não Confiáveis (Restritas/Bloqueadas)
*   **Upload de ZIP Não Assinado:** Tratado como "Não Confiável". A instalação prossegue apenas se o Tenant estiver em um plano que permita o modo "Warn/Audit" (Pro) e um Administrador com privilégios de `Tenant_Security_Admin` aprovar explicitamente a instalação, assumindo os riscos descritos em tela.
*   **URLs Públicas Anônimas:** A importação via links não autenticados (ex: `wget http://site-desconhecido.com/meu-pack.zip`) é estritamente proibida e bloqueada no nível do Orquestrador.

## 3. Quarentena e Processo de Inspeção Obrigatória

Todos os packs importados de fontes não-oficiais (ou não assinados pela CA do Tenant) devem passar obrigatoriamente por um estágio de "Quarentena" antes de poderem ser ativados e executados por usuários finais.

### 3.1. Estado de Quarentena (`STATUS: IMPORTED_QUARANTINE`)
1.  O administrador faz o upload do pack.
2.  O arquivo é salvo no armazenamento isolado do Tenant, mas **não é carregado** na memória do Orquestrador.
3.  O pack fica visível no painel com uma tarja laranja ("Em Quarentena: Aguardando Inspeção").
4.  Nenhum usuário (nem mesmo o administrador) pode invocar este agente ou fluxo neste momento. Suas rotas de API estão desativadas.

### 3.2. Inspeção Automatizada de Importação (SLA: Imediato a 5 minutos)
Enquanto em quarentena, o BirthHub360 executa um *scan* síncrono no pacote:
*   **Validação do Manifesto (`manifest.yaml`):** Checagem de sintaxe e versão.
*   **Scan de Vulnerabilidades Básicas:** Busca por dependências Python/Node desatualizadas (CVEs críticos conhecidos).
*   **Análise Estática de Código (SAST - Modo Rápido):** Bloqueio imediato se encontrar chamadas do sistema (ex: `os.system`) ou ofuscação (ex: `eval()`, código minificado sem source map).
*   **Checagem de Permissões (Egress):** Identificação de todos os domínios externos que as ferramentas do pack tentam acessar.

### 3.3. Saída da Quarentena (Liberação ou Bloqueio)
*   **Bloqueado:** Se a inspeção automatizada falhar (ex: código malicioso detectado), a importação é abortada, o arquivo é deletado do repositório e um log de alerta crítico é gerado para o SOC do Tenant.
*   **Aprovado Condicionalmente:** Se a inspeção passar limpa, o pack muda para o estado `IMPORTED_READY`.
*   **Auditoria Manual do Tenant (Obrigatório):** Antes de ativar o pack (torná-lo `ACTIVE` para a equipe usar), um Administrador de TI do Tenant **deve** revisar os resultados da inspeção automatizada no painel, visualizar a lista de domínios externos que o pacote pediu para acessar e assinar um termo digital (clique de confirmação): *"Eu revi este pacote de terceiros e autorizo seu uso no nosso ambiente. Aceito os riscos inerentes à execução de código não curado pelo BirthHub360."*
