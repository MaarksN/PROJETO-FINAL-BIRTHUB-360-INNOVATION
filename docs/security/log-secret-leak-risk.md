# Análise de Risco de Secret Leak em Logs

## Risco
A principal fonte acidental de vazamento de segredos é quando erros (stack traces), requisições inteiras HTTP (payload/headers) ou variáveis de ambiente são impressos sem filtros em logs que acabam em plataformas como Datadog, CloudWatch ou ELK, onde a retenção e o acesso são amplos.

## Prevenção de Logging Acidental
1. **Filtros Estruturais:** Utilizar bibliotecas de logging com suporte a mascaramento automático (ex: Pino em Node.js com redação, filters no structlog do Python) que anonimizam campos sensíveis por regex (`*password*`, `*token*`, `*secret*`, `*authorization*`).
2. **Sanitização de Stack Traces:** Impedir log de variáveis locais não filtradas em frameworks web e processos em background, ativando middlewares globais que truncam valores desconhecidos.
3. **Auditoria de Configurações em Produção:** O nível de logging em produção deve ser `INFO` ou `WARN` no máximo. `DEBUG` expõe demais e não deve ser ativo globalmente, apenas de forma estrita para debugging seletivo (via trace_id).
