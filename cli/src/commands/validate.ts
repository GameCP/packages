import * as fs from 'fs/promises';
import chalk from 'chalk';
import { validateManifest } from '@gamecp/manifest';

interface ValidateOptions {
  manifest?: string;
}

export async function validateCommand(options: ValidateOptions = {}) {
  const manifestPath = options.manifest || 'gamecp.json';

  console.log(chalk.bold.cyan('\n🔍 Validating GameCP Extension\n'));

  try {
    // Read and parse manifest
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    // Validate manifest
    const validation = validateManifest(manifest);

    if (validation.valid) {
      console.log(chalk.green('✓ Manifest is valid'));
      console.log(chalk.gray(`  Extension: ${manifest.name} v${manifest.version}`));
      console.log(chalk.gray(`  ID: ${manifest.id}`));
      
      if (manifest.permissions && manifest.permissions.length > 0) {
        console.log(chalk.gray(`  Permissions: ${manifest.permissions.join(', ')}`));
      }
      
      if (manifest.cron && manifest.cron.length > 0) {
        console.log(chalk.gray(`  Cron schedules: ${manifest.cron.length}`));
      }
      
      
      console.log();
    } else {
      console.log(chalk.red('✗ Manifest validation failed\n'));
      validation.errors.forEach(error => {
        console.error(chalk.red(`  • ${error}`));
      });
      console.log();
      process.exit(1);
    }

  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      console.error(chalk.red(`✗ Manifest file not found: ${manifestPath}\n`));
    } else if (error instanceof SyntaxError) {
      console.error(chalk.red(`✗ Invalid JSON in manifest file\n`));
      console.error(chalk.gray(`  ${error.message}\n`));
    } else {
      console.error(chalk.red('✗ Validation failed\n'));
      console.error(error);
    }
    process.exit(1);
  }
}
