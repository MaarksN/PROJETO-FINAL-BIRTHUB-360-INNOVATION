# Estratégia de Deploy

## Estratégia Escolhida: Blue-Green Deployment

## Justificativa
O BirthHub 360 exige alta disponibilidade. A estratégia Blue-Green permite a transição para a nova versão sem tempo de inatividade e possibilita um rollback quase instantâneo se algo der errado, alternando o tráfego de volta para o ambiente "Blue" (versão antiga).

Canary foi considerado, mas adiciona complexidade no roteamento de tráfego e tratamento de estado do banco de dados neste momento do ciclo de vida. Rolling update é mais lento para reverter em caso de falha crítica.

## Execução
1. O ambiente "Green" (nova versão) é provisionado.
2. Testes de smoke são executados no ambiente "Green".
3. O roteador (Load Balancer/API Gateway) é atualizado para apontar 100% do tráfego para o ambiente "Green".
4. O ambiente "Blue" é mantido ativo por um período (ex: 2 a 4 horas) em caso de necessidade de rollback.
5. Após o período de segurança, o ambiente "Blue" é destruído.
