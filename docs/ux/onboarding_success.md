# Critérios de Sucesso do Onboarding - BirthHub 360

## Objetivo
Definir critérios de sucesso do fluxo de onboarding: taxa de completude alvo por tipo de usuário e tempo para o Aha Moment (TTFV - Time to First Value).

## Definições Principais

O processo de onboarding é projetado para diferentes personas, com complexidades e incentivos distintos. As metas são baseadas nas respostas iniciais do usuário e seu papel na empresa.

## Taxas de Completude Alvo

| Persona (Tipo de Usuário) | Taxa Alvo de Completude (Finalização do Wizard) | Tempo Alvo p/ Aha Moment (TTFV) | Observações |
| :--- | :---: | :---: | :--- |
| **Executivo (C-Level, VP, Diretor)** | 60% | < 5 minutos | Baixa tolerância à fricção técnica (ex: OAuth longo). Foco em relatórios de alto nível e visão holística do RevOps. Se não virem insights rápidos com poucos cliques, abandonam. Preferem delegar a configuração pesada. |
| **Gestor (Gerente de Vendas, Líder SDR)** | 80% | < 7 minutos | Altamente motivados a resolver dores imediatas da equipe. Mais dispostos a investir tempo inicial para configurar automações que pouparão tempo depois. |
| **Técnico (Sales Ops, Analista de Dados)** | 90% | < 10 minutos | Mais pacientes e detalhistas. Dispostos a conectar múltiplas fontes (CRM, BD) e afinar o agente IA. Focam na qualidade da integração e na flexibilidade das configurações avançadas. |

## Métricas Secundárias de Qualidade (Saúde do Onboarding)
*   **Taxa de Drop-off na Integração (OAuth):** Não superior a 25% global (todos os papéis combinados).
*   **Tempo Médio de Seleção do Agente:** Menos de 45 segundos por usuário.
*   **Percentual de Retorno ao Fluxo (D+1):** 15% dos usuários que abandonaram inicialmente retornam para concluir nas 24h seguintes (via campanhas de reengajamento).

## Ações baseadas nos Resultados (Limiares de Alerta)
*   Se a completude do **Executivo** cair abaixo de 45%, iniciar investigação qualitativa prioritária sobre "Sobrecarga Cognitiva" no passo 1 ou 2.
*   Se a completude do **Gestor** cair abaixo de 65%, revisar imediatamente os *copys* de proposta de valor e a facilidade de escolha do Agente IA ideal.
*   Se o tempo (TTFV) global ultrapassar os 10 minutos sistematicamente, escalonar para a engenharia uma revisão de performance nas integrações OAuth e no processamento inicial da IA.
