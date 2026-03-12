# Threat Model de Convites

- **Token Hijack:** Se um convite é interceptado, alguém pode logar como admin em um tenant.
- **Mitigação:** Tokens de convite (via e-mail) possuem validade de 48h, utilizam JWT assinado criptograficamente amarrado ao `email` alvo, impedindo que outro e-mail utilize o link.
- **Replay:** Links são invalidos automaticamente ao primeiro uso bem-sucedido via cache de estado.
