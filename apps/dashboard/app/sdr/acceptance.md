# [SOURCE] apps/dashboard/README.md — SDR

## Módulo SDR — Deal pipeline and meeting scheduler
### Critérios de Aceite (Acceptance Criteria)

1. **Estrutura e Padrão:** O módulo SDR (`apps/dashboard/app/sdr`) deve seguir o padrão de rotas e composição adotado nos módulos de dashboard.
2. **Navegabilidade:** A rota deve responder sem erro e renderizar a visão principal do SDR.
3. **Funcionalidade Principal:** A interface deve expor:
   - Pipeline de vendas para acompanhar estágios.
   - Agenda de reuniões para priorização de follow-ups.
4. **Sem Regressão:** A inclusão do módulo SDR não pode quebrar os módulos existentes do dashboard.
5. **Autenticação e Segurança:** O módulo deve continuar usando o mesmo modelo de sessão e proxy do dashboard.
