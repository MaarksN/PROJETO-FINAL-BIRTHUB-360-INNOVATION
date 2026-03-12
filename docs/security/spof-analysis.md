# Análise de Pontos Únicos de Falha (SPOF)

A arquitetura atual (focada na AWS) possui as seguintes vulnerabilidades se um componente específico falhar catastroficamente e como mitigamos (ou assumimos o risco).

## 1. Banco de Dados Primário (RDS PostgreSQL)
- **SPOF:** O cluster RDS de escrita cai.
- **Impacto:** O sistema inteiro fica indisponível para criação/modificação (agentes não funcionam, configurações falham).
- **Mitigação Atual:** Implantação Multi-AZ (síncrona). Se a zona principal cair, a AWS promove automaticamente a réplica (standby) em < 60-120 segundos.
- **Risco Residual:** Falha na região inteira (exige DR cross-region).

## 2. API Gateway (Roteamento de Microserviços e Agentes)
- **SPOF:** Falha de roteamento (ex: ALB/API Gateway mal configurado ou saturado).
- **Impacto:** Todos os serviços ficam inatingíveis a partir da internet, mesmo que os containers ECS estejam saudáveis.
- **Mitigação Atual:** O ALB escala automaticamente. Regras estritas de limite de conexões/requests (WAF) previnem exaustão.
- **Risco Residual:** Deploy de configuração corrompida no Terraform que destrua ou modifique o Listener incorretamente.

## 3. Filas/Mensageria Assíncrona (ex: SQS / RabbitMQ / Redis)
- **SPOF:** O broker cai.
- **Impacto:** Jobs de background (processamento de IA, envio de emails, integrações demoradas) acumulam ou falham imediatamente, causando timeout no frontend.
- **Mitigação Atual:** Serviços gerenciados (Amazon SQS / ElastiCache Multi-AZ) são altamente disponíveis. Implementação de Dead Letter Queues (DLQ) no código para não perder as mensagens se os workers caírem, e circuit breakers no backend se o broker estiver lento.
- **Risco Residual:** Corrupção de estado (Redis cache eviction inesperado, etc).

## 4. Provedores Externos Críticos (ex: LLMs)
- **SPOF:** A OpenAI (ou Anthropic) sofre indisponibilidade prolongada.
- **Impacto:** As respostas dos agentes de IA (core do produto) falham.
- **Mitigação Atual:** Circuit breaker configurado no `llm-client` do projeto (implementado via pacotes) para rotear para um modelo ou provedor secundário após N falhas consecutivas, reduzindo a severidade de *Outage* para *Degradação*.
