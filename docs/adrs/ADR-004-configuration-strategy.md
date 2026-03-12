# ADR-004: Estratégia de Configuração

## Status
Aceito

## Decisão
- Valores não sensíveis que variam por ambiente: Variáveis de Ambiente (.env).
- Segredos de produção: AWS Secrets Manager.
- Configurações globais estáticas: Arquivos de configuração versionados (`config.yaml` ou equivalentes em código).

## Justificativa
Permite flexibilidade no desenvolvimento local enquanto mantém a segurança rigorosa na produção.
