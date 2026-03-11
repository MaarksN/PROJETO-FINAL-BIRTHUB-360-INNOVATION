# Análise de Risco de Deploy em Horário de Pico

## Riscos
1. **Downtime e Interrupção de Serviço:** Falhas no deploy durante o horário de pico afetam o maior número de tenants, gerando indisponibilidade e possível perda de dados.
2. **Impacto na Experiência do Usuário:** Lentidão ou erros 5xx durante a troca de versões (mesmo com Blue-Green).
3. **Corrupção de Dados:** Migrações de banco de dados executadas sob alta carga de transações podem causar contenção de locks, lentidão ou corrupção.

## Mitigações
1. **Janela de Manutenção:** Deploys (especialmente com mudanças de schema de BD) devem ser realizados em horários de menor tráfego (ex: madrugadas ou finais de semana), exceto hotfixes críticos.
2. **Estratégia Blue-Green:** O uso do Blue-Green minimiza o risco, pois o tráfego só muda quando a nova versão está pronta.
3. **Comunicação Ativa:** Avisos na plataforma (banners) informando sobre a manutenção para reduzir o atrito e alinhar expectativas.
4. **Rollback Rápido:** Capacidade de reverter o deploy em menos de 5 minutos, conforme runbook estabelecido.
