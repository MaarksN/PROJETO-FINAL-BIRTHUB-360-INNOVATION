# Análise de Risco: Incidente de Segurança vs Disaster Recovery

## Distinção Importante
Um **Desastre (DR)** geralmente envolve falha de hardware, erro de configuração crítico, desastres naturais ou sobrecarga (não maliciosa). O foco primário é **Restaurar o Serviço (RTO)** o mais rápido possível e com a menor perda de dados (RPO).

Um **Incidente de Segurança** (ex: Invasão, Vazamento de Dados, Ransomware, Compromisso de Credenciais AWS) muda completamente a prioridade.

## Prioridade Durante um Incidente de Segurança
1. **Conter a Ameaça:** O serviço pode ser derrubado **deliberadamente** (Downtime intencional) para parar a exfiltração de dados de clientes (LGPD/GDPR) ou impedir que um ator malicioso escale privilégios.
2. **Preservar Evidências (Forensics):**
   - Não destruir instâncias suspeitas imediatamente. Isole-as da rede (Security Groups restritivos).
   - Realize snapshots (EBS) de discos infectados e dumps de memória *antes* de tentar restaurá-los.
   - Restaure serviços a partir de backups *em ambientes novos* (clean slate) para não sobrescrever os logs da invasão.
3. **Erradicação:** Garantir que o invasor não tenha backdoors (trocar *todas* as credenciais/chaves AWS, tokens de acesso a DB e repositórios de código antes de voltar online).
4. **Recuperação:** Aplicar o processo de DR (ex: restore de DB) após a erradicação total.

## Resumo
- No **DR Tradicional**, o tempo é essencial para evitar perda de faturamento/SLA.
- Num **Incidente de Segurança**, a pressa pode destruir evidências e reinfectar o ambiente recém-restaurado. A contenção tem precedência sobre o uptime.
