# Análise de Dados Sensíveis (PII) em Logs

## Risco de Vazamento de PII (Personally Identifiable Information)
Logs frequentemente capturam todo o contexto de uma requisição que falhou, ou o payload inteiro de um webhook recebido de CRMs ou redes sociais (leads). Isso significa que Nomes, Telefones, CPFs, Emails e Senhas podem estar em texto plano nas plataformas de logging (Datadog/CloudWatch) acessíveis a toda a engenharia.

## Campos Considerados PII no Contexto B2B
- `email`, `user_email`, `contact_email`
- `phone`, `whatsapp`, `telefone`, `cellphone`
- `document`, `cpf`, `cnpj`, `ssn`
- `password`, `token`, `secret`, `api_key`, `authorization`
- Conteúdo livre da mensagem (o lead pode digitar "Meu CPF é 123...").

## Como Anonimizar Sem Perder Utilidade (Debug)
A engenharia precisa saber *qual* usuário gerou o erro, sem saber *quem* é a pessoa na vida real.
1. **Mascaramento Parcial (Redação):** O logger central intercepta chaves conhecidas em JSONs.
   - `email`: `j***@gmail.com`
   - `phone`: `+55 (**) *****-1234`
   - `cpf`: `***.***.123-**`
2. **Substituição por IDs:** Em vez de logar "Erro ao processar o email joao@empresa.com", o sistema loga "Erro ao processar tenant_id=123, user_id=456". Se for necessário contato, o suporte busca o `user_id=456` no painel administrativo seguro.
3. **Não logar Payloads Completos:** Rotas de ingestão de leads ou pagamentos (Stripe Webhooks) só devem logar o `event_type` e o `id` da transação externa, omitindo o `data` completo.
