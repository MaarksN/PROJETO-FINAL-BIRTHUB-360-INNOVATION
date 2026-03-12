# Análise: Como a Atualização de um Agente Pode Quebrar um Workflow Existente

O ecossistema BirthHub360 utiliza uma arquitetura baseada em workflows orquestrados, onde agentes colaboram para concluir tarefas complexas. Esta análise descreve os vetores pelos quais a atualização de um único agente pode causar falhas em cascata em um workflow existente, e como nossa política de versionamento (ADR-014) atua como mecanismo de defesa.

A natureza "híbrida" (código determinístico + LLM não-determinístico) torna as atualizações de agentes mais complexas do que atualizações de bibliotecas de software tradicionais.

## Cenário Base de Workflow

Imagine um fluxo de **Onboarding de Cliente**:
1.  **Agente de Triage (`triage_agent`)**: Lê o e-mail do cliente, extrai a intenção e aciona o agente correto.
2.  **Agente de Contratos (`contract_agent`)**: Recebe a intenção de onboarding, gera o PDF do contrato e retorna um `link_do_contrato`.
3.  **Agente de Notificação (`notify_agent`)**: Recebe o `link_do_contrato` e envia o e-mail de boas-vindas.

As seções a seguir demonstram como atualizações no `contract_agent` podem quebrar este fluxo.

## 1. Alterações na Interface Estruturada (Tools & Schema)

Este é o vetor mais óbvio, semelhante a uma quebra de API REST.

*   **O Que Mudou:** O mantenedor do `contract_agent` atualizou a ferramenta `generate_contract`. Antes, ela retornava o campo `contract_url`. Na nova versão, por razões de normalização, ela passa a retornar `document_link`.
*   **A Quebra (Breakage):** Quando o `triage_agent` pede ao `contract_agent` para gerar o contrato, a resposta volta com `document_link`. O `triage_agent` (ou o orquestrador que repassa o estado) não reconhece este campo e tenta passar `contract_url` (que agora é `null`) para o `notify_agent`.
*   **Resultado:** O `notify_agent` envia um e-mail sem o link ou falha com erro de validação.
*   **Enquadramento SemVer:** Esta é uma mudança **MAJOR**. A interface da tool mudou incompativelmente. O manifesto do agente DEVE ter recebido um bump na versão Major.

## 2. Alterações Comportamentais Não-Determinísticas (Prompt Tweaking)

Esta é a causa de quebra mais difícil de detectar, pois o schema da Tool permanece idêntico, mas o *comportamento do LLM* muda.

*   **O Que Mudou:** O mantenedor do `contract_agent` alterou o System Prompt para ser mais "seguro". Ele adicionou a instrução: *"Se o nome da empresa for ambíguo, NUNCA gere o contrato. Peça esclarecimentos"*.
*   **A Quebra (Breakage):** Antes, o agente inferia o nome ou usava um placeholder. Agora, para um subconjunto de requisições, em vez de retornar o `contract_url` (usando a tool de sucesso), o LLM opta por usar uma tool de resposta direta (ex: `ask_user`) ou retorna um erro de orquestração ("Preciso de mais dados").
*   **Resultado:** O workflow inteiro, que era totalmente automatizado (straight-through processing), passa a pausar esperando intervenção humana, quebrando SLAs.
*   **Enquadramento SemVer:** Embora a assinatura da API não tenha mudado, a *garantia de comportamento* mudou drasticamente. Esta mudança DEVE ser classificada como **MAJOR** se o mantenedor souber que workflows automatizados dependem da execução sem pausas.

## 3. Alteração no Formato do Output Textual (Parsing de LLMs)

Mesmo quando não usamos tools estruturadas estritas, a forma como o texto é gerado importa para o agente chamador.

*   **O Que Mudou:** O `contract_agent` antes gerava um resumo do contrato em bullet points e passava isso na variável de "contexto" da memória compartilhada. Após um upgrade do modelo subjacente (ex: gpt-4 para gpt-4o) ou ajuste fino de prompt, ele passou a retornar um texto em parágrafos corridos ou JSON embarcado em Markdown (```json ... ```).
*   **A Quebra (Breakage):** Se o `notify_agent` tinha um prompt (ou código de extração regex) otimizado para ler bullet points e formatar o corpo do e-mail, a mudança no formato textual quebra o design visual do e-mail enviado ao cliente, ou o regex de extração falha.
*   **Resultado:** Degradação da Experiência do Usuário (UX) ou falha de processamento na etapa seguinte.
*   **Enquadramento SemVer:** Frequentemente tratado como PATCH ou MINOR, mas é a principal razão pela qual orquestradores Multi-Agent precisam de formatos de passagem de estado fortemente tipados (StateGraph) em vez de concatenar saídas de texto livre.

## 4. Retirada de Capacidades (Security Downgrade)

*   **O Que Mudou:** Em uma auditoria, a equipe de segurança removeu a capacidade `execute` (que permitia chamar APIs externas) do `contract_agent`, pois ele não deveria precisar disso.
*   **A Quebra (Breakage):** Um fluxo legado *não documentado* usava o `contract_agent` para notificar um webhook antigo do sistema de faturamento após gerar o contrato (usando uma tool genérica de HTTP que exigia `execute`).
*   **Resultado:** A tool de webhook passa a falhar com *Permission Denied* (Capability Missing) bloqueando o agente no meio do processamento.
*   **Enquadramento SemVer:** Remoção de capacidades que invalida ferramentas existentes é sempre **MAJOR**.

## Conclusão e Mitigações

Atualizações de agentes são inerentemente mais frágeis. Para mitigar o risco de quebra de workflows:

1.  **Tipagem Forte no Estado Compartilhado:** Usar LangGraph ou similar para definir schemas estritos para os dados que fluem entre agentes (`State`). Se o `contract_agent` tentar retornar algo diferente do `State` esperado, falhar cedo (Fail Fast) na fronteira do agente, não no meio da execução do próximo.
2.  **Versionamento Estrito:** Seguir as regras de Breaking Changes definidas na documentação (`manifest-breaking-changes.md`).
3.  **Execução Side-by-Side:** Versões MAJOR diferentes do mesmo agente (`triage_agent_v1` e `triage_agent_v2`) DEVEM poder coexistir no ambiente de produção até que o workflow seja explicitamente migrado para a `v2`.
4.  **Testes de Integração de Workflow:** Todo workflow crítico (ex: Onboarding) deve ter testes End-to-End (E2E) que rodam contra a versão "latest" dos sub-agentes. Se um mantenedor propõe um PR no `contract_agent`, o CI do repositório centralizado de workflows deve rodar para detectar quebras.
