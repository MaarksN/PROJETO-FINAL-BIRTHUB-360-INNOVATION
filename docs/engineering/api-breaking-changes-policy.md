# Política de Breaking Changes de API

## O que é Breaking Change?
- Remoção de campos em respostas de API.
- Mudança de tipo de um campo (ex: de Integer para String).
- Alteração no formato de URL de endpoints já expostos.

## Versionamento e SLA
Se uma breaking change for inevitável, uma nova versão deve ser criada (ex: `/api/v2`). A versão antiga deve ser mantida com SLA de deprecation de no mínimo 6 meses, notificando os clientes.
