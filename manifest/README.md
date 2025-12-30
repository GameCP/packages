# @gamecp/manifest

Manifest validation and utilities for GameCP extensions.

## Installation

```bash
npm install @gamecp/manifest
```

## Usage

### Validate a Manifest

```typescript
import { validateManifest } from '@gamecp/manifest';

const manifest = {
  id: 'my-extension',
  name: 'My Extension',
  version: '1.0.0',
  description: 'Does something cool',
  author: { name: 'Your Name' },
  main: 'dist/index.js',
  permissions: ['server:read']
};

const result = validateManifest(manifest);

if (result.valid) {
  console.log('Manifest is valid!');
} else {
  console.error('Validation errors:', result.errors);
}

if (result.warnings) {
  console.warn('Warnings:', result.warnings);
}
```

### Type Guard

```typescript
import { isValidManifest } from '@gamecp/manifest';
import type { ExtensionManifest } from '@gamecp/types';

const data = JSON.parse(manifestJson);

if (isValidManifest(data)) {
  // TypeScript now knows data is ExtensionManifest
  console.log(data.name);
}
```

## Validation Rules

### Required Fields

- `id` - Lowercase alphanumeric with hyphens
- `name` - Display name
- `version` - Semantic version (e.g., 1.0.0)
- `description` - Brief description
- `author.name` - Author name
- `main` - Entry point file path

### Optional Fields

- `permissions` - Array of valid permission strings
- `cron` - Array of cron schedules with valid expressions
- `ui` - Array of UI injection points
- `settings` - Array of setting definitions
- `icon` - Icon URL or path
- `homepage` - Homepage URL
- `repository` - Repository URL
- `license` - License identifier

## Valid Permissions

- `server:read` - Read server information
- `server:write` - Write server data
- `server:control` - Control server (start/stop/restart)
- `server:files` - Access server files
- `server:console` - Access server console
- `tenant:read` - Read tenant information
- `tenant:write` - Write tenant data
- `user:read` - Read user information
- `network:request` - Make network requests

## License

MIT
