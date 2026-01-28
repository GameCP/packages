'use client';

import { useState, useMemo } from 'react';
import Dropdown from '../Dropdown';
import DropdownSearch from '../DropdownSearch';
import DropdownPagination from '../DropdownPagination';
import FilterTrigger from '../triggers/FilterTrigger';
import type { DropdownItem, DropdownPaginationInfo } from '../types';

interface FilterProps {
    /** Options to filter */
    options: DropdownItem[];
    /** Selected values */
    value: string[];
    /** Change handler */
    onChange: (value: string[]) => void;
    /** Label for trigger button */
    label?: string;
    /** Enable search */
    searchable?: boolean;
    /** Server-side search callback */
    onSearch?: (search: string) => void;
    /** Loading state */
    isLoading?: boolean;
    /** Dropdown width */
    width?: number;
    /** Max height */
    maxHeight?: number;
    /** Disabled state */
    disabled?: boolean;
    /** Search placeholder */
    searchPlaceholder?: string;
    /** Empty state message */
    emptyMessage?: string;
    /** Pagination data */
    pagination?: DropdownPaginationInfo;
    /** Page change handler */
    onPageChange?: (page: number) => void;
    /** Called when dropdown opens */
    onOpen?: () => void;
    /** Called when clear button clicked - if provided, shows clear button */
    onClear?: () => void;
    /** Trigger icon */
    icon?: React.ReactNode;
    /** Additional trigger className */
    className?: string;
    /** Custom footer content (renders above pagination/clear buttons) */
    customFooter?: React.ReactNode;
}

/**
 * Filter preset - multi-select dropdown with FilterTrigger
 * Shows count badge and supports search/pagination
 */
export default function Filter({
    options,
    value,
    onChange,
    label = 'Filter',
    searchable = true,
    onSearch,
    isLoading = false,
    width = 320,
    maxHeight = 400,
    disabled = false,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No options found',
    pagination,
    onPageChange,
    onOpen,
    onClear,
    icon,
    className = '',
    customFooter,
}: FilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter options client-side if no onSearch provided
    const filteredOptions = useMemo(() => {
        if (onSearch || !searchQuery) return options;
        const query = searchQuery.toLowerCase();
        return options.filter(
            opt =>
                (typeof opt.label === 'string' && opt.label.toLowerCase().includes(query)) ||
                (typeof opt.description === 'string' && opt.description.toLowerCase().includes(query))
        );
    }, [options, onSearch, searchQuery]);

    // Handle search
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        onSearch?.(query);
    };

    // Handle selection (toggle)
    const handleChange = (newValue: string | string[]) => {
        const values = Array.isArray(newValue) ? newValue : [newValue];
        onChange(values);
    };

    // Handle clear all
    const handleClearAll = () => {
        onChange([]);
    };

    // Handle dropdown open
    const handleOpen = () => {
        setIsOpen(true);
        onOpen?.();
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
    };

    return (
        <Dropdown
            trigger={
                <FilterTrigger
                    label={label}
                    count={value.length}
                    icon={icon}
                    isOpen={isOpen}
                    disabled={disabled}
                    className={className}
                    onClear={onClear}
                />
            }
            items={filteredOptions}
            value={value}
            onChange={handleChange}
            multiple
            closeOnSelect={false}
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
                        placeholder={searchPlaceholder}
                    />
                ) : undefined
            }
            footer={
                <>
                    {customFooter}
                    {pagination && (
                        <DropdownPagination
                            pagination={pagination}
                            onPageChange={onPageChange!}
                            isLoading={isLoading}
                        />
                    )}
                    {value.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted/50 transition-colors border-t border-border"
                        >
                            Clear all ({value.length})
                        </button>
                    )}
                </>
            }
        />
    );
}
