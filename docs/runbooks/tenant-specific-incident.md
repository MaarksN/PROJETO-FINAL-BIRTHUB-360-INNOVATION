# Runbook de Incidente Tenant-Específico

Se um único tenant for alvo de um DoS específico da sua conta (ou preso num loop eterno de automação via webhook custom):
1. Pausar execuções de workflow do tenant no banco marcando status como `suspended`.
2. O API Gateway injeta regra dinâmica limitando o Tenant ID para `0 req/s`.
3. Comunicar o dono da conta informando atividade suspeita. Demais clientes seguem intactos.
