# Contrato OpenAPI (Resumo Manual)

```yaml
openapi: 3.0.0
info:
  title: BirthHub360 API
  version: "1.0"
paths:
  /api/v1/health:
    get:
      summary: Healthcheck
      responses:
        "200":
          description: OK
```
*(Este é um exemplo manual inicial. Os contratos serão gerados preferencialmente a partir do código utilizando Swagger/Zod/FastAPI).*
