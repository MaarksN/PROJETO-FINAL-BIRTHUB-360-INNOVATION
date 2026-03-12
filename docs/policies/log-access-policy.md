# Política de Acesso a Logs

## Princípio do Menor Privilégio
O acesso a logs operacionais e de segurança não é global e difere de acordo com o ambiente (Desenvolvimento vs Produção).

## Papéis Autorizados (Roles)
1. **Engenheiros de Software (Desenvolvimento/Staging):** Acesso total aos logs desses ambientes para debug rápido.
2. **Engenheiros On-call / SRE (Produção):** Acesso a logs de produção e métricas (CloudWatch, Datadog) para troubleshooting ativo durante incidentes ou plantão.
3. **Equipe de Segurança / Compliance:** Acesso a logs de auditoria de segurança (CloudTrail, Access Logs do Load Balancer) arquivados (S3/Athena) para investigações forenses.
4. **Suporte N1 / Atendimento B2B:** **Nenhum acesso direto aos logs brutos.** O acesso deve ser mediado por um painel administrativo customizado (Backoffice) que mostre apenas o status da requisição ou o erro filtrado para o tenant em questão.

## Justificativa e Auditoria
Todo acesso à plataforma de visualização de logs (ex: login no Datadog ou console AWS) é, por si só, auditado. A exportação (download) massiva de logs de produção por um desenvolvedor dispara um alerta de segurança (DLP - Data Loss Prevention).
