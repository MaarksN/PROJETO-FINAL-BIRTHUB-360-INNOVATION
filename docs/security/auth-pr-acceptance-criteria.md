# Critérios de Aceite de Segurança para Autenticação

Todo Pull Request que tocar no código de Autenticação/Autorização deve:
1. Ter revisão aprovada por no mínimo um Engenheiro de Segurança ou Tech Lead.
2. Não introduzir novas dependências criptográficas sem ADR aprovada.
3. Incluir testes unitários para casos de sucesso E falha (ex: tokens expirados, assinaturas inválidas).
4. Garantir que logs não imprimem senhas ou tokens (mesmo parcialmente).
