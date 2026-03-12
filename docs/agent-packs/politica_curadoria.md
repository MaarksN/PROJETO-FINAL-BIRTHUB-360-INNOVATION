# Política de Curadoria do Catálogo de Agent Packs

Este documento delineia o processo formal e os critérios necessários para que um novo agente ou pacote de habilidades (Agent Pack) seja aceito e publicado como `stable` no Catálogo Oficial do BirthHub360.

## Princípio Geral

O catálogo central deve oferecer confiança, segurança e alto valor para o negócio. Os agentes listados não podem comprometer a conformidade de dados da empresa e devem realizar tarefas específicas de forma verificável. Qualquer equipe interna pode desenvolver um agente, mas a submissão ao Catálogo Oficial requer a aprovação de um comitê de curadoria ou através da aprovação no pipeline CI/CD automatizado, que segue as diretrizes abaixo.

## Critérios de Aceite para Novos Agentes (Gatekeeper)

Para ser elegível à publicação oficial, um Agent Pack submetido deve cumprir **todos** os seguintes requisitos:

### 1. Governança e Estrutura (Manifesto)

*   **Manifesto Completo e Válido:** Deve possuir um `manifest.yaml` formatado corretamente, que define com precisão o agente (`name`, `description`, `domain`), suas capacidades (`tools`, `skills`), as configurações de I/O e a governança (custo, retenção).
*   **Versionamento SemVer:** O manifesto deve adotar e seguir a convenção de Versionamento Semântico. A primeira publicação deve iniciar em `1.0.0`.
*   **Taxonomia Oficial:** Deve empregar tags aderentes ao padrão `docs/agent-packs/taxonomia_tags.md` (mínimo: uma tag de `domain` e uma de `role`).
*   **Exemplos Funcionais:** Deve listar pelo menos um caso de uso concreto com input de exemplo e output esperado no manifesto.

### 2. Segurança e Compliance

*   **Menor Privilégio (Least Privilege):** O agente só deve ter acesso às `tools` estritamente necessárias descritas no seu manifesto. Acesso indiscriminado a bancos de dados e APIs externas é motivo de rejeição sumária.
*   **Human-In-The-Loop (HITL) Mapeado:** Ações destrutivas (deleção de registros), transações financeiras e envios diretos de e-mails em massa **devem** estar configurados para exigir aprovação humana obrigatória (`human_in_the_loop: true` nas políticas de operação correspondentes).
*   **Conformidade de Dados (LGPD/GDPR):** O manifest deve declarar o período de retenção de dados associado ao escopo das tarefas. Caso o agente trate dados PII sensíveis, a flag de compliance adequada (`compliance:lgpd`) deve estar configurada.
*   **Proteção contra Prompt Injection e Exfiltração:** O agente deve ter guardrails implementados e testados para prevenir injeções de comandos ou vazamento do prompt do sistema.

### 3. Testes, Desempenho e Qualidade

*   **Cobertura de Testes (Min 80%):** O agente deve estar coberto por testes unitários Python (`pytest`), validando os fluxos normais e erros.
*   **Testes de Integração e I/O (Smoke):** A aprovação de pipeline requer testes ponta-a-ponta rodando inputs e checando as saídas contra os "exemplos esperados".
*   **Testes de Robustez (Negative Testing):** Devem existir testes que validem como o agente reage a inputs corrompidos, mal-formatados ou ferramentas falhando.
*   **Eficiência e Custo (Tiering):** O agente deve especificar claramente seu nível esperado de consumo (tokens, APIs de conectores) via tag `tier:`. Agentes excessivamente ineficientes em chamadas de tools serão retornados para otimização do StateGraph.

## Processo de Submissão

1.  **Desenvolvimento e Documentação:** A equipe cria o agente na estrutura `/agents/novo_agente/`, preenche o `agent.py`, `tools.py`, e o `manifest.yaml` (além da pasta `/tests/`).
2.  **Pull Request e Automação:** Submete via Pull Request para a branch `main`. O CI executa lints, checagem de manifesto (Validador de Schema) e roda toda a suíte de testes (Python/E2E).
3.  **Revisão (Code Review):** Se o CI aprovar, um *Maintainer* do Core (geralmente um membro de Plataforma ou RevOps) fará a revisão final manual dos aspectos de governança, negócio e segurança.
4.  **Aprovação e Merge:** Uma vez aprovado e mesclado à `main`, a publicação no Catálogo Oficial é feita de maneira assíncrona.
