# Plano de Testes de Restore

## Objetivo
Garantir que a recuperação de desastres funcione (RTO/RPO atingíveis) e que os snapshots não estejam corrompidos silenciosamente.

## Execução e Frequência
- **Frequência:** Trimestralmente (Agendado na primeira semana do trimestre).
- **Ambiente:** Um ambiente isolado (ex: AWS VPC de Sandbox/Staging). Nunca teste restore de produção apontando serviços de produção para ele.

## Procedimento
1. Simular uma perda total do banco de dados secundário ou solicitar restore de um horário aleatório do último mês em produção (Point-In-Time).
2. O time de operações executa os passos definidos no `db-restore-runbook.md`.
3. Validar se os dados do horário X estão corretos e consistentes, conferindo hashes e contagem de registros chaves (ex: Tenants totais).

## Critérios de Sucesso
- RTO medido foi menor que 4 horas.
- RPO medido estava alinhado (perda < 1 hora de dados em PITR).
- As chaves estrangeiras (Constraints) e a estrutura do banco não apresentaram corrupção.
