# Campos de Log e Redação de PII

## Campos Obrigatórios
- `timestamp` (ISO 8601)
- `level` (INFO, WARN, ERROR)
- `service` (nome da aplicação)
- `trace_id` (para correlação)

## PII e Redação
Dados pessoais (PII) e de saúde (PHI) NUNCA devem ser logados em plain text.
- Ocultar senhas, tokens de acesso, nomes de pacientes, CPFs, e-mails completos.
