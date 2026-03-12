# Critérios de Aceite de Testes

O que define 'teste suficiente'?
1. O Caminho Feliz (Happy Path) está garantido.
2. Pelo menos dois Caminhos de Erro (Sad Paths) testados para garantir tratamento de falhas adequado.
3. Não há asserções genéricas (ex: não testar apenas se retorna 200, verificar o corpo).
4. Mock de dependências externas (como Stripe/AWS) configurado e não batendo em serviços reais.
