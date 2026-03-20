# [SOURCE] apps/dashboard/README.md — AE

## Módulo AE — Proposal Generator e ROI Calculator
### Critérios de Aceite (Acceptance Criteria)

1. **Estrutura e Padrão:** O módulo AE (`apps/dashboard/app/ae`) deve seguir exatamente a mesma estrutura de pastas, rotas e componentes adotada pelo módulo SDR.
2. **Navegabilidade:** O módulo deve possuir uma rota acessível que renderiza a interface principal do AE sem erros (HTTP 200).
3. **Funcionalidade Principal:** A interface deve exibir uma view contendo:
   - Gerador de proposta (Proposal generator).
   - Calculadora de ROI (ROI calculator).
4. **Compatibilidade Legacy:** O módulo `closer` já existente deve continuar funcional e acessível sem alteração de nome (não renomear globalmente `closer` para `ae`).
5. **Autenticação e Segurança:** O módulo deve respeitar o modelo de proxy de sessão e não utilizar secrets ou senhas locais de dashboard.
