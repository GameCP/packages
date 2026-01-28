'use client';

import { useState, type ReactNode } from 'react';
import Dropdown from '../Dropdown';
import type { DropdownItem } from '../types';

interface MenuProps {
    /** Menu items */
    items: DropdownItem[];
    /** Trigger element */
    trigger: ReactNode;
    /** Action handler - called when item clicked */
    onAction: (value: string) => void;
    /** Dropdown width */
    width?: number;
    /** Max height */
    maxHeight?: number;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className */
    className?: string;
}

/**
 * Menu preset - action menu dropdown
 * For context menus, action buttons, etc.
 */
export default function Menu({
    items,
    trigger,
    onAction,
    width = 200,
    maxHeight = 400,
    disabled = false,
    className = '',
}: MenuProps) {
    const handleChange = (value: string | string[]) => {
        const actionValue = Array.isArray(value) ? value[0] : value;
        if (actionValue) {
            onAction(actionValue);
        }
    };

    return (
        <Dropdown
            trigger={trigger}
            items={items}
            onChange={handleChange}
            closeOnSelect
            width={width}
            maxHeight={maxHeight}
            disabled={disabled}
            className={className}
        />
    );
}
