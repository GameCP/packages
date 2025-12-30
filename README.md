# GameCP Developer Kit

[![GitHub](https://img.shields.io/badge/github-GameCP%2Fpackages-blue?logo=github)](https://github.com/GameCP/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/badge/npm-%40gamecp-red?logo=npm)](https://www.npmjs.com/org/gamecp)

> Official TypeScript developer kit for building GameCP extensions

Monorepo for GameCP extension development tools and type definitions.

## Packages

### [@gamecp/types](./types)
TypeScript type definitions for GameCP extensions. Provides complete type safety for extension development.

**Install:** `npm install @gamecp/types`

### [@gamecp/cli](./cli)
Command-line interface for creating, building, and validating GameCP extensions.

**Install:** `npm install -g @gamecp/cli`

### [@gamecp/manifest](./manifest)
Manifest validation and utilities for GameCP extensions.

**Install:** `npm install @gamecp/manifest`

## Quick Start

### For Extension Developers

```bash
# Install the CLI globally
npm install -g @gamecp/cli

# Create a new extension
gamecp init my-awesome-extension
cd my-awesome-extension

# Install dependencies
npm install

# Start development
npm run dev
```

### For Contributors

```bash
# Clone the repo
git clone <repo-url>
cd gamecpv3

# Install all dependencies
npm install

# Build all packages
npm run build

# Watch mode for development
npm run dev
```

## Development Workflow

This monorepo uses npm workspaces for managing multiple packages:

- **`packages/types`** - Core TypeScript definitions
- **`packages/cli`** - CLI tooling
- **`packages/manifest`** - Validation utilities

### Building Packages

```bash
# Build all packages
npm run build --workspaces

# Build specific package
npm run build --workspace=@gamecp/types
```

### Testing Changes Locally

When developing the packages, you can test them locally in extensions:

```bash
# In your extension directory
npm link @gamecp/types
npm link @gamecp/cli
npm link @gamecp/manifest
```

## Publishing

Each package is published independently to npm under the `@gamecp` scope:

```bash
# From each package directory
cd packages/types
npm version patch  # or minor, major
npm publish

cd ../cli
npm version patch
npm publish

cd ../manifest
npm version patch
npm publish
```

## Package Dependencies

```
@gamecp/cli
  ├── @gamecp/types
  └── @gamecp/manifest
      └── @gamecp/types
```

## License

MIT
