# ADR-036: Deploy Canonico via GitHub Actions + Cloud Run

## Status

Aprovado em 2026-04-07.

## Contexto

O repositorio acumulou referencias operacionais para mais de uma estrategia de deploy da aplicacao:

- workflow de `CD` historicamente misturando hooks externos, manifests e promocoes manuais;
- manifesto de aplicacao em `infra/cloudrun/service.yaml`;
- documentacao corrente misturando Render, Cloud Run e alternativas futuras como se todas fossem lanes ativas.

Essa sobreposicao aumenta risco operacional em momentos criticos, porque rollback, ownership, preflight e resposta a incidentes deixam de ter um unico caminho verificavel.

## Decisão

O BirthHub 360 passa a adotar um unico caminho de deploy de aplicacao:

1. `CI` aprova o commit em `main`.
2. o workflow `.github/workflows/cd.yml` executa preflight, smoke, E2E e validacao de evidencia de rollback;
3. as imagens canonicas sao publicadas no Artifact Registry;
4. staging e production sobem revisoes candidatas no Cloud Run;
5. production so recebe trafego apos smoke, E2E e evidencias de rollback;
6. rollback operacional segue os runbooks canonicos de release e rollback do Cloud Run.

## Consequências

- `infra/cloudrun/service.yaml` volta a ser referencia do runtime canonico, mesmo com o trafego sendo promovido pelo `cd.yml`.
- documentacao operacional corrente deve referenciar Cloud Run e Artifact Registry como destino unico do deploy de aplicacao.
- qualquer nova proposta de lane alternativa de aplicacao exige ADR especifica, owner, criterio de cutover e plano de rollback.
- `infra/terraform` permanece somente como referencia para infraestrutura auxiliar e dados compartilhados, nunca como rota paralela de deploy da aplicacao.

## Alternativas descartadas

- **Manter Render e Cloud Run como lanes ativas**: descartado por aumentar ambiguidade em incidentes e releases.
- **Continuar em hooks externos sem revisoes candidatas**: descartado por fragilizar rollback, promotion gate e rastreabilidade.
- **Deixar a documentacao ambigua e resolver no runbook manual**: descartado por risco alto de erro humano em producao.
