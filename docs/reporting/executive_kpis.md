# KPIs Executivos: Como Calcular ROI e Impacto no BirthHub360

## 1. Visão Geral para o C-Level
A adoção de Inteligência Artificial (Agentes Autônomos, LLMs, Workflows) no ambiente corporativo (B2B) exige métricas que comprovem o Retorno sobre o Investimento (ROI).
A plataforma BirthHub360 rastreia a telemetria técnica não apenas para manter a estabilidade (SLO), mas para traduzi-la em valor de negócio tangível para os tomadores de decisão dos Tenants (CEOs, CFOs, CIOs).

Este documento define os **Key Performance Indicators (KPIs) Executivos** padronizados que o painel do Tenant calcula automaticamente, garantindo que o impacto da automação seja defensável em reuniões de diretoria.

## 2. Métricas de Eficiência e Custo (O "CFO Dashboard")

### 2.1. ROI Financeiro Direto (Return on Investment)
*   **A Pergunta que Responde:** "A IA está se pagando ou é apenas um centro de custo tecnológico?"
*   **Fórmula Defensável:**
    ```
    ROI (%) = [(Economia de Tempo Monetizada + Aumento de Receita Atribuída) - (Custo Total da Plataforma)] / (Custo Total da Plataforma) * 100
    ```
    *   **Custo Total da Plataforma (TCO):** Assinatura do BirthHub360 (ex: plano Enterprise) + Custo Variável de Tokens (OpenAI/Anthropic) consumidos no mês + Custos de Integração (ex: chamadas de API do Salesforce cobradas à parte).
    *   **Economia Monetizada:** (Veja item 2.2).
    *   **Aumento de Receita:** (Se aplicável, via rastreamento de funil, ex: um agente de vendas que converteu 5% a mais de leads que humanos).
*   **Como Interpretar:** Um ROI > 100% significa que a IA não só pagou sua infraestrutura, como gerou lucro ou economia líquida para a empresa no período analisado.

### 2.2. Horas Salvas de Colaboradores (Time Savings)
*   **A Pergunta que Responde:** "Quanto tempo da nossa equipe humana a IA está substituindo em tarefas repetitivas?"
*   **Fórmula Defensável:**
    ```
    Total de Horas Salvas = Σ (Execuções Bem-Sucedidas do Agente X * Tempo Médio Humano Estimado para Tarefa X)
    ```
    *   **Baseline Humano:** Cada "Pack" (Agente) instalado possui um metadado configurável pelo Administrador do Tenant: `Tempo Estimado Manual` (ex: "Analisar este contrato manualmente levava em média 45 minutos").
    *   **Cálculo Monetizado (Opcional):** Total de Horas Salvas * Custo Hora/Homem Médio do Departamento (ex: R$ 80/h).
*   **Como Interpretar:** Esta é a métrica mais poderosa para adoção. Demonstrar que a equipe jurídica economizou "400 horas no mês" justifica o investimento na IA como um multiplicador de força, não como um substituto (permite realocar os advogados para tarefas estratégicas).

## 3. Métricas de Qualidade e Adoção (O "CIO/COO Dashboard")

### 3.1. Taxa de Deflexão / Automação Fim-a-Fim (Automation Rate)
*   **A Pergunta que Responde:** "Quantos processos a IA resolveu inteiramente sozinha, sem precisar escalar para um humano?"
*   **Fórmula Defensável:**
    ```
    Taxa de Deflexão (%) = (Fluxos Concluídos pelo Agente s/ Intervenção HITL) / (Total de Fluxos Iniciados) * 100
    ```
    *   **HITL (Human-in-the-Loop):** Se o fluxo exigiu que um operador humano aprovasse a decisão do agente ou assumisse o chat (Handoff), ele não conta como "Defletido".
*   **Como Interpretar:** Uma taxa de 30% em atendimento ao cliente significa que 1/3 dos chamados sequer tocou na fila humana, aliviando o gargalo operacional. O objetivo é aumentar essa taxa gradativamente sem perder qualidade.

### 3.2. Índice de Qualidade do Output (Accuracy / CSAT da IA)
*   **A Pergunta que Responde:** "A IA está produzindo lixo (alucinações rápidas) ou resultados confiáveis?"
*   **Fórmula Defensável (Métrica Composta):**
    ```
    Qualidade (%) = [ (Avaliações Positivas 👍) / (Avaliações Totais 👍👎) ] * Ponderador de Correções
    ```
    *   **RLHF Implícito:** O BirthHub360 mede quantas vezes um usuário humano precisou *editar* o texto gerado pelo agente antes de enviá-lo ou salvá-lo. Se o humano apagou 80% do e-mail que o agente escreveu, a qualidade (Accuracy) daquela execução foi baixa.
    *   **Feedback Explícito:** A taxa de aceitação (Thumbs Up) ao final de cada execução de tarefa.
*   **Como Interpretar:** Uma alta taxa de horas salvas com baixa qualidade de output é um alerta vermelho (a IA está fazendo rápido, mas fazendo errado). O índice deve se manter consistentemente acima de 85% para fluxos corporativos críticos.

### 3.3. Adoção Ativa por Usuários (MAU / WAU)
*   **A Pergunta que Responde:** "Nossos funcionários realmente abraçaram a ferramenta ou ela virou prateleira digital?"
*   **Fórmula Defensável:** Usuários Únicos que invocaram um agente com sucesso pelo menos 2 vezes na semana (WAU) ou no mês (MAU), dividido pelo total de licenças compradas do Tenant.
*   **Como Interpretar:** Baixa adoção significa que a gestão de mudança (Change Management) falhou. Os funcionários não confiam na IA, não sabem usar os prompts, ou os agentes não resolvem problemas reais. Alto ROI com baixa adoção indica que o benefício está concentrado em poucos "power users".
