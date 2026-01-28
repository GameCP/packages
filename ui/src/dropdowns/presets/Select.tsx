'use client';

import { useState, useMemo, type ReactNode } from 'react';
import Dropdown from '../Dropdown';
import DropdownSearch from '../DropdownSearch';
import SelectTrigger from '../triggers/SelectTrigger';
import type { DropdownItem, DropdownPaginationInfo } from '../types';
import DropdownPagination from '../DropdownPagination';

interface SelectProps {
    /** Options to choose from */
    options: DropdownItem[];
    /** Currently selected value (string for single, string[] for multiple) */
    value?: string | string[];
    /** Selection change handler */
    onChange: (value: string | string[]) => void;
    /** Placeholder when nothing selected */
    placeholder?: string;
    /** Enable search/filter */
    searchable?: boolean;
    /** Server-side search callback */
    onSearch?: (search: string) => void;
    /** Show loading state */
    isLoading?: boolean;
    /** Allow multiple selections */
    multiple?: boolean;
    /** Allow clearing selection */
    clearable?: boolean;
    /** Dropdown width */
    width?: number | 'auto';
    /** Max dropdown height */
    maxHeight?: number;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className for trigger */
    className?: string;
    /** Optional icon for trigger */
    icon?: React.ReactNode;
    /** Pagination data */
    pagination?: DropdownPaginationInfo;
    /** Page change handler */
    onPageChange?: (page: number) => void;
    /** Called when dropdown opens */
    onOpen?: () => void;
    /** Called when dropdown closes */
    onClose?: () => void;
    /** Visual variant */
    variant?: 'default' | 'compact';
    /** Custom render for selected value display */
    renderSelected?: (option: DropdownItem) => ReactNode;
    /** Keep dropdown open after selection (useful for multi-select) */
    keepOpen?: boolean;
}

/**
 * Select preset - combines Dropdown with SelectTrigger
 * Replaces SmartSelect with a cleaner API
 */
export default function Select({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    searchable = false,
    onSearch,
    isLoading = false,
    multiple = false,
    clearable = true,
    width = 300,
    maxHeight = 400,
    disabled = false,
    className = '',
    icon,
    pagination,
    onPageChange,
    onOpen,
    onClose,
    variant = 'default',
    renderSelected,
    keepOpen = false,
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Get selected option(s) for display
    const selectedOptions = useMemo(() => {
        if (!value) return [];
        const values = Array.isArray(value) ? value : [value];
        return options.filter(opt => values.includes(opt.value));
    }, [value, options]);

    // Get display label for trigger
    const displayLabel = useMemo((): ReactNode => {
        if (selectedOptions.length === 0) return null;
        if (multiple) {
            return `${selectedOptions.length} selected`;
        }
        // Use custom renderer if provided
        if (renderSelected && selectedOptions[0]) {
            return renderSelected(selectedOptions[0]);
        }
        return selectedOptions[0]?.label;
    }, [selectedOptions, multiple, renderSelected]);

    // Filter options client-side if no onSearch provided
    const filteredOptions = useMemo(() => {
        if (!searchable || onSearch || !searchQuery) return options;
        const query = searchQuery.toLowerCase();
        return options.filter(
            opt =>
                (typeof opt.label === 'string' && opt.label.toLowerCase().includes(query)) ||
                (typeof opt.description === 'string' && opt.description.toLowerCase().includes(query))
        );
    }, [options, searchable, onSearch, searchQuery]);

    // Handle search change
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    // Handle selection change
    const handleChange = (newValue: string | string[]) => {
        onChange(newValue);
        // Close after single select (unless multiple or keepOpen)
        if (!multiple && !keepOpen && !Array.isArray(newValue)) {
            setIsOpen(false);
        }
    };

    // Handle clear
    const handleClear = () => {
        onChange(multiple ? [] : '');
    };

    // Handle open/close
    const handleOpen = () => {
        setIsOpen(true);
        onOpen?.();
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
        onClose?.();
    };

    // Variant-based styling
    const variantClasses = variant === 'compact'
        ? 'px-2 py-1 text-xs min-h-7'
        : '';

    // Extract width-related classes (w-full, flex-1, etc.) for the wrapper
    // Non-width classes stay on the trigger
    const widthClasses = className.split(' ').filter(c =>
        c.startsWith('w-') || c.startsWith('flex-') || c === 'flex'
    ).join(' ');
    const triggerClasses = className.split(' ').filter(c =>
        !c.startsWith('w-') && !c.startsWith('flex-') && c !== 'flex'
    ).join(' ');

    return (
        <Dropdown
            trigger={
                <SelectTrigger
                    selectedLabel={displayLabel}
                    placeholder={placeholder}
                    icon={icon}
                    isOpen={isOpen}
                    disabled={disabled}
                    className={`${triggerClasses} ${variantClasses}`}
                />
            }
            triggerClassName={widthClasses}
            items={filteredOptions}
            value={value}
            onChange={handleChange}
            multiple={multiple}
            closeOnSelect={!multiple && !keepOpen}
            width={width}
            maxHeight={maxHeight}
            disabled={disabled}
            onOpen={handleOpen}
            onClose={handleClose}
            header={
                searchable ? (
                    <DropdownSearch
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                    />
                ) : undefined
            }
            footer={
                pagination ? (
                    <DropdownPagination
                        pagination={pagination}
                        onPageChange={onPageChange!}
                    />
                ) : clearable && selectedOptions.length > 0 ? (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                    >
                        Clear selection
                    </button>
                ) : undefined
            }
        />
    );
}

