# Runbook de Secret Comprometido

**Severidade:** CRÍTICA (P0)

## 1. Detecção (Triagem Inicial)
- O incidente começa ao receber alertas do provedor cloud (GuardDuty, Macie, GitHub Secret Scanner), reportes de segurança externa (Bug Bounty), ou comportamento anômalo em logs/auditorias.
- Confirme imediatamente qual segredo vazou, seu escopo (produção, staging, tenant específico) e se houve uso malicioso (ver logs de API do respectivo serviço).

## 2. Rotação de Emergência (Contenção)
1. **Acesse o provedor/plataforma do secret vazado.**
2. **Revogue/Desative o secret original IMEDIATAMENTE.** Se o sistema cair por alguns instantes, é justificável diante de um comprometimento.
3. **Gere a nova credencial.**
4. **Atualize o AWS Secrets Manager (ou cofre centralizado).**
5. **Force o restart dos microserviços/agentes dependentes** (ECS Service Force New Deployment ou reiniciar pods no K8s).

## 3. Investigação Pós-Contenção
- Como a chave vazou? (Log? Repositório público? Estação de trabalho comprometida? Engenharia Social?)
- Qual foi a extensão do dano durante a janela de comprometimento? Houve exfiltração de dados (DB, S3) ou criação de instâncias para mineração?
- O invasor deixou "backdoors" (ex: novas chaves SSH, usuários IAM)?

## 4. Recuperação e Comunicação
- Execute o post-mortem identificando as falhas que levaram ao vazamento.
- Atualize as regras de secret scanning ou adicione regexs aos logs para evitar reincidência.
- Comunique as partes afetadas (se dados de terceiros ou tenants foram lidos indevidamente) conforme o processo LGPD estabelecido.
