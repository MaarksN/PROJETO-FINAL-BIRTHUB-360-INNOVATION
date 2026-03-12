# Riscos de Vazamento Cross-Tenant

## Mapeamento
- **API:** Confusão de tokens de autorização, injeção de IDs via URL que pertencessem a outros tenants e falta de validação. Mitigação: Authorization Gateway middleware que valida UUIDs do JWT.
- **DB:** Consultas legadas sem filtro de Tenant. Mitigação: Row-Level Security imposto em todas as tabelas multi-tenant.
- **Cache (Redis):** Colisão de chaves. Mitigação: Prefixo obrigatório `{tenantId}:` em todas as chaves de cache.
- **Queue/Workers:** Trabalhadores processando payloads maliciosos apontando para tenants diferentes do job owner. Mitigação: Validação de escopo estrita nos metadados da Queue.
- **Logs:** Logs misturando informações. Mitigação: Indexação via `tenant_id` e controle de acesso estrito nos Dashboards de Observabilidade.
