'use client';

import React from 'react';

export type SwitchVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'embedded';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: React.ReactNode | string;
    description?: React.ReactNode | string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: SwitchVariant;
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
}: SwitchProps) {
    const toggle = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    const sizes = {
        sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
        md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
        lg: { track: 'w-14 h-8', thumb: 'w-7 h-7', translate: 'translate-x-6' },
    };

    const variants = {
        default: {
            checked: 'bg-primary',
            unchecked: 'bg-muted',
            ring: 'focus:ring-primary',
        },
        success: {
            checked: 'bg-success',
            unchecked: 'bg-muted',
            ring: 'focus:ring-success',
        },
        danger: {
            checked: 'bg-destructive',
            unchecked: 'bg-muted',
            ring: 'focus:ring-destructive',
        },
        warning: {
            checked: 'bg-warning',
            unchecked: 'bg-muted',
            ring: 'focus:ring-warning',
        },
        info: {
            checked: 'bg-info',
            unchecked: 'bg-muted',
            ring: 'focus:ring-info',
        },
        embedded: {
            checked: 'bg-success',
            unchecked: 'bg-gray-300 dark:bg-gray-600',
            ring: 'focus:ring-success',
        },
    };

    const currentSize = sizes[size];
    const currentVariant = variants[variant];

    return (
        <div className={`flex items-start ${className}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={toggle}
                className={`
          relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 ${currentVariant.ring} focus:ring-offset-2
          ${checked ? currentVariant.checked : currentVariant.unchecked}
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
            {(label || description) && (
                <div className="ml-3 text-sm leading-6">
                    {label && (
                        <label className="font-medium text-foreground cursor-pointer" onClick={toggle}>
                            {label}
                        </label>
                    )}
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>
            )}
        </div>
    );
}
