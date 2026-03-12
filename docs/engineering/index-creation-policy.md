# Política de Criação de Indexes

- **Quando criar:** Quando leituras ultrapassam 1.000 chamadas/min em colunas não indexadas que servem como filtro constante.
- **Custo de Escrita:** Adicionar mais índices diminui a velocidade de inserções (`INSERT/UPDATE`). Limite razoável: Não mais de 5 a 7 índices secundários por tabela transacional sem análise rigorosa de carga.
- **Aprovação:** Todo novo índice em tabelas core requer revisão do Code Owner de Backend/Database.
