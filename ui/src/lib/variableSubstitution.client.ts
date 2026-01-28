// Client-safe Variable Substitution Utilities
// This file contains only pure functions that can be safely used in client components
// Server-side functions with database/encryption dependencies are in variableSubstitution.ts

// UI-related types and constants
export interface PredefinedVariable {
  key: string;
  name: string;
  description: string;
  example: string;
  category: 'server' | 'network' | 'game' | 'system';
}

// Predefined variables available for use in environment variables
export const PREDEFINED_VARIABLES: PredefinedVariable[] = [
  // Network variables
  {
    key: 'PORT',
    name: 'Primary Port',
    description: 'The primary port assigned to this game server',
    example: '25565',
    category: 'network',
  },
  {
    key: 'SERVER_PORT',
    name: 'Server Port (Alias)',
    description:
      'Alias for PORT - some game servers use SERVER_PORT instead of PORT',
    example: '25565',
    category: 'network',
  },
  {
    key: 'IP',
    name: 'Bind IP',
    description:
      'Bind address for the server (always 0.0.0.0 for Docker compatibility)',
    example: '0.0.0.0',
    category: 'network',
  },
  {
    key: 'SERVER_IP',
    name: 'Bind IP (Alias)',
    description: 'Alias for IP - bind address for the server',
    example: '0.0.0.0',
    category: 'network',
  },
  {
    key: 'INTERNAL_IP',
    name: 'Internal IP',
    description: 'The internal/private IP address assigned to this game server',
    example: '192.168.1.100',
    category: 'network',
  },
  {
    key: 'EXTERNAL_IP',
    name: 'External IP',
    description: 'The external/public IP address for players to connect',
    example: '203.0.113.50',
    category: 'network',
  },
  {
    key: 'PUBLIC_IP',
    name: 'Public IP (Alias)',
    description: 'Alias for EXTERNAL_IP - the public IP address for players',
    example: '203.0.113.50',
    category: 'network',
  },
  {
    key: 'RCON_PORT',
    name: 'RCON Port',
    description:
      'The RCON port (if multiple ports are assigned, uses the second port)',
    example: '25575',
    category: 'network',
  },
  {
    key: 'QUERY_PORT',
    name: 'Query Port',
    description: 'The query port (same as primary port by default)',
    example: '25565',
    category: 'network',
  },

  // Server variables
  {
    key: 'MAX_PLAYERS',
    name: 'Max Players',
    description: 'Maximum number of players allowed on the server',
    example: '20',
    category: 'game',
  },
  {
    key: 'SERVER_ID',
    name: 'Server ID',
    description: 'Unique identifier for this game server instance',
    example: 'minecraft-1234567890-abc123',
    category: 'server',
  },
  {
    key: 'SERVER_NAME',
    name: 'Server Name',
    description: 'The display name of this game server',
    example: 'My Minecraft Server',
    category: 'server',
  },
  {
    key: 'GAME_ID',
    name: 'Game ID',
    description: 'The type of game this server is running',
    example: 'minecraft',
    category: 'game',
  },
  {
    key: 'NODE_ID',
    name: 'Node ID',
    description: 'The ID of the node this server is running on',
    example: '507f1f77bcf86cd799439011',
    category: 'system',
  },
  {
    key: 'TENANT_ID',
    name: 'Tenant ID',
    description: 'The tenant this server belongs to',
    example: '507f1f77bcf86cd799439012',
    category: 'system',
  },

  // Resource limit variables
  {
    key: 'CPU_LIMIT',
    name: 'CPU Limit',
    description: 'CPU limit for the game server container',
    example: '2.0',
    category: 'system',
  },
  {
    key: 'MEMORY_LIMIT',
    name: 'Memory Limit',
    description: 'Memory limit for the game server container',
    example: '4g',
    category: 'system',
  },
  {
    key: 'DISK_LIMIT',
    name: 'Disk Limit',
    description: 'Disk space limit for the game server container',
    example: '20g',
    category: 'system',
  },
  {
    key: 'NETWORK_LIMIT',
    name: 'Network Limit',
    description: 'Network bandwidth limit for the game server container',
    example: '100m',
    category: 'system',
  },
  {
    key: 'USER_ID',
    name: 'Owner User ID',
    description: 'The ID of the user who owns this server',
    example: '507f1f77bcf86cd799439013',
    category: 'system',
  },
  {
    key: 'RANDOMSTRING',
    name: 'Random String',
    description: 'A random 12-character string for passwords and tokens',
    example: 'aB3xY9mK2pQ7',
    category: 'system',
  },
];

/**
 * Get variables grouped by category for UI display
 */
export function getVariablesByCategory(): Record<string, PredefinedVariable[]> {
  const grouped: Record<string, PredefinedVariable[]> = {};

  for (const variable of PREDEFINED_VARIABLES) {
    if (!grouped[variable.category]) {
      grouped[variable.category] = [];
    }
    grouped[variable.category].push(variable);
  }

  return grouped;
}

/**
 * Format a variable for display in UI (with ${} syntax)
 */
export function formatVariableForDisplay(key: string): string {
  // If the key already has ${} syntax, return it as is
  if (key.startsWith('${') && key.endsWith('}')) {
    return key;
  }
  // Otherwise, wrap it with ${}
  return `\${${key}}`;
}

/**
 * Parse a variable from display format (remove ${} syntax)
 */
export function parseVariableFromDisplay(formatted: string): string {
  return formatted.replace(/^\$\{|\}$/g, '');
}

/**
 * Get variable info by key
 */
export function getVariableInfo(key: string): PredefinedVariable | undefined {
  return PREDEFINED_VARIABLES.find(v => v.key === key);
}

// Client-safe context type (no mongoose dependencies)
export interface ClientVariableContext {
  serverId?: string;
  gameId?: string;
  nodeId?: string;
  assignedPorts?: Array<{
    host: number;
    container: number;
    protocol?: 'tcp' | 'udp' | 'both';
    variable?: string;
  }>;
  serverName?: string;
  tenantId?: string;
  userId?: string;
  maxPlayers?: number | string;
  environment?: Record<string, string>;
  resourceLimits?: {
    cpuLimit?: string;
    memoryLimit?: string;
    diskLimit?: string;
    networkLimit?: string;
  };
}

/**
 * Generate a random string for RANDOMSTRING variable
 */
function generateRandomString(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get variable value from context (client-safe version)
 */
function getVariableValue(
  key: string,
  context: ClientVariableContext
): string | number | undefined {
  // Helper function to find port by variable name
  const findPortByVariable = (variableName: string) => {
    return context.assignedPorts?.find(
      port =>
        port.variable === variableName ||
        port.variable === `\${${variableName}}`
    );
  };

  // Helper function to find primary port (PORT variable or first port)
  const findPrimaryPort = () => {
    return (
      context.assignedPorts?.find(
        port => port.variable === 'PORT' || port.variable === '${PORT}'
      ) || context.assignedPorts?.[0]
    );
  };

  switch (key) {
    case 'PORT':
    case 'SERVER_PORT':
      const primaryPort = findPrimaryPort();
      return primaryPort?.host || primaryPort?.container;
    case 'IP':
    case 'SERVER_IP':
      return '0.0.0.0';
    case 'INTERNAL_IP':
    case 'EXTERNAL_IP':
    case 'PUBLIC_IP':
      return '0.0.0.0'; // Client-side can't resolve actual IPs
    case 'RCON_PORT':
      const rconPort = findPortByVariable('RCON_PORT');
      return rconPort?.host || rconPort?.container || findPrimaryPort()?.host;
    case 'QUERY_PORT':
      const queryPort = findPortByVariable('QUERY_PORT');
      return queryPort?.host || queryPort?.container || findPrimaryPort()?.host;
    case 'SERVER_ID':
      return context.serverId;
    case 'SERVER_NAME':
      return context.serverName;
    case 'GAME_ID':
      return context.gameId;
    case 'NODE_ID':
      return context.nodeId;
    case 'TENANT_ID':
      return context.tenantId;
    case 'USER_ID':
      return context.userId;
    case 'MAX_PLAYERS':
      return context.maxPlayers ?? context.environment?.['MAX_PLAYERS'];
    case 'CPU_LIMIT':
      return context.resourceLimits?.cpuLimit;
    case 'MEMORY_LIMIT':
      return context.resourceLimits?.memoryLimit;
    case 'DISK_LIMIT':
      return context.resourceLimits?.diskLimit;
    case 'NETWORK_LIMIT':
      return context.resourceLimits?.networkLimit;
    case 'RANDOMSTRING':
      return generateRandomString();
    default:
      // Check if it's a custom port variable
      const customPort = findPortByVariable(key);
      if (customPort) {
        return customPort.host || customPort.container;
      }
      // Check if it's an environment variable
      if (context.environment && key in context.environment) {
        return context.environment[key];
      }
      return undefined;
  }
}

/**
 * Substitute variables in a string with actual values (client-safe version)
 */
export function substituteVariables(
  text: string,
  context: ClientVariableContext
): string {
  if (typeof text !== 'string') {
    return String(text);
  }

  // First, handle escaped variables (\${VAR} becomes ${VAR})
  let processedText = text.replace(/\\\$\{([A-Z_]+)\}/g, '$${$1}');

  // Then, handle regular variable substitution
  return processedText.replace(
    /\$\{([A-Z_][A-Z0-9_]*)\}/g,
    (match, variableKey) => {
      const value = getVariableValue(variableKey, context);
      if (value === undefined) {
        return match;
      }
      return String(value);
    }
  );
}

/**
 * Substitute variables in an array of arguments
 */
export function substituteArgumentVariables(
  args: string[],
  context: ClientVariableContext
): string[] {
  return args.map(arg => substituteVariables(arg, context));
}
