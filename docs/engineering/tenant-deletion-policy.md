# Política de Dados de Tenant Deletado

- **Soft Delete:** A deleção na API marca `deleted_at = NOW()` sem expurgo físico imediato.
- **Purge Schedule:** Retenção de lixeira de 30 dias. Job cron varre diariamente e executa `DELETE` real em registros > 30 dias.
- **LGPD Compliance:** Para requisições explícitas de remoção de dados baseadas na lei (Titular de Dados), aplicamos o Right to be Forgotten com Hard Delete imediato acompanhado de tombamento no audit log criptográfico.
