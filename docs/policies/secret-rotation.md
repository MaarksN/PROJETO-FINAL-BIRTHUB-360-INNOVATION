# Política de Rotação de Segredos

## Objetivo
Estabelecer um processo automatizado (sempre que possível) e com zero downtime para rotação de credenciais do BirthHub 360.

## Frequências Recomendadas
- **Credenciais de Banco de Dados:** A cada 90 dias (via integração nativa RDS/Secrets Manager).
- **Chaves de API (ex: Stripe, LLMs):** A cada 180 dias ou conforme limite do provedor.
- **Certificados TLS/SSL:** Renovação automática em 60 dias (ACM, Let's Encrypt).
- **Tokens de Acesso de Aplicação Interna/JWT Secret:** A cada 12 meses.
- **Tokens Pessoais (PAT):** A cada 30-90 dias.

## Processo de Rotação Zero-Downtime
1. **Criar a Nova Chave/Senha:** Uma nova credencial é gerada enquanto a anterior ainda está ativa.
2. **Atualizar o Storage (Secrets Manager):** O novo segredo é armazenado no cofre.
3. **Propagar para as Aplicações:** Se as aplicações leem na inicialização, reiniciá-las progressivamente (Rolling Update). Se suportarem reload dinâmico, enviar o sinal ou esperar a janela de recarregamento do cofre.
4. **Validar Nova Credencial:** Certificar-se que os acessos estão ocorrendo com o novo segredo.
5. **Revogar a Chave/Senha Antiga:** Após validação de que o tráfego 100% migrou, revogar/apagar a credencial antiga.
