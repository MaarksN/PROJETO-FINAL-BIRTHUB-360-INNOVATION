# ADR-029: PKI para Manifests — Chave por Tenant vs CA Central BirthHub

## Status
Aceito

## Contexto
O BirthHub360 introduziu o conceito de "Packs" no Marketplace. Para garantir a integridade, autenticidade e não repúdio desses pacotes durante a distribuição e instalação, é necessário implementar um sistema de assinatura digital.
A principal decisão arquitetural reside em como gerenciar as chaves criptográficas que assinam os manifestos dos packs:
1.  **Opção A (Chave por Tenant):** Cada Tenant criador gera ou recebe um par de chaves único (ex: via KMS). Eles assinam seus próprios manifestos.
2.  **Opção B (CA Central BirthHub):** O BirthHub360 atua como uma Autoridade Certificadora (CA) central. Após a verificação e aprovação de um pack, o próprio BirthHub360 assina o manifesto usando uma chave raiz altamente protegida.

## Decisão
Optamos pela **Opção B (CA Central BirthHub)**.
Todos os manifestos de packs publicados no Marketplace Público serão assinados digitalmente por uma chave gerenciada pelo BirthHub360.
Isso não impede que Tenants assinem seus próprios packs *internos* (distribuição privada) usando a Opção A no futuro, mas para o ecossistema público, a confiança emana da curadoria da plataforma.

## Consequências

### Positivas
*   **Gestão de Confiança Simplificada:** Os Tenants que instalam packs só precisam confiar em uma única chave pública (a do BirthHub360) para verificar a integridade, em vez de manter e atualizar um keyring com chaves de centenas de Tenants diferentes.
*   **Controle Rigoroso de Publicação:** O ato de assinar está intrinsecamente ligado ao processo de revisão (SLA de curadoria). Um pack só é assinado (e portanto "instalável" com garantias) *após* passar pela análise estática/dinâmica.
*   **Revogação Centralizada (Kill Switch):** Se um pack for descoberto como malicioso post-publishing, podemos simplesmente revogar a assinatura daquele manifesto específico ou interromper a publicação da CRL (Certificate Revocation List)/OCSP em tempo real para invalidar a instalação.
*   **Experiência do Desenvolvedor (Tenant Criador):** Reduz o atrito de publicação. O Tenant não precisa se preocupar em gerenciar, rotacionar chaves de assinatura privadas ou lidar com HSMs de forma segura; ele apenas submete o código.

### Negativas / Riscos Assumidos
*   **Ponto Único de Falha (SPOF):** A chave de assinatura central do BirthHub360 (ou a chave da CA intermediária responsável por assinar) torna-se o alvo de maior valor para atacantes. Um comprometimento desta chave comprometeria todo o ecossistema (Golden Ticket).
*   **Gargalo de Performance (SLA):** A assinatura ocorre do nosso lado. Se o KMS/HSM apresentar latência ou inatividade, o pipeline de publicação de packs trava.
*   **Custo Operacional Alto (Mitigado pelo valor):** Manter uma infraestrutura de PKI (Cloud HSM, AWS KMS com asymmetric keys) protegida, rotacionada e auditada exige engenharia dedicada e custos fixos na nuvem.

## Implementação Técnica Resumida
1.  A chave privada será armazenada em um Cloud HSM (ex: AWS KMS Asymmetric Keys - secp256k1 ou Ed25519). A chave privada *nunca* deixa o hardware.
2.  O serviço de publicação ("Marketplace Service") terá uma *IAM Role* extremamente restrita que só permite a ação `kms:Sign` nesta chave específica.
3.  O payload assinado será o *hash SHA-256* do arquivo JSON do manifesto do pack (que contém os hashes de todos os outros arquivos incluídos, como prompts e código-fonte).
4.  A chave pública será codificada ("hardcoded") no binário/código do Agente Orquestrador do Tenant, que faz a verificação local no momento da instalação (offline verification capable).