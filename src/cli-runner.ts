#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loaderConfigPath = resolve(__dirname, '../loader-config.js');
const cliScriptPath = resolve(__dirname, './main.js');

const args = process.argv.slice(2);

const result = spawnSync('node', ['--import', loaderConfigPath, cliScriptPath, ...args], {
  stdio: 'inherit',
  shell: true
});

process.exit(result.status || undefined);
