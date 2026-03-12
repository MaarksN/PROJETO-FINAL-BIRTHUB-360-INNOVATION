# Correção da PR anterior: exports/ESM autofix

## O que foi corrigido

A implementação anterior aplicava mudanças **destrutivas em massa** (alterava `package.json`/`tsconfig.json` de todos os pacotes e criava barrels com `.js` indiscriminadamente), quebrando builds.

Nesta correção:

1. Foram **revertidas** as alterações automáticas indevidas nos pacotes internos e agents.
2. O script `scripts/fix-internal-package-exports.mjs` foi reescrito para operar em modo **audit-first**:
   - padrão: apenas audita e gera relatório
   - `--apply`: aplica ajustes
   - `--build`: roda build apenas para pacotes alterados no `--apply`
3. O script deixou de sobrescrever `exports` de forma destrutiva e agora só exige/insere `exports["."]` quando ausente.
4. O script não força mais opções sensíveis de TS (como `rootDir`, `outDir`, etc.), limitando-se ao essencial (`module` e `moduleResolution` em NodeNext).
5. A geração de barrel passou a ser mais segura:
   - varredura recursiva de `src`
   - exclusão de `dist`, `node_modules`, `tests` e `__tests__`
   - evita duplicar exports já existentes (`./x`, `./x.js`, etc.)

## Comandos executados

```bash
node scripts/fix-internal-package-exports.mjs
pnpm -r build
pnpm test
```

## Resultado

- `node scripts/fix-internal-package-exports.mjs`: sucesso (modo audit), relatório atualizado.
- `pnpm -r build`: falha em problema já existente de imports com extensão `.ts` em `packages/agents-core` sob `tsc`.
- `pnpm test`: falha em problema já existente no dashboard (`@birthub/dashboard#test`).

## Pendências manuais

1. Tratar imports com `.ts` em caminhos de produção/teste onde `tsc` não aceita extensão explícita sem opção adicional.
2. Corrigir falhas da suíte do dashboard/web.
3. Rodar o script com `--apply --build` em branch dedicado quando o baseline de build estiver estável.
