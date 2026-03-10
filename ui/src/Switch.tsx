'use client';

import React from 'react';

export type SwitchVariant =
  | 'default'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'embedded';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode | string;
  description?: React.ReactNode | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: SwitchVariant;
  tooltipId?: string;
  tooltipContent?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = '',
  size = 'md',
  variant = 'default',
  labelPosition = 'right',
  tooltipId,
  tooltipContent,
}: SwitchProps & { labelPosition?: 'left' | 'right' }) {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  // Generate unique IDs for accessibility
  const switchId = React.useId();
  const labelId = label ? `${switchId}-label` : undefined;
  const descriptionId = description ? `${switchId}-description` : undefined;

  const sizes = {
    sm: { track: 'w-8 h-[18px]', thumb: 'w-3.5 h-3.5', translate: 'translate-x-[14px]' },
    md: { track: 'w-[44px] h-[24px]', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-[56px] h-[32px]', thumb: 'w-7 h-7', translate: 'translate-x-[24px]' },
  };

  const variants = {
    default: {
      checked: 'bg-primary/60',
      unchecked: 'bg-muted-foreground/20',
      ring: 'focus:ring-primary',
    },
    success: {
      checked: 'bg-success/60',
      unchecked: 'bg-muted-foreground/20',
      ring: 'focus:ring-success',
    },
    danger: {
      checked: 'bg-destructive/60',
      unchecked: 'bg-muted-foreground/20',
      ring: 'focus:ring-destructive',
    },
    warning: {
      checked: 'bg-warning/60',
      unchecked: 'bg-muted-foreground/20',
      ring: 'focus:ring-warning',
    },
    info: {
      checked: 'bg-info/60',
      unchecked: 'bg-muted-foreground/20',
      ring: 'focus:ring-info',
    },
    embedded: {
      checked: 'bg-success/60',
      unchecked: 'bg-muted-foreground/20',
      ring: 'focus:ring-success',
    },
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  const LabelContent = (
    <div
      className={`${labelPosition === 'left' ? 'mr-3 flex-1 text-left' : 'ml-3 w-fit'} flex flex-col justify-center gap-1`}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={switchId}
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          {label}
        </label>
      )}
      {description && (
        <p id={descriptionId} className="text-xs text-muted-foreground leading-snug">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <div
      className={`flex items-center ${labelPosition === 'left' ? 'justify-between' : ''} ${className}`}
    >
      {labelPosition === 'left' && (label || description) && LabelContent}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        disabled={disabled}
        onClick={toggle}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipContent}
        className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${currentVariant.ring} focus:ring-offset-2
          ${checked ? `${currentVariant.checked} border-transparent` : `${currentVariant.unchecked} border-muted-foreground/30`}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${currentSize.track}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${checked ? currentSize.translate : 'translate-x-0'}
            ${currentSize.thumb}
          `}
        />
      </button>

      {labelPosition === 'right' && (label || description) && LabelContent}
    </div>
  );
}
