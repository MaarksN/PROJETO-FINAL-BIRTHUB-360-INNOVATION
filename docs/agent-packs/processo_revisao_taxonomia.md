# Processo de Revisão e Adição de Novas Tags (Taxonomia de Agent Packs)

Este documento estabelece o fluxo para propor, revisar, aprovar e documentar novas tags na taxonomia oficial do Catálogo de Agentes do BirthHub360. A taxonomia padronizada é vital para a governança e descoberta de Agent Packs; portanto, adições ou modificações estruturais exigem revisão formal.

## Quem e Quando Propor

Qualquer membro do time de Produto, RevOps, ou Engenharia (Desenvolvedores de Agent Packs) pode propor uma nova tag para as categorias padronizadas (`domain:`, `role:`, `tier:`, `compliance:`).

A solicitação é justificada quando:
1.  Um novo agente ou domínio de negócios é incorporado, e nenhuma tag existente no documento oficial de taxonomia o descreve de forma precisa e concisa.
2.  A taxonomia atual causa ambiguidade ou prejudica a busca no Catálogo Oficial.

## Fluxo de Solicitação e Aprovação

### 1. Proposição (Request)

A pessoa interessada deve abrir uma **Pull Request (PR)** contendo a edição do arquivo oficial `docs/agent-packs/taxonomia_tags.md`, acrescentando a nova tag na categoria apropriada.

A PR deve conter obrigatoriamente, na descrição:
*   **Nome da Tag Solicitada:** O valor exato proposto (ex: `domain:logistics`, `role:support-l1`).
*   **Justificativa Comercial ou Operacional:** O porquê da tag atual não suprir as necessidades (e.g., "Adoção de agente CS de primeiro nível requer nova segmentação de role").
*   **Exemplos de Uso:** Manifestos de agentes (ou ideias de pacotes futuros) que passarão a utilizar essa tag de forma primária.

### 2. Revisão por Pares (Review)

A PR passará pela avaliação de um Comitê de Plataforma ou Lead de RevOps, sob os seguintes critérios:

*   **Necessidade e Universalidade:** A tag deve abranger um caso de uso real, mas não ser demasiadamente específica ("nichada") a ponto de se tornar redundante para apenas uma versão ou cliente restrito.
*   **Padrão de Nomenclatura:** Deve aderir ao padrão kebab-case (letras minúsculas e hifens) já estabelecido.
*   **Conflito ou Sobreposição:** Não pode haver redundância lógica com uma tag existente (ex: propor `domain:finance` se já existe `domain:billing`). Caso haja, a discussão deve ser sobre refatoração e deprecação, não apenas adição.

### 3. Aprovação (Merge) e Documentação

Sendo a nova tag aprovada pela revisão:
1.  A PR é mesclada (`merge`) na branch principal (`main`).
2.  O glossário (`docs/agent-packs/taxonomia_tags.md`) torna-se imediatamente a fonte da verdade atualizada.
3.  A modificação é notificada, por meio dos Release Notes ou comunicados internos, às equipes desenvolvedoras para que comecem a utilizar a tag nos manifests de seus Agent Packs.

### 4. Revisões Periódicas

Semestralmente, as tags do Catálogo Oficial devem ser submetidas a uma auditoria de uso: tags não atreladas a nenhum manifesto de Agent Pack em produção (`stable`) por mais de 6 meses podem ser colocadas em fluxo de **Deprecação**.
