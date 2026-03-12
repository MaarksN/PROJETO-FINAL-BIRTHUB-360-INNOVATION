# Análise: SLO Realista vs Aspiracional

## Metas Aspiracionais (O que queremos)
- **Cinco noves (99.999%):** Apenas 5 minutos de downtime por ano. É um excelente marketing B2B.

## Metas Realistas (O que podemos bancar hoje)
- A arquitetura atual (ECS Fargate + RDS Multi-AZ em única região) possui limites físicos de SLA dados pela própria AWS (RDS oferece ~99.95%, Fargate ~99.9%).
- A dependência de LLMs (OpenAI) flutua. O tempo de resposta deles varia entre 1s e 15s sem aviso prévio sob alta carga global. Prometer p99 de 2 segundos para agentes de IA é fisicamente impossível sem modelos hosteados internamente (Llama 3 em GPUs próprias), o que inviabiliza o custo atual.

## Trade-offs B2B
- Estabelecer um **SLA de 99.9% de Uptime do Roteador/Frontend** (painel de controle sempre responde) e **99.5% de Disponibilidade de Geração de IA** (reconhecendo a dependência).
- Metas irreais causam esgotamento (burnout) no time de on-call e quebra de Error Budgets na primeira semana do mês, tornando a política de Freeze inútil, pois a engenharia pedirá exceções toda vez.
