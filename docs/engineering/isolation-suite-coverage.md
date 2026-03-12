# Cobertura da Suite de Isolamento

- **API Routes Coverage:** Asseguramos que 100% dos controllers possuem middleware de autorização de tenant e usuário (exceto rotas whitelistadas expressamente).
- **DB Coverage:** Validação de que 100% das tabelas criadas nas migrations estão marcadas no catálogo `pg_class` e têm a flag de `relrowsecurity = true`.
- Gaps conhecidos na subida a CI serão bloqueados nos Pull Requests.
