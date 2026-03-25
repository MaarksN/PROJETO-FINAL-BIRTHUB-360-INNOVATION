# Índice Único: Core vs Legacy vs Satellites

Este documento atua como o **índice operacional único** listando as fronteiras entre os serviços e repositórios da plataforma BirthHub 360, classificados nas categorias: **Core**, **Legacy/Quarentena** e **Satélites**.

> Para a taxonomia completa e donos operacionais, consulte o [Catálogo de Serviços](../service-catalog.md).

---

## 🟢 Core Canônico (P0)
A fundação operacional da plataforma. Estes são os defaults para desenvolvimento e operação:

- `apps/web`: Front-end (Default para experiência do produto).
- `apps/api`: API (Default para tráfego de negócio).
- `apps/worker`: Worker (Default para filas e processamento assíncrono).
- `packages/database`: Data layer (Default para schema, client Prisma e migrações).

## 🔴 Legacy / Quarentena
Superfícies em fase de migração ou substituição. **Não** devem ser o default de desenvolvimento, não recebem foco no roadmap principal e não são prioridades (P0).

- `apps/dashboard`: Front-end legado mantido para compatibilidade interna.
- `apps/api-gateway`: API legado (sendo substituída pela `apps/api`).
- `apps/agent-orchestrator`: Worker legado (sendo substituído pelo `apps/worker`).
- `packages/db`: Pacote de dados legado (substituído por `packages/database`).

## 🟡 Satélites
Componentes de apoio ao ecossistema que não integram o fluxo principal (core). São suportados, mas sujeitos a níveis de governança e SLAs (SLO/alerta) proporcionais ao seu impacto indireto.

- `packages/agent-packs`: Catálogo de agentes (dependência de domínio, não infraestrutura core).
- `apps/webhook-receiver`: Ingestão de eventos e borda de integração de terceiros.
- `apps/voice-engine`: Serviço de voz e capacidade adicional fora do núcleo transacional.

---
**Nota sobre Governança:** Qualquer divergência entre documentos no monorepo deve ser resolvida em favor das diretrizes apontadas aqui e no [Catálogo de Serviços Oficial](../service-catalog.md).