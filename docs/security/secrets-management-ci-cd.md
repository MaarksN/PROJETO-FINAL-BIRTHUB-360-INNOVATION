# Gestão de Secrets no CI/CD

## Armazenamento
Os secrets de CI são armazenados exclusivamente no GitHub Secrets (ou no Vault do provedor de CI).

## Acesso
Apenas actions/workflows designados têm acesso aos secrets. Secrets de produção ficam no AWS Secrets Manager e não no CI.

## Rotação
Secrets de deploy são rotacionados a cada 90 dias automaticamente ou manualmente em caso de vazamento.
