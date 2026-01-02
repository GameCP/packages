'use client';

import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    description?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Switch({
    checked,
    onChange,
    disabled = false,
    label,
    description,
    className = '',
    size = 'md',
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

    const currentSize = sizes[size];

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
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${checked ? 'bg-primary' : 'bg-muted'}
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
