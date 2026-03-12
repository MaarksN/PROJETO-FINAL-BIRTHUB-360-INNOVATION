# Análise de Impacto de Downgrade

Quando um cliente do BirthHub360 decide reduzir seu plano (ex: Scale -> Growth, ou Growth -> Starter), o sistema deve gerenciar de forma transparente as limitações impostas sem causar perdas acidentais de dados de negócios. Esta política mapeia o que ocorre tecnicamente durante e após um downgrade e como isso é comunicado.

## 1. Dados Acessíveis vs. Inacessíveis (Retenção)

- **Acesso:** Dados históricos não são excluídos de imediato se excederem as restrições do novo plano menor. A política padrão é ocultá-los da interface após o *grace period* aplicável de 30 dias.
- **Armazenamento:** Os dados de Lead/Organizações no CRM, histórico de conversas dos agentes, e pipelines permanecem no banco de dados. No entanto, se o plano menor suporta apenas 3 meses de histórico (vs. 12 meses do plano maior), os dados mais antigos que 3 meses ficarão acinzentados (ou em abas desativadas), sinalizados como "Exige Upgrade para Visualizar".
- **Purge de Dados:** A exclusão física definitiva só ocorre em casos de cancelamento total ou solicitação explícita por questões de LGPD. O Downgrade apenas limita a retenção "ativa".

## 2. Features Bloqueadas e Automações Pausadas

Ao fazer downgrade, features avançadas (ex: Agente Especialista ou Relatórios Personalizados Avançados) podem se tornar indisponíveis.

- **Painéis (Dashboards):** Widgets ou abas específicas das *features* avançadas serão substituídas por *paywalls* (telas de bloqueio suaves com CTA para upgrade).
- **Automações (Agentes e Workflows):** Se o plano inferior tiver um limite menor de "Seats" de Agentes (ex: permitindo apenas 1 Agente SDR contra 3 Agentes do plano anterior), o sistema deverá pausar automaticamente os agentes mais inativos até atingir o novo limite, ou melhor, suspenderá a execução no próximo *trigger*, solicitando ao administrador que defina manualmente os agentes que permanecerão ativos. Se automações dependem de uma integração Premium, os fluxos passarão a falhar com um erro `FeatureNotAvailableError` e não consumirão mais a franquia base, alertando o usuário.

## 3. Limites de Franquia (Overage vs Base Limits)

- O novo limite do plano inferir é imposto no início do próximo ciclo de faturamento.
- O histórico de uso do mês corrente se mantém (o consumo não zera no meio do mês).
- Se o usuário já tiver ultrapassado a cota de uso do plano "novo" menor (downgrade programado pro fim do mês), no primeiro dia da renovação a sua barra de limite base estará estourada se ele não houver contido seu uso, incorrendo em taxas de overage imediatas para novas operações de IA.

## 4. Comunicação do Downgrade

A transparência total é necessária antes, durante e após a confirmação do downgrade na interface.

- **Antes (Tela de Confirmação):**
    - Um resumo claro das consequências: "Atenção: Seu novo plano Growth suporta até 10 usuários e 2.500 interações mensais. Como você tem 12 usuários hoje, você deverá suspender 2 acessos até o final do ciclo, ou eles serão bloqueados automaticamente. O histórico de conversas superior a 12 meses ficará inacessível."
    - O cliente deve "aceitar" os termos clicando em uma checkbox ("Entendo que funcionalidades do plano Scale serão desativadas").
- **Durante (No final do Ciclo):**
    - Um e-mail de confirmação é enviado assim que o webhook `customer.subscription.updated` do Stripe é processado marcando o início da vigência do novo plano: "Seu plano foi atualizado para Growth conforme solicitado. Sua próxima fatura será de $149."
- **Após (In-app Alerts):**
    - Sempre que o cliente esbarrar em um limite do novo plano (ex: tentar rodar um quarto relatório avançado), um banner amigável aparecerá: "Seu plano Growth atingiu o limite ou não possui essa feature. Quer voltar ao Scale?"