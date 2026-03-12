# ADR-009: Estratégia de Migração para Multi-tenant

## Status
Aceito

## Contexto
Temos dados que inicialmente podiam não ter o `tenant_id` atrelado rigidamente em todas as relações profundas legadas (se existissem, hipoteticamente, antes dessa base). E cada novo registro demanda o preenchimento.

## Decisão
Implementar um plano em Background Job. Toda a tabela de legado sem Tenant ID mapeada receberá um UUID padrão e temporário `(tenant_legacy)` e então o RLS as ignorará até que o script de resolução (id matching) resolva as tuplas individualmente preenchendo o schema e fechando o RLS posteriormente. Como a base está limpa do zero no projeto atual, aplicamos a estratégia restritiva Multi-tenant (RLS) desde a largada (DDL Creation).
