# Política de Slug de Agentes

## Objetivo
Padronizar nomes de arquivo de agentes para previsibilidade, legibilidade e automação de validação.

## Regra oficial
- O arquivo `.agent.md` deve usar **kebab-case lowercase** no prefixo do nome do arquivo.
- Exemplo: `board-prep-ai.agent.md`, `api-key-configurator.agent.md`.
- Acrônimos são permitidos em bloco (ex.: `api`, `roi`, `qbr`, `sla`) sem regra rígida de segmentação por letra.

## Escopo da validação
- O validador exige:
  - frontmatter válido;
  - `description` iniciando com `Use when`;
  - `tools: [read, search]`;
  - `user-invocable: true`;
  - seções `Escopo`, `Restrições`, `Saída Obrigatória`;
  - itens numerados `1.`, `2.`, `3.`;
  - contagem esperada por ciclo;
  - presença de `README.md` por ciclo;
  - nome de arquivo em regex `^[a-z0-9]+(?:-[a-z0-9]+)*\.agent\.md$`.

## Observação
A validação não exige derivação literal 1:1 de slug a partir de `name` para evitar falsos positivos com siglas/acrônimos.
