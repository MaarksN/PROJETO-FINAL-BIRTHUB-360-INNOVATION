# Checklist de Revisão de Tenant Isolation

Ao revisar um PR, verifique obrigatoriamente:
- [ ] O endpoint tem validação do middleware de tenant (`requireTenant`)?
- [ ] Novas tabelas multi-tenant ativam RLS (`ALTER TABLE table ENABLE ROW LEVEL SECURITY`)?
- [ ] As chaves no cache (Redis) incluem o `tenant_id`?
- [ ] Filas de mensagens e cron jobs validam se a operação solicitada pertence ao tenant ativo?
