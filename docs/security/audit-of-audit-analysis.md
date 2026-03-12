# Auditoria de Auditoria

Quem audita os auditores?
- A leitura ou visualização dos logs de auditoria por um super-admin DEVE criar um evento adicional no sistema global indicando "Admin de ID X acessou a página de Logs Críticos do Tenant Y".
Esse super-log deve ser persistido em CloudWatch (não no DB nativo do Postgres) garantindo imutabilidade máxima em um serviço gerido.
