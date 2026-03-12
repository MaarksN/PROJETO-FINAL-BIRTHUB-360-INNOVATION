# SLA de CI (Continuous Integration)

O BirthHub 360 possui 8 agentes e frontends complexos. No entanto, o tempo de feedback do desenvolvedor deve ser tão rápido quanto possível, pois o engajamento e qualidade da entrega caem exponencialmente conforme a pipeline demora para terminar e aprovar/recusar o código.

Este documento define o nosso SLA (Service Level Agreement) para o tempo de resposta das Github Actions / CI Pipelines.

## SLA de Tempos Aceitáveis (Thresholds)

Definimos limites de tempo rígidos baseados na natureza dos processos executados:

| Processo / Job no CI   | Duração Aceitável (SLA P90) | Limite Máximo Tolerado | Justificativa                                                                                                                           |
| ---------------------- | --------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `Lint & Format`        | < 45 segundos               | 2 minutos              | Verificação estática que deve rodar rapidamente em paralelo com o `pnpm install` para rejeitar código mal formatado na mesma hora.      |
| `Type Checking`        | < 60 segundos               | 3 minutos              | O Turborepo é encarregado de fazer as validações em paralelo sem emitir binários, apenas checando assinaturas.                          |
| `Testes de Agentes`    | < 2 minutos                 | 4 minutos              | Testes unitários de fluxos em Python (com mock). Precisam rodar rápidos, utilizando o `pytest-xdist` para rodar em multithread/workers. |
| `Testes E2E (UI/API)`  | < 5 minutos                 | 10 minutos             | Levanta os serviços e faz chamadas de Playwright contra as rotas de gateway/dashboard. A latência vem de containers e renders.          |
| **Full Pipeline (PR)** | **< 8 minutos**             | **12 minutos**         | O tempo total fim-a-fim da pipeline desde a criação/push no PR até o status de sucesso final.                                           |

## O Que É Um "Quebra de SLA"?

Se um PR demora 15 minutos de forma consistente (por exemplo, na métrica semanal P90) para validar uma branch `feat/nova-integracao`, dizemos que a pipeline está degradada (Quebrou o SLA).

## Plano de Mitigação: O que fazer se ultrapassar o SLA?

Quando a equipe (ou ferramentas de monitoramento do GitHub) observar que a Duração Máxima Tolerada foi excedida nas últimas 24 horas, os Engenheiros DevOps e Tech Leads devem executar este plano de mitigação:

1. **Paralisar novas features ("Stop The Line"):** Nenhum ticket de feature avança para PR até o CI ser desafogado e voltar ao seu SLO.
2. **Avaliar Cache do Turborepo/Python:**
   - Verificar as taxas de Hit/Miss do Vercel Remote Cache nas execuções (`turbo run build`). Se a taxa for baixa, existe dependência não declarada em `turbo.json` "quebrando" o cache hash e fazendo tudo rodar do zero.
   - Analisar o tempo de "Setup Node/Python". O repositório está demorando muito em `pnpm install`? Se sim, auditar pacotes pesados ou falhas no Restore Cache do GitHub Actions.
3. **Paralelização / Sharding:**
   - Se os Testes E2E cresceram demais e rodam em um único job (levando 15min), o plano técnico é separar os testes ativando o **Sharding do Playwright** ou criar jobs paralelos de "Testes Agentes A, B, C" vs "Testes Agentes D, E, F".
4. **Alocação de Runners Maiores:**
   - Temporariamente, subir a classe da máquina do runner (de 2 cores / 8GB para 4 cores / 16GB) para processar os assets pesados do front e do TypeScript mais rapidamente.

## Ferramenta de Monitoramento

- Monitoramos a duração média dos `Workflows` via painel nativo do GitHub Actions "Insights".
- Relatório mensal deverá identificar o job que mais gasta minutos (e consequentemente custo do runner) para ser otimizado.
