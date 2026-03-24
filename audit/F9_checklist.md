# F9 — CHECKLIST DETALHADO DE AÇÕES TÉCNICAS

Este checklist serve como evidência obrigatória antes do envio de qualquer PR e direciona a execução dos Ciclos definidos em F8.

### 🔴 OBRIGATÓRIO (Onda R0 - Sobrevivência)
- [ ] O diretório `agents/pos-venda` foi excluído do disco (Evidência: `ls agents/pos-venda` falha).
- [ ] O diretório `agents/pre_sales` foi excluído do disco.
- [ ] O diretório `agents/pre_vendas` foi excluído do disco.
- [ ] O diretório `agents/partners` foi excluído do disco.
- [ ] O diretório `agents/analista` foi excluído do disco.
- [ ] O diretório `agents/coordenador_comercial` foi excluído do disco.
- [ ] O diretório `agents/executivo_negocios` foi excluído do disco.
- [ ] O diretório `agents/gerente_comercial` foi excluído do disco.
- [ ] O diretório `agents/copywriter` foi excluído do disco.
- [ ] O diretório `agents/inside_sales` foi excluído do disco.
- [ ] O diretório `agents/account_manager` foi excluído do disco.
- [ ] O arquivo `pnpm-workspace.yaml` não possui referências a pacotes zumbis em `packages/`.
- [ ] Executou-se `pnpm dedupe` e `pnpm install` sem erros no root.

### 🟡 MÉDIA PRIORIDADE (Onda R1 - Estabilização e Código TS)
- [ ] Todos os pacotes remanescentes no workspace possuem script `lint`, `typecheck`, `test`, `build` (ou `"echo 'N/A...'"` se não se aplicar).
- [ ] O Next.js (`apps/web`) compila via `pnpm build` localmente referenciando o `workspace:*`.
- [ ] O arquivo `.python-version` corresponde à versão do ambiente `.tool-versions`.
- [ ] Nenhum arquivo no monorepo excede explicitamente `max-lines` ou `complexity` ciclomatica grave sem um `// eslint-disable` justificado (verificado via `pnpm lint:core`).
- [ ] A configuração de segurança para scan `aquasecurity/trivy-action` utiliza `scan-type: 'fs'` caso imagem docker não exista ainda na CI local.
- [ ] Todas as chaves `sk_test_...` em configs locais foram mockadas com sufixo `_mock` (ex: `sk_test_xxx_mock`).

### 🟢 LONGO PRAZO (Onda R2 e R3 - Python/Docker)
- [ ] Agentes Python utilizam estritamente convenção `snake_case` (verificar caminhos e módulos).
- [ ] O teste de infraestrutura `/home/jules/.pyenv/versions/...` funciona (as dependências estão mapeadas no `requirements.txt`).
- [ ] Todas as chamadas ao DB geradas nos testes provêem `tenantId` nos seeds de Prisma (`test:db:baseline`).
- [ ] Os pacotes do monorepo foram submetidos e passaram pelo comando `corepack pnpm monorepo:doctor`.
- [ ] Nenhuma credencial foi detectada em arquivos locais usando o scanner JS `node scripts/security/scan-inline-credentials.mjs`.

## Total de Itens: 21 Ações Técnicas Verificáveis.