# ADR-008: RLS como segunda camada

## Status
Aceito

## Decisão
RLS (Row-Level Security) será usado como a **Segunda Linha de Defesa** no banco (defense-in-depth), mas NUNCA a única. A validação lógica do tenant DEVE continuar ativa em nível de aplicação via middlewares e injetores.

## Justificativa
Apoiar-se apenas no RLS reduz o isolamento de testes falhos e transfere toda a resiliência para a conexão. Se a injeção do contexto local (`SET LOCAL app.current_tenant`) no DB falhar ou for ignorada numa query mal feita, a camada da aplicação evitará o vazamento antes de despachar o SQL.
