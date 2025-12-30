/**
 * @gamecp/types
 * TypeScript type definitions for GameCP extensions
 */

// Re-export all types
export * from './manifest';
export * from './context';
export * from './events';

// Convenience type for extension entry point
export type { Extension } from './events';
export type { ExtensionManifest } from './manifest';
export type { ExtensionContext } from './context';
