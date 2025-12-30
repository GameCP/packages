/**
 * GameCP Extension Events
 * Real event types based on the actual extension system
 */

import type { ExtensionContext, EventHandler, ApiRouteHandler } from './context';

/**
 * Extension exports
 * What your extension should export
 */
export interface ExtensionExports {
  /** API route handlers */
  [key: string]: ApiRouteHandler | EventHandler | any;
}

/**
 * Server event payloads
 */
export interface ServerCrashPayload {
  serverId: string;
  serverName: string;
  crashReason?: string;
  exitCode?: number;
  timestamp?: Date;
}

export interface ServerStartPayload {
  serverId: string;
  serverName: string;
  timestamp?: Date;
}

export interface ServerStopPayload {
  serverId: string;
  serverName: string;
  timestamp?: Date;
}

export interface PlayerJoinPayload {
  serverId: string;
  serverName: string;
  playerName: string;
  playerUuid?: string;
  playerIp?: string;
  timestamp?: Date;
}

export interface PlayerLeavePayload {
  serverId: string;
  serverName: string;
  playerName: string;
  playerUuid?: string;
  timestamp?: Date;
}

/**
 * Common event types
 */
export type ServerEvent =
  | 'server.status.crash'
  | 'server.status.started'
  | 'server.status.stopped'
  | 'server.player.join'
  | 'server.player.leave'
  | 'server.console.output';

/**
 * Event payload types mapped to event names
 */
export interface EventPayloadMap {
  'server.status.crash': ServerCrashPayload;
  'server.status.started': ServerStartPayload;
  'server.status.stopped': ServerStopPayload;
  'server.player.join': PlayerJoinPayload;
  'server.player.leave': PlayerLeavePayload;
  'server.console.output': { line: string; serverId: string };
}

/**
 * Typed event handler
 */
export type TypedEventHandler<T extends ServerEvent> = (
  event: T,
  payload: EventPayloadMap[T],
  ctx: ExtensionContext
) => Promise<void> | void;
