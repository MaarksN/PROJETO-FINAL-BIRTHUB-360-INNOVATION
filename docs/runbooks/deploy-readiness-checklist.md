# Checklist de Prontidão de Deploy

Este checklist deve ser validado antes de cada release em produção.

1. [ ] **Integração Contínua (CI):** Todos os testes automatizados (unitários, integração e e2e) passaram com sucesso no pipeline.
2. [ ] **Revisão de Código (Code Review):** PR aprovado por pelo menos um validador.
3. [ ] **Cobertura de Testes:** A cobertura não diminuiu em relação ao branch principal.
4. [ ] **Security Scans:** Nenhuma vulnerabilidade crítica ou alta encontrada nas análises estáticas (SAST) ou em dependências (SCA).
5. [ ] **Testes de Performance:** Sem degradação significativa nos tempos de resposta em relação à baseline.
6. [ ] **Runbook de Rollback Atualizado:** O runbook de rollback foi revisado e as instruções são aplicáveis para esta versão.
7. [ ] **Aprovação de Negócios/QA:** Funcionalidades críticas foram validadas e aprovadas.
8. [ ] **Notificação aos Stakeholders:** Alertas de janela de manutenção enviados (se aplicável).
