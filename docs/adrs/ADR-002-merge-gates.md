# ADR-002: Gates Bloqueadores de Merge

## Status
Aceito

## Decisão
Os seguintes checks são bloqueadores para merge na `main`:
1. Lint (Zero warnings)
2. Type check (TypeScript)
3. Testes Unitários e de Integração (Passando com cobertura mínima)
4. Build de produção (Verifica se a aplicação de fato compila)

## Justificativa
Garantir que a branch principal nunca quebre e esteja sempre pronta para deploy.
