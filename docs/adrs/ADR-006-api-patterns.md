# ADR-006: Padrões de API

## Status
Aceito

## Decisão
Utilizaremos **RESTful Patterns** para a maioria dos endpoints de gestão e integrações. As URLs usarão `/api/v1/...`. Códigos HTTP padronizados serão adotados (200, 201, 400, 401, 403, 404, 500).

## Justificativa
A previsibilidade do REST facilita a integração do Dashboard, de clientes externos, e está alinhada ao padrão de mercado para integrações SaaS.
