'use client';

import { RiCheckLine } from 'react-icons/ri';
import type { DropdownItem as DropdownItemType } from './types';

interface DropdownItemProps {
    item: DropdownItemType;
    selected?: boolean;
    multiple?: boolean;
    onClick: () => void;
    focused?: boolean;
    itemId?: string;
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
    focused = false,
    itemId,
}: DropdownItemProps) {
    const { label, description, icon, disabled, variant = 'default', example } = item;

    // Resolve icon and description - they can be functions that receive selection state
    const resolvedIcon = typeof icon === 'function' ? icon(selected) : icon;
    const resolvedDescription = typeof description === 'function' ? description(selected) : description;

    // Variant-based styling
    const variantClasses = {
        default: 'text-foreground hover:bg-muted/50',
        danger: 'text-danger hover:bg-danger/10',
        success: 'text-success hover:bg-success/10',
        warning: 'text-warning hover:bg-warning/10',
    };

    const baseClasses = `
    w-full px-3 py-2 text-left text-sm transition-colors
    flex items-start gap-3 border-b border-border/30 last:border-b-0
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${selected && !multiple ? 'bg-primary text-primary-foreground' : variantClasses[variant]}
    ${focused && !selected ? 'bg-muted/70 ring-2 ring-primary/50 ring-inset' : ''}
    ${focused && selected ? 'brightness-110 ring-2 ring-primary-foreground/30' : ''}
  `;

    return (
        <button
            type="button"
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={baseClasses}
            role="option"
            aria-selected={selected}
            aria-disabled={disabled}
            id={itemId}
            tabIndex={-1}
        >
            {/* Checkbox for multi-select */}
            {multiple && (
                <div
                    className={`
            mt-0.5 w-4 h-4 rounded border flex-shrink-0
            flex items-center justify-center
            ${selected ? 'bg-primary border-primary' : 'border-border'}
          `}
                >
                    {selected && <RiCheckLine className="w-3 h-3 text-primary-foreground" />}
                </div>
            )}

            {/* Icon */}
            {resolvedIcon && (
                <div className={`mt-0.5 flex-shrink-0 ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                    {resolvedIcon}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Label */}
                <div className={`font-medium ${selected ? 'text-primary-foreground' : ''}`}>
                    {label}
                </div>

                {/* Description */}
                {resolvedDescription && (
                    <div className={`text-xs mt-0.5 ${selected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {resolvedDescription}
                    </div>
                )}

                {/* Example (for variable inputs) */}
                {example && (
                    <div className={`text-xs mt-0.5 ${selected ? 'text-primary-foreground/60' : 'text-secondary-foreground'}`}>
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
