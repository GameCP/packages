#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { buildCommand } from './commands/build';
import { validateCommand } from './commands/validate';
import { devCommand } from './commands/dev';

const program = new Command();

program
  .name('gamecp')
  .description('CLI tool for developing GameCP extensions')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new GameCP extension')
  .argument('[name]', 'Extension name')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .option('-t, --template <template>', 'Template to use', 'basic')
  .action(initCommand);

program
  .command('build')
  .description('Build the extension for production')
  .option('-w, --watch', 'Watch mode')
  .option('-o, --outdir <directory>', 'Output directory', 'dist')
  .action(buildCommand);

program
  .command('validate')
  .description('Validate extension manifest and code')
  .option('-m, --manifest <file>', 'Manifest file path', 'gamecp.json')
  .action(validateCommand);

program
  .command('dev')
  .description('Start development mode with watch and validation')
  .action(devCommand);

program.parse();
