# Política de Revisão do Agent Manifest

Esta política define as regras, papéis e o fluxo (workflow) exigidos para a aprovação e publicação (deploy) de um **Agent Manifest** na plataforma BirthHub360 (veja [ADR-013](../adr/ADR-013-agent-manifest.md)). O objetivo é garantir que apenas agentes seguros, auditáveis e bem definidos entrem em produção.

## 1. Escopo e Aplicabilidade

Esta política se aplica a **todos** os agentes (novos e atualizações) e suas respectivas ferramentas. Modificar o arquivo `manifest.yaml` de qualquer agente desencadeia obrigatoriamente este processo de revisão.

## 2. Papéis Envolvidos (Quem Aprova?)

O processo de revisão de um manifesto exige **dupla aprovação** em ambientes produtivos (Four-Eyes Principle).

*   **Autor (Submitting Engineer):** O desenvolvedor, AI Engineer ou Product Manager que cria ou atualiza o agente e abre o Pull Request (PR) com o manifesto modificado.
*   **Revisor de Domínio (Domain Reviewer):** Um engenheiro sênior ou líder técnico da equipe dona do agente. Ele foca na lógica de negócio e na correção das tools/prompts.
*   **Revisor de Plataforma/Segurança (Core/Security Reviewer):** Um membro do time "Agent Core" ou "AppSec". Ele foca em segurança (capacidades, vazamentos) e estabilidade da plataforma (dependências, timeouts).

## 3. Critérios de Aceite (Review Criteria)

Um manifesto **não deve** ser aprovado se falhar em qualquer um dos critérios abaixo:

### A. Validação Estrutural e Sintática
*   [ ] O manifesto passa na validação estrita do JSON Schema (`birthhub-cli validate-manifest`).
*   [ ] Versão do manifesto (`manifest_version`) e do agente (`metadata.version`) seguem os padrões definidos (SemVer).
*   [ ] Metadados (nome, descrição, autor) estão preenchidos, são claros e não possuem caracteres ambíguos.

### B. Revisão de Capacidades (Security & Privacy)
*   [ ] **Menor Privilégio (Least Privilege):** As `capabilities` solicitadas são estritamente necessárias para as ferramentas (tools) listadas. (Ex: O agente pede `write`, mas as tools só fazem `SELECT` no banco).
*   [ ] **Ausência de Secrets:** Nenhuma credencial (API Key, token, senha) está "hardcoded" no arquivo, especialmente na seção `configuration.env`. O manifesto deve apenas *declarar* as variáveis de ambiente necessárias.
*   [ ] **Justificativa para Ações Críticas:** Se as capacidades `write` ou `execute` (especialmente para serviços externos) forem solicitadas, o PR deve conter uma justificativa de negócio clara.

### C. Revisão de Tools e Dependências
*   [ ] Nomes de tools (`tools[].name`) seguem as convenções (`snake_case`, verbos de ação).
*   [ ] Descrições das tools são precisas para evitar "Confused Deputy Problem" ou mal-entendido pelo LLM orquestrador.
*   [ ] Dependências (`dependencies.agents`) referenciam agentes conhecidos e usam versões ancoradas (pinned) ou ranges seguros (ex: `^2.1.0`), evitando "Dependency Confusion".
*   [ ] Tools com alto risco de segurança (ex: `run_shell_command`) devem passar por revisão de segurança obrigatória, não apenas do revisor de domínio.

### D. Configuração Operacional (Reliability)
*   [ ] `timeout_seconds` está definido e é um valor razoável (ex: entre 30s e 300s, não infinito).
*   [ ] Variáveis obrigatórias em `configuration.env` foram documentadas.

## 4. O Fluxo de Revisão (Review Workflow)

1.  **Abertura do PR:** O Autor abre um Pull Request contendo a adição ou modificação de um `manifest.yaml` (ou `.json`).
2.  **Verificações Automatizadas (CI/CD):**
    *   O pipeline de CI executa o linter e o validador de schema no manifesto.
    *   Um script de segurança analisa se o manifesto solicita capacidades restritas (`write`, `execute`). Se sim, o PR é automaticamente tageado como `needs-security-review`.
3.  **Revisão de Domínio:** O Revisor de Domínio analisa o manifesto para garantir o alinhamento de negócio e os nomes das tools/descrições. Se aprovado, ele assina o PR.
4.  **Revisão de Plataforma/Segurança:** O Core Reviewer analisa as capacidades, configurações e riscos sistêmicos. Se aprovado, ele assina o PR.
5.  **Merge e Deploy:** Com as duas aprovações obrigatórias e todos os testes automatizados passando (incluindo testes que usam o manifesto aprovado), o PR pode ser mergeado e o agente é publicado.

## 5. Acordo de Nível de Serviço (SLA de Review)

Para garantir agilidade sem comprometer a segurança, os seguintes SLAs se aplicam:

*   **Manifestos de Baixo Risco** (Somente capacidade `read`, uso de ferramentas padrão internas já aprovadas):
    *   Tempo de Resposta Alvo: **24 horas (dia útil)** após a abertura do PR.
    *   Aprovação necessária: Revisor de Domínio (Aprovação de Plataforma é opcional, mas recomendada).
*   **Manifestos de Alto Risco** (Capacidades `write`, `execute`, ferramentas novas, integrações externas ou acesso a PII):
    *   Tempo de Resposta Alvo: **48 horas (dias úteis)** após a abertura do PR.
    *   Aprovação necessária: Revisor de Domínio **E** Revisor de Plataforma/Segurança (obrigatório).

## 6. Exceções e "Quebra-Vidro" (Break-Glass)

Em caso de incidente crítico (ex: um agente está travando o banco de dados em produção e precisa ter seu timeout alterado imediatamente), o processo regular pode ser contornado usando o procedimento "Break-Glass" da empresa. A modificação é feita emergencialmente (hotfix) por um administrador com privilégios elevados, gerando um alerta de auditoria P0. O PR de hotfix deve ser revisado de forma retrospectiva no próximo dia útil.
