'use client';

import { DropDownArrow } from '../../DropDown';

interface VariableTriggerProps {
    /** Current value */
    value?: string;
    /** Handle value change (for typing) */
    onChange?: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the input is read-only (only dropdown selection) */
    readOnly?: boolean;
    /** Whether dropdown is open */
    isOpen?: boolean;
    /** Whether trigger is disabled */
    disabled?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * Variable input trigger - input field + dropdown arrow
 * Used for PortEditor/VolumeEditor variable selectors
 */
export default function VariableTrigger({
    value = '',
    onChange,
    placeholder = 'Enter variable...',
    readOnly = false,
    isOpen = false,
    disabled = false,
    className = '',
}: VariableTriggerProps) {
    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                value={value}
                onChange={e => onChange?.(e.target.value)}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                className={`
          form-input text-sm pr-8 w-full
          ${readOnly || disabled ? 'bg-muted cursor-not-allowed' : ''}
        `}
            />
            {!readOnly && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 p-1">
                    <DropDownArrow
                        isOpen={isOpen}
                        disabled={disabled}
                        size="sm"
                        color="gray"
                    />
                </div>
            )}
        </div>
    );
}
