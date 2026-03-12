# Política de Valores de Configuração

- **.env**: Usado apenas localmente. Não commitar (`.env` está no `.gitignore`).
- **AWS Secrets Manager**: Chaves de API, senhas de DB, Salts de criptografia.
- **Estático**: URIs de serviços internos que não mudam, limites de paginação padrão, IDs de tenants do sistema.
