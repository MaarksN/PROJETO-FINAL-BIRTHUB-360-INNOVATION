# Mapeamento de Dados Pessoais (Data Mapping - LGPD)

## 1. Visão Geral (RoPA - Record of Processing Activities)
Este documento serve como o Registro de Operações de Tratamento de Dados Pessoais do BirthHub360, conforme exigido pelo Art. 37 da Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
Ele detalha o ciclo de vida dos dados processados pela plataforma, identificando campos, localização, finalidade e a base legal utilizada.

**Nota Arquitetural:** O BirthHub360 atua primariamente como **Operador** (Processador) dos dados inseridos pelos *Tenants* nos fluxos de IA. Atua como **Controlador** apenas para os dados de cadastro e faturamento dos próprios Tenants.

## 2. Inventário de Dados (Data Inventory)

### 2.1. Dados de Conta e Autenticação (Controlador)
Dados necessários para o provisionamento e acesso à plataforma BirthHub360.
*   **Tabela/Coleção:** `users`, `tenants`
*   **Campos Pessoais:** Nome completo, E-mail corporativo, Hash de senha (Argon2), Endereço IP de registro.
*   **Finalidade:** Autenticação (SSO/Login), comunicação de segurança, recuperação de conta e identificação do usuário no painel.
*   **Base Legal:** Execução de Contrato (Art. 7º, V).
*   **Retenção:** Duração do contrato do Tenant + 5 anos (marco civil/prescrição).

### 2.2. Dados de Faturamento e Financeiros (Controlador)
Dados coletados para processar as assinaturas (Planos Free, Pro, Enterprise).
*   **Tabela/Coleção:** `billing_profiles` (Sincronizado via Stripe Webhooks)
*   **Campos Pessoais:** Razão Social / Nome, CNPJ/CPF do responsável financeiro, Endereço de faturamento, E-mail do financeiro. *(Nota: O BirthHub360 NÃO armazena o número do cartão de crédito (PAN); isso é tokenizado diretamente no Stripe Elements).*
*   **Finalidade:** Emissão de nota fiscal, cobrança recorrente, prevenção a fraudes.
*   **Base Legal:** Cumprimento de Obrigação Legal ou Regulatória (Art. 7º, II - Legislação Fiscal).
*   **Retenção:** 5 anos após o encerramento do contrato (obrigação tributária).

### 2.3. Logs de Telemetria e Segurança (Operador/Controlador Conjunto)
Rastros deixados pelo uso do sistema.
*   **Tabela/Coleção:** `audit_logs`, `session_telemetry`
*   **Campos Pessoais:** Endereço IP (IPv4/IPv6), User-Agent, ID do Usuário, Timestamp, Ações realizadas (ex: "Exportou Pack").
*   **Finalidade:** Detecção de intrusão, prevenção de abusos, auditoria forense de incidentes, garantia de SLO.
*   **Base Legal:** Legítimo Interesse (Art. 7º, IX) e Cumprimento de Obrigação Legal (Marco Civil da Internet - Art. 15).
*   **Retenção:** 6 meses (MCI) no armazenamento "quente", até 2 anos em armazenamento *cold storage* para auditoria Enterprise.

### 2.4. Dados Conversacionais e Prompts (Operador)
O coração da plataforma. Os dados que os usuários finais do Tenant enviam para os Agentes de IA processarem.
*   **Tabela/Coleção:** `chat_sessions`, `messages`, `agent_memory`
*   **Campos Pessoais:** Variável (Pode conter qualquer PII/PHI injetada pelo usuário no prompt, como nomes de clientes finais, CPFs em contratos, e-mails, relatórios médicos, dependendo do Pack utilizado).
*   **Finalidade:** Processamento via Modelos de Linguagem (LLMs) para gerar a resposta ou automação solicitada pelo Tenant.
*   **Base Legal:** O **Tenant (Controlador)** é responsável por garantir a base legal (ex: Consentimento do *seu* cliente ou Execução de Contrato) antes de injetar o dado no BirthHub360. O BirthHub360 processa sob os Termos de Serviço (DPA - Data Processing Agreement) firmado com o Tenant.
*   **Retenção:** Definida pela Política de Retenção configurada pelo Administrador do Tenant (ex: 30 dias, 90 dias, ou "Apagar ao final da sessão").

## 3. Fluxo de Compartilhamento (Terceiros / Sub-operadores)
O BirthHub360 compartilha dados restritos com os seguintes subprocessadores:
1.  **Stripe (EUA):** Apenas dados de faturamento.
2.  **AWS (Brasil/EUA):** Hospedagem da infraestrutura (EC2, RDS). Dados criptografados em repouso (KMS AES-256).
3.  **Provedores de LLM (ex: OpenAI, Anthropic - EUA):** Os *prompts* (seção 2.4) são enviados via API (TLS 1.3) para geração de inferência. **Garantia Contratual:** O BirthHub360 possui acordos empresariais de "Zero Data Retention" (ZDR) com esses provedores, garantindo que os dados dos Tenants **NÃO** sejam usados para treinar os modelos fundacionais de terceiros.
