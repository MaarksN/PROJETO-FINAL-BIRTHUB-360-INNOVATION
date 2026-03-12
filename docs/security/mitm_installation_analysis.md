# Análise de MITM na Instalação de Pack: Como Prevenir e Detectar

## 1. Cenário de Ataque: Interceptação (Man-in-the-Middle)
Este documento descreve a análise de risco e as contramedidas para um ataque de Man-in-the-Middle (MITM) focado no processo de download e instalação de "Packs" (Agentes, Prompts, Tools) pelo Agente Orquestrador do Tenant, a partir do repositório/Marketplace do BirthHub360.

**O Vetor de Ataque:** Um atacante posicionado entre a infraestrutura do Tenant (ex: rede Wi-Fi corporativa comprometida, ISP malicioso, proxy de interceptação SSL mal configurado) e os servidores do BirthHub360 intercepta a requisição de download de um pack legítimo.

**O Objetivo do Atacante:** Substituir, em trânsito, o arquivo do pack legítimo por uma versão maliciosa (ex: alterando o código de uma ferramenta Python para exfiltrar chaves de API do Tenant) antes que o pacote alcance o disco do Orquestrador e seja executado.

**O Impacto (Crítico):** Execução de código arbitrário remoto (RCE) no ambiente do Tenant, comprometimento de dados confidenciais (Data Breach), e perda total de confiança na plataforma BirthHub360.

## 2. Como o Ataque Ocorre (A Cadeia de Substituição)
1.  **Interceptação da Conexão:** O atacante sequestra o tráfego HTTP/HTTPS (ex: via envenenamento ARP, DNS Spoofing ou instalação forçada de um certificado CA raiz falso no host do Tenant).
2.  **Interceptação do Download:** Quando o Orquestrador solicita `GET /api/v1/packs/download/crm-analyst-v1.2.zip`, o atacante captura essa requisição.
3.  **Forjamento do Pacote:** O atacante descompacta o ZIP em memória, injeta seu código malicioso no arquivo `tools/salesforce_integration.py`, recompacta o ZIP e o envia de volta ao Orquestrador do Tenant como se fosse a resposta legítima do servidor do BirthHub360.
4.  **Instalação Comprometida:** O Orquestrador salva o ZIP malicioso, descompacta-o localmente e, ao ser invocado pelo usuário, executa o código envenenado.

## 3. Prevenção (Defesa em Profundidade)

### 3.1. Criptografia em Trânsito (Camada de Rede)
*   **Controle Principal:** Todas as comunicações entre o Orquestrador e as APIs do BirthHub360 (incluindo downloads de packs via CDN) devem ocorrer exclusivamente sobre **HTTPS (TLS 1.3 ou superior)**. Conexões HTTP (porta 80) devem ser sumariamente rejeitadas ou redirecionadas.
*   **HSTS (HTTP Strict Transport Security):** A infraestrutura do BirthHub360 deve forçar o uso de HTTPS através de cabeçalhos HSTS (`Strict-Transport-Security`), garantindo que os clientes modernos (e orquestradores construídos sobre bibliotecas seguras) nunca tentem a conexão em texto claro.
*   **Proteção Adicional:** Uso de *Certificate Pinning* (fixação de certificado) no código do Orquestrador. O software do Agente Orquestrador, distribuído aos Tenants (seja binário ou imagem Docker), trará embutida a impressão digital (hash) do certificado público TLS esperado do BirthHub360 (ou da sua Root CA). Se o certificado TLS oferecido durante a conexão não bater com o PIN armazenado no código, a conexão é abortada imediatamente (mitigando o risco de interceptação via proxies SSL corporativos não autorizados ou CAs governamentais maliciosas).

### 3.2. Assinatura Digital de Código (Camada de Aplicação - O Fator Decisivo)
O TLS previne que o tráfego seja lido ou modificado em trânsito, mas falha se o ponto de terminação TLS (ex: um WAF ou proxy comprometido) for o atacante. A assinatura digital do pacote protege o *artefato em repouso e em movimento*, não importando como ele foi transportado.

*   **O Processo:** O Orquestrador baixa o arquivo `.zip` e um arquivo separado de assinatura (`.sig` ou `.asc`).
*   **A Verificação Matemática:** O Orquestrador, usando a chave pública do BirthHub360 (que já vem hardcoded no seu próprio binário confiável no momento de sua compilação/distribuição inicial), verifica a assinatura contra o arquivo baixado.
*   **A Prevenção do MITM:** Se o atacante modificou apenas 1 byte do arquivo ZIP em trânsito (injetando malware), o hash do arquivo (ex: SHA-256) mudará drasticamente. Quando o Orquestrador tentar descriptografar a assinatura original do BirthHub360 com a chave pública local, os hashes não baterão. A instalação falhará *antes* de qualquer arquivo ser descompactado ou executado, e o pacote malicioso será descartado no ato. O atacante não consegue gerar uma nova assinatura válida porque não possui a chave privada do BirthHub360 (armazenada em HSM na nuvem).

## 4. Detecção (Monitoramento e Alertas)

Mesmo que a prevenção falhe (cenário extremamente improvável dadas as contramedidas), ou que o MITM esteja tentando ativamente quebrar a proteção (ataque de força bruta, downgrade), a plataforma precisa de mecanismos de detecção:

### 4.1. Alertas de Falha de Assinatura (No Orquestrador)
*   **Ação:** Se a verificação da assinatura falhar (hashes incompatíveis), o Orquestrador deve gerar um log local de severidade `CRITICAL` (ex: "Assinatura do pack 'crm-analyst-v1.2' INVÁLIDA. Possível adulteração ou corrupção no download").
*   **Notificação (Telemetria):** O Orquestrador tentará enviar este log específico (se a rede permitir) para um endpoint de telemetria seguro do BirthHub360.
*   **Detecção de Ataque Coordenado:** Se a equipe de SecOps do BirthHub360 receber múltiplos relatórios de "Falha de Assinatura" provenientes de vários Tenants de uma mesma região geográfica (ou do mesmo provedor de internet/nuvem corporativa), isso é um forte indicador (IoC - Indicator of Compromise) de uma campanha de interceptação MITM em larga escala direcionada àquela infraestrutura específica.

### 4.2. Análise de Padrões de Download (No Servidor CDN)
*   **Monitoramento de Comportamento:** A CDN ou o Gateway da API do BirthHub360 deve analisar os padrões de solicitação de download.
*   **Sinal de Alerta:** Um número anormalmente alto de solicitações sequenciais para o arquivo de download do pack (`.zip`) *sem* a correspondente solicitação do arquivo de assinatura (`.sig`) pelo mesmo IP cliente pode indicar a presença de um script malicioso automatizado ou um proxy MITM defeituoso que está descartando/ignorando intencionalmente a verificação de assinatura para facilitar a injeção do payload (tentando burlar a lógica do orquestrador). Nesses casos, o IP suspeito deve ser temporariamente bloqueado (Rate Limiting) e adicionado a uma watchlist (lista de observação) para investigação forense.
