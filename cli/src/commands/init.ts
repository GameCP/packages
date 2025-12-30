import * as fs from 'fs/promises';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import type { ExtensionManifest } from '@gamecp/types';

interface InitOptions {
  dir: string;
  template: string;
}

export async function initCommand(name?: string, options: InitOptions = { dir: '.', template: 'basic' }) {
  console.log(chalk.bold.cyan('\n🎮 GameCP Extension Generator\n'));

  // Prompt for extension details
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Extension name:',
      default: name || 'my-extension',
      validate: (input: string) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Extension name must be lowercase with hyphens only';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'displayName',
      message: 'Display name:',
      default: (answers: any) => {
        return answers.name
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: 'A GameCP extension'
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: 'Your Name'
    },
    {
      type: 'checkbox',
      name: 'permissions',
      message: 'Select permissions:',
      choices: [
        { name: 'Read server info', value: 'server:read', checked: true },
        { name: 'Write server data', value: 'server:write' },
        { name: 'Control server (start/stop/restart)', value: 'server:control' },
        { name: 'Access server files', value: 'server:files' },
        { name: 'Access server console', value: 'server:console' },
        { name: 'Read tenant info', value: 'tenant:read' },
        { name: 'Write tenant data', value: 'tenant:write' },
        { name: 'Read user info', value: 'user:read' },
        { name: 'Make network requests', value: 'network:request' }
      ]
    },
    {
      type: 'confirm',
      name: 'useCron',
      message: 'Add cron schedule?',
      default: false
    },
    {
      type: 'input',
      name: 'cronExpression',
      message: 'Cron expression:',
      default: '*/5 * * * *',
      when: (answers: any) => answers.useCron
    }
  ]);

  const spinner = ora('Creating extension...').start();

  try {
    const targetDir = path.resolve(options.dir, answers.name);
    
    // Create directory structure
    await fs.mkdir(targetDir, { recursive: true });
    await fs.mkdir(path.join(targetDir, 'src'), { recursive: true });

    // Create manifest
    const manifest: ExtensionManifest = {
      id: answers.name,
      name: answers.displayName,
      version: '0.1.0',
      description: answers.description,
      author: {
        name: answers.author
      },
      main: 'dist/index.js',
      permissions: answers.permissions,
      ...(answers.useCron && {
        cron: [
          {
            expression: answers.cronExpression,
            description: 'Scheduled task'
          }
        ]
      })
    };

    await fs.writeFile(
      path.join(targetDir, 'gamecp.json'),
      JSON.stringify(manifest, null, 2)
    );

    // Create package.json
    const packageJson = {
      name: answers.name,
      version: '0.1.0',
      description: answers.description,
      main: 'dist/index.js',
      scripts: {
        dev: 'gamecp dev',
        build: 'gamecp build',
        validate: 'gamecp validate'
      },
      devDependencies: {
        '@gamecp/types': '^0.1.0',
        '@gamecp/cli': '^0.1.0',
        'typescript': '^5.3.3'
      }
    };

    await fs.writeFile(
      path.join(targetDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist']
    };

    await fs.writeFile(
      path.join(targetDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    // Create main extension file
    const extensionCode = generateExtensionCode(answers);
    await fs.writeFile(
      path.join(targetDir, 'src', 'index.ts'),
      extensionCode
    );

    // Create .gitignore
    await fs.writeFile(
      path.join(targetDir, '.gitignore'),
      'node_modules/\ndist/\n*.log\n'
    );

    // Create README
    const readme = generateReadme(answers);
    await fs.writeFile(
      path.join(targetDir, 'README.md'),
      readme
    );

    spinner.succeed(chalk.green('Extension created successfully!'));

    console.log(chalk.bold('\n📦 Next steps:\n'));
    console.log(chalk.cyan(`  cd ${answers.name}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));
    console.log();

  } catch (error) {
    spinner.fail(chalk.red('Failed to create extension'));
    console.error(error);
    process.exit(1);
  }
}

function generateExtensionCode(answers: any): string {
  const hasCron = answers.useCron;
  
  return `import type { Extension, ExtensionContext${hasCron ? ', CronEvent' : ''} } from '@gamecp/types';

const extension: Extension = {
  async onLoad(context: ExtensionContext) {
    context.logger.info('${answers.displayName} loaded!');
  },
${hasCron ? `
  async onCron(event: CronEvent, context: ExtensionContext) {
    context.logger.info('Cron tick', { expression: event.expression });
    
    // Your scheduled logic here
  },
` : ''}
  async onUnload(context: ExtensionContext) {
    context.logger.info('${answers.displayName} unloaded');
  }
};

export default extension;
`;
}

function generateReadme(answers: any): string {
  return `# ${answers.displayName}

${answers.description}

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Permissions

${answers.permissions.map((p: string) => `- \`${p}\``).join('\n')}

## Author

${answers.author}
`;
}
