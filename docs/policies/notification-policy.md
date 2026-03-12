# Política de Notificações B2B

## Objetivo
Estabelecer diretrizes claras para o envio de notificações (E-mail, Push, In-App) aos Tenants do BirthHub 360, focando em manter a relevância, reduzir a fadiga e garantir conformidade com LGPD (Opt-out).

## 1. Frequência Máxima
- **E-mails de Marketing/Produto:** Máximo de 2 por semana.
- **E-mails Transacionais / Alertas:** Depende da urgência (ex: Billing failed é imediato). Para alertas de uso (ex: "Sua IA conversou com 50 pessoas hoje"), **limitar a 1 resumo diário (Daily Digest)**, nunca a cada evento.
- **Notificações In-App (Sino):** Não há limite estrito numérico, porém a regra de consolidação se aplica.

## 2. Regra de Consolidação
Se um mesmo evento ocorrer múltiplas vezes em uma janela curta, ele não deve gerar N notificações.
- *Incorreto:* 15 e-mails "Lead João quer falar com você", "Lead Maria quer falar com você".
- *Correto:* 1 e-mail a cada 3 horas (configurável): "Você tem 15 leads aguardando intervenção humana".

## 3. Opt-Out Obrigatório (LGPD / CAN-SPAM)
- **Obrigatoriedade:** TODAS as notificações de produto ou marketing devem conter um link de "Unsubscribe" em 1-clique no rodapé.
- **Exceções Legais:** Apenas e-mails de cobrança (Faturas), atualizações de Termos de Serviço e alertas de segurança críticos (ex: Nova tentativa de login) não permitem Opt-out.
- **Painel de Preferências:** O Dashboard deve ter uma aba `/settings/notifications` com toggles granulares (ex: Desligar e-mails, mas manter In-App ativo).
