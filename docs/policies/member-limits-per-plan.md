# Limites de Membros por Plano

- **Starter:** Até 5 membros.
- **Pro:** Até 20 membros.
- **Enterprise:** Ilimitado (pricing customizado).
Se atingir o limite, o endpoint de `POST /invites` falha rigidamente com `402 Payment Required` (ou 403) informando a necessidade de upgrade.
