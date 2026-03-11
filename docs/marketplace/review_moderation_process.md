# Processo de Moderação de Reviews: Quem Modera, Critérios e Apelação

## 1. Objetivo
Estabelecer as diretrizes e o fluxo de trabalho para a moderação de avaliações (reviews) e comentários deixados por usuários nos Packs publicados no Marketplace Público do BirthHub360. O objetivo é manter um ambiente de feedback construtivo, livre de spam, abuso e manipulação, garantindo a integridade do sistema de reputação.

## 2. Atores Envolvidos (Quem Modera)

*   **Sistema Automatizado (Filtro Nível 1):** Algoritmos de processamento de linguagem natural (NLP) e regras heurísticas que atuam em tempo real no momento da submissão do review.
*   **Equipe de Moderação BirthHub360 (Nível 2):** Analistas humanos responsáveis por revisar denúncias, avaliar casos complexos e auditar as decisões do sistema automatizado.
*   **Criadores de Packs:** Podem sinalizar (flag) reviews em seus próprios packs que considerem injustos ou violadores das regras, mas não podem apagá-los diretamente.
*   **Usuários Finais (Comunidade):** Podem denunciar reviews em qualquer pack que considerem abusivos ou falsos (crowdsourced moderation).

## 3. Critérios de Moderação (O que é proibido)

Um review será ocultado ou removido se violar qualquer um dos seguintes critérios:

### 3.1. Conteúdo Abusivo ou Ilegal
*   **Discurso de Ódio e Assédio:** Qualquer forma de discriminação, ameaças, intimidação, doxing (exposição de dados pessoais) ou ataques pessoais direcionados ao criador do pack ou a outros usuários.
*   **Conteúdo Explícito:** Linguagem obscena, profanidade excessiva ou material sexualmente explícito.
*   **Ilegalidade:** Promoção de atividades ilegais ou violação de direitos autorais (ex: "Use este pack para gerar chaves de software pirata").

### 3.2. Spam e Manipulação (Fake Reviews)
*   **Spam Comercial:** Promoção de serviços concorrentes, links não relacionados ao BirthHub360 ou anúncios disfarçados de review ("Compre meus serviços na empresa X").
*   **Review Bombing (Positivo ou Negativo):** Esforços coordenados (por humanos ou bots) para inflar ou destruir artificialmente a reputação de um pack sem base no uso real.
*   **Conflito de Interesse:** Reviews deixados pelo próprio criador (usando contas alternativas), seus funcionários ou concorrentes diretos com o intuito de manipular o ranking.

### 3.3. Irrelevância e Baixa Qualidade
*   **Off-Topic:** O comentário não tem relação com a funcionalidade, qualidade ou experiência de uso do pack (ex: reclamar da lentidão da internet do próprio usuário ou do preço da assinatura do BirthHub360).
*   **Incompreensível:** Textos sem sentido, compostos apenas por emojis ou caracteres aleatórios (ex: "asdfghjkl").
*   **Feedback Não Acionável (Somente em casos extremos):** Embora reviews de 1 estrela sem texto sejam permitidos (afetam apenas a média), comentários que consistem apenas em insultos vagos ("Este pack é um lixo") sem explicar o motivo podem ser rebaixados na exibição, embora a nota (rating) seja mantida, a menos que viole a regra 3.1.

## 4. Fluxo de Moderação

### 4.1. Submissão e Filtro Automático
1.  O usuário envia o review (nota + comentário opcional).
2.  O Filtro Automático (Nível 1) analisa o texto:
    *   *Match* com lista de palavras proibidas (profanidade, ódio) -> Rejeição imediata antes da publicação. Mensagem de erro ao usuário.
    *   Detecção de anomalia (ex: 50 reviews de 1 estrela em 10 minutos para um pack que normalmente recebe 1 por dia) -> Publicação suspensa; enviado para fila de Moderação Humana (Nível 2).
    *   Nenhuma violação detectada -> Review publicado e visível no Marketplace.

### 4.2. Denúncia (Flagging)
1.  Um review já publicado é denunciado por um Criador, outro Usuário ou selecionado para auditoria aleatória.
2.  O review recebe a tag `UNDER_REVIEW` (permanece visível por padrão, a menos que a denúncia seja classificada como "Risco de Vida/Legal", caso em que é ocultado cautelarmente).
3.  O caso entra na fila da Equipe de Moderação (Nível 2) com SLA de 48 horas úteis.

### 4.3. Análise Humana e Decisão
O Analista de Moderação avalia o contexto, o histórico do usuário que deixou o review e a denúncia:
*   **Aprovar (Keep):** A denúncia é infundada. O review não viola os critérios. A tag `UNDER_REVIEW` é removida.
*   **Remover (Delete):** O review viola claramente as regras. O comentário é apagado, e a nota (estrelas) é subtraída do cálculo da reputação do pack. O autor do review é notificado do motivo da remoção.
*   **Ação Disciplinar:** Se o autor do review for reincidente em violações severas (ex: assédio, spam), sua conta de usuário (e potencialmente todo o seu Tenant, dependendo da gravidade) pode ser suspensa de avaliar outros packs ou banida da plataforma.

## 5. Processo de Apelação

Garantir a justiça para os usuários cujos reviews foram removidos e para os criadores cujos packs sofreram avaliações injustas.

### 5.1. Apelação pelo Autor do Review Removido
1.  **Notificação:** O usuário recebe um e-mail explicando qual regra foi violada e um link para contestar a decisão em até 7 dias corridos.
2.  **Submissão:** O usuário preenche um formulário curto justificando por que acredita que a remoção foi um erro.
3.  **Revisão Secundária (SLA: 5 dias úteis):** Um Analista de Moderação *diferente* (Senior) avalia a apelação. Esta decisão é final e irreversível.
    *   Se a apelação for deferida, o review é restaurado integralmente.
    *   Se indeferida, o review permanece apagado.

### 5.2. Apelação pelo Criador do Pack (Review Não Removido)
Se o Criador denunciou um review, mas a moderação decidiu mantê-lo (Aprovar), o Criador tem um último recurso:
1.  **Escalação (Escalate):** O Criador pode solicitar uma segunda análise, fornecendo evidências adicionais (ex: logs de execução provando que o erro relatado pelo usuário nunca ocorreu no seu tenant, indicando má-fé).
2.  **Análise Final (SLA: 7 dias úteis):** A equipe de Trust & Safety avalia as evidências técnicas fornecidas pelo Criador vs. a experiência relatada pelo usuário. Se comprovada a falsidade ou erro técnico do *usuário*, o review é removido. Caso contrário, a decisão inicial de manter o review é ratificada.
