# Política de SLA de Revisão de Packs

## 1. Objetivo
Estabelecer Acordos de Nível de Serviço (SLAs) claros e previsíveis para o processo de revisão, curadoria e assinatura de Packs (agentes, ferramentas, workflows) submetidos ao Marketplace Público do BirthHub360.
O SLA reflete a complexidade e o risco inerente aos artefatos submetidos, garantindo que a equipe de Trust & Safety possa realizar análises adequadas sem gerar gargalos para a comunidade de criadores.

## 2. Categorias de Revisão e Prazos

A triagem inicial classifica o pack em uma de três categorias no momento da submissão. O prazo do SLA começa a contar a partir do momento em que o status do pacote muda de `DRAFT` para `PENDING_REVIEW`.

### 2.1. Nível 1: Agentes Simples (Prompt-Only)
*   **Definição:** Packs que consistem exclusivamente em manifestos JSON/YAML e instruções sistêmicas (Prompts). Eles **não** contêm código customizado (Python/Node) e **não** invocam ferramentas (tools) externas de terceiros não homologadas nativamente pelo BirthHub360.
*   **Foco da Revisão:** Qualidade do prompt, alinhamento com as regras de conteúdo, taxonomia do marketplace (tags/descrição correta) e mitigação de tentativas básicas de *prompt injection* (jailbreaks submetidos pelo próprio autor).
*   **SLA de Resposta (Decisão):** **48 horas úteis** (T+2 dias).

### 2.2. Nível 2: Agentes com Tools Customizadas / Integrações Externas
*   **Definição:** Packs que incluem scripts customizados (ex: integrações com APIs privadas, processamento avançado de dados em Python) ou que requisitam permissões de rede de saída explícitas no manifesto para domínios de terceiros.
*   **Foco da Revisão:** Análise Estática de Segurança (SAST) do código, revisão de uso de bibliotecas, escopo de requisições de rede (prevenção de SSRF/Exfiltração) e garantia de que o código não tenta escapar do sandboxing da plataforma.
*   **SLA de Resposta (Decisão):** **5 dias úteis** (T+5 dias).

### 2.3. Nível 3: Revisão de Segurança Aprofundada (Escalação)
*   **Definição:** Packs complexos que acionaram gatilhos de risco extremo durante o Nível 2 (ex: ofuscação de código detectada, uso de dependências de alto risco, ou denúncia grave contra o Tenant criador). Ver documento `review_escalation_criteria.md`.
*   **Foco da Revisão:** Pentest manual na sandbox, engenharia reversa do código ofuscado, e avaliação legal/compliance.
*   **SLA de Resposta (Decisão):** **10 dias úteis** (T+10 dias), com notificação imediata ao criador sobre o motivo do atraso.

## 3. Gestão de Prazos e Falhas de SLA

### 3.1. Dias Úteis
Os SLAs são calculados com base no calendário de dias úteis (Segunda a Sexta-feira, excluindo feriados nacionais e globais listados no calendário oficial do BirthHub360).

### 3.2. Pausa no Relógio (Status: "WAITING_FOR_AUTHOR")
Se, durante a revisão, o Analista de Trust & Safety precisar de esclarecimentos sobre o código (ex: "Para que serve a chamada para o domínio X?") ou solicitar mudanças não-bloqueantes, o status do pack muda para `WAITING_FOR_AUTHOR`.
*   **Ação:** O cronômetro do SLA do BirthHub360 é **pausado**.
*   **Retomada:** O cronômetro só é retomado quando o autor submete as respostas ou os artefatos corrigidos.

### 3.3. Quebra de SLA (Breach)
Se a equipe do BirthHub360 não fornecer uma decisão formal (Aprovado, Aprovado com Ressalvas, ou Reprovado) dentro do SLA estabelecido (sem culpa do autor):
1.  O ticket de revisão é automaticamente escalado para o gerente da equipe de Trust & Safety.
2.  O Tenant criador recebe um pedido de desculpas automatizado e um crédito na plataforma (ex: 5.000 tokens LLM bônus na sua conta de faturamento) como compensação pelo atraso comercial.

## 4. Atualizações de Packs (Updates)
*   Atualizações menores (apenas alterações de descrição ou README): **Processamento Automático (SLA 2h).**
*   Atualizações de Prompts em Agentes Simples: **SLA 24h úteis** (Fast-track).
*   Atualizações de código/tools: Seguem o **SLA integral de 5 dias úteis** (Nível 2), pois o *diff* de código precisa ser auditado para garantir que um payload malicioso não foi introduzido pós-aprovação inicial.
