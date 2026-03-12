# ADR-013: Design do Agent Manifest

## Status
Proposto

## Contexto
O ecossistema de agentes do BirthHub360 está crescendo e precisamos de uma forma padronizada, extensível e segura de definir as capacidades, dependências e configurações de cada agente. Atualmente, a definição de agentes é ad-hoc e fortemente acoplada ao código, dificultando a criação de novas ferramentas, atualizações independentes e a garantia de retrocompatibilidade. Precisamos definir a estrutura do "Agent Manifest", o arquivo central de configuração para qualquer agente na plataforma.

## Decisão
Adotaremos um formato de **Agent Manifest baseado em YAML/JSON** com um schema estrito (JSON Schema) para validação. O design focará em três pilares: extensibilidade, versionamento e retrocompatibilidade (backward compatibility).

### Estrutura Base do Manifest
O manifest conterá as seguintes seções principais:
*   **`metadata`**: Informações de identificação do agente (nome, versão, autor, descrição).
*   **`capabilities`**: Declaração explícita de permissões (ex: read, write, execute, notify) e acesso a ferramentas (tools). O agente operará no princípio do menor privilégio; se não estiver declarado aqui, a operação falhará no runtime.
*   **`dependencies`**: Outros agentes, serviços ou bibliotecas (com versões específicas ou ranges) necessários para a execução.
*   **`configuration`**: Parâmetros de runtime, prompts base, limites de recursos (memória, timeout) e variáveis de ambiente esperadas (sem valores sensíveis).
*   **`entrypoint`**: A classe/função principal que orquestra o agente.

### Extensibilidade
Para permitir que o manifesto cresça sem quebrar implementações antigas, adotaremos uma política de **"Open-Closed Principle" para o schema**:
*   Novos campos podem ser adicionados ao schema em versões menores (minor versions).
*   Campos existentes não podem ter seus tipos alterados nem serem removidos (exceto em major versions, e após período de deprecação).
*   O schema suportará a seção `extensions` ou propriedades adicionais (`additionalProperties: true` restrito a campos com prefixos específicos, como `x-`) para metadados customizados ou experimentais.

### Versionamento e Retrocompatibilidade (Backward Compatibility)
O versionamento do manifesto e do próprio agente é crítico para a estabilidade do sistema.

1.  **Versão do Schema (Manifest Version):**
    *   O manifest sempre declarará `manifest_version: "1.0"` (exemplo).
    *   Mudanças incompatíveis no formato do manifesto exigirão um bump na `manifest_version` (ex: "2.0").
    *   A plataforma (Agent Core) deverá suportar múltiplas versões do manifesto simultaneamente para garantir que agentes antigos continuem rodando (backward compatibility). O Core implementará adaptadores (upcasters) se necessário para normalizar manifests antigos para o formato interno mais recente.

2.  **Versão do Agente (Agent Version):**
    *   A versão do agente (em `metadata.version`) seguirá **Semantic Versioning (SemVer 2.0.0)** (`MAJOR.MINOR.PATCH`).
    *   **MAJOR**: Mudanças incompatíveis na API, mudanças nos prompts que alterem significativamente o comportamento esperado, ou mudanças na interface de tools. Quebra retrocompatibilidade.
    *   **MINOR**: Adição de novas capacidades ou tools (backward-compatible).
    *   **PATCH**: Correções de bugs, ajustes finos de prompt (sem alterar a semântica principal), melhorias de performance.

## Consequências
*   **Positivas:** Maior segurança (devido às capacidades explícitas), facilidade de governança, deploy independente de agentes, clareza sobre dependências.
*   **Negativas:** Aumenta a complexidade inicial de criação de um agente (necessidade de escrever e validar o manifest) e a manutenção da plataforma para suportar múltiplas versões de schema.

## Referências
*   Item 4.1.J1 do Ciclo 4 (JULES)
*   Integração com Policy Engine e Tool Framework (ADRs futuros)
