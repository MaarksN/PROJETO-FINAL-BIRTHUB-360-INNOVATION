# Política de Flaky Tests

Testes que falham de forma intermitente no CI degradam a confiança da equipe.
- **Identificação:** Se um teste falhar aleatoriamente, deve ser marcado com `@skip` ou `.skip` e ser atrelado a uma Issue no tracker.
- **Prazo:** A equipe tem 1 Sprint para fixar o flaky test e reativá-lo.
- **Deleção:** Se o teste não for corrigido e seu valor não compensar o custo da manutenção, deve ser removido permanentemente.
