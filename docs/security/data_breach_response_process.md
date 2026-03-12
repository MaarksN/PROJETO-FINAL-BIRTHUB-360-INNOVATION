# Processo de Resposta a Incidente de Dados Pessoais (Data Breach)

## 1. Definição e Escopo
Um Incidente de Segurança com Dados Pessoais (Data Breach) no contexto do BirthHub360 é qualquer evento confirmado que comprometa a confidencialidade, integridade ou disponibilidade de dados pessoais ou sensíveis sob a guarda da plataforma, seja na qualidade de Controlador (dados dos Tenants) ou Operador (dados processados pelos Agentes dos Tenants).
**Exemplos:**
*   Acesso não autorizado ao banco de dados PostgreSQL (vazamento de prompts e histórico de chat).
*   Exfiltração de dados por um pack malicioso (ver ADR e Análise de Risco de Packs).
*   Falha de configuração que exponha dados de um Tenant A para o Tenant B (vazamento cruzado).
*   Ataque de Ransomware que torne os dados indisponíveis.

Este procedimento segue as exigências do **Artigo 48 da LGPD**, garantindo uma resposta rápida, transparente e legalmente em conformidade.

## 2. A Equipe de Resposta a Incidentes (CSIRT)
*   **DPO (Encarregado de Dados):** Lidera a comunicação legal e regulatória.
*   **CISO (Chefe de Segurança da Informação):** Lidera a contenção técnica e a investigação forense.
*   **CTO / Lead Architect:** Executa as correções na infraestrutura e patches de código.
*   **Legal / PR:** Apoia a redação de comunicados públicos e avalia riscos jurídicos.

## 3. O Fluxo de Resposta (Fases)

O objetivo é agir imediatamente (T+0) e comunicar as partes afetadas dentro de um prazo legal razoável (idealmente **até 48 horas**, conforme recomendação da ANPD).

### Fase 1: Descoberta e Triagem (T0 a T+2 horas)
1.  **Alerta:** O incidente é detectado via SIEM (logs anômalos de banco de dados, falhas de WAF), relato de um *White Hat* (Bug Bounty), denúncia de um Tenant ou monitoramento do provedor de nuvem (AWS GuardDuty).
2.  **Classificação Imediata:** A equipe técnica avalia se é um falso positivo ou um incidente real. Se confirmado, o "War Room" (sala de crise) é acionado imediatamente. O status de severidade do incidente (ex: P1 - Crítico) é definido.

### Fase 2: Contenção Técnica (T+2 a T+12 horas)
O foco é estancar o vazamento ou mitigar o dano imediato, **antes** de apurar todas as responsabilidades.
1.  **Isolamento:** Desconectar a rede, suspender as credenciais/chaves de API comprometidas, rotacionar imediatamente as chaves do banco de dados (Secret Manager), ou aplicar um "Kill Switch" em pacotes maliciosos do Marketplace (ver Política de Compromisso de Chaves).
2.  **Preservação:** Congelar logs do sistema, *snapshots* do banco de dados afetado, e capturas de rede (PCAP) em armazenamento seguro (WORM) para análise forense posterior. Nenhum log deve ser deletado ou sobreposto na pressa de consertar o sistema.

### Fase 3: Avaliação do Risco LGPD (T+12 a T+24 horas)
O DPO e o CISO avaliam o impacto do vazamento para determinar se ele pode acarretar "risco ou dano relevante aos titulares".
1.  **Quais dados vazaram?** (Nomes e e-mails de admins do sistema? Ou o histórico de chat de 10.000 pacientes de uma clínica de saúde rodando um agente médico?).
2.  **Qual o volume?** (10 registros vs. 10 milhões).
3.  **Qual o papel do BirthHub360?**
    *   **Se Controlador:** Os dados são nossos (faturamento, cadastro). O BirthHub360 deve notificar a ANPD e os titulares (Tenants).
    *   **Se Operador:** Os dados são de clientes do Tenant (processados nas LLMs). O BirthHub360 deve notificar **apenas o Tenant (Controlador)** imediatamente, fornecendo todos os detalhes técnicos. A obrigação de notificar a ANPD e os titulares finais é **exclusiva do Tenant**.

### Fase 4: Notificação (T+24 a T+48 horas)
Se o risco for relevante, as notificações formais são disparadas.

**4.1. Notificação aos Tenants Afetados (Se Operador)**
*   **Quem:** O BirthHub360 (DPO) notifica os Administradores de Segurança dos Tenants que tiveram dados vazados de sua instância isolada.
*   **Conteúdo (Art. 48, § 1º da LGPD):**
    *   A descrição clara do incidente (o que vazou, quando).
    *   As medidas técnicas adotadas para conter o vazamento (ex: "aplicamos o patch de segurança e bloqueamos o IP agressor").
    *   Uma avaliação preliminar dos riscos para o negócio do Tenant.
    *   Os contatos diretos do DPO do BirthHub360 para apoio técnico 24/7.
*   **Prazo:** O mais rápido possível, não excedendo 48 horas da descoberta confirmada.

**4.2. Notificação à ANPD e Titulares (Se Controlador)**
*   Se dados dos próprios Tenants vazarem (senhas, CNPJs, cartões), o BirthHub360 submete o formulário oficial de Comunicação de Incidente de Segurança à Autoridade Nacional de Proteção de Dados (ANPD).
*   Os administradores dos Tenants são notificados publicamente e instruídos (ex: "Troquem suas senhas e revisem as chaves de API imediatamente").

### Fase 5: Erradicação e Recuperação (T+2 a T+7 dias)
*   **Correção da Causa Raiz:** O código falho (ex: *SQL Injection*, falha de RLS) é consertado, testado e feito o *deploy* em produção.
*   **Limpeza Forense:** O sistema volta ao estado normal e seguro (Green Status).

### Fase 6: Post-Mortem e Aprendizado (Após T+7 dias)
1.  **Relatório Interno:** O CSIRT elabora um Relatório de Incidente (RCA - Root Cause Analysis) detalhando a cronologia, como a defesa falhou, e o que foi feito para corrigir.
2.  **Melhorias:** Atualização obrigatória dos processos, checklists de curadoria do marketplace, políticas de segurança, novos *guardrails* na pipeline CI/CD, ou treinamento da equipe de engenharia para evitar que a mesma falha (ex: bypass de firewall) ocorra novamente.
3.  **Fechamento:** O incidente é oficialmente encerrado no painel da ANPD ou nas comunicações com os Tenants.
