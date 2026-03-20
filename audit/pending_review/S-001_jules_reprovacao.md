# Reprovação Jules — S-001
Data: 2026-03-20

## O que foi verificado
- Existência do arquivo `debugAuth.ts` no projeto
- Teste de não-elevação `auth.debug-elevation.test.ts`
- O arquivo `.md` correspondente `S-001_codex.md` em `audit/pending_review/` para verificar ausência de marcadores de rascunho.

## O que está faltando ou errado
- marcador de rascunho explícito (token-rascunho, token-rascunho, campo-rascunho, [campo-rascunho]) encontrado no arquivo `audit/pending_review/S-001_codex.md`. Sob a regra de Anti-Drift, qualquer submissão contendo esses vocabulários deve ser rejeitada imediatamente.
- O teste `auth.debug-elevation.test.ts` falhou e não rodou localmente indicando dependências corrompidas, ou escopo do teste não atende aos requisitos do pipeline.

## Critério para aprovação
- O arquivo de rastreabilidade do item não deve conter nenhum marcador de rascunho ou rascunho.
- O teste de não-elevação deve passar sem erros sob a validação local.

## Evidência esperada
- Remoção dos marcadores de rascunho e teste executando e retornando sucesso.
