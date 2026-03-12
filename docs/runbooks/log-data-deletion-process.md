# Processo de Resposta a Solicitação de Exclusão em Logs (LGPD)

## Cenário
Um usuário final (titular dos dados) de uma das Agências (nossos Tenants B2B) exerce seu "Direito ao Esquecimento" (Exclusão). A agência clica em "Deletar Lead" no painel. O banco de dados apaga o registro.
*E os logs dos últimos 30 dias que contêm o e-mail ou CPF desse lead espalhados em gigabytes de texto no CloudWatch/Datadog?*

## O Desafio Prático
Varreduras manuais e purgas em sistemas de logs imutáveis (como CloudWatch ou S3 Archives) são custosas e quase impossíveis de se realizar para cada requisição diária. A LGPD e GDPR reconhecem limitações técnicas e o conceito de "esforço desproporcional".

## Processo (Abordagem BirthHub 360)
1. **Prevenção (O Melhor Caminho):** Se a `pii-logs-analysis.md` for seguida e o PII não for logado (apenas o UUID do Lead), a exclusão do UUID no banco primário já anonimiza o histórico inteiro, pois o log perde o vínculo com a pessoa física real. Nenhuma ação extra é necessária nos logs.
2. **Se PII Vazou para os Logs (Remediação Baseada em Tempo):**
   - O BirthHub 360 adota uma política de **Expiração Rápida (Short-lived Logs)**. Logs operacionais que podem conter lixo acidental expiram (são apagados automaticamente) em **30 dias**.
   - A resposta oficial ao DPO/Tenant será: *"O registro foi excluído permanentemente do banco de dados ativo. Quaisquer resquícios acidentais em logs de sistema temporários e imutáveis não são processados para fins de negócio e serão automaticamente destruídos dentro de nossa janela de retenção de 30 dias."*
3. **Casos Excepcionais (Vazamento Massivo Exigindo Purga Imediata):** Se, por um bug, todas as senhas dos clientes foram logadas e estão armazenadas (um risco crítico):
   - O SRE usará ferramentas específicas (ex: Datadog Data Deletion API ou AWS CloudWatch log stream deletion) para purgar as streams de log dos dias afetados.
