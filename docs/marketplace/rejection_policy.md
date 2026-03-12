# Política de Reprovação: Feedback Obrigatório e Ressubmissão

## 1. Princípios
O processo de revisão de Packs para o Marketplace Público do BirthHub360 não é punitivo por padrão, mas sim um controle de qualidade colaborativo. A plataforma visa encorajar o desenvolvimento da comunidade sem comprometer a segurança ou a integridade técnica.
Quando um pack (Agente, Prompt, Ferramenta ou Fluxo) é reprovado pelos revisores de Trust & Safety, o processo de reprovação deve ser claro, educativo, construtivo e eficiente, garantindo uma curva de aprendizado rápida para o Tenant criador.

## 2. Tipos de Decisões de Reprovação

A equipe de revisão não utiliza apenas um "Não". A rejeição é estruturada em dois níveis de severidade:

### 2.1. Aprovado com Ressalvas (Needs Changes / Amarelo)
*   **Significado:** O pack é fundamentalmente válido, seguro e útil, mas contém problemas técnicos menores, falhas de usabilidade ou violações leves das diretrizes de formatação (ex: README incompleto, tratamento de erros pobre que não representa risco de segurança, typos na descrição).
*   **Ação:** O status do pack muda para `WAITING_FOR_AUTHOR`. O pack não é publicado. O SLA de revisão é pausado.

### 2.2. Reprovado (Rejected / Vermelho)
*   **Significado:** O pack contém violações fundamentais de segurança (ex: exfiltração de dados, dependências maliciosas), falhas críticas de estabilidade (ex: loops infinitos que travam a sandbox), viola as regras de moderação de conteúdo, ou o escopo proposto é manifestamente falso ou enganoso.
*   **Ação:** O status do pack muda para `REJECTED`. O processo de publicação é encerrado para esta submissão específica.

## 3. Padrão de Feedback Obrigatório Mínimo

O BirthHub360 exige que seus revisores (humanos ou automatizados) forneçam **sempre** uma justificativa detalhada e acionável. Rejeições silenciosas ou genéricas (ex: "Seu pacote violou nossas políticas. Tente novamente.") são proibidas.

### O Feedback de Reprovação/Ressalvas deve conter obrigatoriamente:
1.  **O Fato (O que ocorreu):** Qual regra específica, diretriz técnica ou ponto do `custom_agent_review_checklist.md` falhou. (Ex: "O pacote solicita permissões de rede amplas `["*"]` no manifesto.")
2.  **A Evidência (Onde ocorreu):** Linha de código, trecho do System Prompt ou campo do manifesto exato onde o problema reside. (Ex: "Arquivo `tools/weather.py`, linha 42, `requests.get()` feito sem verificação TLS.")
3.  **O Impacto (Por que importa):** Explicação educacional do risco que aquela falha representa para o Tenant, para o usuário final ou para o ecossistema. (Ex: "Permitir conexões sem verificação TLS expõe a chamada de API do usuário a ataques Man-in-the-Middle e roubo de credenciais da Weather API.")
4.  **A Resolução (Como consertar):** O passo a passo acionável (Actionable Advice) de como o criador pode resolver o problema e adequar o pack. (Ex: "Por favor, defina `verify=True` na sua chamada *requests* ou adicione a flag TLS nas opções da biblioteca nativa.")

## 4. Prazo de Ressubmissão e Limites

Para evitar o entupimento da fila de revisão com "tentativa e erro" por parte de desenvolvedores descuidados, o BirthHub360 aplica regras de cadência (Cooldowns):

### 4.1. Limites para "Aprovado com Ressalvas" (Amarelo)
*   **Prazo do Autor:** O autor tem **15 dias corridos** para enviar as correções solicitadas.
*   **Inatividade:** Se o autor não responder ou não enviar as modificações dentro desse prazo, a submissão é automaticamente marcada como `ABANDONED` e o processo é encerrado. O autor precisará iniciar uma nova submissão do zero.
*   **Ciclos de Revisão:** Um pack pode passar por no máximo 3 ciclos de "Aprovado com Ressalvas" consecutivos pela mesma falha (o autor não conseguiu corrigir o que foi pedido). No 4º ciclo, a submissão é convertida em Reprovação (Rejected) com feedback final.

### 4.2. Limites e Punições para "Reprovado" (Vermelho)
*   **Prazo de Resfriamento (Cooldown):** Quando um pack é formalmente Reprovado por falhas técnicas severas ou segurança, o Tenant criador não pode ressubmeter uma nova versão daquele mesmo artefato (ou de um pack idêntico sob outro nome) por **7 dias corridos**.
*   **Por que o Cooldown?** Obriga o autor a dedicar tempo real para analisar o feedback de segurança, refatorar o código e testar a solução na sua própria sandbox de desenvolvimento antes de tentar consumir novamente os recursos de revisão do BirthHub360.
*   **Suspensão de Conta (Strikes):**
    *   **Strike 1:** Primeira reprovação por motivo de segurança grave (ex: código ofuscado, bypass de restrição de rede intencional). O autor recebe um aviso formal (Warning) além da reprovação, com cooldown de 7 dias.
    *   **Strike 2:** Segunda ofensa dentro de 6 meses. O Tenant perde o privilégio de publicar pacotes no Marketplace Público por 30 dias.
    *   **Strike 3:** Banimento permanente da conta do desenvolvedor do Tenant para funções de publicação no Marketplace. (O Tenant continua podendo usar a plataforma internamente, mas não pode mais distribuir pacotes públicos).

## 5. Casos Especiais: Reprovação Sem Feedback

Existe apenas uma exceção à regra do "Feedback Obrigatório Mínimo":
Se o conteúdo da submissão for flagrantemente ilegal (ex: material de abuso infantil, instrução terrorista), classificado como *Spam Massivo*, ou envolver uma tentativa deliberada, óbvia e maliciosa de invadir a infraestrutura do BirthHub360 através da engine de CI/CD.
Nesses casos, a submissão é imediatamente banida sem explicação técnica para não municiar o atacante, as contas são suspensas no ato e os dados são preservados para as autoridades competentes (se aplicável).
