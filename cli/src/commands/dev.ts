import chalk from 'chalk';
import { buildCommand } from './build';
import { validateCommand } from './validate';

export async function devCommand() {
  console.log(chalk.bold.cyan('\n🚀 Starting GameCP Extension Development Mode\n'));

  // Validate first
  await validateCommand();

  // Start watch mode
  console.log(chalk.cyan('Starting build in watch mode...\n'));
  await buildCommand({ watch: true });
}
