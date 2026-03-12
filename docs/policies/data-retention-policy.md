# Política de Retenção de Dados

## Objetivo
Garantir a conformidade com leis de privacidade (LGPD/GDPR), regulamentações financeiras e otimizar custos de armazenamento (AWS S3/RDS), mantendo dados apenas pelo tempo estritamente necessário para operações do SaaS B2B BirthHub 360.

## Prazos de Retenção por Categoria

1. **Dados Transacionais e Financeiros (Billing/Stripe Logs)**
   - **Retenção:** 5 anos (mínimo legal exigido pela Receita/Auditoria Fiscal para serviços e assinaturas).
   - **Armazenamento:** Ativo (Banco de Dados Primário) por 1 ano. Archive (Cold Storage - S3 Glacier) por mais 4 anos.

2. **Dados de Clientes (Tenants Ativos)**
   - **Retenção:** Até o encerramento da conta (Account Deletion) + 30 dias de carência de backup (Soft Delete).
   - **Armazenamento:** Ativo (RDS) com backups rotativos.

3. **Interações de Agentes IA (Chat Logs, Prompts, Respostas de Leads)**
   - **Retenção:** 90 dias (para treinamento, debug de qualidade ou auditoria de performance de vendas).
   - **Justificativa:** Contém dados pessoais (PII) de leads dos nossos clientes B2B. O BirthHub atua como Operador de Dados.
   - **Expurgo:** Jobs diários (`Cron`) excluem ou anonimizam irreversivelmente interações mais antigas que 90 dias (salvo contrato Enterprise com retenção customizada).

4. **Logs de Sistema (Acesso, Erros, Auditoria de Segurança)**
   - **Retenção:** 1 ano para eventos de segurança/auditoria (Logins, Criação de Usuários, Acessos a PII). 30 dias para logs operacionais (Debug, Trace, HTTP Access).
   - **Armazenamento:** AWS CloudWatch Logs (com expiração automática) encaminhado para S3 (Archive) apenas para auditorias de segurança (1 ano).

## Execução
A exclusão/anonimização automatizada é preferida e implementada em nível de banco de dados (`DELETE FROM chats WHERE created_at < NOW() - INTERVAL '90 days'`) ou regras do ciclo de vida em buckets S3 (Lifecycle Policies).
