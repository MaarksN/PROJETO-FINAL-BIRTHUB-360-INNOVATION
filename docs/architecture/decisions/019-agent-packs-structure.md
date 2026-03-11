# ADR-019: Estrutura de Agent Packs — Versionamento, Publicação e Deprecação

## Status
Aceito

## Contexto
O BirthHub360 está consolidando sua frota de agentes em "Agent Packs" corporativos gerenciáveis, que podem ser implantados em diferentes contextos. Precisamos definir uma estrutura clara de versionamento, publicação e ciclo de vida desses pacotes.

## Decisão

1. **Estrutura dos Agent Packs**: Cada Agent Pack deve residir em um diretório próprio e conter obrigatoriamente um arquivo `manifest.yaml` definindo metadados, dependências (tools, skills) e configuração (inputs, outputs, governança).
2. **Versionamento**: Adotaremos Semantic Versioning (SemVer - MAJOR.MINOR.PATCH) para os Agent Packs.
    *   **MAJOR**: Mudanças incompatíveis na API (e.g., mudança de inputs/outputs obrigatórios, remoção de skills).
    *   **MINOR**: Adição de funcionalidades retrocompatíveis (e.g., nova skill opcional, novo output informativo).
    *   **PATCH**: Correções de bugs retrocompatíveis (e.g., ajustes finos no prompt de sistema).
3. **Publicação**: Agent Packs serão publicados via um pipeline de CI/CD que validará a estrutura do `manifest.yaml`, rodará os testes definidos (Smoke, I/O, Permissões) e atualizará um catálogo central de agentes se os critérios de aceite forem atingidos.
4. **Deprecação**: Agent Packs obsoletos ou que não atendam mais aos padrões de segurança e qualidade serão depreciados, passando pelo estado de `deprecated` (ainda utilizável, mas não recomendado para novos usos) e `sunset` (remoção efetiva). Um aviso deve ser enviado aos administradores com pelo menos 30 dias de antecedência para `sunset`.

## Consequências
*   A adoção do `manifest.yaml` facilita a descoberta e o gerenciamento de permissões.
*   SemVer provê clareza sobre o impacto de atualizações nos fluxos de trabalho que dependem dos agentes.
*   A publicação via CI garante a padronização e a qualidade dos pacotes no catálogo.
