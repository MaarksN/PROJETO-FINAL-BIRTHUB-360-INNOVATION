# ADR-003: Observabilidade

## Status
Aceito

## Decisão
Utilizaremos **Logs Estruturados (JSON)**, **Traces Distribuídos (OpenTelemetry)** e **Métricas (Prometheus/Datadog)**.

## Justificativa
A arquitetura baseada em agentes e microsserviços exige rastreabilidade ponta a ponta (trace ID) para diagnosticar requisições entre o Gateway, Orchestrator e Agentes Python.
