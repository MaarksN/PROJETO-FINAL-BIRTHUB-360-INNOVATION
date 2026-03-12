# Tabelas Dispensadas de RLS

Exceções documentadas para RLS:
- `global_plans`: Planos do Stripe, comuns a todos.
- `public_marketplace_packs`: Pacotes públicos sem dados confidenciais.
- `audit_logs` (sistema): Escritos pelo administrador. (Logs de tenant sofrem RLS, mas logs de infra não).
Justificativa formal no ADR-008.
