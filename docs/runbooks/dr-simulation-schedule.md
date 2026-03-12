# Cronograma de Simulacro de DR

## Objetivo
Garantir que a equipe saiba agir em emergências e que os runbooks estejam atualizados com a infraestrutura vigente. O "Tabletop" discute as ações, o "Live" executa de verdade em ambientes não-produtivos.

## Cronograma Anual
- **Q1 (Março): Tabletop de Incidente de Segurança (Vazamento de PII/Acesso não Autorizado).** Duração: 2 horas. Time: Engenharia e Segurança. Discutir as ações caso um secret do banco de dados vaze no GitHub.
- **Q2 (Junho): Simulação Live de Perda de Instância (Failover de Banco e Container).** Duração: 4 horas. Time: SRE/Infraestrutura. Forçar a falha do banco primário na Staging (RDS Failover Test) e observar métricas e alertas; recriar clusters de ECS.
- **Q3 (Setembro): Tabletop de Indisponibilidade de Provedor (ex: AWS Route53/OpenAI Down).** Duração: 2 horas. Time: Liderança Técnica e Produto. Como os tenants usarão a plataforma? Como avisaremos?
- **Q4 (Dezembro): Simulação Live de Restore (Ver `restore-test-plan.md`).** Fazer o restore de um dump para nova instância.

## Critérios de Sucesso (Simulações Live)
1. Todos os alertas disparam conforme o esperado (PagerDuty).
2. O runbook testado pode ser executado *sem* consultar a pessoa que escreveu o código ou configurou o sistema originalmente.
3. O serviço/banco de dados é trazido de volta no tempo limite (RTO).
4. As lições aprendidas geram tickets no Jira/Linear (action items) que são resolvidos em até 30 dias.
