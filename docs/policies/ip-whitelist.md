# Processo de Whitelist de IP

## Objetivo
Regras excepcionais para evitar bloqueios de clientes confiáveis, sistemas de parceiros ou escritórios inteiros com NAT que operam em alto volume.

## Restrições e Cuidados
- Whitelists permanentes criam **riscos de segurança residuais** (se a rede corporativa do cliente for comprometida, o tráfego passará direto pelo WAF). Portanto, o padrão deve ser evitar whitelists e sim aumentar os limites globais do Token.

## Solicitação e Aprovação
1. **Solicitante:** O cliente formaliza o pedido de Whitelist ou o time de Atendimento ao Cliente (CS) abre um ticket técnico no Jira (SRE).
2. **Justificativa Obrigatória:** Deve detalhar o caso de uso (ex: "Integração B2B de backend para backend via webhook"), CIDRs estáticos (não dinâmicos) e volume projetado.
3. **Aprovação:** Requer validação do Gerente de Engenharia/Infraestrutura (avaliando a carga de infra) e Segurança (verificando reputação do ASN fornecido).

## Execução e Duração Máxima
- A regra é inserida via Infra-as-Code (Terraform) no AWS WAF associado ao API Gateway, atrelada a uma tag/comentário clara (`# JIRA-1234 - Cliente X - Expira YYYY-MM-DD`).
- **Duração Máxima Sugerida:** Revisão a cada 6 meses (para parceiros de longo prazo) ou Whitelists temporários de 7-30 dias (para campanhas/eventos específicos).
- Whitelists órfãos sem justificativa atualizada no Terraform devem ser expurgados periodicamente.
