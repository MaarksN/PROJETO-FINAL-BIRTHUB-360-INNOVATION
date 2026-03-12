# Contadores de Uso (O que é 'Uso')

Incrementamos o contador quando:
- **Agentes LLM:** Toda inferência que retorna sucesso da OpenAI/Anthropic soma o número real de tokens ao balance do tenant (não apenas 1 contador genérico de execução).
- **Armazenamento:** Processos em background calculam buckets AWS/Tamanho BD via rollup task uma vez a cada 24h em horário não comercial, não no loop em tempo real.
