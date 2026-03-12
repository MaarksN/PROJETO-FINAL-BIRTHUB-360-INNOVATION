# Política de Gestão de Secrets no CI/CD e Ambientes

Este documento estabelece a gestão de Segredos de Produção (Chaves de API, Passwords, Chaves Criptográficas) do ecossistema BirthHub 360, especificando de forma clara onde ficam armazenadas, quem pode acessá-las e como sua rotação é gerenciada de modo a prevenir vazamentos ("Secrets Spills").

## 1. Princípios Básicos

- **Zero Secrets em Código Fonte**: Nenhuma string de senha de banco, chaves de OpenAI/Gemini/Stripe deve estar commitada no Git.
- **O Princípio do Menor Privilégio**: O ambiente só tem acesso aos secrets dos serviços e agentes que realmente os utilizam. Um Agente de Pós-Venda não precisa saber a chave da Asaas (Financeira), e o Dashboard não deve possuir a String de Conexão MASTER do Banco.
- **Auditoria de Secrets**: Apenas Tech Leads e Engenheiros DevOps (CODEOWNERS core) podem adicionar e inspecionar Secrets de Produção nas ferramentas de Key Management.

## 2. Onde Ficam (Arquitetura de Vault)

Dependendo do ambiente e propósito, as chaves e senhas (Secrets) seguem o seguinte fluxo e armazenamento:

1. **Desenvolvimento Local (`.env`):**
   - Os desenvolvedores devem popular o seu próprio arquivo local `.env` a partir do template `.env.example`.
   - NUNCA commit arquivos como `.env`, `.env.local` ou `.env.production`. O arquivo `.gitignore` força essa regra na raiz.

2. **Integração Contínua (CI - GitHub Actions / GitLab CI):**
   - Segredos requeridos para testes ou empacotamento (`STRIPE_TEST_KEY`, `DOCKER_REGISTRY_TOKEN`) são salvos e criptografados nos "Repository Secrets" do GitHub Settings.
   - O Runner extrai esses dados e passa como flags no pipeline `docker build` ou via `env:` steps do actions.

3. **Produção / Deploy (Google Secret Manager / AWS Secrets Manager):**
   - As strings de produção críticas são mantidas em um **Secret Manager**.
   - As aplicações e agentes (FastAPI, Next.js) rodando no Cloud Run (`infra/cloudrun/service.yaml`) resolvem esses segredos em _Runtime_ (via volume mounted config ou SDK do Secret Manager), não precisando embuti-las em imagens Docker.

## 3. Quem Acessa e Regras de Segurança

- **Acesso Manual (Cloud Platform):** Acesso total para ler, apagar ou gerar senhas/tokens no Vault é concedido APENAS a usuários do grupo `Admin/SRE` do IAM da Cloud. Devs que precisam criar uma integração nova solicitarão as chaves via sistema de chamados.
- **Leitura em Execução (Aplicações):** A identidade de serviço de cada componente (`Service Account` específica do Agente) detém permissões apenas de `Secret Accessor` para o conjunto de chaves que precisa.

## 4. Política de Rotação (Rotation Flow)

Toda API Key, JWT Secret e Senhas de BD têm ciclos de vida e expiração (quando suportado pela integração terceira). A rotação segue este modelo para **Zerar Downtime**:

1. **Gerar Nova Chave**: Uma "Chave V2" é gerada no provedor ou banco e adicionada ao Secret Manager paralelamente à "Chave V1" (versões do Secret).
2. **Deploy Controlado**: O pipeline realiza o deploy apontando a env var ou versão para "Chave V2". O Cloud Run levanta os novos containeres utilizando a nova senha e drenam os requests antigos.
3. **Revogar Chave Antiga**: Após monitorarmos por X horas a nova chave e certificarmos a inexistência de HTTP 401/403 (Authentication Errors) nos painéis de observabilidade e logs, a chave "V1" antiga é revogada na origem.

## Exceções ou Incidentes

Caso ocorra comprometimento de segredo (um token OpenAI ou Stripe vazado), rodamos a Política de Rotação em regime de emergência. A chave comprometida deve ser invalidada em menos de **15 minutos**, e a pipeline do `api-gateway`/`agent-orchestrator` precisará ser executada de novo puxando do Secret Manager as novas credenciais.
