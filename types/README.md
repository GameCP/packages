# @gamecp/types

TypeScript type definitions for GameCP extensions.

## Installation

```bash
npm install @gamecp/types
```

## Usage

```typescript
import type { Extension, ExtensionContext, CronEvent } from '@gamecp/types';

const extension: Extension = {
  async onLoad(context: ExtensionContext) {
    context.logger.info('Extension loaded!');
  },

  async onCron(event: CronEvent, context: ExtensionContext) {
    const servers = await context.server?.getInfo();
    context.logger.info('Cron tick', { servers });
  }
};

export default extension;
```

## Type Definitions

### Core Types

- **`Extension`** - Main extension interface with lifecycle hooks
- **`ExtensionContext`** - Runtime context available to extensions
- **`ExtensionManifest`** - Schema for `gamecp.json` manifest file

### Events

- **`CronEvent`** - Cron schedule execution
- **`ServerEvent`** - Server lifecycle events
- **`PlayerEvent`** - Player join/leave events
- **`ConsoleOutputEvent`** - Server console output

### APIs

- **`ServerAPI`** - Server control methods (restart, sendCommand, etc.)
- **`Storage`** - Persistent key-value storage
- **`Logger`** - Structured logging

## Manifest Schema

```typescript
import type { ExtensionManifest } from '@gamecp/types';

const manifest: ExtensionManifest = {
  id: 'my-extension',
  name: 'My Extension',
  version: '1.0.0',
  description: 'Does something cool',
  author: {
    name: 'Your Name'
  },
  main: 'dist/index.js',
  permissions: ['server:read', 'server:control'],
  cron: [
    {
      expression: '*/5 * * * *',
      description: 'Run every 5 minutes'
    }
  ]
};
```

## License

MIT
