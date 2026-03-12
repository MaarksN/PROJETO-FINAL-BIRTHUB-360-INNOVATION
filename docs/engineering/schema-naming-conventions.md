# Convenções de Nomenclatura de Schema

- **Tabelas:** `snake_case` e no plural (ex: `users`, `agent_packs`).
- **Colunas:** `snake_case` (ex: `created_at`, `stripe_customer_id`).
- **Chaves Primárias:** Normalmente `id` (UUID).
- **Chaves Estrangeiras:** `tabela_id` (ex: `user_id`).
- **Índices Explicitos:** `idx_nome_tabela_colunas`.
