# Política de Curadoria: Critérios de Aceite de Packs no Marketplace Público

## 1. Objetivo
Estabelecer os critérios e o processo de avaliação para a publicação de Packs (conjunto de agentes, prompts, tools e workflows) no Marketplace Público do BirthHub360, garantindo a qualidade, segurança e utilidade para todos os tenants.

## 2. Princípios Gerais
- **Segurança First:** Nenhum pack pode apresentar riscos à infraestrutura, aos dados de outros tenants ou à plataforma.
- **Transparência:** O funcionamento do pack, seus requisitos e custos devem ser claros para o usuário final.
- **Qualidade:** O pack deve resolver um problema real de forma eficiente e sem erros frequentes.
- **Compliance:** O pack deve respeitar a LGPD e outras legislações aplicáveis, além de não promover conteúdo ilegal ou abusivo.

## 3. Critérios de Aceite

### 3.1. Segurança e Privacidade
- **Sem Exfiltração de Dados:** O pack não pode enviar dados processados ou inseridos pelo usuário para endpoints externos não declarados e não autorizados.
- **Escopo Mínimo de Permissões:** O pack deve solicitar apenas as permissões estritamente necessárias para o seu funcionamento (Least Privilege).
- **Sem Execução de Código Malicioso:** O código ou as ferramentas incluídas no pack não podem conter malware, spyware ou tentar explorar vulnerabilidades da plataforma.
- **Conformidade LGPD:** Se o pack processa dados pessoais, deve declarar claramente a finalidade e garantir que não armazena dados indevidamente.

### 3.2. Qualidade e Funcionamento
- **Descrição Clara e Precisa:** O nome, a descrição e as tags devem refletir exatamente o que o pack faz. Evitar falsas promessas.
- **Documentação Adequada:** O pack deve incluir um arquivo `README.md` detalhando como usá-lo, exemplos de input/output e requisitos (ex: chaves de API externas).
- **Tratamento de Erros:** O pack deve lidar com falhas de forma graciosa, retornando mensagens de erro compreensíveis em vez de travar.
- **Desempenho Aceitável:** O pack não deve consumir recursos excessivos da plataforma (CPU, memória, tempo de execução), respeitando os limites estabelecidos no SLO.
- **Ausência de Alucinações Graves:** Para packs que dependem de LLMs, as instruções sistêmicas (prompts) devem ser desenhadas para minimizar alucinações críticas, especialmente em contextos sensíveis (ex: jurídico, médico).

### 3.3. Originalidade e Propriedade Intelectual
- **Direitos Autorais:** O criador do pack deve ter o direito de distribuir todos os componentes incluídos. Plágio de outros packs não é permitido.
- **Sem Conteúdo Proibido:** O pack não pode gerar ou facilitar a criação de conteúdo de ódio, violência, abuso infantil, ou atividades ilegais.

## 4. Processo de Submissão e Revisão

1.  **Submissão:** O Tenant Criador empacota a solução e a submete via painel do BirthHub360, preenchendo o formulário de metadados.
2.  **Análise Automatizada (SLA: 2h):**
    *   Verificação de estrutura do arquivo.
    *   Varredura estática por padrões de código malicioso ou exfiltração conhecida.
    *   Checagem de permissões solicitadas.
3.  **Análise Manual/Curadoria (SLA: 48h a 5 dias úteis):**
    *   Agentes simples: revisão rápida de prompts e dependências.
    *   Agentes com tools externas: revisão aprofundada de segurança, requisições de rede e análise de tráfego simulado.
4.  **Decisão:**
    *   **Aprovado:** O pack é publicado imediatamente no Marketplace.
    *   **Aprovado com Ressalvas (Amarelo):** O criador precisa fazer ajustes menores antes da publicação.
    *   **Reprovado (Vermelho):** O pack viola regras críticas. O criador recebe um feedback claro do motivo.

## 5. Manutenção Pós-Publicação
- Packs com altas taxas de erro (>15% de falhas) podem ser temporariamente ocultados.
- Packs com denúncias de usuários serão reavaliados e podem ser removidos (ver Política de Remoção de Packs Maliciosos).
- O criador é responsável por manter o pack atualizado, especialmente se as APIs externas que ele utiliza sofrerem *breaking changes*.
