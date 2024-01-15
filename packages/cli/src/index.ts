#!/usr/bin/env node
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import { program } from 'commander';
import docs from './commands/docs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function start() {
  const npm = new Package({ dirName: join(__dirname, '..') });
  program.version(npm.version);

  program
    .description(docs.description)
    .argument('[input]', 'input file.')
    .option('-m, --mode [string]', 'independent mounted', 'independent')
    .action(docs.action);

  program.parseAsync(process.argv);
}

start();
