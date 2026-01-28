'use client';

import React from 'react';
import type { IconType } from 'react-icons';

interface FormGroupHeaderProps {
  /** Title of the form group */
  title: string;
  /** Optional icon displayed before the title */
  icon?: IconType;
  /** Optional description shown below the title */
  description?: string;
  /** Child form elements to render below the header */
  children: React.ReactNode;
  /** Number of columns for the grid layout (1 or 2). Default: 2 */
  cols?: 1 | 2;
}

/**
 * FormGroupHeader - A reusable header component for grouping related form fields.
 * Provides consistent styling with an optional icon, title, description, and grid layout for children.
 *
 * @example
 * ```tsx
 * <FormGroupHeader title="Image Settings" icon={RiSettingsLine}>
 *     <FormInput label="Setting 1" ... />
 *     <FormInput label="Setting 2" ... />
 * </FormGroupHeader>
 *
 * <FormGroupHeader title="Volume Mappings" icon={RiFolderLine} cols={1}>
 *     <VolumeEditor ... />
 * </FormGroupHeader>
 *
 * <FormGroupHeader
 *     title="Command Line Groups"
 *     icon={RiTerminalLine}
 *     description="Create predefined argument presets for quick switching."
 *     cols={1}
 * >
 *     <CommandLineGroupEditor ... />
 * </FormGroupHeader>
 * ```
 */
export default function FormGroupHeader({
  title,
  icon: Icon,
  description,
  children,
  cols = 2,
}: FormGroupHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div
        className={
          cols === 1 ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'
        }
      >
        {children}
      </div>
    </div>
  );
}
