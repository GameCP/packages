'use client';

import type { ReactNode } from 'react';
import { DropDownArrow } from '../../DropDown';

interface SelectTriggerProps {
    /** Currently selected value label to display */
    selectedLabel?: ReactNode;
    /** Placeholder when nothing selected */
    placeholder?: string;
    /** Optional icon on the left */
    icon?: ReactNode;
    /** Whether dropdown is open */
    isOpen?: boolean;
    /** Whether trigger is disabled */
    disabled?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * Select-style trigger showing selected value with dropdown arrow
 */
export default function SelectTrigger({
    selectedLabel,
    placeholder = 'Select...',
    icon,
    isOpen = false,
    disabled = false,
    className = '',
}: SelectTriggerProps) {
    return (
        <div
            className={`
        form-input flex items-center justify-between gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'}
        ${className}
      `}
        >
            <div className="flex items-center flex-1 min-w-0 gap-2">
                {icon && (
                    <div className="flex-shrink-0 text-muted-foreground">
                        {icon}
                    </div>
                )}
                <span className={`truncate ${selectedLabel ? '' : 'text-muted-foreground'}`}>
                    {selectedLabel || placeholder}
                </span>
            </div>
            <DropDownArrow isOpen={isOpen} disabled={disabled} size="sm" color="gray" />
        </div>
    );
}
