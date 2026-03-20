# Itens do Checklist de Session Security com GAP ou DESVIO

O relatório forense acusa que 7 itens do `docs/Checklist-Session-Security.md` têm problemas. A partir da leitura do checklist, o Codex deverá verificar o estado atual de implementação e corrigir as seguintes frentes de requisitos de sessão, escrevendo testes para cada uma:

## Itens a verificar e corrigir (GAP-SEC-004)

1.  **Sufficient Length & High Entropy**: O Session ID deve possuir pelo menos 128 bits (16 bytes) e ser gerado com CSPRNG (e.g. `crypto.randomBytes(16)`). (Item já listado como GAP-SEC-001 no checklist principal, mas verifique se não há geradores fracos remanescentes no código).
2.  **Meaningless**: O Session ID não pode conter dados significativos (user ID, roles).
3.  **Cookie Security Attributes (`Secure`, `HttpOnly`, `SameSite`, `Path`, `Domain`)**: Devem ser estritamente configurados em rotas que inicializam a sessão e cookies.
4.  **Session Lifecycle Management (Regeneration on Login / Privilege Escalation)**: A sessão deve ser invalidada e um novo ID gerado imediatamente após o login bem-sucedido e em elevação de privilégios (sudo).
5.  **Invalidation on Logout**: A sessão deve ser destruída no servidor (não apenas remoção do cookie).
6.  **Timeouts (Idle e Absolute)**: Devem ser enforceados no servidor (Idle: ex. 30min; Absoluto: ex. 12h).
7.  **Session Tracking and Anomaly Detection**: Limites concorrentes baseados em regras (`Policy-Concurrent-Sessions.md`), detecção de mudança drástica de IP/user-agent.
