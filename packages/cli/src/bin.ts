#!/usr/bin/env node
import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Package } from '@lough/npm-operate';
import { Command, program } from 'commander';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadCommands = async (program: Command) => {
  const commandsDir = join(__dirname, 'commands');
  const list = readdirSync(commandsDir).filter(file => file.includes('.js'));

  for (const file of list) {
    const command = (await import(pathToFileURL(join(commandsDir, file)).href)).default;

    const cmd = command.name ? program.command(command.name) : program;

    cmd.description(command.description);

    command.options.forEach((option: [string, string, string]) => {
      cmd.option(...option);
    });

    cmd.action(command.action);
  }
};

async function start() {
  const npm = new Package({ dirName: join(__dirname, '..') });
  program.version(npm.version);

  await loadCommands(program);

  program.parseAsync(process.argv);
}

start();
