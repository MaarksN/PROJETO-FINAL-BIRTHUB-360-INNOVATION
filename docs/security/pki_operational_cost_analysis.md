# Análise de Custo Operacional: Manter PKI para Signing de Manifests

## 1. Visão Geral (Objetivo de Negócio e de Segurança)
A Infraestrutura de Chave Pública (PKI - Public Key Infrastructure) no BirthHub360 garante a integridade e não repúdio (via assinatura digital) de todos os Packs (Agentes, Prompts, Tools) publicados no Marketplace Público.
A arquitetura escolhida foi a **Autoridade Certificadora (CA) Central do BirthHub** (veja ADR-029).
Embora essencial para a segurança de um ecossistema multi-tenant (especialmente Tenants Enterprise, Pro e Free que confiam no BirthHub360 para não distribuir malwares/RCEs), a operação e manutenção contínua de uma PKI centralizada gera custos técnicos e financeiros recorrentes.

## 2. Direcionadores de Custo (Drivers)

### 2.1. Custos de Infraestrutura e Hardware (Cloud HSM)
O armazenamento e a operação da chave privada *nunca* devem ocorrer em memória ou disco comum; requerem hardware criptográfico especializado para evitar roubo completo da chave ("Golden Ticket" do ecossistema).

*   **Serviço AWS KMS (Key Management Service) Asymmetric Keys**
    *   **Armazenamento da Chave Base:** A chave assimétrica (ex: secp256k1, Ed25519) custa aproximadamente US$ 1,00/mês por chave na AWS.
    *   **Custo de Geração da Chave (Material Mestre):** Próximo a zero se gerado no próprio KMS, mas se for gerado em Cerimônia Offline (Offline Root CA) e importado, envolve o custo do hardware seguro utilizado na cerimônia (smartcards, HSMs USB offline).
    *   **Custo por Requisição (Assinatura):** A chamada à API `kms:Sign` custa cerca de US$ 0,03 a US$ 0,05 a cada 10.000 requisições (dependendo da região AWS).
    *   *Estimativa de Escala (Cenário Alto Volume):* Se a plataforma realizar 1.000 publicações/atualizações de packs por dia, o custo de API para `kms:Sign` é insignificante (< US$ 1/mês). No entanto, o custo de armazenamento fixo é mandatório.

*   **Alternativa de Alta Conformidade (AWS CloudHSM)**
    *   Para clientes altamente regulados (Setor Bancário, Defesa) que exigem controle total do *cluster* FIPS 140-2 Level 3 (single-tenant), o AWS CloudHSM custa cerca de US$ 1,45 por hora por HSM (~US$ 1.050/mês). É necessário um cluster com pelo menos 2 HSMs (Alta Disponibilidade), elevando o custo para **~US$ 2.100/mês (Aproximadamente US$ 25.200/ano)** apenas para a infraestrutura básica, excluindo as transações.

*   **Opção Escolhida:** O KMS multi-tenant (AWS Managed) é a escolha operacional inicial para controlar custos, escalando para CloudHSM dedicado apenas se demandas de *compliance* de Tenants específicos (Enterprise) pagarem essa diferença através de subscrições Premium.

### 2.2. Custos de Distribuição (CDN, CRL, OCSP e Hashes)
*   **Distribuição das Assinaturas:** O arquivo de assinatura `.sig` ou manifesto `.json` é pequeno (alguns KB), mas é acessado maciçamente. O Orquestrador do Tenant fará o download da assinatura sempre que verificar atualizações ou tentar instalar um pack.
    *   *Custo:* Transferência de dados via CDN (CloudFront/Cloudflare). Em larga escala, o tráfego gerado por milhões de Agentes Orquestradores puxando arquivos `.sig` diariamente aumentará os custos de banda passante de saída (Egress bandwidth).
*   **Custo da Revogação (CRL / OCSP Responder):** Uma PKI segura não serve apenas para assinar, mas para *revogar* confianças.
    *   Hospedar e servir uma Lista de Revogação de Certificados (CRL) ou um endpoint de resposta online (OCSP - Online Certificate Status Protocol) requer alta disponibilidade (Uptime 99.99%). Se o OCSP ficar inacessível, as instalações de todos os Tenants (modo Strict) pararão. O tráfego OCSP é um custo contínuo mesmo quando nenhuma chave é revogada (os clientes *sempre* consultam o status da CA e das intermediárias).

### 2.3. Custos de Engenharia (DevOps e SecOps)
Este é frequentemente o maior custo oculto ("Hidden Cost") da PKI.

*   **Integração e Automação no Pipeline de CI/CD (DevOps):**
    *   Horas de engenharia para construir o serviço que faz o "Hash-and-Sign".
    *   Desenvolvimento seguro para interagir com o KMS (IAM Roles restritas, manipulação de erros, retries).
    *   Inclusão da verificação de assinatura (a "parte pública") no cliente de instalação do Tenant (Orquestrador) escrita de forma resiliente em Python/Node/Go.
*   **Operações de Segurança Contínuas (SecOps):**
    *   Monitoramento de logs de uso do KMS (SIEM/CloudTrail) para detectar tentativas de uso anômalo da chave privada (alguém assinou um manifesto que não veio da pipeline de curadoria?).
    *   **Rotação de Chaves (Key Rotation):** O planejamento e a execução rotineira (ex: anual) da troca da chave de assinatura mestre do BirthHub360. Isso requer coordenação, atualização forçada do software dos Agentes (distribuição do binário atualizado do orquestrador com o novo *hash* de chave pública hardcoded) e comunicação com os clientes. Uma rotação mal gerida causa *downtime* na plataforma e interrupção dos negócios dos Tenants.
*   **Gestão de Incidentes (War Room "Key Compromise"):** A preparação e manutenção do plano de resposta (Incident Response Playbook) para o cenário apocalíptico de comprometimento da chave CA.

## 3. Retorno sobre o Investimento (ROI / Justificativa)
A PKI é essencialmente um "Custo de Fazer Negócios Seguros" (Cost of Doing Business Securely). Não é um centro de lucro, mas uma apólice de seguro contra eventos que destruiriam a plataforma.

*   **Mitigação de Danos Catastróficos (Custo Evitado):** O incidente da SolarWinds ("Sunburst") demonstrou que a distribuição de software não assinado (ou assinado com chave comprometida) por um fornecedor confiável a clientes Enterprise leva a danos multibilionários. Para o BirthHub360, um único evento de Man-in-the-Middle ou injeção de malware silencioso no Marketplace distribuiria a ameaça para milhares de Tenants simultaneamente. A PKI centralizada garante que, mesmo que a rede/CDN seja comprometida, a instalação do payload malicioso será bloqueada criptograficamente nas bordas (nos Orquestradores).
*   **Atendimento a Requisitos de Venda (Enterprise Readiness):** Clientes B2B e Enterprise modernos (com SOCs maduros e conformidade ISO 27001 / SOC 2 Type II) frequentemente exigem evidências de que o software/scripts que executam localmente (o Agente e as ferramentas do Pack) são verificáveis (Software Bill of Materials - SBOM e Assinaturas de Integridade). Sem PKI de assinatura, o Marketplace não escala para os clientes de maior ticket.

## 4. Conclusão

*   **O custo puramente técnico (KMS Managed) é extremamente baixo e viável.**
*   **O verdadeiro custo reside na excelência operacional da equipe de DevOps/SecOps** (gestão segura do ciclo de vida das chaves, rotação, distribuição de binários dos orquestradores, monitoramento de CRL/OCSP e auditoria de log constante).
*   A decisão de assumir este custo (em detrimento da Opção A - Tenants assinam tudo ou da Opção C - Não usar assinatura) é um **investimento mandatório** para a credibilidade e viabilidade a longo prazo do modelo de negócio "Marketplace Público de Automações de IA" B2B.
