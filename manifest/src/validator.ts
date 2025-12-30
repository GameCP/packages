import type { ExtensionManifest, ExtensionPermission } from '@gamecp/types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

const VALID_PERMISSIONS: ExtensionPermission[] = [
  'server:read',
  'server:write',
  'server:control',
  'server:files',
  'server:console',
  'tenant:read',
  'tenant:write',
  'user:read',
  'network:request'
];

const CRON_REGEX = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;

export function validateManifest(manifest: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!manifest.id) {
    errors.push('Missing required field: id');
  } else if (typeof manifest.id !== 'string') {
    errors.push('Field "id" must be a string');
  } else if (!/^[a-z0-9-]+$/.test(manifest.id)) {
    errors.push('Field "id" must be lowercase alphanumeric with hyphens only');
  }

  if (!manifest.name) {
    errors.push('Missing required field: name');
  } else if (typeof manifest.name !== 'string') {
    errors.push('Field "name" must be a string');
  }

  if (!manifest.version) {
    errors.push('Missing required field: version');
  } else if (typeof manifest.version !== 'string') {
    errors.push('Field "version" must be a string');
  } else if (!/^\d+\.\d+\.\d+/.test(manifest.version)) {
    errors.push('Field "version" must follow semver format (e.g., 1.0.0)');
  }

  if (!manifest.description) {
    errors.push('Missing required field: description');
  } else if (typeof manifest.description !== 'string') {
    errors.push('Field "description" must be a string');
  }

  if (!manifest.author) {
    errors.push('Missing required field: author');
  } else if (typeof manifest.author !== 'object') {
    errors.push('Field "author" must be an object');
  } else {
    if (!manifest.author.name) {
      errors.push('Missing required field: author.name');
    } else if (typeof manifest.author.name !== 'string') {
      errors.push('Field "author.name" must be a string');
    }
  }

  if (!manifest.main) {
    errors.push('Missing required field: main');
  } else if (typeof manifest.main !== 'string') {
    errors.push('Field "main" must be a string');
  }

  // Optional fields validation
  if (manifest.permissions) {
    if (!Array.isArray(manifest.permissions)) {
      errors.push('Field "permissions" must be an array');
    } else {
      manifest.permissions.forEach((perm: any, index: number) => {
        if (!VALID_PERMISSIONS.includes(perm)) {
          errors.push(`Invalid permission at index ${index}: "${perm}"`);
        }
      });
    }
  }

  if (manifest.cron) {
    if (!Array.isArray(manifest.cron)) {
      errors.push('Field "cron" must be an array');
    } else {
      manifest.cron.forEach((schedule: any, index: number) => {
        if (!schedule.expression) {
          errors.push(`Missing "expression" in cron schedule at index ${index}`);
        } else if (!CRON_REGEX.test(schedule.expression)) {
          errors.push(`Invalid cron expression at index ${index}: "${schedule.expression}"`);
        }
      });
    }
  }

  if (manifest.ui) {
    if (!Array.isArray(manifest.ui)) {
      errors.push('Field "ui" must be an array');
    } else {
      manifest.ui.forEach((injection: any, index: number) => {
        if (!injection.location) {
          errors.push(`Missing "location" in UI injection at index ${index}`);
        }
        if (!injection.component) {
          errors.push(`Missing "component" in UI injection at index ${index}`);
        }
      });
    }
  }

  if (manifest.settings) {
    if (!Array.isArray(manifest.settings)) {
      errors.push('Field "settings" must be an array');
    } else {
      manifest.settings.forEach((setting: any, index: number) => {
        if (!setting.key) {
          errors.push(`Missing "key" in setting at index ${index}`);
        }
        if (!setting.label) {
          errors.push(`Missing "label" in setting at index ${index}`);
        }
        if (!setting.type) {
          errors.push(`Missing "type" in setting at index ${index}`);
        }
      });
    }
  }

  // Warnings
  if (!manifest.icon) {
    warnings.push('Consider adding an "icon" field for better visibility');
  }

  if (!manifest.homepage && !manifest.repository) {
    warnings.push('Consider adding "homepage" or "repository" for documentation');
  }

  if (!manifest.license) {
    warnings.push('Consider adding a "license" field');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

export function isValidManifest(manifest: any): manifest is ExtensionManifest {
  return validateManifest(manifest).valid;
}
