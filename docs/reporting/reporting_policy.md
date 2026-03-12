# Política de Geração e Retenção de Relatórios

## 1. Objetivo e Escopo
Esta política estabelece as regras de governança para a geração, exportação, compartilhamento e retenção de Relatórios de Telemetria e Uso de IA (Analytics) dentro dos Tenants do BirthHub360.
O objetivo é garantir que dados operacionais sensíveis (que podem incluir PII indireta, métricas de produtividade individual de funcionários ou segredos de negócio) sejam acessados e preservados de forma segura e em conformidade com a LGPD e políticas corporativas.

## 2. Controle de Acesso (Quem Pode Gerar/Ver)

Os painéis de métricas do BirthHub360 não são públicos para todos os funcionários da empresa (Tenant). O acesso é regido por Role-Based Access Control (RBAC):

### 2.1. Nível Global (Visão Executiva Completa)
*   **Papéis:** `Tenant_Owner`, `Tenant_Admin`, `Tenant_Billing_Admin`
*   **Permissões:** Acesso irrestrito a todos os *dashboards* (ROI, Consumo de Tokens por usuário, Taxas de Erro Globais, Custo Total).
*   **Ação:** Podem gerar, visualizar e exportar (CSV/PDF) relatórios consolidados de toda a organização.

### 2.2. Nível de Departamento/Workspace (Visão Tática)
*   **Papéis:** `Workspace_Manager`, `Team_Lead`
*   **Permissões:** Acesso restrito às métricas dos Agentes instalados e operados exclusivamente pelas suas equipes subordinadas.
*   **Restrição:** Não podem ver dados financeiros globais do Tenant (ex: a fatura total de Tokens da empresa), nem métricas de outros departamentos (ex: O líder de Vendas não vê os relatórios do Jurídico).

### 2.3. Nível Individual (Usuário Final)
*   **Papéis:** `User`
*   **Permissões:** Acesso apenas às suas próprias métricas de uso (ex: "Quantos contratos eu pedi para a IA analisar este mês?").
*   **Restrição:** Bloqueado de gerar relatórios consolidados ou exportar dados agregados de produtividade de colegas.

## 3. Política de Exportação e Compartilhamento (Prevenção de Vazamento)

Quando um relatório gerencial é exportado do portal seguro do BirthHub360, ele se torna um arquivo (PDF ou CSV) vulnerável a distribuição inadequada.

### 3.1. Compartilhamento Interno (Download)
*   **Auditoria de Exportação:** Toda vez que um usuário com privilégios clica em "Exportar Relatório", o sistema do BirthHub360 registra um log de auditoria imutável: `timestamp`, `user_id`, `report_type` (ex: "Consumo por Agente - Janeiro"), e `IP_address`.
*   **Watermarking (Avançado - Plano Enterprise):** Relatórios em PDF gerados pela plataforma recebem uma marca d'água digital sutil contendo o e-mail corporativo de quem o gerou. Isso desencoraja o vazamento de métricas estratégicas da empresa (ex: o volume total de tickets de suporte atendidos) para a concorrência.

### 3.2. Compartilhamento Externo (Links Seguros)
*   Se um `Tenant_Admin` precisar compartilhar um *dashboard* com investidores externos, conselheiros (Board) ou consultores não cadastrados na plataforma:
    *   **Proibição de Links Abertos:** É tecnicamente impossível gerar um link público anonimizado das métricas do Tenant.
    *   **Obrigatório:** O compartilhamento externo deve ser feito via exportação de PDF (sujeito a marca d'água) ou provisionando contas de acesso temporário (`Guest_Auditor`) limitadas apenas à visualização de relatórios (Read-Only) que expiram automaticamente em 7 dias.

## 4. Política de Retenção de Dados de Telemetria (Data Lifecycle)

As métricas geradas pelos agentes consomem espaço de banco de dados e contêm informações de comportamento dos usuários. O BirthHub360 retém esses dados agregados com base no plano contratado.

### 4.1. Dados Granulares (Log de Execução Fina / Raw Logs)
*   **O que é:** O registro detalhado de cada API call, cada ferramenta acionada, os *prompts* exatos enviados e o tempo de resposta em milissegundos de uma interação única com a IA.
*   **Retenção:**
    *   **Free:** 7 dias.
    *   **Pro:** 30 dias.
    *   **Enterprise:** Até 90 dias (ou configurável via integração com *bucket S3/SIEM* do próprio cliente para retenção infinita).
*   **Motivo (Privacidade/LGPD):** Evitar o armazenamento perpétuo de conversas individuais de funcionários sem finalidade operacional imediata (Depuração/Auditoria). Após o período, esses dados brutos são anonimizados e purgados (Data Deletion).

### 4.2. Dados Agregados (Dashboards Executivos / Analytics)
*   **O que é:** As métricas sumarizadas mensais ("Total de Tokens Consumidos em Janeiro", "Média de Horas Salvas no Q3", "ROI Anual").
*   **Retenção:** Dados agregados (que não identificam o indivíduo nem contêm o conteúdo do chat) são retidos por **5 anos** (Período Contratual Padrão) em todos os planos pagos (Pro/Enterprise).
*   **Motivo:** Permitir aos CFOs a análise de tendência histórica de longo prazo (Ano sobre Ano - YoY) e justificar a renovação do orçamento de software.

## 5. Exclusão sob Demanda (Right to be Forgotten)
Se um Tenant rescindir o contrato com o BirthHub360, todos os relatórios, dashboards e dados de telemetria brutos e agregados associados àquela empresa serão fisicamente apagados dos servidores de produção no prazo máximo de 30 dias após o cancelamento, conforme Política de Offboarding, mantendo-se apenas dados financeiros de faturamento exigidos pela Receita Federal (ex: a NF-e da assinatura).
