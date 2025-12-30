import * as fs from 'fs/promises';
import * as path from 'path';
import { build } from 'esbuild';
import chalk from 'chalk';
import ora from 'ora';
import { validateManifest } from '@gamecp/manifest';

interface BuildOptions {
  watch?: boolean;
  outdir?: string;
}

export async function buildCommand(options: BuildOptions = {}) {
  const spinner = ora('Building extension...').start();

  try {
    // Validate manifest first
    const manifestPath = path.resolve('gamecp.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);
    
    const validation = validateManifest(manifest);
    if (!validation.valid) {
      spinner.fail(chalk.red('Manifest validation failed'));
      validation.errors.forEach(error => {
        console.error(chalk.red(`  ✗ ${error}`));
      });
      process.exit(1);
    }

    // Build with esbuild
    const outdir = options.outdir || 'dist';
    
    const buildOptions: any = {
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outdir,
      format: 'cjs',
      sourcemap: true,
      minify: !options.watch,
      logLevel: 'info'
    };

    if (options.watch) {
      buildOptions.watch = {
        onRebuild(error: any, result: any) {
          if (error) {
            console.error(chalk.red('Build failed:'), error);
          } else {
            console.log(chalk.green('✓ Rebuilt successfully'));
          }
        }
      };
    }
    
    await build(buildOptions);

    if (options.watch) {
      spinner.succeed(chalk.green('Watching for changes...'));
      // Keep process alive
      await new Promise(() => {});
    } else {
      spinner.succeed(chalk.green('Build completed successfully!'));
    }

  } catch (error) {
    spinner.fail(chalk.red('Build failed'));
    console.error(error);
    process.exit(1);
  }
}
