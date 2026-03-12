# OWASP Baseline Top 10

Checklist inicial de segurança:
- [x] A01: Broken Access Control (Validação baseada em RLS e JWT)
- [x] A02: Cryptographic Failures (Uso de TLS 1.2+, hashing seguro de senhas)
- [x] A03: Injection (ORMs usados, SQL queries parametrizadas)
- [x] A04: Insecure Design (Revisão de arquitetura em ADRs)
- [x] A05: Security Misconfiguration (Hardenização em containers Docker)
- [x] A06: Vulnerable and Outdated Components (pnpm audit, dependabot ativado)
- [x] A07: Identification and Authentication Failures (Rate limiting no login, MFA planejado)
- [x] A08: Software and Data Integrity Failures (Assinatura de Packs de Agentes - ADR-029)
- [x] A09: Security Logging and Monitoring Failures (Logs configurados, PII redactado)
- [x] A10: Server-Side Request Forgery (SSRF) (Controle estrito nos webhooks e agentes)
