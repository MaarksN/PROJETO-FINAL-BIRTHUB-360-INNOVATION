# Critérios de Aceite Zero Warning

## Política
Todos os builds e lints do repositório devem executar sem emitir nenhum warning.

## Exceções Justificadas
- Warnings de dependências third-party que não podem ser resolvidos imediatamente (devem ser adicionados a um arquivo de suppressions `.eslintignore` ou equivalente com comentário explícito sobre a data de expiração).
- Deprecation warnings de ferramentas internas aguardando migração (máximo 1 ciclo de vida).
