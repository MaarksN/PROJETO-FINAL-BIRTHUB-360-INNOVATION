# ADR-014: Versionamento de Agentes

## Status
Proposto

## Contexto
Com a formalização do Agent Manifest (ADR-013), precisamos definir como os agentes serão versionados e como as atualizações (especialmente as que quebram compatibilidade) serão gerenciadas. Os agentes, diferentemente de bibliotecas de código tradicionais, são artefatos híbridos que combinam código determinístico (tools, hooks) e instruções não-determinísticas (prompts, LLMs). Uma alteração em um prompt pode mudar drasticamente o comportamento de um agente, quebrando workflows dependentes. Precisamos decidir se adotaremos *Semantic Versioning (SemVer)* ou versionamento baseado em data (Calendar Versioning / *CalVer*), além de definir a política de *breaking changes*.

## Decisão
Adotaremos **Semantic Versioning (SemVer) 2.0.0 (`MAJOR.MINOR.PATCH`)** para a versão do agente, declarada no campo `metadata.version` do Agent Manifest.

### Por que SemVer e não Date-Based (CalVer)?
*   **Contratos Claros:** Os agentes do BirthHub360 interagem entre si formando *workflows* (um agente é dependência de outro). SemVer comunica intenção de forma muito mais clara que uma data. Se o agente `triage` depende do `sentiment_analysis ^1.2.0`, ele sabe que a versão `1.3.0` é segura, mas a `2.0.0` requer atenção e possivelmente refatoração. CalVer não oferece essa garantia de contrato.
*   **Retrocompatibilidade:** A infraestrutura (Agent Core) precisa saber quando manter múltiplas versões de um agente rodando simultaneamente (Blue/Green ou side-by-side) e quando pode simplesmente substituir a versão antiga (in-place update). O bump de `MAJOR` sinaliza a necessidade de side-by-side.

### O que constitui cada incremento?

Dada a natureza não-determinística dos agentes, as definições tradicionais de API precisam ser adaptadas:

1.  **PATCH (0.0.X):** Correções de bugs.
    *   *Exemplos:* Correção de um typo em uma Tool, ajuste de um parâmetro de timeout em `configuration.env`, ou pequenos ajustes (tweaks) no prompt do sistema para corrigir alucinações específicas, *desde que o objetivo final e os outputs não mudem*.
    *   *Deploy:* A substituição pode ser feita in-place (atualiza o manifesto ativo).

2.  **MINOR (0.X.0):** Adição de capacidades de forma retrocompatível.
    *   *Exemplos:* O agente recebe uma nova Tool em seu manifesto, o agente é instruído no prompt a suportar um novo idioma de entrada, adição de novas dependências (outros agentes) para fluxos secundários novos.
    *   *Garantia:* Workflows que dependiam do agente na versão `0.(X-1).0` continuarão funcionando perfeitamente. O formato de output para entradas antigas não deve quebrar.
    *   *Deploy:* Substituição in-place geralmente segura.

3.  **MAJOR (X.0.0):** Breaking Changes (Quebra de compatibilidade).
    *   *Exemplos:* Ver o documento `docs/policies/manifest-breaking-changes.md` para a lista exaustiva. Inclui remoção de Tools, mudança drástica no core prompt que altera o formato do output esperado (mesmo que melhorado), ou remoção de capacidades (ex: agente deixa de ter permissão `write`).
    *   *Garantia:* Não há garantias de que os clientes (outros agentes ou usuários finais) continuarão funcionando sem intervenção.
    *   *Deploy:* A versão antiga **DEVE** continuar rodando no runtime (side-by-side) até que todos os clientes migrem ou a versão sofra *sunset* (deprecação).

## Consequências
*   **Positivas:** Contratos explícitos entre os agentes e previsibilidade para as equipes que mantêm os workflows. O orquestrador pode fazer resolução de dependências de forma inteligente (como o NPM ou Cargo).
*   **Negativas:** A linha entre `PATCH` (tweak de prompt) e `MAJOR` (mudança comportamental) pode ser subjetiva. As equipes precisarão de disciplina para testar e revisar se uma mudança no prompt de fato constitui um *breaking change*. Requer que a infraestrutura suporte múltiplas versões do mesmo agente ativas.

## Referências
*   Item 4.2.J1 do Ciclo 4 (JULES)
*   [ADR-013: Design do Agent Manifest](./ADR-013-agent-manifest.md)
*   `docs/policies/manifest-breaking-changes.md`
