# Thresholds de Anomalia por Tenant

Justificativas:
- **Error Rate > 10% (em 5 min no tenant):** O tenant possivelmente configurou mal uma integração ou credencial (ex: falha contínua no login de e-mail de SMTP). O alarme não dispara um incidente nível global P1, mas um P3 (atendimento de suporte pró-ativo).
- **Spike de Tráfego repentino de 500%:** O tenant publicou o formulário ou bot numa campanha em massa e precisa de mais scale do gateway (ou trata-se de um DDoS e deve ser monitorado).
