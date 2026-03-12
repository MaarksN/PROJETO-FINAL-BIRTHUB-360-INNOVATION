# Análise de Risco de Enumeração (Slugs e IDs)

**Riscos:**
- Slugs (ex: `app.birthhub360.com/cliente_x`) podem ser adivinhados para enumerar quem é cliente.
- IDs numéricos deixam óbvio quantos clientes o sistema possui.
**Mitigação:** IDs usam KSUID/UUID. Slugs expõem publicamente *apenas* a página de login customizada e retornam 404 em vez de 403 se o slug não for encontrado (impedindo scan do atacante se um token falso for fornecido ou omitido).
