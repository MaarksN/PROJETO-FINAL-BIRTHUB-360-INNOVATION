# Teste de Descoberta no Catálogo de Agentes

Este documento descreve um cenário de teste simulado para validar a taxonomia de tags e a utilidade do catálogo corporativo para usuários de negócio.

## Cenário: Gerente de Vendas Procurando Copilotos

*   **Persona:** João, Gerente Comercial B2B, sem grande conhecimento técnico sobre como agentes de IA funcionam, precisa configurar rotinas automatizadas para o seu time de Vendas.
*   **Objetivo de Negócio:** Melhorar a gestão do pipeline, qualificar os leads vindos do marketing (inbound) e ajudar os AEs a fecharem propostas complexas.
*   **Meta de Descoberta:** Encontrar três (3) agentes adequados para suas necessidades em menos de 30 segundos utilizando a busca por taxonomia.

## Etapas do Teste (Simulação)

### Passo 1: Busca por Domínio e Papel

João acessa o Catálogo Oficial e utiliza os filtros básicos de taxonomia:
1.  Filtro `domain`: **`sales`**
2.  Filtro `role`: **`manager`** (Buscando agentes para seu próprio apoio).

**Resultado Esperado (Instantâneo):** O catálogo retorna os agentes que possuem a tag `domain:sales` E a tag `role:manager` (ex: **Coordenador Comercial** ou **Gerente Comercial**).
**Tempo Gasto:** ~5 segundos.

### Passo 2: Busca por Função Específica de Qualificação

Satisfeito com o seu copiloto gerencial, João busca um agente para ajudar seus representantes com os leads inbound.
1.  Filtro livre ou seleção na taxonomia de Função: "qualificação" (ou seleciona `role:sdr`).

**Resultado Esperado:** O catálogo retorna agentes focados em prospecção inicial (ex: **SDR** ou **LDR**).
**Tempo Gasto:** ~10 segundos.

### Passo 3: Busca por Habilidade de Fechamento

Para seus AEs experientes, ele busca um agente capaz de lidar com a parte legal e comercial avançada.
1.  Filtra por: `domain:sales` e `role:ae` (ou `role:closer`).

**Resultado Esperado:** O catálogo retorna os agentes de fechamento (ex: **Closer** ou **AE**).
**Tempo Gasto:** ~10 segundos.

## Conclusão do Teste

**Status:** Sucesso (Aprovado na Simulação).
**Tempo Total Estimado:** 25 segundos (< 30s).
**Observações:** A taxonomia padronizada (`domain:`, `role:`) é essencial para que perfis de gestão (personas não técnicas) consigam navegar pelo portfólio de Agent Packs baseando-se em funções corporativas conhecidas (SDR, AE, Manager) em vez de capacidades técnicas isoladas.
