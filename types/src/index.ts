/**
 * @gamecp/types
 * TypeScript type definitions for GameCP extensions
 */

// Re-export all types
export * from './manifest';
export * from './context';
export * from './events';

// Convenience exports
export type { ExtensionManifest } from './manifest';
export type { ExtensionContext, ApiRouteHandler, EventHandler } from './context';
export type { ExtensionExports, ServerEvent, TypedEventHandler } from './events';
