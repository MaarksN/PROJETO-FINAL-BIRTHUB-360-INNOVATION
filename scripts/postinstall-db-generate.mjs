#!/usr/bin/env node
// @ts-nocheck
// 
import { readdirSync, rmSync } from 'node:fs';
import path from 'node:path';

import { projectRoot, runPnpm } from './ci/shared.mjs';

function removeTsbuildinfoArtifacts(rootDirectory) {
  const stack = [rootDirectory];

  while (stack.length > 0) {
    const currentDirectory = stack.pop();
    let entries;
    try {
      entries = readdirSync(currentDirectory, { withFileTypes: true });
    } catch (error) {
      console.warn(
        `[postinstall] Skipping unreadable directory '${currentDirectory}': ${error instanceof Error ? error.message : String(error)}`
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
        try {
          rmSync(absolutePath, { force: true });
        } catch (error) {
          console.warn(
            `[postinstall] Failed to remove '${absolutePath}': ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    }
  }
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

removeTsbuildinfoArtifacts(projectRoot);
