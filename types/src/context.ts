/**
 * GameCP Extension Runtime Context
 * This is the actual API available to extensions at runtime
 */

export interface ExtensionContext {
  /** HTTP request object */
  request: {
    body: Record<string, any>;
    query: Record<string, any>;
    headers: Record<string, string>;
    method: string;
    path: string;
  };
  
  /** Database access */
  db: DatabaseClient;
  
  /** HTTP client for making external requests */
  http: HttpClient;
  
  /** Extension configuration from gamecp.json */
  config: Record<string, any>;
  
  /** Logger instance */
  logger: Logger;
  
  /** Instance control methods (when available) */
  instance?: {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    restart: () => Promise<void>;
    sendCommand: (command: string) => Promise<void>;
    deleteFile: (path: string) => Promise<void>;
  };
}

export interface DatabaseClient {
  /** Get a collection */
  collection(name: string): Collection;
}

export interface Collection {
  /** Insert a single document */
  insertOne(doc: any): Promise<{ insertedId: any }>;
  
  /** Insert multiple documents */
  insertMany(docs: any[]): Promise<{ insertedIds: any[] }>;
  
  /** Find documents */
  find(query: any): FindCursor;
  
  /** Find one document */
  findOne(query: any): Promise<any | null>;
  
  /** Update one document */
  updateOne(query: any, update: any): Promise<{ modifiedCount: number }>;
  
  /** Update multiple documents */
  updateMany(query: any, update: any): Promise<{ modifiedCount: number }>;
  
  /** Delete one document */
  deleteOne(query: any): Promise<{ deletedCount: number }>;
  
  /** Delete multiple documents */
  deleteMany(query: any): Promise<{ deletedCount: number }>;
  
  /** Count documents */
  countDocuments(query?: any): Promise<number>;
}

export interface FindCursor {
  /** Convert cursor to array */
  toArray(): Promise<any[]>;
  
  /** Limit results */
  limit(count: number): FindCursor;
  
  /** Skip results */
  skip(count: number): FindCursor;
  
  /** Sort results */
  sort(sort: any): FindCursor;
}

export interface HttpClient {
  /** Make GET request */
  get(url: string, config?: HttpConfig): Promise<HttpResponse>;
  
  /** Make POST request */
  post(url: string, data?: any, config?: HttpConfig): Promise<HttpResponse>;
  
  /** Make PUT request */
  put(url: string, data?: any, config?: HttpConfig): Promise<HttpResponse>;
  
  /** Make DELETE request */
  delete(url: string, config?: HttpConfig): Promise<HttpResponse>;
  
  /** Make PATCH request */
  patch(url: string, data?: any, config?: HttpConfig): Promise<HttpResponse>;
}

export interface HttpConfig {
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, any>;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
}

export interface Logger {
  /** Log info message */
  info(message: string, meta?: any): void;
  
  /** Log warning message */
  warn(message: string, meta?: any): void;
  
  /** Log error message */
  error(message: string, meta?: any): void;
  
  /** Log debug message */
  debug(message: string, meta?: any): void;
}

/**
 * API Route Handler
 * Handlers for custom API routes defined in gamecp.json
 */
export type ApiRouteHandler = (ctx: ExtensionContext) => Promise<ApiResponse> | ApiResponse;

export interface ApiResponse {
  status: number;
  body: any;
  headers?: Record<string, string>;
}

/**
 * Event Handler
 * Handlers for server events defined in gamecp.json
 */
export type EventHandler = (
  event: string,
  payload: any,
  ctx: ExtensionContext
) => Promise<void> | void;
