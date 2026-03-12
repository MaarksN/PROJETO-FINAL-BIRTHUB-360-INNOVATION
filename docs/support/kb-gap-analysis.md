# Análise de Gap da Base de Conhecimento (KB)

## A Métrica de Gap
Como sabemos que a KB está falhando? Comparando as buscas sem resultado e os tickets abertos com o conteúdo existente.

## Indicadores de Gap (O que medir)
1. **Zero-Result Searches:** Acompanhar no sistema de busca da KB (ex: Algolia) quais termos os usuários pesquisam que retornam "0 resultados". (Ex: Se 50 pessoas buscaram "Zapier" e não temos artigo, precisamos criar um urgentemente).
2. **Deflection Rate Baixo:** Se o artigo "Como integrar o WhatsApp" tem 10.000 visualizações, mas gera 500 tickets de suporte por semana com a tag "WhatsApp", o artigo é *ineficaz*. Ele não tem um gap de existência, mas um gap de qualidade (Faltam prints, a UI mudou ou a explicação é muito técnica).
3. **Feature vs Article (Orfandade):** Features novas que lançamos no último mês vs. Artigos criados. Se lançamos o "Agente Jurídico" mas não documentamos como treiná-lo, existe um gap de Produto.

## Ação Pós-Análise
- Mensalmente, o sistema de suporte deve gerar um relatório: *"Os 5 temas que mais geraram tickets e NÃO possuem um artigo correspondente na KB"*. Estes 5 temas viram tickets prioritários para o time de Suporte/Produto escrever na semana seguinte.
