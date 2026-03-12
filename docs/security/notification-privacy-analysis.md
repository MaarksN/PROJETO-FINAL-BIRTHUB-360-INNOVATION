# Análise de Privacidade em Notificações (PII)

## O Risco
Notificações (especialmente E-mail e Push) viajam pela internet em texto claro (fora do túnel seguro HTTPS do painel) e ficam armazenadas em servidores de terceiros (Google/Apple) e nos dispositivos (Telas de bloqueio visíveis a qualquer um).

## Dados Pessoais em Canais Não-Seguros
1. **O Cenário Inseguro:** Um e-mail ou push notification diz: *"O lead João da Silva (CPF 123.456.789-00, Telefone 9999-9999) está com dívida médica e pediu para falar com você no chat."*
2. **A Quebra de Compliance:** Isso viola a LGPD e o sigilo de dados do cliente do nosso cliente. Os provedores de e-mail e push agora têm cópia dos dados sensíveis (PII).

## Diretriz de Privacidade de Notificações
- **Regra:** NUNCA incluir Dados Sensíveis (Saúde, Finanças, Senhas) ou PII completo em canais de notificação externa (E-mail, Push, SMS).
- **Abordagem Correta (Zero-Knowledge Notification):** A notificação deve ser apenas um "Pointer" (Ponteiro) que obriga o usuário a entrar na área segura (Autenticada) para ler a mensagem real.
- *Exemplo Correto:* "Você tem um novo pedido de atendimento humano aguardando na fila. Clique aqui para acessar o painel de suporte."
- *Exceção Permitida (Com cuidado):* Primeiros nomes (`first_name`) para contexto genérico ("João solicitou contato").
