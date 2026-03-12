# Critérios de Sucesso do Wizard - Usuário Gestor

## Visão Geral
Este documento estabelece os critérios de sucesso e métricas esperadas para o Wizard de Onboarding do BirthHub 360, com foco especial na persona **Gestor de Vendas (Sales Manager)**, visando atingir uma taxa de completude de 80%.

## 1. Por que o Gestor é a Persona Principal de Otimização?
- Gestores possuem o poder de compra e expansão dentro de suas equipes (SDRs, AEs).
- Eles têm interesse direto em otimizar operações repetitivas sem precisar necessariamente de um "Technical Admin".
- Historicamente (análise prévia), a completude dessa persona estava em 72%. Uma melhoria de UX focada neles traz o maior ROI de conversão Trial para Pago.

## 2. Meta Principal: 80% de Completude do Wizard
A taxa de completude é calculada como: `(Número de Gestores que visualizaram o primeiro insight do Agente) / (Número de Gestores que iniciaram o Wizard)`.

### 2.1 Passos Críticos do Wizard
1. **Seleção de Perfil**: Preenchimento automático (0s).
2. **Conexão CRM**: Em vez de OAuth obrigatório imediato, oferecer **Integração Básica via CSV** (Upload) ou **Dados Demo (Sandbox)** para pulo imediato.
3. **Setup do Agente Principal**: Sugerir 1 único agente focado na principal dor (Ex: Agente Analista de Pipeline).
4. **Ver o Dashboard**.

## 3. Critérios Mínimos de Sucesso (UX/UI)
Para considerar a nova versão do wizard "Pronta para Prod" e capaz de atingir os 80%:

1. **Tempo de Conclusão (TTFV - Time to First Value):** O Gestor deve conseguir completar o wizard e ver o Dashboard populado (com seus dados ou demo) em **menos de 4 minutos**.
2. **Ausência de "Telas Brancas":** Nenhuma etapa de processamento (Spinner) deve exceder 5 segundos sem feedback visual rico (Skeleton Loaders ou Tooltips informativas).
3. **Clareza de Controle (Segurança Psicológica):** O gestor deve ver uma confirmação explícita de que **nenhum e-mail ou ação externa será tomada automaticamente** pelos agentes sem a sua pré-aprovação ("Modo Draft/Copiloto ativado").
4. **Taxa de Pulo (Skip Rate) Monitorada:** É aceitável que até 40% dos Gestores usem a opção "Dados de Demonstração" no lugar da "Integração CRM". O sucesso é que eles terminem o fluxo.

## 4. Plano de Acompanhamento Pós-Deploy
- Acompanhar Funil do Mixpanel (Eventos: `Wizard Started` -> `CRM Connected` / `Demo Selected` -> `Agent Configured` -> `Aha Moment Reached`).
- Investigar se a taxa (hoje 72%) estacionar antes de 80% após 2 semanas.
