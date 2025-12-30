/**
 * GameCP Extension Context
 * Available to extensions at runtime
 */

export interface ExtensionContext {
  /** Extension metadata */
  extension: {
    id: string;
    name: string;
    version: string;
  };
  
  /** Tenant information */
  tenant: TenantContext;
  
  /** Extension settings */
  settings: Record<string, any>;
  
  /** Logger instance */
  logger: Logger;
  
  /** Storage API */
  storage: Storage;
  
  /** Server control API (if permission granted) */
  server?: ServerAPI;
}

export interface TenantContext {
  /** Tenant ID */
  id: string;
  
  /** Tenant name */
  name: string;
  
  /** Tenant settings */
  settings?: Record<string, any>;
}

export interface Logger {
  /** Log informational message */
  info(message: string, meta?: Record<string, any>): void;
  
  /** Log warning message */
  warn(message: string, meta?: Record<string, any>): void;
  
  /** Log error message */
  error(message: string, meta?: Record<string, any>): void;
  
  /** Log debug message */
  debug(message: string, meta?: Record<string, any>): void;
}

export interface Storage {
  /** Get a value from storage */
  get<T = any>(key: string): Promise<T | null>;
  
  /** Set a value in storage */
  set<T = any>(key: string, value: T): Promise<void>;
  
  /** Delete a value from storage */
  delete(key: string): Promise<void>;
  
  /** Check if a key exists */
  has(key: string): Promise<boolean>;
  
  /** List all keys */
  keys(): Promise<string[]>;
  
  /** Clear all storage */
  clear(): Promise<void>;
}

export interface ServerAPI {
  /** Get server information */
  getInfo(): Promise<ServerInfo>;
  
  /** Get server status */
  getStatus(): Promise<ServerStatus>;
  
  /** Restart the server */
  restart(): Promise<void>;
  
  /** Start the server */
  start(): Promise<void>;
  
  /** Stop the server */
  stop(): Promise<void>;
  
  /** Send a command to the server console */
  sendCommand(command: string): Promise<void>;
  
  /** Read a file from the server */
  readFile(path: string): Promise<string>;
  
  /** Write a file to the server */
  writeFile(path: string, content: string): Promise<void>;
  
  /** Delete a file from the server */
  deleteFile(path: string): Promise<void>;
  
  /** List files in a directory */
  listFiles(path: string): Promise<FileInfo[]>;
  
  /** Get server console output */
  getConsoleOutput(lines?: number): Promise<string[]>;
}

export interface ServerInfo {
  /** Server ID */
  id: string;
  
  /** Server name */
  name: string;
  
  /** Game type */
  game: string;
  
  /** Server IP address */
  ip: string;
  
  /** Server port */
  port: number;
  
  /** Server version */
  version?: string;
  
  /** Server metadata */
  metadata?: Record<string, any>;
}

export interface ServerStatus {
  /** Current status */
  status: 'online' | 'offline' | 'starting' | 'stopping' | 'crashed';
  
  /** Player count */
  players?: {
    online: number;
    max: number;
  };
  
  /** Resource usage */
  resources?: {
    cpu?: number;
    memory?: number;
    disk?: number;
  };
  
  /** Uptime in seconds */
  uptime?: number;
}

export interface FileInfo {
  /** File name */
  name: string;
  
  /** File path */
  path: string;
  
  /** Is directory? */
  isDirectory: boolean;
  
  /** File size in bytes */
  size?: number;
  
  /** Last modified timestamp */
  modified?: Date;
}
