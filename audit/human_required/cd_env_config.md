<!-- [SOURCE] CD-001 -->
# CD-001 — Dependência de configuração externa para staging deploy

## Contexto validado por Codex (2026-03-20)
- Workflow de CD existe em `.github/workflows/cd.yml`.
- O preflight de staging foi validado em modo controlado com arquivo de ambiente (`artifacts/release/staging-preflight.env`).

## Evidência técnica local
Comando executado:
- `corepack pnpm release:preflight:staging -- --env-file=artifacts/release/staging-preflight.env`

Resultado:
- `ok: true` para `api`, `web` e `worker` no relatório gerado por `scripts/release/preflight-env.ts`.

## Ação humana requerida
- Nenhuma para o fechamento técnico local deste item.