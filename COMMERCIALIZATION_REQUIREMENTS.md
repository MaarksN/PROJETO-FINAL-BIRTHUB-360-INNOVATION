# COMMERCIALIZATION REQUIREMENTS

Este documento consolida tudo o que falta para a ferramenta rodar 100% e estar pronta para ser comercializada por completo, com base no backlog de pendências forenses e nos gaps de governança documentados nas fases F0 a F11.

## 1. Gaps de Governança e Auditoria (Prioridade Máxima)

A comercialização para ambientes B2B/Enterprise exige que a ferramenta possua lastro empírico e rastreabilidade que passe em Due Diligence. Os seguintes pontos do `master_governance_checklist.md` precisam ser resolvidos antes da comercialização:

- **[DOC-10] Baseline de Aderência SLA 90d (🔴 CRÍTICO):** A política de SLA não pode ser apenas teórica. É necessário comprovar o SLA (uptime, tempo de resposta a incidentes) através de um baseline empírico verificável em `docs/operations/f0-sla-adherence-baseline-90d.md`.
- **[AUD-23] Bundle Dedicado de Isolamento Multi-tenant (🔴 CRÍTICO):** Para SaaS B2B, é imperativo provar o isolamento de dados entre clientes. O processo de regressão/teste existe, mas não gera um pacote consolidado e auditável.
- **[AUD-21] Política de Frescor e Revalidação de Evidências (🟠 ALTO):** Determinar a política oficial (ex.: `docs/operations/f0-evidence-freshness-policy.md`) de expiração e reexecução das evidências da auditoria para que due diligence não consuma provas antigas.
- **[AUD-22] Proveniência Uniforme Entre Bundles (🟠 ALTO):** As evidências de release, security, e F11 devem ter metadados uniformes de proveniência (checksum, hash e referência ao commit do código que o gerou).
- **[REL-18] SBOM Arquivado Localmente (🟠 ALTO):** A Software Bill of Materials (SBOM) deve ser gerada e mantida (`artifacts/sbom/bom.xml`) para rastreabilidade de segurança na cadeia de suprimentos.
- **[REL-19] Tag Semântica (🟠 ALTO):** A versão de release no código (`package.json`) deve estar atrelada a uma tag do repositório Git para rastreabilidade, rollback e comprovação da release oficial. (Resolvido: Tag `1.0.0` atrelada à baseline).
- **[REL-20] Manifesto de Checksums da Release (🟠 ALTO):** Criação de um manifesto único garantindo que os artefatos de release gerados não sofreram adulterações posteriores (drift).

*(Obs: Alguns de impacto Médio, como [DOC-21], [DOC-22], [AUD-24] e [REL-21] devem ser arrumados, mas as acima são bloqueadoras)*

## 2. Gaps Técnicos Ativos (Foco em Estabilidade e Segurança)

Conforme descrito em `audit/gaps.md`, algumas lacunas técnicas oferecem riscos e degradam a confiabilidade da arquitetura e operação.

- **Isolamento de Tenant - Prova em Banco de Dados (P0):** A pipeline de CI/CD deve rodar os testes de isolamento de tenant em um ambiente PostgreSQL obrigatoriamente (atualmente os testes ignoram a prova de isolamento quando o DB não está provisionado).
- **Segurança - Tipagens `any` (P1):** Existem 41 arquivos críticos que ainda utilizam tipagem genérica `any`. Isso destrói garantias de tipo estáticas nas fronteiras compartilhadas. Eles precisam ser mapeados explicitamente (zod, discriminated unions).
- **Estabilidade - Integrações Sem Timeout (P1):** Existem 74 arquivos de runtime que realizam chamadas de rede externas sem limites de tempo (`timeouts`). Se o serviço externo demorar ou falhar, a plataforma travará. É preciso introduzir política explícita de timeout e retry nesses pontos.
- **Observabilidade - Logging Misto (P1):** Existem 91 arquivos que usam `console.log` em vez de `@birthub/logger`. Em um ambiente comercial, todos os logs devem ser estruturados e centralizados para permitir alertas eficientes e censura (redaction) automática de PII.

## 3. Backlog de Pendências F0-F11 (Volume Operacional)

De acordo com `PROMPT_GERAL_PENDENCIAS.md`, há mais de **500 pendências identificadas** em diversas fases da ferramenta (classificadas como APENAS DOCUMENTADO, NÃO ENCONTRADO, CONFLITANTE ou PARCIAL).

Para a comercialização, não basta documentar. Todas essas pendências devem materializar-se na forma de **código, workflow, log, teste verificável ou artefato de release gerado pela esteira CI/CD**.

Recomenda-se executar em "batches" e resolver primeiro os NÃO ENCONTRADO, em seguida consolidar tudo que é APENAS DOCUMENTADO em verificações/módulos reais.

---
**Próximo Passo do Action Plan:** Iniciar a resolução resolvendo os Gaps de Governança `[DOC-10]`, `[AUD-21]` e `[REL-19]` para começar a "zerar" a área crítica de due diligence do SaaS.