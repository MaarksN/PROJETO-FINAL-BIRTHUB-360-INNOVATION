# Critérios de Aceite para Novas Notificações

## O Gatekeeper de Notificações
Antes de qualquer desenvolvedor do BirthHub 360 enviar um Pull Request que dispare um novo tipo de e-mail ou alerta In-App, o PR deve passar pelos seguintes critérios de revisão (avaliados pelo PM ou Agente JULES):

1. **Ação Clara (Call to Action):**
   - A notificação exige uma ação ou decisão do usuário? (Se "Não", justifique por que não é apenas um log silencioso).
2. **Opt-Out (Toggle):**
   - Foi criada a opção correspondente na tela de "Preferências de Notificação" para o usuário desligá-la?
3. **Consolidação (Throttling):**
   - O código possui lógica de debounce/throttling para não disparar 10x se o evento ocorrer 10x no mesmo segundo?
4. **Segurança de PII:**
   - O payload do e-mail/push foi revisado para garantir que não contém senhas, tokens inteiros, CPFs, ou conteúdo completo de conversas sensíveis de clientes?
5. **Template Básico (Copywriting):**
   - O texto é curto, vai direto ao ponto e não contém jargões de engenharia (ex: "Job 495 failed", em vez de "Seu relatório não pôde ser gerado").

Se todos os critérios forem "Sim", o novo tipo de notificação é aprovado para release.
