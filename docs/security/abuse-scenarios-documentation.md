# Cenários de Abuso Documentados

- **Bot Scraping de Marketplace:** Bloqueado no Gateway de API limitando requests para `/packs` a 100/min por IP.
- **DDoS via API Key (exaustão financeira):** Atacante tenta estourar a fatura por Overage LLM rodando milhares de requisições. Mitigação: O limitador da cota do ciclo diário fará hard block automático ao atingir o teto predefinido ("kill-switch de gastos").
- **Bulk Import Fraud:** Tentativa de sobrecarregar DB (1M rows num CSV). Arquivos limitados a 10MB no envio de S3 e validação via stream limitando linhas processadas.
