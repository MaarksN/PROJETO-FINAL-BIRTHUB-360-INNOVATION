# Revisão Manual de Código (Áreas de Maior Risco)

## Objetivo
Garantir que componentes críticos do sistema, como Autenticação, Faturamento (Billing) e o núcleo dos Agentes de IA, não contenham vulnerabilidades lógicas complexas que ferramentas automatizadas (SAST/DAST) possam não detectar.

## Áreas de Foco e Critérios de Revisão

### 1. Autenticação (Auth) e Autorização (RBAC/Tenancy)
- **Onde (Exemplos):** `apps/api-gateway/src/middleware/auth.ts`, `packages/db/prisma/schema.prisma`
- **Foco da Revisão:**
  - **Isolamento de Tenant (Multi-Tenancy):** Assegurar que TODA query no banco inclua a cláusula `WHERE tenant_id = ?` ou utilize Row-Level Security (RLS). Testar se um usuário pode acessar recursos de outro tenant mudando o ID na URL (IDOR - Insecure Direct Object Reference).
  - **Validação de Tokens JWT:** Verificar a assinatura do token, o tempo de expiração (`exp`) e se o algoritmo é fixo e seguro (ex: ignorar tokens com `alg: none`).
  - **Políticas de Senhas:** Checar a existência de hashes fortes (Argon2/Bcrypt) com salts adequados e rotinas de reset de senha seguras contra enumeração de usuários.

### 2. Faturamento (Billing) e Pagamentos (Stripe)
- **Onde (Exemplos):** Webhooks do Stripe, lógica de upgrade/downgrade, contagem de uso de LLMs.
- **Foco da Revisão:**
  - **Validação de Webhooks:** Garantir que todos os eventos do Stripe têm a assinatura (`Stripe-Signature`) verificada pelo segredo do webhook. Evita spoofing de pagamentos.
  - **Race Conditions:** Verificar o processamento concorrente do mesmo evento de faturamento para evitar "Double Spending" ou aplicação dupla de créditos. Utilizar locks no banco ou operações atômicas (ex: `UPDATE ... SET credits = credits + X`).
  - **Manipulação de Preços:** Evitar que o frontend possa enviar preços ou quantidades arbitrárias (`price=0`) na criação de checkout sessions. O preço deve vir do banco ou do Stripe, baseado no plano.

### 3. Agentes de IA e Interações (Core)
- **Onde (Exemplos):** `packages/llm-client/`, `apps/agent-orchestrator/`, `agents/*/tools.py`
- **Foco da Revisão:**
  - **Prompt Injection:** Analisar como o input do usuário é concatenado no prompt do sistema. Usar delimitadores fortes (ex: `"""`) e instruções claras para o modelo ignorar comandos de bypass.
  - **Acesso Restrito a Ferramentas (Tool Calling):** Assegurar que as ferramentas que os agentes podem chamar (ex: `read_file`, `execute_query`) rodam em ambientes isolados (sandboxes), com permissões limitadas (read-only onde possível), e nunca expõem o backend do BirthHub.
  - **Vazamento de PII:** Revisar os filtros de saída e entrada (PII redaction) para garantir que informações sensíveis não vazem nas respostas do LLM.

## Processo
Esta revisão deve ser documentada em Pull Requests específicos de "Security Hardening", com a tag ou rótulo de segurança, exigindo a aprovação de pelo menos um engenheiro sênior antes do merge na branch principal.
