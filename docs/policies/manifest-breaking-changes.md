# Política de Quebra de Compatibilidade (Breaking Changes) em Manifestos de Agentes

Para manter a estabilidade do ecossistema de multi-agentes do BirthHub360, todas as alterações no arquivo `manifest.yaml` de um agente devem ser cuidadosamente classificadas usando Versionamento Semântico (SemVer 2.0.0).

Este documento define **o que constitui um Breaking Change (Quebra de Compatibilidade)**. Qualquer alteração que se enquadre em uma das categorias abaixo exige um **bump na versão MAJOR** (ex: `1.4.2` para `2.0.0`) e segue a [Política de Deprecação](./deprecation-policy.md).

## 1. O que é um Breaking Change (MAJOR Bump Obrigatório)

### A. Modificações em Capacidades (Capabilities)
Qualquer redução nos privilégios de um agente que possa impedir ferramentas existentes de funcionar.
*   **Remoção de uma capacidade:** Ex: Remover `write` da lista de `capabilities` de um agente que antes podia gravar no banco.
*   **Restrição de escopo (Policy):** Adicionar um bloqueio (deny-list) ou remover um item de uma allow-list no Policy Engine que antes era permitido pelo manifesto.

### B. Modificações em Ferramentas (Tools)
Mudanças na interface estruturada de como o agente interage com o mundo ou com outros agentes.
*   **Remoção de uma Tool:** Deletar `generate_report` da lista de tools do manifesto.
*   **Renomeação de uma Tool:** Mudar `fetch_user` para `get_user`.
*   **Mudança no Schema de Entrada (Input) da Tool:**
    *   Tornar um parâmetro opcional em obrigatório.
    *   Mudar o tipo de um parâmetro (ex: de `string` para `integer`).
    *   Mudar o nome de um parâmetro (ex: de `userId` para `user_id`).
    *   Adicionar um novo parâmetro obrigatório.
*   **Mudança no Schema de Saída (Output) da Tool:**
    *   Remover um campo do objeto JSON retornado.
    *   Mudar o tipo de um campo retornado.
    *   Mudar a estrutura do objeto retornado (ex: passar a retornar um array em vez de um objeto).

### C. Modificações em Configurações Obrigatórias (`configuration.env`)
Mudanças nos requisitos de ambiente para que o agente possa ser instanciado.
*   **Adição de uma variável de ambiente OBRIGATÓRIA:** Se o agente agora requer `NEW_API_KEY` para iniciar e falha sem ela.
*   **Mudança de nome de variável:** Mudar `DB_HOST` para `DATABASE_URL`.
*   **Redução drástica de Resource Limits:** Por exemplo, diminuir o `timeout_seconds` de 120s para 10s, se for sabido que workflows normais demoram 15s. (Isso causará falhas sistêmicas em clientes que dependiam do timeout maior).

### D. Modificações Comportamentais (Prompt/LLM)
As alterações mais sutis, mas igualmente destrutivas para workflows orquestrados.
*   **Mudança no Formato de Saída (Output Format) do Agente:** Se o `triage_agent` é conhecido por retornar *sempre* um JSON estruturado no final de seu turno, e um ajuste de prompt faz com que ele passe a retornar texto livre (Markdown), isso é uma quebra de contrato.
*   **Alteração Drástica na Lógica de Decisão:** Se um agente de moderação era instruído a "sempre aprovar posts neutros" e passa a ser instruído a "sempre enviar posts neutros para revisão humana", a latência e o fluxo do sistema mudaram de automatizado para manual. Workflows dependentes desse comportamento rápido quebrarão ou violarão SLAs.

### E. Modificações em Dependências
*   **Bump MAJOR em uma dependência obrigatória:** Se o Agente A depende do Agente B `v1.0.0`, e o manifesto do Agente A é atualizado para depender do Agente B `v2.0.0`, o Agente A também deve sofrer um bump MAJOR, pois a mudança estrutural do Agente B pode (e provavelmente vai) vazar para quem chama o Agente A.

---

## 2. O que NÃO é um Breaking Change (MINOR ou PATCH Bumps)

As seguintes alterações **NÃO** exigem um bump MAJOR. Elas são retrocompatíveis e seguras para substituição "in-place" (deploy contínuo sem side-by-side).

### A. Adições e Extensões (MINOR Bump)
*   **Adicionar uma nova Tool:** Desde que o agente continue suportando as antigas.
*   **Adicionar um parâmetro OPCIONAL a uma Tool:** Clientes antigos não enviarão o parâmetro e a Tool deve continuar funcionando com o comportamento default.
*   **Adicionar um novo campo no Output de uma Tool:** Clientes antigos ignorarão o campo extra no JSON.
*   **Adicionar uma nova Capacidade:** O agente ganha permissões, não perde.
*   **Adicionar uma nova variável de ambiente opcional.**

### B. Correções e Otimizações (PATCH Bump)
*   **Correção de Bug (Bugfix) em uma Tool:** A Tool não retornava os dados prometidos devido a um erro de SQL, e agora retorna corretamente seguindo o schema original.
*   **Ajuste Fino de Prompt (Prompt Tweaking):** Melhorar a formulação do `system_prompt` para que o agente gere respostas mais concisas ou siga as instruções com maior fidelidade, *sem* alterar a estrutura do output (ex: de JSON para Texto) ou o comportamento macro esperado do workflow.
*   **Atualização de dependências MINOR/PATCH:** Atualizar bibliotecas internas ou a dependência de um agente de `^1.1.0` para `^1.2.0`.
*   **Mudanças na descrição (description) do Agent ou Tool:** Desde que não introduza injeções de prompt e apenas clarifique a intenção para o LLM.

## Resumo da Regra de Ouro

Se você precisa pedir a outra equipe (ou a outro agente no workflow) para modificar o código deles, os prompts deles ou a forma como eles interagem com o seu agente para que ele continue funcionando após a sua atualização, **você introduziu um Breaking Change (MAJOR)**.
