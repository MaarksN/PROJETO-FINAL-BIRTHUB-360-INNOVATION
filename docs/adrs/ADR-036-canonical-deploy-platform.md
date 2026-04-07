# ADR-036: Deploy Canônico via GitHub Actions + Render

## Status

Aprovado em 2026-04-07.

## Contexto

O repositório acumulou referências operacionais para mais de uma estratégia de deploy da aplicação:

- workflow de `CD` acionando hooks do Render para staging e produção;
- manifesto de aplicação em `infra/cloudrun/service.yaml`;
- documentação corrente misturando Render, Cloud Run e alternativas futuras como se todas fossem lanes ativas.

Essa sobreposição aumenta risco operacional em momentos críticos, porque rollback, ownership, preflight e resposta a incidentes deixam de ter um único caminho verificável.

## Decisão

O BirthHub 360 passa a adotar um único caminho de deploy de aplicação:

1. `CI` aprova o commit em `main`.
2. o workflow `.github/workflows/cd.yml` executa preflight, smoke, E2E e validação de evidência de rollback;
3. o deploy é disparado exclusivamente por hooks do Render;
4. rollback operacional segue os runbooks canônicos de release e rollback do Render.

## Consequências

- `infra/cloudrun/service.yaml` deixa de fazer parte do lane ativo de produção.
- documentação operacional corrente deve referenciar Render como destino único do deploy de aplicação.
- qualquer nova proposta de lane alternativa de aplicação exige ADR específica, owner, critério de cutover e plano de rollback.
- `infra/terraform` permanece somente como referência para infraestrutura auxiliar e dados compartilhados, nunca como rota paralela de deploy da aplicação.

## Alternativas descartadas

- **Manter Render e Cloud Run como lanes ativas**: descartado por aumentar ambiguidade em incidentes e releases.
- **Migrar imediatamente toda a operação para Cloud Run**: descartado porque o pipeline e os gates atuais já estão centrados em Render.
- **Deixar a documentação ambígua e resolver no runbook manual**: descartado por risco alto de erro humano em produção.
