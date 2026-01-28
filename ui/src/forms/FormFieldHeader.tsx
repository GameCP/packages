'use client';

import React from 'react';

interface FormFieldHeaderProps {
  /** Field label text */
  label: string;
  /** Optional description text */
  description?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Size variant affecting text sizes */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className for the container */
  className?: string;
  /** htmlFor attribute for the label */
  htmlFor?: string;
}

/**
 * FormFieldHeader - Reusable label + description component for form fields
 *
 * Provides consistent styling for field headers across the application
 * with optional size variants and required indicator.
 *
 * @example
 * ```tsx
 * <FormFieldHeader
 *   label="Environments"
 *   description="Select an environment to make its variables available."
 *   size="md"
 * />
 * <Select ... />
 * ```
 */
export default function FormFieldHeader({
  label,
  description,
  required = false,
  size = 'md',
  className = '',
  htmlFor,
}: FormFieldHeaderProps) {
  const sizeStyles = {
    sm: {
      label: 'text-xs font-medium',
      description: 'text-xs',
      gap: 'space-y-0',
    },
    md: {
      label: 'text-sm font-medium',
      description: 'text-sm',
      gap: 'space-y-0',
    },
    lg: {
      label: 'text-base font-medium',
      description: 'text-sm',
      gap: 'space-y-0',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={`${styles.gap} ${className}`}>
      <label htmlFor={htmlFor} className={`${styles.label} text-foreground`}>
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {description && (
        <p className={`${styles.description} text-muted-foreground`}>
          {description}
        </p>
      )}
    </div>
  );
}
