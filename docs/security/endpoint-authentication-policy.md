# Política de Autenticação de Endpoints

- **Públicos (Sem Autenticação):**
  - `/health`, `/metrics` (quando restrito por rede/porta).
  - Webhooks de parceiros (Stripe, etc), protegidos por validação de assinatura no payload.
  - Rotas de login e reset de senha.

- **Privados (Autenticados):**
  - Todo o restante da API requer Token JWT (`Authorization: Bearer <token>`) válido.
