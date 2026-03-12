# Critérios de Aceite: Provisioning Flow

A automação testa sem intervenção humana:
1. Requisição POST `/api/v1/auth/signup` cria um Tenant com status pendente.
2. Emissão de token JWT restrito enviado.
3. Ativação troca token pendente por Session validada e ativa RLS do novo tenant.
4. Nenhuma fila de banco ou workers em segundo plano engasga.
