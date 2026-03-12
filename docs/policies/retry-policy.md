# Política de Reprocessamento e Retry de Falhas

No BirthHub360, um agente pode falhar por diversos motivos (problemas de rede, indisponibilidade do LLM, falhas em ferramentas externas ou erros lógicos). A forma como a plataforma reage a essas falhas (retries automáticos, fail-fast, ou escalonamento) depende diretamente da categoria do erro.

Esta política documenta o comportamento esperado e as regras de retry que o runtime deve aplicar aos agentes.

## 1. Classificação de Erros (Tipos de Falha)

Os erros durante a execução de um agente ou ferramenta são classificados nas seguintes categorias:

### A. Erros Transitórios (Rede e Infraestrutura)
*   **Definição:** Falhas temporárias que provavelmente serão resolvidas sozinhas após um curto intervalo.
*   **Exemplos:**
    *   Timeouts de conexão (`ETIMEDOUT`, `ECONNRESET`) ao chamar o provedor de LLM (OpenAI, Anthropic).
    *   Erros 5xx (500, 502, 503, 504) em APIs de terceiros (tools).
    *   Rate limits (`429 Too Many Requests`) onde a API externa fornece um cabeçalho `Retry-After`.
*   **Política de Retry:** **Retry com Backoff Exponencial.**
    *   A plataforma (Agent Core) intercepta a exceção e tenta executar o passo/ferramenta novamente (e não do início do workflow, mas a partir do último checkpoint).
    *   **Max Retries Padrão:** 3 tentativas.
    *   **Delay Inicial:** 2 segundos.
    *   **Max Delay:** 30 segundos.

### B. Erros Lógicos e de Negócio (Determinísticos)
*   **Definição:** Falhas onde os dados de entrada são inválidos ou a operação viola regras de negócio. Retentar a operação com os mesmos dados resultará invariavelmente no mesmo erro.
*   **Exemplos:**
    *   Erros de Validação 4xx (400 Bad Request, 422 Unprocessable Entity) de uma API de terceiros porque o agente passou um CPF inválido.
    *   Autenticação falha (401 Unauthorized, 403 Forbidden). O token da tool expirou ou foi revogado.
    *   Erro de permissão no Policy Engine (ex: agente tentou usar `execute`, mas a capacidade não estava habilitada para ele no tenant).
    *   JSONDecodeError (a API retornou HTML em vez de JSON) se não houver indicativo de que é transitório.
*   **Política de Retry:** **NO RETRY (Fail Fast).**
    *   A operação é abortada imediatamente na ferramenta (Tool). O erro determinístico é capturado como um erro da ferramenta.
    *   O erro (ex: `"Erro da ferramenta: O CPF informado é inválido."`) é repassado ao contexto (State) do agente, e o LLM orquestrador recebe a mensagem para que possa decidir se tenta extrair um dado melhor ou relata a falha ao usuário (Graceful Degradation). O workflow do agente NÃO falha, apenas o "step" falha.
    *   Se o agente forçar repetidas chamadas incorretas à tool (ex: 3 vezes), o agente inteiro é abortado.

### C. Erros de Limite de Tempo Estrito (Hard Timeouts)
*   **Definição:** O agente ou uma ferramenta específica demorou mais do que o tempo máximo (timeout_seconds) estipulado em seu manifesto (ADR-013).
*   **Exemplos:**
    *   A consulta ao banco de dados do cliente na tool `fetch_data` trava por 45 segundos, violando o SLA de 30s da tool.
*   **Política de Retry:** **Retry Limitado a 1x (Uma Tentativa).**
    *   Timeouts frequentes indicam gargalos sistêmicos severos.
    *   A plataforma interromperá o passo atual e retentará a chamada exatamente UMA vez (assumindo um *hiccup* temporal). Se falhar novamente, a tool retorna uma mensagem de erro ao agente ("Tool Timeout - o serviço não respondeu a tempo"), como nos erros determinísticos.

### D. Erros Fatais do Worker (Crashes)
*   **Definição:** Erros em nível de processo ou infraestrutura em que o próprio worker que executa o agente morre ou é desligado subitamente (ex: OOM Killed).
*   **Política de Retry:** **Reprocessamento a partir de Checkpoint (Ver `worker-crash-risk.md`).**
    *   Como a mensagem não recebe "Ack" (confirmação), o message broker a devolve à fila e outro worker a processa, retomando do último nó (checkpoint) bem-sucedido no grafo.

## 2. Configurações Específicas e Sobrescrita

O comportamento default desta política se aplica a todas as ferramentas (tools). Entretanto:

*   **Manifestos:** O autor do agente pode declarar, de forma granular por ferramenta no manifesto (`tools[].max_retries`), o número de retries que sua ferramenta permite caso a API em questão seja sabidamente instável (desde que inferior ou igual ao limite máximo do tenant de `5` retries).
*   **Idempotência Obrigatória:** Como detalhado na política de crashes e aqui em Erros Transitórios, a plataforma depende crucialmente de Idempotência para que ferramentas de escrita (`write`) possam ser retentadas sem efeitos adversos. Se uma tool de escrita não garantir idempotência (e avisar no manifesto), o retry de falhas de rede torna-se inseguro e deve ser desabilitado para essa tool específica.
