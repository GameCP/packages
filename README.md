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

## Release Automation

### Using npm Scripts (Easiest)

```bash
# Release all packages with patch bump
npm run release:patch

# Release all packages with minor bump
npm run release:minor

# Release all packages with major bump
npm run release:major

# Release individual packages
npm run release:types
npm run release:manifest
npm run release:cli

# Update versions without publishing
npm run update:patch
npm run update:minor
npm run update:major

# Build packages
npm run build:all
npm run build:types
npm run build:manifest
npm run build:cli

# Publish manually
npm run publish:all
npm run publish:types
npm run publish:manifest
npm run publish:cli
```

### Using Scripts Directly

Use the automated release script to version, build, and publish packages:

```bash
# Release all packages with patch version bump
./release.sh patch

# Release all packages with minor version bump
./release.sh minor

# Release all packages with major version bump
./release.sh major

# Release specific packages only
./release.sh patch types cli
./release.sh minor manifest
```

The script will:
1. ✅ Bump versions
2. ✅ Build packages
3. ✅ Commit changes
4. ✅ Publish to npm (in dependency order)
5. ✅ Create git tags
6. ✅ Push to GitHub

### Update Versions Only

To bump versions without publishing:

```bash
# Update all packages
./update-versions.sh patch

# Update specific packages
./update-versions.sh minor types cli
```

This is useful for testing before publishing.

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
