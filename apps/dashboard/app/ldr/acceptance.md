# [SOURCE] apps/dashboard/README.md — LDR

## Módulo LDR — Lead Scoring and Enrichment View
### Critérios de Aceite (Acceptance Criteria)

1. **Estrutura e Padrão:** O módulo LDR (`apps/dashboard/app/ldr`) deve seguir exatamente a mesma estrutura de pastas, rotas e componentes adotada pelo módulo SDR, CS e Finance.
2. **Navegabilidade:** O módulo deve possuir uma rota acessível que renderiza a interface principal do LDR sem erros (HTTP 200).
3. **Funcionalidade Principal:** A interface deve exibir uma view contendo:
   - Lead Scoring (pontuação dos leads).
   - Dados de enriquecimento de leads.
4. **Sem Regressão:** A inclusão do módulo LDR não deve impactar ou alterar o comportamento dos módulos existentes.
5. **Autenticação e Segurança:** O módulo deve respeitar o modelo de proxy de sessão e não utilizar secrets ou senhas locais de dashboard, repassando o contexto via cookie de sessão.
