# Guia de Contribuição: Escrevendo Agent Manifests

Bem-vindo ao guia de contribuição para o desenvolvimento de agentes na plataforma BirthHub360. Para que o seu agente seja integrado e executado corretamente, ele precisa de um **Agent Manifest** bem definido (veja [ADR-013](../adr/ADR-013-agent-manifest.md)).

Este documento descreve como escrever um manifesto válido, testável e com semântica clara.

## 1. O que é o Agent Manifest?

O Agent Manifest é um arquivo YAML (ou JSON) que atua como o contrato do seu agente. Ele diz à plataforma:
*   Quem é o agente (nome, versão, autor).
*   O que ele tem permissão para fazer (capabilities).
*   Quais ferramentas ele usa (tools).
*   Do que ele depende (dependencies).
*   Como ele é configurado (config).

## 2. Estrutura do Manifesto

Um manifesto válido deve seguir a estrutura base abaixo. Um schema JSON oficial será fornecido para validação (ex: no pre-commit ou CI).

```yaml
manifest_version: "1.0"

metadata:
  name: "support_triage_agent"
  version: "1.2.0"
  description: "Agent responsible for triaging incoming customer support tickets and routing them to the correct department."
  author: "Suporte Team <suporte@birthhub360.com>"

capabilities:
  - "read"
  - "write"

tools:
  - name: "fetch_ticket_details"
    description: "Fetches details of a ticket given its ID."
  - name: "update_ticket_status"
    description: "Updates the status of a ticket."
  - name: "route_ticket"
    description: "Routes a ticket to a specific department queue."

dependencies:
  agents:
    - name: "sentiment_analysis_agent"
      version: "^2.0.0"

configuration:
  timeout_seconds: 120
  max_retries: 3
  env:
    - name: "ZENDESK_API_URL"
      required: true
```

## 3. Boas Práticas e Semântica Clara

Para garantir que seu manifesto seja legível e fácil de manter, siga estas diretrizes:

### Nomenclatura (Naming Conventions)
*   **Agentes (`metadata.name`)**: Use `snake_case`, descritivo e sem a palavra "agent" no final se for redundante, mas evite nomes genéricos. Ex: `support_triage` em vez de `triage` ou `Agent1`.
*   **Ferramentas (`tools[].name`)**: Use verbos de ação claros no formato `snake_case`. Ex: `fetch_user_data`, `send_email`. Não use nomes como `tool1` ou `do_stuff`.

### Descrições e Prompts
*   As descrições no `metadata.description` e em `tools[].description` são vitais. O LLM orquestrador usa essas descrições para saber *quando* invocar seu agente ou ferramenta.
*   **Seja específico:** Descreva o *propósito* e os *limites*. "Envia emails de cobrança para clientes inadimplentes" é melhor que "Envia emails".

### Versionamento (Semantic Versioning)
Siga o SemVer estritamente (MAJOR.MINOR.PATCH):
*   Bump **MAJOR** se você remover uma ferramenta, alterar os parâmetros obrigatórios de uma ferramenta ou mudar drasticamente o comportamento do agente.
*   Bump **MINOR** se você adicionar uma nova ferramenta ou capacidade de forma retrocompatível.
*   Bump **PATCH** para correções de bugs, ajustes de timeout ou melhorias internas que não afetam a interface do agente.

### Capacidades (Capabilities)
Adote o Princípio do Menor Privilégio. Nunca solicite a capacidade `write` ou `execute` se o seu agente apenas lê dados para gerar relatórios. O processo de revisão do manifesto (PR review) irá rejeitar capacidades não justificadas. (Veja `docs/guides/capabilities-definition.md`).

## 4. Como Tornar o Manifesto Testável

Um bom manifesto facilita os testes automatizados da plataforma.

1.  **Isolamento através de Dependências:** Se seu agente chama outro agente, declare isso em `dependencies.agents`. Isso permite que o framework de testes "moke" (mock) as respostas do agente dependente durante os testes unitários do seu agente.
2.  **Configurações Claras:** Declare todas as variáveis de ambiente necessárias em `configuration.env`. O framework de testes usará essa lista para injetar valores de teste seguros (sandbox). Se uma variável não for declarada, o agente não terá acesso a ela no runtime de testes.
3.  **Validação Local:** Antes de enviar seu PR, rode a ferramenta de validação de manifestos:
    ```bash
    # Exemplo de comando (a ser implementado)
    birthhub-cli validate-manifest path/to/manifest.yaml
    ```
    Isso garantirá que seu arquivo respeita o schema e que não há erros de sintaxe.

## 5. Submetendo seu Manifesto

1. Crie uma branch (ex: `feat/support-triage-agent`).
2. Adicione ou atualize o seu `manifest.yaml` no diretório do seu agente (ex: `agents/support_triage/manifest.yaml`).
3. Abra um Pull Request.
4. O CI irá validar o schema do manifesto.
5. Um revisor de arquitetura (Agent Core Team) revisará as capacidades solicitadas e as dependências (veja a política de revisão em `docs/policies/manifest-review.md`).
