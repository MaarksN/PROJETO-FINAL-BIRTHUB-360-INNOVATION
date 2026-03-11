# ADR-027: Secrets management — vault centralizado vs env vars por plataforma

## Status
Proposto

## Contexto
O BirthHub 360 lida com chaves de API externas (Stripe, OpenAI, bancos de dados, etc.), exigindo um gerenciamento seguro, centralizado e escalável. Variáveis de ambiente injetadas em CI/CD podem ficar fragmentadas.

## Decisão
Usaremos um **Vault Centralizado** (AWS Secrets Manager).

## Justificativa
1. **Segurança e Auditoria:** O Secrets Manager permite controle de acesso refinado (IAM), rotação automática (Lambda) e auditoria completa via CloudTrail.
2. **Desacoplamento:** Serviços não precisam ter segredos em seus repositórios ou em plataformas CI/CD de forma persistente, reduzindo a superfície de ataque.
3. **Escalabilidade:** Em um ambiente de microserviços (ou vários agentes independentes), injetar env vars manualmente em cada serviço é inviável e propenso a erros.

## Consequências
- Os agentes buscarão os segredos no AWS Secrets Manager na inicialização ou em runtime.
- Será necessário definir políticas restritas (Least Privilege) para cada agente acessar apenas seus respectivos segredos.
