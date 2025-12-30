/**
 * GameCP Extension Manifest Schema
 * Defines the structure of gamecp.json
 */

export interface ExtensionManifest {
  /** Unique identifier for the extension (kebab-case) */
  id: string;
  
  /** Display name of the extension */
  name: string;
  
  /** Semantic version (e.g., "1.0.0") */
  version: string;
  
  /** Brief description of the extension */
  description: string;
  
  /** Extension author information */
  author: {
    name: string;
    email?: string;
    url?: string;
  };
  
  /** Extension icon URL or path */
  icon?: string;
  
  /** Main entry point file (relative to extension root) */
  main: string;
  
  /** Required GameCP version (semver range) */
  gamecpVersion?: string;
  
  /** Extension permissions */
  permissions?: ExtensionPermission[];
  
  /** Cron schedule expressions */
  cron?: CronSchedule[];
  
  /** UI injection points */
  ui?: UIInjection[];
  
  /** Extension settings schema */
  settings?: SettingDefinition[];
  
  /** Extension dependencies */
  dependencies?: Record<string, string>;
  
  /** Extension homepage URL */
  homepage?: string;
  
  /** Repository URL */
  repository?: string;
  
  /** License identifier */
  license?: string;
  
  /** Extension tags/categories */
  tags?: string[];
}

export type ExtensionPermission =
  | 'server:read'
  | 'server:write'
  | 'server:control'
  | 'server:files'
  | 'server:console'
  | 'tenant:read'
  | 'tenant:write'
  | 'user:read'
  | 'network:request';

export interface CronSchedule {
  /** Cron expression (e.g., every 5 minutes) */
  expression: string;
  
  /** Human-readable description */
  description?: string;
  
  /** Timezone for the schedule */
  timezone?: string;
}

export interface UIInjection {
  /** Where to inject the UI component */
  location: UILocation;
  
  /** Component file path (relative to extension root) */
  component: string;
  
  /** Display label */
  label?: string;
  
  /** Icon for the UI element */
  icon?: string;
  
  /** Order/priority for rendering */
  order?: number;
}

export type UILocation =
  | 'server:overview'
  | 'server:sidebar'
  | 'server:actions'
  | 'server:settings'
  | 'tenant:dashboard'
  | 'tenant:settings'
  | 'user:profile';

export interface SettingDefinition {
  /** Setting key */
  key: string;
  
  /** Display label */
  label: string;
  
  /** Setting type */
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea';
  
  /** Default value */
  default?: any;
  
  /** Help text */
  description?: string;
  
  /** Is this setting required? */
  required?: boolean;
  
  /** Options for select type */
  options?: Array<{ label: string; value: string | number }>;
  
  /** Validation pattern (regex) */
  pattern?: string;
  
  /** Minimum value (for numbers) */
  min?: number;
  
  /** Maximum value (for numbers) */
  max?: number;
}
