# Política de Deprecação de Agentes e Ferramentas

Esta política estabelece as diretrizes para descontinuar e, eventualmente, remover versões de agentes, capacidades, ferramentas (tools) e APIs que não são mais suportadas na plataforma BirthHub360.

O ciclo de vida completo de um componente deprecado inclui o **Notice Period** (aviso prévio), a publicação do **Migration Guide** (guia de migração), e a data de **Sunset** (desligamento definitivo). O objetivo primário é minimizar interrupções nos workflows dos usuários e integrações de outros agentes.

## 1. Princípios Gerais

*   **Não quebrar clientes silenciosamente.** Nenhum agente ou tool em uso será desligado sem aviso prévio. A descontinuação abrupta só é permitida em caso de incidente crítico de segurança imediato (Zero-Day Vulnerability em uma tool, por exemplo).
*   **Avisos Claros e Antecipados.** A comunicação será feita via painel de controle (Agent Studio) e e-mail para os proprietários do Tenant.
*   **Tempo Adequado.** Os clientes devem ter tempo suficiente para atualizar suas integrações ou migrar para as alternativas recomendadas.
*   **Caminho Direto para Migração.** Toda deprecação *deve* vir acompanhada de um plano de como migrar para o novo fluxo recomendado.

## 2. O Processo de Deprecação

A deprecação ocorre em quatro fases distintas:

### Fase 1: Anúncio de Deprecação (Deprecation Notice)
O momento em que a equipe do BirthHub360 decide descontinuar oficialmente um recurso.

*   **Ações Exigidas:**
    *   O manifesto do agente deprecado (ou versão do agente) recebe uma anotação `deprecated: true` na seção metadata.
    *   Um **Migration Guide** deve estar escrito e publicado (veja seção 3).
    *   A API do Agent Core passará a retornar um header de aviso (`Warning: 299 BirthHub "This endpoint is deprecated."`) nas chamadas feitas pelo ou para o recurso deprecado.
*   **Início da Contagem Regressiva:** Esta fase inicia o **Notice Period** (Período de Aviso).

### Fase 2: Notice Period (Período de Aviso Prévio)
O período durante o qual o recurso deprecado continua a funcionar exatamente como antes (side-by-side com a nova versão, se houver).

*   **Duração Mínima:**
    *   **Versões *Major* de Agentes:** 90 dias.
    *   **Ferramentas Específicas (Tools) usadas via interface UI:** 60 dias.
    *   **Integrações de Parceiros / Third-Party Tools:** Pode variar conforme a política do provedor externo, mas tentaremos garantir pelo menos 60 dias. Se o provedor nos cortar imediatamente, o Sunset ocorre no mesmo momento.
*   **Suporte:** Durante este período, o recurso recebe correções de bugs críticos e patches de segurança, mas **nenhuma nova funcionalidade** é adicionada.

### Fase 3: Brownouts (Testes de Interrupção - Opcional, mas Recomendado)
Nas últimas semanas do Notice Period, a plataforma pode implementar "brownouts" programados para forçar os usuários a perceberem a dependência do recurso deprecado.

*   Um brownout é uma indisponibilidade temporária e controlada do recurso (ex: durante 1 hora, a chamada do agente falhará com erro `410 Gone`, retornando ao normal logo após).
*   Os brownouts serão comunicados antecipadamente e aumentarão em frequência e duração à medida que o dia do Sunset se aproximar.

### Fase 4: Sunset (Desligamento)
O recurso é permanentemente removido ou desabilitado da plataforma.

*   Qualquer chamada para o agente, versão ou tool deprecada retornará um erro definitivo (`410 Gone` em APIs, ou uma mensagem no log indicando "Agente descontinuado").
*   O código associado ao recurso será removido (deleted) do repositório ativo para reduzir a carga de manutenção.

## 3. Guia de Migração (Migration Guide)

Nenhuma deprecação será anunciada sem um Guia de Migração correspondente. Este guia (normalmente publicado em `docs/guides/migrations/`) deve conter:

1.  **O que está sendo deprecado e a data do Sunset.**
2.  **O motivo da deprecação.** (Ex: "A tool X foi substituída pela tool Y por ser mais rápida e segura").
3.  **A alternativa recomendada.** (O que o usuário/desenvolvedor deve usar no lugar).
4.  **Passo-a-passo técnico para a migração.** (Ex: "Mude no manifesto a dependência de `^1.0.0` para `^2.0.0` e atualize os parâmetros A, B e C para D e E no input da tool").
5.  **Exemplos de código (antes e depois).**

## 4. Retirada Emergencial (Emergency Sunset)

A plataforma reserva-se o direito de ignorar os períodos de aviso e realizar o desligamento imediato de um agente ou ferramenta caso:
*   Exista um risco iminente de segurança (ex: vazamento de PII grave, injeção de prompt explorada ativamente).
*   A tool dependa de um serviço de terceiros que foi desativado sem aviso por esse fornecedor.
*   O agente cause degradação sistêmica na estabilidade do Agent Core.
Nesses casos de força maior, um aviso post-mortem detalhando a ação emergencial será publicado imediatamente após a contenção.
