# @gamecp/cli

Command-line interface for developing GameCP extensions.

## Installation

```bash
npm install -g @gamecp/cli
```

Or use with npx:

```bash
npx @gamecp/cli init my-extension
```

## Commands

### `gamecp init [name]`

Initialize a new GameCP extension with interactive prompts.

```bash
gamecp init my-discord-bot
```

Options:
- `-d, --dir <directory>` - Target directory (default: current directory)
- `-t, --template <template>` - Template to use (default: basic)

### `gamecp build`

Build the extension for production.

```bash
gamecp build
```

Options:
- `-w, --watch` - Watch mode for development
- `-o, --outdir <directory>` - Output directory (default: dist)

### `gamecp validate`

Validate extension manifest and code.

```bash
gamecp validate
```

Options:
- `-m, --manifest <file>` - Manifest file path (default: gamecp.json)

### `gamecp dev`

Start development mode with watch and validation.

```bash
gamecp dev
```

This command:
1. Validates your manifest
2. Starts TypeScript compilation in watch mode
3. Rebuilds automatically on file changes

## Workflow

```bash
# Create new extension
gamecp init my-extension
cd my-extension

# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build
```

## Generated Project Structure

```
my-extension/
├── src/
│   └── index.ts          # Main extension code
├── dist/                 # Compiled output
├── gamecp.json          # Extension manifest
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
