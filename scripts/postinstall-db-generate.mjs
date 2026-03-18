#!/usr/bin/env node
import { runPnpm } from './ci/shared.mjs';

runPnpm(['--filter', '@birthub/database', 'db:generate']);
