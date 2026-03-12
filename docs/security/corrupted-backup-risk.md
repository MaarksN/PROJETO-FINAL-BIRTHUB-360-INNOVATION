# Análise de Risco de Backup Corrompido

## Riscos
1. **Falhas Silenciosas de Backup:** Jobs de backup indicando "sucesso" mas os dados exportados (dumps/snapshots) estão incompletos ou ilegíveis devido a timeout ou problemas de I/O em discos da cloud.
2. **Corrupção Lógica:** Um bug no código escreve lixo em tabelas críticas, e esse dado corrompido é copiado pelos snapshots diários.

## Detecção e Plano B
1. **Monitoramento e Alertas:** Monitorar os logs nativos do provedor em busca de erros de snapshot. Implementar checagens de tamanho do arquivo do dump (se cair 50% de um dia para o outro sem delete massivo, é uma anomalia).
2. **Testes de Restore (A Principal Defesa):** O plano trimestral de testes é a detecção real de falhas.
3. **Plano B:** Manter múltiplas cópias do banco em provedores/regiões distintas (ex: Cross-Region Snapshots AWS RDS). Se a região atual corrompeu as instâncias por problemas de storage (EBS), restaurar a partir da região de DR (Disaster Recovery).
4. **Event Sourcing / Change Data Capture (CDC):** (Plano a longo prazo) Manter streaming em filas (Kafka/Kinesis) para tentar reconstruir estados a partir de eventos brutos armazenados em S3 se o relacional falhar catastroficamente.
