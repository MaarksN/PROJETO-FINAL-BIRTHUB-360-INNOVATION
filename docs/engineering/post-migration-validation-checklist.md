# Checklist de Validação Pós-Migração

O script que roda o smoke test pós-migração no release inclui:
- [ ] O RLS ativou com sucesso para as novas entidades em produção?
- [ ] Performance nas leituras pesadas sofreu regressão? (Avaliar nos 30 min pós-deploy).
- [ ] A consistência referencial no log de auditoria reflete e garante links perfeitos e não rompidos de IDs?
- [ ] Testes no ambiente Prod (conta mock) apontam 100% isolation funcional e com integridade?
