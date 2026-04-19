#!/usr/bin/env node
// @ts-nocheck
// 
import { readdirSync, rmSync } from 'node:fs';
import path from 'node:path';

import { projectRoot, runPnpm } from './ci/shared.mjs';

function formatErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function isSafeTsbuildinfoPath(absolutePath) {
  const normalizedProjectRoot = `${projectRoot}${path.sep}`;
  return (
    absolutePath.startsWith(normalizedProjectRoot) &&
    absolutePath.includes(`${path.sep}packages${path.sep}`) &&
    absolutePath.endsWith('.tsbuildinfo')
  );
}

/**
 * Objetivo: remover artefatos TypeScript transitórios (.tsbuildinfo) criados no bootstrap.
 * Entrada esperada: rootDirectory absoluto do workspace; percorre subdiretórios exceto node_modules/.git.
 * Saída obrigatória: árvore sem arquivos .tsbuildinfo dentro de packages/, com logs de erros não fatais.
 * Fora de escopo: não remove artefatos fora de packages/, não altera código-fonte nem node_modules.
 * Critérios de aceite: não lançar erro por diretório/arquivo inacessível e manter limpeza determinística.
 * Riscos e mitigação: remoção indevida mitigada por validação explícita de caminho seguro.
 * Rollback: definir BIRTHUB_POSTINSTALL_CLEAN_TSBUILDINFO=0 para desativar a limpeza.
 */
function removeTsbuildinfoArtifacts(rootDirectory) {
  const stack = [rootDirectory];
  let removedCount = 0;

  while (stack.length > 0) {
    const currentDirectory = stack.pop();
    let entries;
    try {
      entries = readdirSync(currentDirectory, { withFileTypes: true });
    } catch (error) {
      console.warn(
        `[postinstall] Skipping unreadable directory '${currentDirectory}': ${formatErrorMessage(error)}`
      );
      continue;
    }

    for (const entry of entries) {
      const absolutePath = path.join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') {
          continue;
        }
        stack.push(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.tsbuildinfo')) {
        if (!isSafeTsbuildinfoPath(absolutePath)) {
          continue;
        }
        try {
          rmSync(absolutePath, { force: true });
          removedCount += 1;
        } catch (error) {
          console.warn(
            `[postinstall] Failed to remove '${absolutePath}': ${formatErrorMessage(error)}`
          );
        }
      }
    }
  }

  console.log(`[postinstall] Removed ${removedCount} tsbuildinfo artifact(s).`);
}

runPnpm([
  '--filter',
  '@birthub/config',
  '--filter',
  '@birthub/logger',
  '--filter',
  '@birthub/agents-core',
  '--filter',
  '@birthub/workflows-core',
  '--filter',
  '@birthub/database',
  'build'
]);

if (process.env.BIRTHUB_POSTINSTALL_CLEAN_TSBUILDINFO === '0') {
  console.log('[postinstall] Skipping tsbuildinfo cleanup (BIRTHUB_POSTINSTALL_CLEAN_TSBUILDINFO=0).');
} else {
  removeTsbuildinfoArtifacts(projectRoot);
}
