# Guia de Operações (OPERATIONS.md)

## Deploy
- Ocorrem via CI/CD no merge para a `main` após todos os checks e build de containers Docker no AWS ECS.

## Rollback
- O rollback é efetuado revertendo o PR no GitHub e aguardando o CI/CD gerar a versão anterior, ou fazendo um deploy manual no ECS usando a imagem anterior registrada no ECR.

## Monitoramento
- Acompanhar os dashboards de APM e Logs para rastrear anomalias de taxa de erro e latência nas APIs ou na execução de agentes LangGraph.
