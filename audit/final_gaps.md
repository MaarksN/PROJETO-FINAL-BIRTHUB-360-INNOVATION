# GAPS QUE IMPEDEM PRODUÇÃO — BirthHub 360

**Data:** 2026-04-11
**Auditor:** Antigravity (Forensic Staff+ Auditor)

---

## 🔴 BLOQUEADORES ABSOLUTOS DE GO-LIVE

Estes itens IMPEDEM categoricamente o lançamento em produção.

---

### GAP-001: @ts-nocheck Pandêmico

**Descrição:** 200+ arquivos de produção contêm `// @ts-nocheck` na primeira linha, incluindo TODOS os arquivos críticos: API, Worker, Database, Voice Engine, Billing, Integrations.

**Impacto:** O TypeScript compiler NÃO valida tipos em runtime. Erros de tipo que seriam capturados em compilação passam silenciosamente. O CI job de `typecheck` é um teatro — ele reporta sucesso porque o checker é desabilitado nos arquivos.

**Evidência:**
- `apps/api/src/app.ts:1` → `// @ts-nocheck`
- `apps/api/src/server.ts:1` → `// @ts-nocheck`
- `apps/worker/src/worker.ts:1` → `// @ts-nocheck`
- `apps/worker/src/worker.process-job.ts:1` → `// @ts-nocheck`
- `packages/database/src/client.ts:1` → `// @ts-nocheck`
- Total estimado: **200+ arquivos**

**Remediação:** Remover `@ts-nocheck` de TODOS os arquivos e resolver erros de tipo resultantes. Estimativa: 2-4 semanas de trabalho dedicado.

---

### GAP-002: Voice Engine é Mock

**Descrição:** O Voice Engine aparenta ser funcional mas NÃO integra com nenhum serviço real de STT (Deepgram), TTS (ElevenLabs), ou LLM.

**Impacto:** O produto alega ter funcionalidade de voz que não existe. Qualquer demonstração usando o voice engine é enganosa.

**Evidência:**
- `voice-engine/server.ts:105` → Deepgram factory retorna `{ apiKey }` (mock)
- `voice-engine/server.ts:161` → LLM output é string hardcoded
- ElevenLabs API key é lida mas **jamais utilizada**
- O "TTS" enviado via WebSocket é um JSON com texto, NÃO áudio

**Remediação:**
1. Implementar client real do Deepgram STT API
2. Implementar client real do ElevenLabs TTS API
3. Implementar integração com LLM real para geração de resposta
4. Implementar streaming de áudio real via WebSocket
5. Estimativa: 4-6 semanas

---

### GAP-003: Auth Refresh Store In-Memory

**Descrição:** Os refresh tokens são armazenados em `new Map<string, JWTPayload>()` na memória do processo Node.js.

**Impacto:**
- Cada restart do servidor invalida TODOS os refresh tokens
- Em ambiente multi-instância, tokens emitidos por uma instância são inválidos em outra
- Memory leak potencial: tokens nunca são limpos até expire do JWT

**Evidência:** `packages/auth/index.ts:21` → `const refreshStore = new Map<string, JWTPayload>()`

**Remediação:** Migrar refresh store para Redis ou banco de dados. Estimativa: 1 semana.

---

## 🟠 GAPS DE ALTA PRIORIDADE

---

### GAP-004: Sem Release Evidence Real

**Descrição:** `releases/evidence/` contém apenas um README de 177 bytes. Não há checksums de build, evidência de smoke test, ou artefatos de release verificáveis.

**Remediação:** Executar pipeline de release completo e armazenar evidências.

---

### GAP-005: PolicyEngine In-Memory

**Descrição:** O agent policy engine usa `InMemoryPolicyAdminStore` — políticas de governança de agentes perdem-se em cada restart.

**Remediação:** Implementar persistência de políticas em banco de dados ou configuração.

---

### GAP-006: Cookie Secure Flag Ausente

**Descrição:** `apps/web/lib/auth-client.ts` → `setCookieValue` NÃO define `Secure` flag nos cookies de sessão do lado client.

**Impacto:** Em produção HTTPS, cookies de sessão podem ser transmitidos em cleartext se o browser permitir.

**Remediação:** Adicionar `Secure` flag quando em produção.

---

### GAP-007: Usage Metering Sem Sync Stripe

**Descrição:** O modelo `UsageRecord` existe no banco com campos `metric`, `quantity`, `unit`, mas não há sync com a Stripe Usage Records API.

**Impacto:** Metering existe localmente mas NÃO gera cobrança real por uso.

**Remediação:** Implementar sync de usage records com Stripe.

---

## 🟡 GAPS MÉDIOS

---

### GAP-008: Import Path Relativo Violando Monorepo

**Evidência:** `apps/web/lib/auth-client.ts:5` → `import { fetchWithTimeout } from "../../../packages/utils/src/fetch"`

**Remediação:** Usar import via workspace package `@birthub/utils`.

---

### GAP-009: Circuit Breaker Instalado Sem Uso

**Descrição:** `opossum` está em root dependencies mas nenhum adapter de integração usa `CircuitBreaker`.

**Remediação:** Implementar circuit breaker nos clients de integração ou remover dependência.

---

### GAP-010: Elasticsearch Dev Sem Autenticação

**Evidência:** `docker-compose.yml:39` → `xpack.security.enabled=false`

**Remediação:** Habilitar segurança do Elasticsearch mesmo em desenvolvimento.

---

### GAP-011: Legacy Storage Keys No Web Client

**Descrição:** `session-context.ts` mantém 5 legacy storage keys (`bh_access_token`, `bh_refresh_token`, etc.) que indicam migração incompleta de auth architecture.

**Remediação:** Definir sunset date e remover legacy fallbacks.

---

### GAP-012: packages/billing Morto

**Descrição:** O package `packages/billing/` existe com `README.md` que diz "DEAD PACKAGE" mas não foi removido.

**Remediação:** Remover o diretório e atualizar workspace config.
