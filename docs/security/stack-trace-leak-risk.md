# Análise de Risco de Dados Sensíveis em Logs de Exceção (Stack Traces)

## O Problema dos Stack Traces (Python/Node.js)
Quando uma exceção não tratada ocorre (Ex: `500 Internal Server Error`), frameworks web (como FastAPI/Express) ou runners (Celery/BullMQ) costumam gerar um Stack Trace completo.

Em algumas linguagens e configurações de debug, o stack trace captura o valor das **variáveis locais** no momento do "crash". Se a função for `authenticate(user, password)`, a variável `password` pode ser impressa em texto plano junto com a linha do erro, indo direto para o CloudWatch ou Sentry.

## Mitigações
1. **Sanitização de Stack Traces:** Utilizar bibliotecas ou configurações no Sentry/Datadog (Data Scrubbing) que filtrem padrões de cartão de crédito e chaves conhecidas (`password`, `secret`) do trace antes do envio.
2. **NUNCA usar Modo Debug em Produção:** O modo `DEBUG=True` no Django ou opções detalhadas em outras linguagens que imprimem contextos HTML de erro devem estar terminantemente desativados no ambiente de produção.
3. **Tratamento Global de Erros:** Um middleware global captura exceções não tratadas e as transforma em um log limpo com o tipo do erro e a linha, omitindo propositalmente o escopo de variáveis. A resposta HTTP ao cliente é apenas "Ocorreu um erro interno" + `trace_id`.
