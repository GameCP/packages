/**
 * @gamecp/types
 * TypeScript type definitions for GameCP extensions
 */

// Re-export all types
export * from './manifest';
export * from './context';
export * from './events';
export * from './sdk';
// Note: helpers.ts is CLIENT-SIDE ONLY - import from '@gamecp/types/client'

// Convenience exports
export type { ExtensionManifest } from './manifest';
export type { 
  ExtensionContext, 
  ApiRouteHandler, 
  EventHandler,
  MySQLConfig,
  PostgreSQLConfig,
  RedisConfig,
  MySQLClient,
  PostgreSQLClient,
  RedisClient
} from './context';
export type { ExtensionExports, ServerEvent, TypedEventHandler } from './events';
export type { GameCPSDK, GameCPAPI, GameCPWindow, ButtonProps, CardProps, LinkProps, BadgeProps, FormInputProps, SwitchProps, SelectOption } from './sdk';

