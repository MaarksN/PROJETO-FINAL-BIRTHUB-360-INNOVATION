# Análise: Key Compromise → Revogação → Re-assinatura → Re-distribuição

## 1. Cenário de Ameaça (O "Golden Ticket" do Ecossistema)
Este documento descreve o plano de contingência e resposta a incidentes para o pior cenário criptográfico na arquitetura do BirthHub360: o comprometimento (roubo, exposição acidental ou acesso não autorizado prolongado) da chave privada da Autoridade Certificadora (CA) central que assina os manifestos dos packs publicados no Marketplace.

**Ameaça Ativa:** Um atacante com posse desta chave poderia criar packs maliciosos (contendo exfiltração de dados, backdoors ou ransomware), assiná-los com a chave oficial do BirthHub360 e induzir Tenants a instalá-los. Os sistemas de segurança de instalação dos Tenants confiariam cegamente nesses packs maliciosos, pois a assinatura matemática seria perfeitamente válida.

## 2. Fase 1: Detecção e Contenção Imediata (T0 a T+1 hora)

### 2.1 Detecção
*   **Monitoramento de Logs do HSM/KMS:** Alertas de anomalias disparados por:
    *   Picos de volume de assinaturas (ex: 50.000 assinaturas em 5 minutos quando a média é 100/dia).
    *   Chamadas à API `kms:Sign` vindas de endereços IP desconhecidos fora da VPC de produção do BirthHub360.
    *   Múltiplas tentativas de exportar a chave privada (embora bloqueadas pelo provedor de nuvem).
*   **Threat Intel / Telemetria:** Relatórios externos de que "packs do BirthHub360 estão distribuindo malware validamente assinado" ou detecção de um pack não curado no ecossistema com uma assinatura oficial recente.

### 2.2 Contenção ("Break Glass")
1.  **Bloqueio de API e Kill-Switch:** A equipe de SecOps desativa imediatamente (via IAM Deny Policies explícitas) todo o acesso à chave comprometida no KMS, interrompendo instantaneamente a capacidade de *novas* assinaturas maliciosas.
2.  **Suspensão do Marketplace:** O serviço do Marketplace é colocado em modo de manutenção (Read-Only). O gateway de API rejeita novas submissões de publicação e downloads de packs.
3.  **Desativar Kill-Switches Remotos (CRL/OCSP):** Em caso de comprometimento grave da raiz de confiança, publicar imediatamente uma Certificate Revocation List (CRL) de emergência ou configurar o responder OCSP para retornar "Revoked" para *todos* os certificados associados à chave comprometida, efetivamente quebrando a cadeia de confiança de ponta a ponta em tempo real para instalações ativas.

## 3. Fase 2: Revogação da Chave e Raiz de Confiança (T+1 hora a T+12 horas)

### 3.1 Revogação Pública da Chave
*   A chave pública correspondente à chave privada comprometida é declarada "Comprometida" e permanentemente adicionada à "Lista de Chaves Revogadas" do BirthHub360, publicada de forma redundante e fora de banda (ex: via CDN separada, repositório GitHub público e DNS TXT records).
*   Isso garante que mesmo orquestradores offline ou instâncias isoladas (Air-Gapped) de Tenants, ao tentarem verificar a chave localmente, rejeitem qualquer pack assinado por essa chave, pois a lista de revogação é cacheada no orquestrador.

### 3.2 Comunicação de Incidente Crítico (War Room)
*   Acionamento do plano de resposta a incidentes de segurança cibernética corporativa.
*   Notificação de transparência ("Breach Notification") para todos os Administradores de Tenants via canais de emergência (SMS, e-mail dedicado, banner irremovível no painel), instruindo-os a *não* instalar novos packs até segunda ordem e a realizar auditorias em instalações recentes.

## 4. Fase 3: Rotação, Re-assinatura e Recuperação (T+12 horas a T+48 horas)

### 4.1 Rotação e Geração de Nova Raiz (Nova PKI)
1.  **Cerimônia de Geração de Chaves:** Em um ambiente isolado (HSM diferente, controle de acesso mais restritivo "Quorum"), um novo par de chaves (Raiz e Intermediárias) é gerado para assinar manifestos.
2.  **Atualização de Clientes (Agentes Orquestradores):** Uma atualização forçada e compulsória do software principal do "BirthHub360 Agent Orchestrator" é enviada para todos os Tenants. Esta nova versão do software contém a *nova chave pública hardcoded* e a lista de revogação atualizada (bloqueando a chave antiga).

### 4.2 Re-assinatura do Repositório (Re-Signing)
*   **Auditoria Retroativa:** Antes de re-assinar qualquer pack, todos os pacotes publicados na janela de tempo suspeita (entre o possível comprometimento e a contenção) são re-processados rigorosamente na pipeline de segurança (SAST/DAST) para garantir que nenhum artefato malicioso foi injetado "nas sombras".
*   **Script de Assinatura em Massa:** Um job batch de segurança, rodando em um enclave seguro com a nova chave privada, percorre todo o catálogo do Marketplace.
*   Ele pega os hashes de código limpo verificados, gera um novo manifesto (versão atualizada) para cada pack e os assina com a *nova chave*.

### 4.3 Re-distribuição (Self-Healing)
1.  O Marketplace é reaberto para leitura, exibindo os novos pacotes recém-assinados.
2.  Os Agentes Orquestradores dos Tenants entram em "Sync Mode" de emergência.
3.  Para cada pack instalado localmente, o Orquestrador compara a assinatura antiga (agora inválida/revogada) com a nova assinatura no servidor.
4.  O Orquestrador faz o download silencioso do manifesto recém-assinado, verifica a integridade (hash do código existente bate com o hash assinado pela nova chave) e atualiza o estado para "Seguro/Verificado". Se os hashes não baterem (indicação de que o arquivo local foi de fato alterado pelo atacante), o pack é sumariamente desativado, deletado e um alerta crítico é gerado no log do Tenant.

## 5. Fase 4: Post-Mortem e Fortalecimento
*   Conduzir uma investigação forense detalhada para determinar *como* o HSM ou o IAM Role foi comprometido (ex: roubo de credenciais de DevSecOps, vulnerabilidade de zero-day no provedor de nuvem).
*   Publicar um relatório técnico de transparência para reconstruir a confiança do ecossistema e implementar controles corretivos (ex: exigir aprovações M-of-N para operações criptográficas críticas de assinatura, migração para HSMs com certificação FIPS 140-2 Level 3 de outro provedor).
