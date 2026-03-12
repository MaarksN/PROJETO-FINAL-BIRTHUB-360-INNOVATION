# Política de Retenção de Logs

- **Ambiente de Dev/Staging:** 7 dias.
- **Produção:** 30 dias com acesso quente (pesquisa rápida), arquivamento em cold storage (S3) por 1 ano para fins de auditoria.

O purge automático do armazenamento quente evita custos excessivos.
