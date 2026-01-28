'use client';

import type { ReactNode } from 'react';
import { RiFilterLine, RiCloseLine } from 'react-icons/ri';
import SharedTooltip from '../../SharedTooltip';

interface FilterTriggerProps {
    /** Label for the filter */
    label?: string;
    /** Number of selected items */
    count?: number;
    /** Optional icon (defaults to filter icon) */
    icon?: ReactNode;
    /** Whether dropdown is open */
    isOpen?: boolean;
    /** Whether trigger is disabled */
    disabled?: boolean;
    /** Additional className */
    className?: string;
    /** Optional clear handler - shows clear button when count > 0 */
    onClear?: () => void;
}

/**
 * Filter-style trigger with btn-alt styling, count badge, and optional clear button
 */
export default function FilterTrigger({
    label = 'Filter',
    count = 0,
    icon,
    isOpen = false,
    disabled = false,
    className = '',
    onClear,
}: FilterTriggerProps) {
    const hasSelections = count > 0;
    const tooltipId = `filter-${label.toLowerCase().replace(/\s+/g, '-')}-tooltip`;
    const clearTooltipId = `clear-${label.toLowerCase().replace(/\s+/g, '-')}-tooltip`;

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onClear?.();
    };

    return (
        <div className="relative inline-block">
            <button
                type="button"
                disabled={disabled}
                className={`btn-alt btn-md flex items-center space-x-2 relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                data-tooltip-id={tooltipId}
                data-tooltip-content={label}
            >
                {/* Icon */}
                <span className="flex-shrink-0">
                    {icon || <RiFilterLine className="w-4 h-4" />}
                </span>

                {/* Label - hidden on mobile */}
                <span className="hidden sm:inline">{label}</span>

                {/* Count badge */}
                {hasSelections && (
                    <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 min-w-[18px] rounded-full text-center font-medium">
                        {count}
                    </span>
                )}
            </button>

            {/* Clear button - absolute positioned */}
            {hasSelections && onClear && (
                <span
                    onClick={handleClear}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors cursor-pointer z-10"
                    data-tooltip-id={clearTooltipId}
                    data-tooltip-content={`Clear ${label.toLowerCase()} filter`}
                >
                    <RiCloseLine className="w-3 h-3" />
                </span>
            )}

            <SharedTooltip id={tooltipId} className="sm:hidden" />
            {hasSelections && onClear && <SharedTooltip id={clearTooltipId} />}
        </div>
    );
}
