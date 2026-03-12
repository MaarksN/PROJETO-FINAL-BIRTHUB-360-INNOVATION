# Padrão de Paginação

Para APIs de listagem, utilizaremos primariamente paginação **Cursor-Based**.

## Justificativa
O Cursor-Based é muito mais eficiente no banco de dados para grandes conjuntos de dados (sem o problema de lentidão do `OFFSET`) e evita itens duplicados/perdidos ao paginar quando há inserções no banco ao mesmo tempo.
