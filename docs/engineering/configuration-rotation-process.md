# Processo de Rotação de Configuração

Como mudar valores sem downtime:
1. Adicione a nova chave (ex: `NEW_API_KEY`) no Secrets Manager.
2. Atualize a aplicação para aceitar a chave nova e a antiga simultaneamente (fallback).
3. Efetue o deploy da aplicação.
4. Troque os clientes/sistemas externos para usar a nova chave.
5. Remova a chave antiga da aplicação e do Secrets Manager no próximo ciclo de deploy.
