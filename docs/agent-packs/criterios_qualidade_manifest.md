# Critérios de Qualidade de Manifest para Agent Packs

Este documento define os critérios de qualidade para os manifests de configuração de Agent Packs corporativos.

## 1. Campos Obrigatórios

Todo manifest de Agent Pack (`manifest.yaml` ou `manifest.json`) deve obrigatoriamente conter a seguinte estrutura básica:

```yaml
version: "1.0" # Versão do schema do manifest
agent:
  id: "string" # Identificador único, e.g., "sdr_agent"
  name: "string" # Nome legível, e.g., "SDR Corporativo"
  description: "string" # Descrição clara da função e do domínio
  version: "semver" # Versão do agente, e.g., "1.2.0"
  domain: "string" # Domínio principal, e.g., "vendas"
  tags: ["string"] # Lista de tags para categorização

capabilities:
  llm_model: "string" # Modelo LLM primário requerido
  tools: ["string"] # Lista de IDs das ferramentas requeridas
  skills: ["string"] # Lista de templates de skills necessários

configuration:
  inputs:
    - name: "string"
      type: "string"
      required: boolean
      description: "string"
  outputs:
    - name: "string"
      type: "string"
      description: "string"

governance:
  human_in_the_loop: boolean # Se requer aprovação humana para ações críticas
  data_retention_days: integer # Política de retenção de dados associada
  cost_tier: "string" # Nível de custo (low, medium, high)
```

## 2. Exemplos de Uso

Os exemplos no manifest devem ser realistas e refletir o uso de negócio esperado:

```yaml
examples:
  - input:
      lead_id: "12345"
      context: "Lead gerado no evento anual, interesse no plano Enterprise."
    expected_output:
      status: "qualified"
      next_action: "schedule_demo"
      summary: "Lead demonstrou interesse claro no plano Enterprise. Qualificado para demonstração com um AE."
```

## 3. Testes Requeridos

Para que um manifest seja considerado de alta qualidade e pronto para publicação, ele deve ser acompanhado de:

1.  **Smoke Tests:** Testes básicos garantindo que o agente inicializa e responde a um ping com o manifest configurado.
2.  **Testes de Input/Output:** Validação de que as entradas requeridas (`configuration.inputs`) produzem as saídas esperadas (`configuration.outputs`) definidas nos `examples`.
3.  **Testes de Permissões (Tools/Skills):** Verificação de que o agente não acessa ferramentas não listadas no manifest (Least Privilege).
4.  **Validação de Guardrails:** Testes simulando violações de política (e.g., ultrapassar budget de tokens, requerer dados sensíveis não permitidos) para garantir que os guardrails definidos no manifest atuam corretamente.
