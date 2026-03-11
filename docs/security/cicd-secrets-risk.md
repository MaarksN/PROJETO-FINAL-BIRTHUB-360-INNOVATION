# Análise de Risco de Secrets em CI/CD

## Riscos (GitHub Actions e Similares)
1. **Exposição em Logs (Secret Leakage):** Erros de script podem imprimir acidentalmente o valor de um secret nos logs de build.
2. **Exfiltração por Third-Party Actions:** Dependências ou actions comprometidas (Supply Chain Attack) podem capturar e enviar variáveis de ambiente para servidores externos.
3. **Acesso Indevido por Desenvolvedores:** Desenvolvedores com permissões de repositório podem criar workflows maliciosos (PR) que extraem segredos injetados.

## Mitigações
1. **Uso de OIDC:** Ao invés de armazenar long-lived credentials (ex: AWS_ACCESS_KEY_ID), a CI/CD autenticará via OpenID Connect (OIDC) para assumir roles temporárias no provedor Cloud.
2. **Ambientes Separados e Aprovação Manual:** Secrets de produção só são disponibilizados para deployments originados de branches protegidos (`main`) e exigem aprovação manual no fluxo de CI/CD.
3. **Ferramentas de Secret Scanning:** Configurar varredura estática de segredos no repositório (ex: GitHub Advanced Security, TruffleHog, GitLeaks) como pre-commit ou nos checks iniciais da CI/CD.
4. **Mascaramento de Logs:** Habilitar máscaras nativas nas variáveis injetadas para evitar log acidental.
