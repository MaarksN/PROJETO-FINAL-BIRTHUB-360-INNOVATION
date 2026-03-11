# Processo de Solicitação de Restore por Tenant (LGPD/GDPR)

## Cenário
Um cliente (Tenant) excluiu acidentalmente uma grande quantidade de configurações de agentes e solicita a restauração de seus dados de 3 dias atrás, sem afetar outros tenants (SaaS Multi-tenant).

## Processo
1. **Solicitação (Abertura do Chamado):** O Owner/Admin do tenant envia solicitação formal pelo canal de suporte (comprovando identidade).
2. **Análise de Viabilidade (Operações/DBA):**
   - O tempo solicitado está dentro da janela de retenção de PITR (geralmente 7-35 dias).
   - *Nota de Engenharia:* Em sistemas Multi-tenant com schema único (Row-Level Security / tenant_id), o restore parcial é complexo.
3. **Aprovação e Prazo (SLA):** Requer aprovação do Gerente de Operações e, caso envolva dados sensíveis (PII de leads de vendas, etc.), do DPO (Data Protection Officer). Prazo de resposta: Até 48h úteis; execução: Até 5 dias úteis.
4. **Execução Segura:**
   - Restaurar o banco inteiro em uma instância temporária e isolada (Sandbox).
   - Extrair os registros específicos do tenant (`SELECT * FROM X WHERE tenant_id = 'Y'`).
   - Avaliar conflitos de IDs/Chaves Estrangeiras antes de reinserir ou fazer UPSERT na produção (cuidado com dados mais novos que o tenant criou desde o incidente).
5. **Auditoria (LGPD):** Todo o processo deve ser documentado. Se o restore for de um período onde houve exclusão solicitada por um titular (Direito ao Esquecimento), os dados desse titular não podem ser reinseridos em produção, ou devem ser imediatamente anonimizados na origem do dump temporário antes da importação.
