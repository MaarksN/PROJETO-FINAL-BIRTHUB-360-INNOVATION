# Template de Post-Mortem de Incidente

## Resumo do Incidente
- **Nome:** [Ex: Indisponibilidade Total do Agente de Vendas]
- **Data:** [YYYY-MM-DD]
- **Severidade:** [P0, P1, P2]
- **Duração (TTR):** [XX horas/minutos]
- **Impacto no Negócio:** [Ex: 300 tenants afetados, ~15k interações de IA falharam]
- **Incident Commander:** [Nome]

## Timeline (Cronologia)
- [00:00 UTC] - Início do problema (primeiro erro nos logs).
- [00:05 UTC] - Alarme do PagerDuty disparado (Monitor XYZ).
- [00:10 UTC] - On-call engineer reconhece o alerta.
- [00:15 UTC] - Status page atualizada; escalonamento para Liderança de Infra.
- [00:30 UTC] - Causa raiz identificada e mitigação iniciada (rollback).
- [00:45 UTC] - Serviço estabilizado. Recuperação completa.

## Root Cause (Causa Raiz)
Técnica dos 5 Porquês:
1. O agente de vendas falhou. Por quê?
2. O serviço de LLM Client começou a retornar 500. Por quê?
3. O parsing do JSON de resposta quebrou. Por quê?
4. A API do provedor mudou sutilmente o formato de um campo de array para null. Por quê?
5. Nosso código não tinha tipagem defensiva nem try/catch abrangente para essa estrutura dinâmica.

## Lições Aprendidas
- **O que foi bem:** Rollback funcionou perfeitamente e rápido (15 min após identificar).
- **O que deu errado:** Faltou um circuito de degradação suave (Fallback para provedor B) ou retornar um erro amigável. A falha derrubou a thread.
- **Como melhoramos a detecção:** Teríamos pego isso em staging se houvesse testes e2e com mocks mutáveis.

## Ações Preventivas (Action Items)
| Tarefa (Jira Ticket) | Responsável | Prazo | Status |
| :--- | :--- | :--- | :--- |
| [BH-1001] Implementar Zod/Validação estrita de resposta LLM | Eng. Backend | 7 dias | Pendente |
| [BH-1002] Adicionar fallback automático no LLM Client | Eng. Plataforma | 14 dias | Pendente |
| [BH-1003] Atualizar alertas de taxa de erro no Datadog | SRE | 2 dias | Concluído |
