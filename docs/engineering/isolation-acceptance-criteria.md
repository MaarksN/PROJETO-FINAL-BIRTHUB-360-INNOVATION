# Critério de Aceite: Suíte de Isolamento

**Meta: Zero Falha (0.0%).**
Se a suíte de testes de Isolamento e RLS falhar com um único erro, a build será automaticamente reprovada (Red Pipeline) e o PR não poderá avançar para a `main`, independentemente do Code Owner ou reviewer. A prioridade de isolamento supera novidades de features.
