# Checklist de Revisão de Manifesto de Agente

Antes de aprovar um Pull Request (PR) que introduz um novo `manifest.yaml` ou atualiza um existente, o revisor deve garantir que o arquivo atenda a todos os critérios de segurança, operabilidade e semântica do BirthHub360.

**Agente Revisado:** ________________________
**Versão do Manifesto:** ________________________
**Autor do PR:** ________________________
**Revisor (Domain):** ________________________
**Revisor (Core/Sec):** ________________________

---

## 1. Validação Estrutural e Sintática (CI/CD Automatizado)
*   [ ] O arquivo `manifest.yaml` ou `.json` é válido conforme o JSON Schema oficial (`birthhub-cli validate-manifest`).
*   [ ] O arquivo está localizado no diretório correto do agente (ex: `agents/<nome_do_agente>/manifest.yaml`).
*   [ ] A `manifest_version` está declarada e é suportada pelo Agent Core atual.
*   [ ] O `metadata.version` segue o padrão de Versionamento Semântico (SemVer) (MAJOR.MINOR.PATCH) (Ver ADR-014).
*   [ ] Os metadados (`name`, `description`, `author`) são claros, descritivos e precisos (o `name` está em `snake_case`).

## 2. Capacidades (Capabilities) e Princípio do Menor Privilégio
*   [ ] O agente solicita apenas as capacidades (`read`, `write`, `execute`, `notify`) estritamente necessárias para as `tools` declaradas.
*   [ ] A justificativa para solicitar `write` ou `execute` foi fornecida no PR (caso não seja óbvia).
*   [ ] As capabilities solicitadas não violam as restrições globais do Tenant (ver Policy Engine).

## 3. Revisão de Ferramentas (Tools)
*   [ ] As `tools` listadas em `tools[].name` usam verbos de ação claros e em `snake_case`.
*   [ ] A `description` de cada tool é precisa e instrui adequadamente o LLM sobre *quando* e *como* usá-la.
*   [ ] A `description` NÃO contém injeções de prompt disfarçadas ou instruções complexas que poderiam confundir o orquestrador (Confused Deputy Problem).
*   [ ] As tools listadas são compatíveis com as `capabilities` declaradas.
*   [ ] **Segurança (Opcional):** Se o agente expõe tools de alto risco (ex: execução arbitrária de código, deleção em lote), a equipe de AppSec foi envolvida na revisão?

## 4. Gerenciamento de Dependências
*   [ ] O agente declara corretamente suas dependências (outros agentes, versões) em `dependencies.agents`.
*   [ ] As versões dependentes usam referências seguras (pinned ou ranges como `^1.2.0`), evitando *Dependency Confusion*.
*   [ ] O manifesto não introduz dependências circulares (Agente A -> Agente B -> Agente A).

## 5. Configuração Operacional e Sensível
*   [ ] O manifesto NÃO contém valores fixos (*hardcoded*) de segredos (API Keys, senhas, tokens). Ele deve apenas declarar a necessidade na seção `configuration.env`.
*   [ ] Variáveis de ambiente declaradas que sobrescrevem URLs de APIs internas foram validadas e aprovadas.
*   [ ] O valor de `timeout_seconds` está configurado e é razoável para a carga de trabalho esperada do agente (ex: 30s a 300s).

## 6. Versionamento e Breaking Changes
*   [ ] Se a versão foi incrementada (`MINOR` ou `MAJOR`), a nova versão justifica o bump de acordo com o ADR-014.
*   [ ] Se a alteração introduz um *Breaking Change* (ex: remoção de tool, mudança de parâmetro obrigatório), o `metadata.version` foi incrementado com um `MAJOR` bump.
*   [ ] Se houver um *Breaking Change*, o Guia de Migração correspondente foi redigido e o período de deprecação (Notice Period) foi respeitado (conforme Política de Deprecação).

## Aprovação Final

- [ ] Aprovado por um Revisor de Domínio (Domain Reviewer).
- [ ] Aprovado por um Revisor da Plataforma/Segurança (Core/Security Reviewer) (se aplicável, para manifestos de alto risco).

---
*Este checklist é derivado da [Política de Revisão do Agent Manifest](../policies/manifest-review.md).*
