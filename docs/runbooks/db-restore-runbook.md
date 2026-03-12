# Runbook de Restore de DB em Produção

**Objetivo:** Restaurar um snapshot de banco de dados (RDS PostgreSQL) sob pressão durante um incidente crítico (P0).

## 1. Identificar o Incidente (Detecção)
- Queda de banco de dados irrecuperável.
- Corrupção de dados por deploy incorreto ou ataque.
- Exclusão acidental de tabelas críticas.

## 2. Preparação (Sem Alterar o BD Atual Imediatamente)
- **Bloquear Tráfego Externo:** Altere o roteamento ou pare os serviços principais para evitar escritas inconsistentes no banco de dados corrompido, se aplicável.
- **Identificar Snapshot:** No console do AWS RDS (ou via CLI `aws rds describe-db-snapshots`), localize o snapshot automático mais recente (Point-In-Time Recovery) ou um manual viável anterior ao incidente.

## 3. Execução (Restore em Nova Instância)
1. **Restaurar Snapshot:** Inicie o restore do snapshot escolhido como uma *nova instância* de banco de dados (ex: `birthhub-db-restored`). Não sobreponha a instância atual para garantir que os dados "quebrados" possam ser analisados depois (Forensics).
2. **Tempo de Espera (RTO):** Aguarde o provisionamento (pode levar vários minutos dependendo do tamanho do disco). Monitore o status "Available" no console.
3. **Validar Nova Instância:** Conecte-se à nova instância via Bastion Host (ou cliente de DB seguro) para verificar a integridade básica dos dados.
4. **Atualizar Credenciais/DNS:** Quando validado, atualize os registros DNS internos (ex: Route53) ou a variável de ambiente centralizada (Secrets Manager) para apontar o endpoint do banco de dados para a nova instância `birthhub-db-restored`.
5. **Liberar Tráfego:** Reinicie os serviços (ECS/K8s) para que capturem as novas configurações de conexão e restabeleça o acesso dos usuários.

## 4. Pós-Restore (Estabilização)
- Verifique métricas de performance, lentidão pode ocorrer até que o cache/indexes sejam aquecidos.
- A instância original corrompida pode ser mantida pausada/isolada por 48 horas para análise forense ou extração manual de registros faltantes.
