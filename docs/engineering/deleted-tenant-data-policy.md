# Política de Dados de Tenant Deletado

- **Soft Delete:** Ao excluir um tenant, marcamos como `deleted_at = NOW()` (Soft Delete).
- **Retenção:** Dados são mantidos por 30 dias na lixeira antes do expurgo definitivo (Hard Delete).
- **Auditoria:** A exclusão e o expurgo final geram eventos inalteráveis no log de auditoria do sistema.
