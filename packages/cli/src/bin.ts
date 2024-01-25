#!/usr/bin/env node
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import { program } from 'commander';
import docs from './commands';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function start() {
  const npm = new Package({ dirName: join(__dirname, '..') });
  program.version(npm.version);

  program
    .description(docs.description)
    .argument('[input]', 'input file.')
    .option('-sm, --saveMode [string]', 'independent mounted', 'independent')
    .option('-pt, --projectType [string]', 'default cli', 'default')
    .action(docs.action);

  program.parseAsync(process.argv);
}

start();

// TODO: 1.动态读取 commands
// TODO: 2.参数、选项配置化
