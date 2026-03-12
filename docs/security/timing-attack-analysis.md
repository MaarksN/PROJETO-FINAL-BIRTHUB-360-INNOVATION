# Análise: Vazamento por Timing Attack

- **Problema:** Um endpoint de e-mail pode demorar 2ms se o usuário de outro org não existir e 20ms se existir (devido a comparações profundas ou delays).
- **Ação mitigatória adotada:** Retornamos `200 OK` (resposta vaga "Enviamos e-mail se você possuir cadastro") no mesmo limite de tempo base usando operações constantes, ou aplicamos delay randômico artificial aos requests negativos para ofuscar diferenças sutis de tempo computacional entre as respostas positivas e falhas.
