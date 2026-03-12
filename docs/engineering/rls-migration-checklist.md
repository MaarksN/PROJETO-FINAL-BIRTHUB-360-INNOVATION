# Checklist de Revisão de RLS

Para novas tabelas:
- [ ] O script inclui `ALTER TABLE x ENABLE ROW LEVEL SECURITY;`?
- [ ] As `CREATE POLICY` cobrem SELECT, INSERT, UPDATE, DELETE?
- [ ] A condição de policy (`tenant_id = current_setting('app.current_tenant')::uuid`) está correta?
- [ ] A política possui permissão `FORCE ROW LEVEL SECURITY` para garantir que donos das tabelas também cumpram?
