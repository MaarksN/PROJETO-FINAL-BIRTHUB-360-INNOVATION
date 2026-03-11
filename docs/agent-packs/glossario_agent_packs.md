# Glossário de Termos de Agent Packs

Este documento estabelece um vocabulário comum para garantir a consistência de nomenclatura na concepção, documentação e uso de Agent Packs corporativos no BirthHub360.

## Termos Essenciais

*   **Agent Pack:** Um pacote distribuível contendo um Agente de IA configurado para um domínio específico, incluindo seu `manifest`, instruções de sistema, definições de ferramentas (tools) e habilidades (skills), bem como políticas de governança e custo.
*   **Manifest (`manifest.yaml`):** Arquivo de configuração que descreve a identidade, capacidades (tools/skills), requisitos de entrada/saída, versionamento e governança de um Agent Pack. Funciona como a "carteira de identidade" do agente.
*   **Skill Template:** Um bloco de construção reutilizável que define uma capacidade específica (e.g., "qualificação de leads", "análise de contratos"). Pode compor múltiplos Agent Packs.
*   **Tool (Ferramenta):** Uma função atômica ou integração externa que o agente pode chamar para interagir com sistemas, bancos de dados ou APIs (e.g., "buscar\_lead\_hubspot", "enviar\_email").
*   **Conector:** O componente de integração subjacente a uma ou mais Tools, responsável por gerenciar credenciais, resiliência (retry, circuit breaker) e comunicação com o serviço externo (e.g., Conector Salesforce).
*   **Domínio:** A área de negócios ou função corporativa a que um Agent Pack se destina (e.g., Vendas, Marketing, Jurídico, Sucesso do Cliente).
*   **Guardrails:** Regras e limites (hard ou soft) impostos à execução de um agente para garantir segurança, compliance e controle de custos (e.g., limite de tokens por execução, proibição de acesso a dados de cartão de crédito).
*   **Human-in-the-Loop (HITL):** Um padrão de governança onde uma ação proposta pelo agente requer aprovação explícita de um operador humano antes de ser executada (e.g., aprovar um desconto acima de 20%).
*   **Catálogo Oficial:** O repositório centralizado onde todos os Agent Packs aprovados (versão stable) ficam disponíveis para descoberta e instalação pelas unidades de negócios.
*   **Execução Típica:** O fluxo de trabalho padrão e mais frequente esperado para um Agent Pack, utilizado como base para estimativas de custo e definição de orçamentos (budgets).
