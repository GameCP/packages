/**
 * GameCP Extension Events
 * Event types and handlers for extension lifecycle
 */

import { ExtensionContext, ServerInfo, ServerStatus } from './context';

export interface ExtensionEvents {
  /** Called when extension is loaded */
  onLoad?(context: ExtensionContext): void | Promise<void>;
  
  /** Called when extension is unloaded */
  onUnload?(context: ExtensionContext): void | Promise<void>;
  
  /** Called on cron tick */
  onCron?(event: CronEvent, context: ExtensionContext): void | Promise<void>;
  
  /** Called when server starts */
  onServerStart?(event: ServerEvent, context: ExtensionContext): void | Promise<void>;
  
  /** Called when server stops */
  onServerStop?(event: ServerEvent, context: ExtensionContext): void | Promise<void>;
  
  /** Called when server crashes */
  onServerCrash?(event: ServerCrashEvent, context: ExtensionContext): void | Promise<void>;
  
  /** Called when server status changes */
  onServerStatusChange?(event: ServerStatusChangeEvent, context: ExtensionContext): void | Promise<void>;
  
  /** Called when player joins */
  onPlayerJoin?(event: PlayerEvent, context: ExtensionContext): void | Promise<void>;
  
  /** Called when player leaves */
  onPlayerLeave?(event: PlayerEvent, context: ExtensionContext): void | Promise<void>;
  
  /** Called when console output is received */
  onConsoleOutput?(event: ConsoleOutputEvent, context: ExtensionContext): void | Promise<void>;
}

export interface CronEvent {
  /** Cron expression that triggered */
  expression: string;
  
  /** Timestamp of execution */
  timestamp: Date;
  
  /** Scheduled execution time */
  scheduledTime: Date;
}

export interface ServerEvent {
  /** Server information */
  server: ServerInfo;
  
  /** Event timestamp */
  timestamp: Date;
}

export interface ServerCrashEvent extends ServerEvent {
  /** Crash reason/error */
  reason?: string;
  
  /** Exit code */
  exitCode?: number;
  
  /** Last console lines before crash */
  lastOutput?: string[];
}

export interface ServerStatusChangeEvent extends ServerEvent {
  /** Previous status */
  previousStatus: ServerStatus['status'];
  
  /** New status */
  newStatus: ServerStatus['status'];
}

export interface PlayerEvent extends ServerEvent {
  /** Player information */
  player: {
    name: string;
    uuid?: string;
    ip?: string;
  };
}

export interface ConsoleOutputEvent extends ServerEvent {
  /** Console output line */
  line: string;
  
  /** Output type */
  type: 'stdout' | 'stderr';
}

/**
 * Extension entry point
 * Extensions should export a default object implementing this interface
 */
export interface Extension extends ExtensionEvents {
  /** Extension metadata (optional, can be in manifest only) */
  metadata?: {
    name: string;
    version: string;
    description?: string;
  };
}
