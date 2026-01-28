'use client';

import { RiCheckLine } from 'react-icons/ri';
import type { DropdownItem as DropdownItemType } from './types';

interface DropdownItemProps {
    item: DropdownItemType;
    selected?: boolean;
    multiple?: boolean;
    onClick: () => void;
}

/**
 * Single dropdown item renderer
 * Supports icon, label, description, and selection state
 */
export default function DropdownItem({
    item,
    selected = false,
    multiple = false,
    onClick,
}: DropdownItemProps) {
    const { label, description, icon, disabled, variant = 'default', example } = item;

    // Variant-based styling
    const variantClasses = {
        default: 'text-foreground hover:bg-muted/50',
        danger: 'text-danger hover:bg-danger/10',
        success: 'text-success hover:bg-success/10',
        warning: 'text-warning hover:bg-warning/10',
    };

    const baseClasses = `
    w-full px-3 py-2 text-left text-sm transition-colors
    flex items-start gap-3
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${selected && !multiple ? 'bg-primary text-primary-foreground' : variantClasses[variant]}
  `;

    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={baseClasses}
            role="option"
            aria-selected={selected}
        >
            {/* Checkbox for multi-select */}
            {multiple && (
                <div
                    className={`
            mt-0.5 w-4 h-4 rounded border flex-shrink-0
            flex items-center justify-center
            ${selected ? 'bg-primary border-primary' : 'border-input'}
          `}
                >
                    {selected && <RiCheckLine className="w-3 h-3 text-primary-foreground" />}
                </div>
            )}

            {/* Icon */}
            {icon && (
                <div className={`mt-0.5 flex-shrink-0 ${selected && !multiple ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                    {icon}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Label */}
                <div className={`font-medium ${selected && !multiple ? 'text-primary-foreground' : ''}`}>
                    {label}
                </div>

                {/* Description */}
                {description && (
                    <div className={`text-xs mt-0.5 ${selected && !multiple ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {description}
                    </div>
                )}

                {/* Example (for variable inputs) */}
                {example && (
                    <div className={`text-xs mt-0.5 ${selected && !multiple ? 'text-primary-foreground/60' : 'text-secondary-foreground'}`}>
                        {example}
                    </div>
                )}
            </div>

            {/* Checkmark for single select */}
            {selected && !multiple && (
                <RiCheckLine className="w-4 h-4 flex-shrink-0 text-primary-foreground" />
            )}
        </button>
    );
}
