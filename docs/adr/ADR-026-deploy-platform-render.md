# ADR-026: Plataforma de deploy automatizado (Render)

- **Status:** Aceito
- **Data:** 2026-03-12
- **Decisor:** Time de Plataforma (JULES)

## Contexto

Precisamos de um fluxo de deploy contínuo com:

1. Publicação automática em staging a cada merge na branch `main`.
2. Promoção para produção com aprovação manual.
3. Operação simples para serviços web e workers do BirthHub360.

## Decisão

A plataforma de referência para deploy será o **Render**, usando **Deploy Hooks** separados para staging e produção.

## Consequências

### Positivas

- Integração direta com GitHub Actions sem dependência de infraestrutura própria.
- Fácil segregação de ambientes usando secrets distintos.
- Aprovação manual em produção via protection rules do environment no GitHub.

### Negativas

- Dependência do provedor Render para execução de deploy.
- Necessidade de manter os deploy hooks ativos e rotacionar URLs quando necessário.

## Implementação no repositório

- Workflow: `.github/workflows/cd.yml`.
- Segredos obrigatórios:
  - `RENDER_STAGING_DEPLOY_HOOK_URL`
  - `RENDER_PRODUCTION_DEPLOY_HOOK_URL`
- Environment `production` deve ter regra de aprovação manual habilitada.
