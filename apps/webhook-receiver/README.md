# Webhook Receiver (Python Canonical Runtime)

Serviço canônico de recepção de webhooks em Python/FastAPI.

## Runtime oficial
- App entrypoint: `apps/webhook-receiver/main.py`
- Testes: `apps/webhook-receiver/tests`
- Dependências: `apps/webhook-receiver/requirements.txt`

## Comandos
- Desenvolvimento: `pnpm webhook-receiver:dev`
- Testes: `pnpm webhook-receiver:test`
- Lint: `pnpm webhook-receiver:lint`

## Execução direta (sem scripts)
- `python -m uvicorn main:app --app-dir apps/webhook-receiver --reload`

## Observações
- O arquivo TypeScript legado `src/server.ts` foi removido para evitar runtime duplo.
- Em runtime estrito, o serviço exige `INTERNAL_SERVICE_TOKEN` e `SVIX_WEBHOOK_SECRET`.
