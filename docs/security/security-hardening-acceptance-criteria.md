# Critérios de Aceite de Security Hardening para Release B2B

## Pré-requisitos para Release em Produção
Para que uma versão (especialmente as principais que introduzem novos agentes ou integrações B2B) seja considerada pronta ("Go/No-Go"), as seguintes verificações devem passar com sucesso:

1. **Gestão de Dependências (SCA):**
   - Nenhuma vulnerabilidade conhecida `High` ou `Critical` nas dependências do `package.json` ou `requirements.txt` (via npm audit, dependabot ou Trivy).
2. **Qualidade de Código Segura (SAST):**
   - Ferramentas de análise estática (ex: SonarQube, CodeQL) sem novos findings críticos relacionados a injeção de SQL, XSS, ou vazamento de segredos no código-fonte.
3. **Configuração de Infraestrutura (IaC):**
   - Templates do Terraform (`infra/terraform/`) sem configurações permissivas inseguras (ex: portas abertas para `0.0.0.0/0` além das essenciais 80/443, permissões `Action: "*"` no IAM).
4. **Autenticação e Roteamento:**
   - WAF configurado e ativo. Rate Limiting implementado no API Gateway para todos os endpoints públicos.
   - Headers de Segurança HTTP configurados (HSTS, CSP, X-Frame-Options).
5. **Auditoria e Logs:**
   - Mascaramento de dados sensíveis (PII) ativo no Logger central.
   - Nenhum Secret exposto ou hardcoded; uso exclusivo do AWS Secrets Manager.

## Validação Manual
- Revisão manual (Pull Request) concluída por pelo menos um desenvolvedor não-autor do código nas áreas de Billing e Autenticação.
